import express from "express";
import { createNotification } from "../controllers/notifications.controller.js";

const router = express.Router();

// POST /api/notifications
router.post("/", express.json(), createNotification);

export default router;
