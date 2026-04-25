import mongoose from "mongoose";

const testCaseSchema = new mongoose.Schema({
  input: {
    type: [Number],
    required: true,
    default: []
  },
  expectedOutput: {
    type: [Number],
    required: true,
    default: []
  }
}, { _id: false });

const ruleSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
    trim: true
  },
  required: {
    type: Boolean,
    default: true
  }
}, { _id: false });

const challengeSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true,
    trim: true
  },

  description: {
    type: String,
    default: "",
    trim: true
  },

  testCases: {
    type: [testCaseSchema],
    required: true,
    validate: {
      validator: (arr) => arr.length > 0,
      message: "At least one test case is required"
    }
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
    type: Number,
    default: 120,
    min: 10
  }

}, {
  timestamps: true // 🔥 cria createdAt e updatedAt automaticamente
});

export const Challenge = mongoose.model("Challenge", challengeSchema);