import express from "express";
import { listTickets, createTicket, getTicket, patchTicket, addTicketEvent } from "../controllers/tickets.controller.js";

const router = express.Router();

router.get("/", listTickets);
router.post("/", express.json(), createTicket);

router.get("/:id", getTicket);
router.patch("/:id", express.json(), patchTicket);
router.post("/:id/events", express.json(), addTicketEvent);

export default router;
