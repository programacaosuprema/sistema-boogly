import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

  nickname: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  points: {
    type: Number,
    default: 0
  },

  authCode: {
    type: String
  },
  authCodeExpiresAt: {
    type: Date
  }

}, { timestamps: true });

export const User = mongoose.model("User", userSchema);