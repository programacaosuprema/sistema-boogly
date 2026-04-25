import { Challenge } from "../models/challenge.model.js";
import { UserChallenge } from "../models/userChallenge.model.js";

// 🔥 CRIAR
export const createChallenge = async (data) => {
  return await Challenge.create(data);
};

// 🔥 LISTAR COM STATUS + RESOLUÇÕES
export const getAllChallenges = async (userId) => {

  const challenges = await Challenge.find();

  // 🔥 progresso do usuário
  let userProgress = [];

  if (userId) {
    userProgress = await UserChallenge.find({ userId });
  }

  const progressMap = {};

  userProgress.forEach((p) => {
    progressMap[p.challengeId.toString()] = p;
  });

  const result = await Promise.all(
    challenges.map(async (c) => {

      const progress = progressMap[c._id.toString()] || {};

      // 🔥 total de usuários que completaram
      const solvedCount = await UserChallenge.countDocuments({
        challengeId: c._id,
        status: "completed"
      });

      return {
        ...c.toObject(),

        userStatus: progress.status || "pending",
        attempts: progress.attempts || 0,

        solvedCount
      };
    })
  );

  return result;
};

// 🔥 BUSCAR POR ID
export const getChallengeById = async (id) => {
  return await Challenge.findById(id);
};