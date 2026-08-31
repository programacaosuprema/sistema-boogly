// src/controllers/challenge.controller.js
import mongoose from "mongoose";
import { nanoid } from "nanoid";
import { Challenge } from "../models/challenge.model.js";
import { UserChallenge } from "../models/userChallenge.model.js";

/**
 * Helper: encontrar challenge por _id ou publicId
 */
async function findChallengeByIdOrPublicId(id) {
  if (!id) return null;
  let challenge = null;
  if (mongoose.Types.ObjectId.isValid(id)) {
    challenge = await Challenge.findById(id);
  }
  if (!challenge) {
    challenge = await Challenge.findOne({ publicId: id });
  }
  return challenge;
}

/**
 * GET /challenges
 * - Se req.userId estiver presente (middleware optionalAuth), junta status do usuário
 */
export const getAll = async (req, res) => {
  try {
    const { structure, difficulty } = req.query;

    const filter = {};
    if (structure) filter.structure = structure;
    if (difficulty) filter.difficulty = difficulty;

    const challenges = await Challenge.find(filter).lean();

    // se houver usuário autenticado, buscar userChallenges e mesclar
    const userId = req.userId || null;
    if (userId) {
      const ucs = await UserChallenge.find({ userId }).lean();
      const byChallenge = new Map(ucs.map(u => [String(u.challengeId), u]));

      const merged = challenges.map(c => {
        const uc = byChallenge.get(String(c._id));
        return {
          ...c,
          userStatus: uc?.status || "pending",
          userAttempts: uc?.attempts ?? 0
        };
      });

      return res.json(merged);
    }

    // sem usuário -> só retorna challenges
    const fallback = challenges.map(c => ({
      ...c,
      userStatus: c.userStatus || "pending"
    }));

    return res.json(fallback);
  } catch (err) {
    console.error("getAll error:", err);
    return res.status(500).json({ error: err.message });
  }
};

/**
 * GET /challenges/:id
 * - retorna challenge (por _id ou publicId)
 * - se user autenticado, inclui userStatus / userAttempts
 */
export const getChallenge = async (req, res) => {
  try {
    const { id } = req.params;
    const challenge = await findChallengeByIdOrPublicId(id);
    if (!challenge) return res.status(404).json({ error: "Challenge not found" });

    const out = challenge.toObject ? challenge.toObject() : challenge;

    const userId = req.userId || null;
    if (userId) {
      const uc = await UserChallenge.findOne({ userId, challengeId: challenge._id }).lean();
      out.userStatus = uc?.status || "pending";
      out.userAttempts = uc?.attempts ?? 0;
    }

    return res.json(out);
  } catch (err) {
    console.error("getChallenge error:", err);
    return res.status(500).json({ error: err.message });
  }
};

export async function recordAttempt(req, res) {
  try {
    const challengeId = req.params.id;
    const userId = req.userId; // vem do optionalAuth

    // 🔥 visitante (sem login)
    if (!userId) {
      await Challenge.findByIdAndUpdate(challengeId, {
        $inc: { attempts: 1 }
      });

      return res.json({ userAttempt: null });
    }

    // 🔥 usuário logado
    const userChallenge = await UserChallenge.findOneAndUpdate(
      { userId, challengeId },
      {
        $setOnInsert: {
          status: "attempted",
          attempts: 0
        }
      },
      { upsert: true, new: true }
    );

    // 🔥 incrementa tentativa SEMPRE
    userChallenge.attempts += 1;

    // 🔥 se ainda não resolveu
    if (userChallenge.status !== "completed") {
      userChallenge.status = "attempted";
    }

    await userChallenge.save();

    // 🔥 incrementa global
    await Challenge.findByIdAndUpdate(challengeId, {
      $inc: { attempts: 1 }
    });

    return res.json({
      userAttempt: {
        status: userChallenge.status,
        attempts: userChallenge.attempts
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao registrar tentativa" });
  }
}

/**
 * PATCH /challenges/:id/attempts
 * - só incrementa attempts global para o challenge (uso administrativo / rápido)
 */
export const incrementAttempts = async (req, res) => {
  try {
    const { id } = req.params;
    const filter = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { publicId: id };
    const updated = await Challenge.findOneAndUpdate(filter, { $inc: { attempts: 1 } }, { new: true });
    if (!updated) return res.status(404).json({ error: "Challenge not found" });
    return res.json({ success: true, attempts: updated.attempts });
  } catch (err) {
    console.error("incrementAttempts error:", err);
    return res.status(500).json({ error: err.message });
  }
};

function executeWithSteps(commands, structure = "list") {
  let lista = [];
  const steps = [];

  for (const cmd of commands) {
    switch (cmd.type) {
      case "list_insert":
      case "insert":
        if (cmd.value !== undefined && cmd.value !== null) lista.push(cmd.value);
        break;
      case "list_remove_first":
      case "remove_first":
        lista.shift();
        break;
      case "list_remove_last":
      case "remove_last":
        lista.pop();
        break;
      case "list_invert":
      case "invert":
        lista.reverse();
        break;
      default:
        // ignore unknown
        break;
    }

    steps.push({
      command: cmd,
      state: [...lista]
    });
  }

  return steps;
}

/**
 * POST /challenges/:id/submit
 * - body: { commands: [...] }
 * - executa testes, retorna sucesso, output, steps, message
 * - atualiza UserChallenge: increments attempts and sets completed if success
 * - incrementa Challenge.solvedCount se success e user ainda não havia completed
 */
export const submitChallenge = async (req, res) => {
  try {
    const { id } = req.params;
    const { commands } = req.body;

    const challenge = await findChallengeByIdOrPublicId(id);
    if (!challenge) return res.status(404).json({ message: "Challenge not found" });

    // execute each test case
    const testCases = challenge.testCases || [];
    const aggregated = {
      success: true,
      steps: null,
      output: null,
      expected: null,
      message: "Correto"
    };

    // sempre reexecuta a partir de lista vazia (spec do seu sistema)
    let overallSteps = [];
    let finalOutput = [];

    for (const testCase of testCases) {
      // validate that inserted sequence equals testCase.input (se esse for seu requisito)
      const inserted = (commands || []).filter(c => /insert/i.test(c.type)).map(c => c.value);
      if (JSON.stringify(inserted) !== JSON.stringify(testCase.input)) {
        aggregated.success = false;
        aggregated.message = "Você deve construir a lista exatamente igual à entrada";
        aggregated.expected = testCase.expectedOutput;
        aggregated.output = inserted;
        // run execution anyway to produce steps
        const steps = executeWithSteps(commands, challenge.structure);
        aggregated.steps = steps;
        return res.json(aggregated);
      }

      const steps = executeWithSteps(commands, challenge.structure);
      overallSteps = steps;
      const finalState = steps.at(-1)?.state || [];

      const passed = JSON.stringify(finalState) === JSON.stringify(testCase.expectedOutput);
      if (!passed) {
        aggregated.success = false;
        aggregated.message = "Incorreto ❌";
        aggregated.expected = testCase.expectedOutput;
        aggregated.output = finalState;
        aggregated.steps = steps;
        break;
      } else {
        // passed this test; continue to next
        aggregated.steps = steps;
        aggregated.output = finalState;
      }
    }

    // update user and challenge state if success
    const userId = req.userId || null;

    // increment global attempts for the challenge (each submit counts)
    await Challenge.updateOne({ _id: challenge._id }, { $inc: { attempts: 1 } });

    let userChallengeDoc = null;
    if (userId) {
      // increment attempts; if success, set completed
      if (aggregated.success) {
        // If user had no previous completed, increment solvedCount and mark completed
        userChallengeDoc = await UserChallenge.findOneAndUpdate(
          { userId, challengeId: challenge._id },
          {
            $set: { status: "completed", completedAt: new Date() },
            $inc: { attempts: 1 }
          },
          { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        // If this user is completing for first time, increment solvedCount
        // Check if previously completed (we can check upsert's wasNew not reliable with findOneAndUpdate),
        // so query previous
        // Simpler approach: if userChallengeDoc.attempts === 1 and previous status wasn't completed, increment solvedCount
        // but to be safe fetch previous:
        const prev = await UserChallenge.findOne({ userId, challengeId: challenge._id });
        // if prev existed and prev.status !== 'completed' then inc solvedCount
        // (Because we already updated, prev might be after update — so to be safe: query history by looking at a flag is tricky.
        // We'll increment solvedCount if aggregated.success and there is no other record of completion by this user.)
        const alreadyCompleted = await UserChallenge.exists({ userId, challengeId: challenge._id, status: "completed", _id: { $ne: userChallengeDoc._id } });
        if (!alreadyCompleted) {
          // increment solvedCount by 1 (idempotency not perfect but acceptable)
          await Challenge.updateOne({ _id: challenge._id }, { $inc: { solvedCount: 1 } });
        }

      } else {
        // not success: just increment attempts and set status attempted (if not completed)
        userChallengeDoc = await UserChallenge.findOneAndUpdate(
          { userId, challengeId: challenge._id },
          {
            $set: { status: "attempted" },
            $inc: { attempts: 1 }
          },
          { new: true, upsert: true, setDefaultsOnInsert: true }
        );
      }
    }

    return res.json({
      success: aggregated.success,
      message: aggregated.message,
      output: aggregated.output,
      expected: aggregated.expected,
      steps: aggregated.steps,
      userAttempt: userChallengeDoc ? { attempts: userChallengeDoc.attempts, status: userChallengeDoc.status } : null
    });

  } catch (err) {
    console.error("submitChallenge error:", err);
    return res.status(500).json({ error: err.message });
  }
};

export const create = async (req, res) => {
  try {
    const data = req.body;

    const challenge = await Challenge.create({
      ...data,
      publicId: nanoid(10)
    });

    res.status(201).json(challenge);
  } catch (err) {
    console.error("create error:", err);
    res.status(500).json({ error: err.message });
  }
};