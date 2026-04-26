import express from "express";
import { authenticate, getUsers, loginGuest} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/", authenticate); // 🔥 unificado
router.get("/users", getUsers);
router.post("/guest", loginGuest);

export default router;