import express from "express";
import {
  getExportActivite,
  getExportCommissions,
  getExportDossiers,
  postExportDossiers,
} from "../controllers/exports.controller.js";

const router = express.Router();

router.get("/activite",    getExportActivite);
router.get("/commissions", getExportCommissions);
router.get("/dossiers",    getExportDossiers);
router.post("/dossiers",   postExportDossiers);

export default router;
