import { Router } from "express";
import { pool } from "../db";

const router = Router();

// GET /api/doctors?specialty=&available=
router.get("/", async (req, res) => {
  const { specialty, available } = req.query;

  const conditions: string[] = [];
  const values: unknown[] = [];

  if (specialty) {
    values.push(specialty);
    conditions.push(`d.specialty = $${values.length}`);
  }
  if (available) {
    values.push(available);
    conditions.push(`d.available = $${values.length}`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  try {
    const { rows } = await pool.query(
      `SELECT
         d.id, d.name, d.specialty, d.location, d.rating, d.reviews,
         d.available, d.experience, d.avatar, d.image_url, d.bio,
         d.languages, d.education,
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
       ${where}
       GROUP BY d.id
       ORDER BY d.rating DESC`,
      values
    );
    res.json(rows);
  } catch (err: any) {
    res.status(500).json({ error: err?.message ?? String(err) });
  }
});

// GET /api/doctors/:id  — single doctor with all slots
router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid doctor id" });
    return;
  }

  try {
    const { rows } = await pool.query(
      `SELECT
         d.id, d.name, d.specialty, d.location, d.rating, d.reviews,
         d.available, d.experience, d.avatar, d.image_url, d.bio,
         d.languages, d.education,
         COALESCE(
           json_agg(
             json_build_object(
               'id', s.id,
               'slotTime', s.slot_time,
               'isAvailable', s.is_available
             )
             ORDER BY s.slot_time
           ) FILTER (WHERE s.id IS NOT NULL),
           '[]'
         ) AS slots
       FROM doctors d
       LEFT JOIN doctor_slots s ON s.doctor_id = d.id
       WHERE d.id = $1
       GROUP BY d.id`,
      [id]
    );

    if (!rows.length) {
      res.status(404).json({ error: "Doctor not found" });
      return;
    }
    res.json(rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err?.message ?? String(err) });
  }
});

export default router;
