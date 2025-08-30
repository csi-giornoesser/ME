import express from "express";

import multer from "multer";
import { downloadDossierDocument, listDossierDocuments, completeFormStep, getDossierMessages,
  postDossierMessage, uploadDossierPiece, getDossierPieces, getDossierTimeline, patchDossier, listDossiers  } from "../controllers/dossiers.controller.js";


const router = express.Router();

// Multer en mémoire pour valider taille/extension avant d’écrire sur disque
const upload = multer({
  storage: multer.memoryStorage(),
  // limite “garde-fou” globale (la vraie limite spécifique est checkée dans le contrôleur)
  limits: { fileSize: 25 * 1024 * 1024 }, // 25 Mo
});

router.post("/:id/pieces/:piece_key/upload", upload.single("file"), uploadDossierPiece);


// Liste des documents (ton Next utilisait POST — on garde POST pour compat)
router.post("/:id/documents", listDossierDocuments);

// Download d’un type de document
router.get("/:id/documents/:type/download", downloadDossierDocument);


router.post("/:id/etapes/formulaire/completer", completeFormStep);

router.get("/:id/messages", getDossierMessages);
router.post("/:id/messages", express.json(), postDossierMessage);

router.get("/:id/pieces", getDossierPieces);

router.get("/:id/timeline", getDossierTimeline);

router.patch("/:id", express.json(), patchDossier);

router.get("/", listDossiers);

export default router;
