import mongoose from "mongoose";

const testCaseSchema = new mongoose.Schema({
  input: {
    type: [Number],
    required: true
  },
  expectedOutput: {
    type: [Number],
    required: true
  }
}, { _id: false });

const ruleSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true
  },
  required: {
    type: Boolean,
    default: true
  }
}, { _id: false });

const challengeSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true
  },

  description: {
    type: String
  },

  testCases: {
    type: [testCaseSchema],
    required: true
  },

  rules: {
    type: [ruleSchema],
    default: []
  },

  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    default: "easy"
  },

  timeLimit: {
    type: Number, // seconds
    default: 120
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

export const Challenge = mongoose.model("Challenge", challengeSchema);