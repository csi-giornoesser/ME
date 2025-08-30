import express from "express";
import {
  listPartnerClients,
  listPartnerInteractions,
  createPartnerInteraction,
  listPartnerInvoices,
  getInvoicePdf,
  postPartnerInvoices,    // unified: preview/create
  getPartnerOverview,
  postCloseMonth,
  previewInvoice,   // déjà écrit par toi
  createInvoice,    // déjà écrit par toi
} from "../controllers/partenaires.controller.js";

const router = express.Router();

// Clients
router.get("/:id/clients", listPartnerClients);

// Interactions
router.get("/:id/interactions", listPartnerInteractions);
router.post("/:id/interactions", createPartnerInteraction);

// Invoices
router.get("/:id/invoices", listPartnerInvoices);
router.post("/:id/invoices", postPartnerInvoices);               // <= use this only
router.get("/:id/invoices/:invoiceId/pdf", getInvoicePdf);

// Aperçu de la facture
router.post("/:id/invoices/preview", express.json(), previewInvoice);

// Création de la facture
router.post("/:id/invoices", express.json(), createInvoice);

// Close month (no id in path)
router.post("/close-month", postCloseMonth);

// Overview last (to avoid conflicts)
router.get("/:id", getPartnerOverview);

export default router;
