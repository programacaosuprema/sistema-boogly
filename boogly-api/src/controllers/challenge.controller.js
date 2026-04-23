import * as service from "../services/challenge.service.js";

export const create = async (req, res) => {
  try {
    const challenge = await service.createChallenge(req.body);
    res.status(201).json(challenge);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAll = async (req, res) => {
  try {
    const challenges = await service.getAllChallenges();
    res.json(challenges);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getById = async (req, res) => {
  try {
    const challenge = await service.getChallengeById(req.params.id);
    res.json(challenge);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};