import { Router, Request } from "express";
import { pool } from "../db";
import { requireAuth, AuthRequest } from "../middleware/requireAuth";

const router = Router();

// GET /api/appointments — list the authenticated user's appointments
router.get("/", requireAuth, async (req: Request, res) => {
  const user = (req as AuthRequest).user!;
  try {
    const { rows } = await pool.query(
      `SELECT
         a.id, a.slot_time, a.appointment_date, a.status, a.notes, a.created_at,
         d.id        AS doctor_id,
         d.name      AS doctor_name,
         d.specialty AS doctor_specialty,
         d.image_url AS doctor_image_url,
         d.avatar    AS doctor_avatar
       FROM appointments a
       JOIN doctors d ON d.id = a.doctor_id
       WHERE a.user_id = $1
       ORDER BY a.appointment_date DESC, a.slot_time DESC`,
      [user.id]
    );

    res.json(
      rows.map((r) => ({
        id: r.id,
        slotTime: r.slot_time,
        appointmentDate: r.appointment_date,
        status: r.status,
        notes: r.notes,
        createdAt: r.created_at,
        doctor: {
          id: r.doctor_id,
          name: r.doctor_name,
          specialty: r.doctor_specialty,
          imageUrl: r.doctor_image_url,
          avatar: r.doctor_avatar,
        },
      }))
    );
  } catch (err: any) {
    res.status(500).json({ error: err?.message ?? String(err) });
  }
});

// POST /api/appointments — book an appointment
router.post("/", requireAuth, async (req: Request, res) => {
  const user = (req as AuthRequest).user!;
  const { doctorId, slotTime, appointmentDate, notes } = req.body;

  if (!doctorId || !slotTime || !appointmentDate) {
    res
      .status(400)
      .json({ error: "doctorId, slotTime, and appointmentDate are required" });
    return;
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO appointments (user_id, doctor_id, slot_time, appointment_date, notes)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, slot_time, appointment_date, status, notes, created_at`,
      [user.id, doctorId, slotTime, appointmentDate, notes ?? null]
    );
    res.status(201).json(rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err?.message ?? String(err) });
  }
});

// PATCH /api/appointments/:id/cancel — cancel a confirmed appointment
router.patch("/:id/cancel", requireAuth, async (req: Request, res) => {
  const user = (req as AuthRequest).user!;
  const { id } = req.params;

  try {
    const { rows } = await pool.query(
      `UPDATE appointments
       SET status = 'cancelled'
       WHERE id = $1
         AND user_id = $2
         AND status = 'confirmed'
       RETURNING id, status`,
      [id, user.id]
    );

    if (!rows.length) {
      res
        .status(404)
        .json({ error: "Appointment not found or cannot be cancelled" });
      return;
    }
    res.json(rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err?.message ?? String(err) });
  }
});

export default router;
