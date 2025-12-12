import { Router } from "express";
import { pool } from "../db.js";

const router = Router();

// --- GET all posts ---
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, author, title, description, date FROM posts ORDER BY id DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

// --- GET single post ---
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "SELECT id, author, title, description FROM posts WHERE id = $1",
      [id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch post" });
  }
});

// --- CREATE post ---
router.post("/", async (req, res) => {
  const { author, title, description } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO posts (author, title, description) VALUES ($1, $2, $3) RETURNING id, author, title, description",
      [author, title, description]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create post" });
  }
});

// --- UPDATE post ---
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { author, title, description } = req.body;

  try {
    const result = await pool.query(
      "UPDATE posts SET author = $1, title = $2, description = $3 WHERE id = $4 RETURNING id, author, title, description",
      [author, title, description, id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update post" });
  }
});

// --- DELETE post ---
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM posts WHERE id = $1", [id]);
    res.json({ message: "Post deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete post" });
  }
});

export default router;
