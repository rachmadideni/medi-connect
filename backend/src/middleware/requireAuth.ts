import { Request, Response, NextFunction } from "express";
import { pool } from "../db";
import { verifyGoogleToken } from "../services/auth";

export interface AuthRequest extends Request {
  user?: { id: string; email: string; name: string };
}

export async function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Missing or invalid Authorization header" });
    return;
  }

  const idToken = authHeader.slice(7);
  try {
    const payload = await verifyGoogleToken(idToken);
    const { rows } = await pool.query(
      "SELECT id, email, name FROM users WHERE provider_id = $1",
      [payload.sub]
    );
    if (!rows.length) {
      res.status(401).json({ error: "User not found — please sign in first" });
      return;
    }
    req.user = rows[0];
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}
