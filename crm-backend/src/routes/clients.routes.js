import express from "express";
import { getClientDetails } from "../controllers/clients.controller.js";

const router = express.Router();

// GET /api/clients/:id
router.get("/:id", getClientDetails);

export default router;
