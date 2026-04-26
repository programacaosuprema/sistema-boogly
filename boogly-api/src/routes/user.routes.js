// routes/user.routes.js
import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import { User } from "../models/user.model.js";

const router = express.Router();

router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("nickname email");

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;