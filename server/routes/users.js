import { Router } from "express";
import { pool } from "../db.js";

const router = Router();

// GET all users
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT id, login, role FROM users");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

router.post("/login", async (req, res) => {
  const { login, password } = req.body;
  if (!login || !password)
    return res.status(400).json({ message: "Missing login or password" });

  try {
    const result = await pool.query("SELECT * FROM users WHERE login = $1", [
      login,
    ]);
    const user = result.rows[0];
    if (!user) return res.status(401).json({ message: "Invalid login" });

    const isValid = password === user.password;
    if (!isValid) return res.status(401).json({ message: "Invalid password" });

    // Возвращаем роль
    return res.json({ role: user.role });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

// GET single user
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "SELECT id, login, role FROM users WHERE id = $1",
      [id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// CREATE user
router.post("/", async (req, res) => {
  const { login, password, role } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO users (login, password, role) VALUES ($1, $2, $3) RETURNING id, login, role",
      [login, password, role || "user"]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create user" });
  }
});

// UPDATE user
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { login, password, role } = req.body;

  try {
    // Сначала получаем текущего пользователя
    const userRes = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    if (userRes.rows.length === 0)
      return res.status(404).json({ error: "User not found" });

    const existingUser = userRes.rows[0];

    // Если пароль пустой или null, оставляем старый
    const newPassword =
      password && password.trim() ? password : existingUser.password;

    // Обновляем пользователя
    const updatedUser = await pool.query(
      "UPDATE users SET login = $1, password = $2, role = $3 WHERE id = $4 RETURNING *",
      [login, newPassword, role, id]
    );

    res.json(updatedUser.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE user
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM users WHERE id = $1", [id]);
    res.json({ message: "User deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

export default router;
