import express from "express";
import cors from "cors";
import { config } from "./config";
import { pool } from "./db";
import authRoutes from "./routes/auth";
import doctorsRoutes from "./routes/doctors";
import searchRoutes from "./routes/search";
import appointmentsRoutes from "./routes/appointments";

const app = express();

app.use(cors({ origin: config.corsOrigin === "*" ? true : config.corsOrigin }));
app.use(express.json());

// ── Health check ─────────────────────────────────────────────────────────────
app.get("/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ ok: true });
  } catch (err: any) {
    res
      .status(500)
      .json({ ok: false, error: err?.message ?? "DB connection failed" });
  }
});

// ── Routes ────────────────────────────────────────────────────────────────────
// NOTE: /api/doctors/search MUST be mounted before /api/doctors
//       so Express doesn't treat "search" as a :id param.
app.use("/api/doctors/search", searchRoutes);
app.use("/api/doctors", doctorsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/appointments", appointmentsRoutes);

// ── 404 fallback ──────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.listen(config.port, '0.0.0.0', () => {
  console.log(`Medi Connect backend running on port ${config.port}`);
});