import { Router } from "express";
import { pool } from "../db";
import { verifyGoogleToken } from "../services/auth";

const router = Router();

// POST /api/auth/verify
// Receives a Google ID token, verifies it, upserts the user, returns profile.
router.post("/verify", async (req, res) => {
  const { id_token } = req.body;
  if (!id_token) {
    res.status(400).json({ error: "id_token is required" });
    return;
  }

  try {
    const payload = await verifyGoogleToken(id_token);
    const { sub, email, name } = payload;

    const { rows } = await pool.query(
      `INSERT INTO users (email, name, provider, provider_id)
       VALUES ($1, $2, 'google', $3)
       ON CONFLICT (provider_id) DO UPDATE SET name = EXCLUDED.name
       RETURNING id, email, name`,
      [email, name ?? email, sub]
    );

    res.json({ user: rows[0] });
  } catch (err: any) {
    res.status(401).json({
      error: "Token verification failed",
      details: err?.message ?? String(err),
    });
  }
});

export default router;
