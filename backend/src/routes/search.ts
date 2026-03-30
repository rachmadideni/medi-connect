import { Router } from "express";
import { pool } from "../db";

const router = Router();

// GET /api/doctors/search?q=
// Uses AlloyDB's inline embedding() to do vector cosine similarity search.
// No application-side embedding call needed — AlloyDB calls Vertex AI internally.
router.get("/", async (req, res) => {
  const q = String(req.query.q ?? "").trim();
  if (!q) {
    res.status(400).json({ error: "q parameter is required" });
    return;
  }

  try {
    const { rows } = await pool.query(
      `SELECT
         d.id, d.name, d.specialty, d.location, d.rating, d.reviews,
         d.available, d.experience, d.avatar, d.image_url, d.bio,
         d.languages, d.education,
         ROUND(
           (1 - (d.search_embedding <=> embedding('text-embedding-005', $1)::vector))::numeric,
           4
         ) AS similarity,
         COALESCE(
           json_agg(
             json_build_object(
               'id', s.id,
               'slotTime', s.slot_time,
               'isAvailable', s.is_available
             )
           ) FILTER (WHERE s.id IS NOT NULL),
           '[]'
         ) AS slots
       FROM doctors d
       LEFT JOIN doctor_slots s ON s.doctor_id = d.id AND s.is_available = true
       WHERE d.search_embedding IS NOT NULL
       GROUP BY d.id, d.search_embedding
       ORDER BY d.search_embedding <=> embedding('text-embedding-005', $1)::vector
       LIMIT 10`,
      [q]
    );
    res.json(rows);
  } catch (err: any) {
    res.status(500).json({ error: err?.message ?? String(err) });
  }
});

export default router;
