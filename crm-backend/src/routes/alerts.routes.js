// /workspaces/ME/crm-backend/src/routes/alerts.routes.js
import express from "express";
import { getAlerts } from "../controllers/alerts.controller.js";

const router = express.Router();

// GET /api/alerts
router.get("/", getAlerts);

export default router;
