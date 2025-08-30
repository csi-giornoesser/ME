// src/middlewares/index.js

import express from "express";
import cors from "cors";

// Variables d'environnement
const CORS_ORIGIN = process.env.CORS_ORIGIN || "*";

// Ici, on configure les middlewares globaux
export const applyMiddlewares = (app) => {
  // Permet de lire le JSON envoyé par le front
  app.use(express.json());
  // pas forcement que des json pour du react - API
  app.use(express.urlencoded({ extended: true }));// on permet de lire ici les forulaires HTML classique aussi

  // Autoriser le front à appeler l'API
  app.use(cors({ origin: CORS_ORIGIN }));

  console.log("✅ Middlewares appliqués");
};
