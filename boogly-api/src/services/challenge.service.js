import { Challenge } from "../models/challenge.model.js";

export const createChallenge = async (data) => {
  return await Challenge.create(data);
};

export const getAllChallenges = async () => {
  return await Challenge.find();
};

export const getChallengeById = async (id) => {
  return await Challenge.findById(id);
};