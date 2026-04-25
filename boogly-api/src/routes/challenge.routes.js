import express from "express";
import * as controller from "../controllers/challenge.controller.js";

const router = express.Router();

router.post("/", controller.create);
router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.post("/:id/submit", controller.submitChallenge);

export default router;