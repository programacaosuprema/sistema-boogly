// controllers/challenge.controller.js
import mongoose from "mongoose";
import { Challenge } from "../models/challenge.model.js";

function validateExactConstruction(commands, input) {

  const inserted = commands
    .filter(c => c.type === "list_insert")
    .map(c => c.value);

  if (JSON.stringify(inserted) !== JSON.stringify(input)) {
    return {
      success: false,
      message: "Você deve inserir exatamente os valores da entrada"
    };
  }

  return { success: true };
}

export const create = async (req, res) => {
  try {
    const challenge = await Challenge.create(req.body);
    res.json(challenge);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAll = async (req, res) => {
  try {
    const { structure, difficulty } = req.query;

    const filter = {};
    if (structure) filter.structure = structure;
    if (difficulty) filter.difficulty = difficulty;

    const challenges = await Challenge.find(filter);
    res.json(challenges);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getChallenge = async (req, res) => {
  try {
    const { id } = req.params;

    let challenge;

    if (mongoose.Types.ObjectId.isValid(id)) {
      challenge = await Challenge.findById(id);
    } else {
      challenge = await Challenge.findOne({ publicId: id });
    }

    if (!challenge) {
      return res.status(404).json({ error: "Challenge not found" });
    }

    res.json(challenge);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* =========================
   EXECUÇÃO
========================= */

function executeWithSteps(commands) {

  let lista = []; // 🔥 SEMPRE vazio

  const steps = [];

  for (const cmd of commands) {

    switch (cmd.type) {

      case "list_insert":
        if (cmd.value != null) lista.push(cmd.value);
        break;

      case "list_remove_first":
        lista.shift();
        break;

      case "list_remove_last":
        lista.pop();
        break;

      case "list_invert":
        lista.reverse();
        break;
    }

    steps.push({
      command: cmd,
      state: [...lista]
    });
  }

  return steps;
}

export const submitChallenge = async (req, res) => {
  try {
    const { id } = req.params;
    const { commands } = req.body;

    let challenge;

    if (mongoose.Types.ObjectId.isValid(id)) {
      challenge = await Challenge.findById(id);
    } else {
      challenge = await Challenge.findOne({ publicId: id });
    }

    if (!challenge) {
      return res.status(404).json({ message: "Challenge not found" });
    }

    for (const testCase of challenge.testCases) {

      // 🔥 1. VALIDAR CONSTRUÇÃO
      const inserted = commands
        .filter(c => c.type === "list_insert")
        .map(c => c.value);

      const same =
        JSON.stringify(inserted) === JSON.stringify(testCase.input);

      if (!same) {
        return res.json({
          success: false,
          message: "Você deve construir a lista exatamente igual à entrada",
          expectedInput: testCase.input,
          inserted
        });
      }

      // 🔥 2. EXECUTA SEMPRE COMEÇANDO VAZIO
      const steps = executeWithSteps(commands, [], "build");

      const finalState = steps.at(-1)?.state || [];

      const success =
        JSON.stringify(finalState) ===
        JSON.stringify(testCase.expectedOutput);

      if (!success) {
        return res.json({
          success: false,
          message: "Incorreto ❌",
          expected: testCase.expectedOutput,
          output: finalState,
          steps
        });
      }
    }

    return res.json({
      success: true,
      message: "Correto 🎉"
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};