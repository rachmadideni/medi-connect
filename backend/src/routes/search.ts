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
          AND ai.if(
            prompt => 'Does this text: "' || d.name || '. ' || d.specialty || ' at ' || d.location || '. ' || d.bio || '. Languages: ' || array_to_string(d.languages, ', ') || '" match the user request: "' || $1 || '", at least 50%? ',
            model_id => 'gemini-3-flash-preview'
          )
          AND (1 - (d.search_embedding <=> embedding('text-embedding-005', $1)::vector)) > 0.5
       GROUP BY d.id, d.search_embedding
       ORDER BY d.search_embedding <=> embedding('text-embedding-005', $1)::vector
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
