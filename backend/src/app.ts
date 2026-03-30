import express from "express";
import cors from "cors";
import multer from "multer";
import { randomUUID } from "crypto";
import { config } from "./config";
import { pool } from "./db";
// import { uploadToGcs } from "./gcs";
// import { describeItemFromImage } from "./gemini";

const app = express();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

app.use(cors({ origin: config.corsOrigin === "*" ? true : config.corsOrigin }));
app.use(express.json());

app.get("/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ ok: true });
  } catch (err: any) {
    res.status(500).json({ ok: false, error: err?.message ?? "DB connection failed" });
  }
});

/*
app.get("/api/items", async (_req, res) => {
  try {
    const sql = `
      SELECT item_id, title, bio, category, image_url
      FROM items
      WHERE status = 'available'
      ORDER BY created_at DESC
      LIMIT 20
    `;
    const { rows } = await pool.query(sql);
    const items = rows.map((r) => ({
      id: String(r.item_id),
      title: r.title,
      bio: r.bio,
      category: r.category,
      image_url: r.image_url
    }));
    res.json(items);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to fetch items", details: err?.message ?? String(err) });
  }
});

app.post("/api/list-item", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No image provided" });

    const providerName = String(req.body.provider_name ?? "Anonymous");
    const providerPhone = String(req.body.provider_phone ?? "No Phone");
    const itemTitle = String(req.body.item_title ?? "No Title");

    const imageUrl = await uploadToGcs(req.file.buffer, req.file.originalname, req.file.mimetype);
    const profile = await describeItemFromImage(req.file.buffer, req.file.mimetype);
    const ownerId = randomUUID();

    const insertSql = `
      INSERT INTO items (owner_id, provider_name, provider_phone, title, bio, category, image_url, status, item_vector)
      VALUES ($1, $2, $3, $4, $5, $6, $7, 'available', embedding('text-embedding-005', $4 || ' ' || $5)::vector)
      RETURNING item_id
    `;

    const values = [
      ownerId,
      providerName,
      providerPhone,
      itemTitle,
      profile.bio ?? "No bio provided.",
      profile.category ?? "Misc",
      imageUrl
    ];

    const result = await pool.query(insertSql, values);

    res.json({
      status: "success",
      item_id: String(result.rows[0].item_id),
      image_url: imageUrl,
      profile
    });
  } catch (err: any) {
    res.status(500).json({
      error: "Operation Failed",
      details: err?.message ?? String(err)
    });
  }
});

app.get("/api/search", async (req, res) => {
  const queryText = String(req.query.query ?? "").trim();
  if (!queryText) return res.json([]);

  try {
    const sql = `
      SELECT
        item_id, title, bio, category, image_url,
        1 - (item_vector <=> embedding('text-embedding-005', $1)::vector) AS score
      FROM items
      WHERE status = 'available'
        AND item_vector IS NOT NULL
        AND ai.if(
          prompt => 'Does this text: "' || bio || '" match the user request: "' || $1 || '", at least 60%? " ',
          model_id => 'gemini-3-flash-preview'
        )
      ORDER BY item_vector <=> embedding('text-embedding-005', $1)::vector
      LIMIT 5
    `;

    const { rows } = await pool.query(sql, [queryText]);

    res.json(
      rows.map((r) => ({
        id: String(r.item_id),
        title: r.title,
        bio: r.bio,
        category: r.category,
        image_url: r.image_url,
        score: Number(r.score).toFixed ? Number(Number(r.score).toFixed(3)) : r.score
      }))
    );
  } catch (err: any) {
    res.status(500).json({ error: err?.message ?? String(err) });
  }
});

app.post("/api/swipe", async (req, res) => {
  const direction = String(req.body?.direction ?? "");
  const itemId = req.body?.item_id;
  const swiperId = String(req.body?.swiper_id ?? randomUUID());

  if (!itemId || !["left", "right"].includes(direction)) {
    return res.status(400).json({ error: "Invalid swipe data" });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const isMatch = direction === "right";

    await client.query(
      `
      INSERT INTO swipes (swiper_id, item_id, direction, is_match)
      VALUES ($1, $2, $3, $4)
      `,
      [swiperId, itemId, direction, isMatch]
    );

    if (isMatch) {
      const info = await client.query(
        `SELECT provider_name, provider_phone FROM items WHERE item_id = $1`,
        [itemId]
      );

      await client.query(`UPDATE items SET status = 'matched' WHERE item_id = $1`, [itemId]);
      await client.query("COMMIT");

      if (info.rows.length > 0) {
        return res.json({
          is_match: true,
          provider_name: info.rows[0].provider_name,
          provider_phone: info.rows[0].provider_phone,
          swiper_id: swiperId
        });
      }
    }

    await client.query("COMMIT");
    res.json({ is_match: false, swiper_id: swiperId });
  } catch (err: any) {
    await client.query("ROLLBACK");
    res.status(500).json({
      error: "Database error during swipe",
      details: err?.message ?? String(err)
    });
  } finally {
    client.release();
  }
});

app.get("/api/matches", async (req, res) => {
  const swiperId = String(req.query.swiper_id ?? "");
  if (!swiperId) return res.status(400).json({ error: "swiper_id is required" });

  try {
    const sql = `
      SELECT s.item_id, i.title, i.image_url, i.provider_name, i.provider_phone
      FROM swipes s
      JOIN items i ON s.item_id = i.item_id
      WHERE s.swiper_id = $1 AND s.is_match = true AND i.status = 'matched'
    `;
    const { rows } = await pool.query(sql, [swiperId]);

    res.json(
      rows.map((r) => ({
        item_id: r.item_id,
        item_title: r.title,
        item_image_url: r.image_url,
        provider_name: r.provider_name,
        provider_phone: r.provider_phone
      }))
    );
  } catch (err: any) {
    res.status(500).json({ error: err?.message ?? String(err) });
  }
});
*/
app.listen(config.port, () => {
  console.log(`Backend running on port ${config.port}`);
});