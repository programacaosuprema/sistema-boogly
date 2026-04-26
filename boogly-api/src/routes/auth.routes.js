import express from "express";
import { authenticate, getUsers} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/", authenticate); // 🔥 unificado
router.get("/users", getUsers);

export default router;