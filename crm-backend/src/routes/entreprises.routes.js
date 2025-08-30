import express from "express";
import { getEntrepriseById } from "../controllers/entreprises.controller.js";

const router = express.Router();

// GET /api/entreprises/:id
router.get("/:id", getEntrepriseById);

export default router;
