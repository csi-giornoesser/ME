import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import cors from "cors"; // [AJOUT]

import { applyMiddlewares } from "./middlewares/index.js";
import clientsRoutes from "./routes/clients.routes.js";
import entreprisesRoutes from "./routes/entreprises.routes.js";
import { notFound, errorHandler } from "./middlewares/errorHandler.js";
import { assertDbConnection } from "./config/db.js";
import usersRoutes from "./routes/users.routes.js";
import authRoutes from "./routes/auth.routes.js";

import alertsRoutes from "./routes/alerts.routes.js";
import commercialRoutes from "./routes/commercial.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import entreprisesRoutes from "./routes/entreprises.routes.js";
import exportsRoutes from "./routes/exports.routes.js";
import notificationsRoutes from "./routes/notifications.routes.js";

import partenairesRoutes from "./routes/partenaires.routes.js";
import partenairesRoutes from "./routes/partenaires.routes.js";
import ticketsRoutes from "./routes/tickets.routes.js";
import dossiersRoutes from "./routes/dossiers.routes.js";
app.use("/api/dossiers", dossiersRoutes);
app.use("/api/tickets", ticketsRoutes);
app.use("/api/partenaires", partenairesRoutes);
app.use("/api/partenaires", partenairesRoutes);



dotenv.config();

const app = express();
applyMiddlewares(app);

// ---------- CORS (doit être avant les routes) ----------
const corsOptions = {
  // Permet une liste d'origines séparées par des virgules dans .env si besoin
  origin: (process.env.CORS_ORIGIN || "http://localhost:3000").split(","),
  credentials: true, // cookies/sessions si utilisés ; OK même si non utilisé
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));            // [AJOUT]
app.options("*", cors(corsOptions));   // [AJOUT] — gère les preflight OPTIONS

app.disable("x-powered-by");
app.use(helmet());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use("/api/auth/login", rateLimit({ windowMs: 15 * 60 * 1000, max: 20 }));

// ---- Health checks (SANS v1)
const startedAt = new Date();

app.get("/health", (req, res) => {
  res.status(200).json({
    ok: true,
    service: "crm-backend",
    env: process.env.NODE_ENV || "development",
    uptime_s: Math.round(process.uptime()),
    started_at: startedAt.toISOString(),
    now: new Date().toISOString(),
  });
});

app.get("/ready", async (req, res) => {
  try {
    await assertDbConnection();
    res.status(200).json({ ok: true });
  } catch {
    res.status(503).json({ ok: false, error: "db_unreachable" });
  }
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/clients", clientsRoutes);
app.use("/api/entreprises", entreprisesRoutes);

app.use("/api/alerts", alertsRoutes);
app.use("/api/commercial", commercialRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/entreprises", entreprisesRoutes);
app.use("/api/exports", exportsRoutes);
app.use("/api/exports", exportsRoutes);
app.use("/api/notifications", notificationsRoutes);
// 404 + error handler en dernier
app.use(notFound);
app.use(errorHandler);

// ---- Start
const PORT = Number(process.env.PORT || 8000);
const server = app.listen(PORT, () => {
  console.log(`✅ API CRM écoute sur http://localhost:${PORT}`);
  console.log(`🌐 CORS_ORIGIN: ${process.env.CORS_ORIGIN || "http://localhost:3000"}`); // [AJOUT]
});
server.on("error", (err) => console.error("❌ listen error:", err.message));
