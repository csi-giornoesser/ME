import express from "express";
import { getRappels, terminerRappel } from "../controllers/commercial.controller.js";

const router = express.Router();

// GET /api/commercial/rappels
router.get("/rappels", getRappels);

// POST /api/commercial/rappels
router.post("/rappels", terminerRappel);

export default router;
