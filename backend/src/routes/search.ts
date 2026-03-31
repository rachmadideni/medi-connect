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
    // Hybrid filter: extract specialty/availability from query
    const specialties = [
      "Cardiologist", "General Practice", "Dermatologist", "Pediatrician",
      "Neurologist", "Psychiatrist", "Orthopedic", "Ophthalmologist"
    ];
    const availabilities = ["Today", "Tomorrow", "Wed", "Thu"];
    let specialtyFilter = null;
    let availabilityFilter = null;
    for (const s of specialties) {
      if (q.toLowerCase().includes(s.toLowerCase())) {
        specialtyFilter = s;
        break;
      }
    }
    for (const a of availabilities) {
      if (q.toLowerCase().includes(a.toLowerCase())) {
        availabilityFilter = a;
        break;
      }
    }

    const { rows } = await pool.query(
      `WITH query_vec AS (
  SELECT embedding('text-embedding-005', $1)::vector AS vec
),
top_candidates AS (
  SELECT
    d.*,
    1 - (d.search_embedding <=> q.vec) AS similarity
  FROM doctors d, query_vec q
  WHERE d.search_embedding IS NOT NULL
  ORDER BY d.search_embedding <=> q.vec
  LIMIT 30
)
SELECT
  t.id, t.name, t.specialty, t.location, t.rating, t.reviews,
  t.available, t.experience, t.avatar, t.image_url, t.bio,
  t.languages, t.education,
  ROUND(t.similarity::numeric, 4) AS similarity,
  COALESCE(
    json_agg(
      json_build_object(
        'id', s.id,
        'slotTime', s.slot_time,
        'isAvailable', s.is_available
      ) ORDER BY s.slot_time
    ) FILTER (WHERE s.id IS NOT NULL),
    '[]'
  ) AS slots
FROM top_candidates t
LEFT JOIN doctor_slots s ON s.doctor_id = t.id AND s.is_available = true
WHERE ai.if(
  prompt => 'Does this text: \"' || t.name || '. ' || t.specialty || ' at ' || t.location || '. ' || t.bio || '. Languages: ' || array_to_string(t.languages, ', ') || '\" match the user request: \"' || $1 || '\", at least 50%? ',
  model_id => 'gemini-3-flash-preview'
)
AND t.similarity > 0.5
GROUP BY
  t.id, t.name, t.specialty, t.location, t.rating, t.reviews,
  t.available, t.experience, t.avatar, t.image_url, t.bio,
  t.languages, t.education, t.similarity
ORDER BY t.similarity DESC
LIMIT 20`,
      [q]
    );
    // Post-filter for specialty/availability if present in query
    let filtered = rows;
    if (specialtyFilter) {
      filtered = filtered.filter((d) => d.specialty === specialtyFilter);
    }
    if (availabilityFilter) {
      filtered = filtered.filter((d) => d.available === availabilityFilter);
    }
    // Return top 10 after filtering
    res.json(filtered.slice(0, 10));
  } catch (err: any) {
    res.status(500).json({ error: err?.message ?? String(err) });
  }
});

export default router;
