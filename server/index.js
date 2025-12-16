import express from "express";
import { pool } from "./db.js";
import cors from "cors";
import usersRouter from "./routes/users.js";
import postsRouter from "./routes/posts.js";

const app = express();

// CORS
app.use(cors());

// Ограничение размера тела запроса
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Маршруты
app.use("/users", usersRouter);
app.use("/posts", postsRouter);

app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ dbTime: result.rows[0].now });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database connection failed" });
  }
});

// Глобальный обработчик ошибок
app.use((err, req, res, next) => {
  if (err.type === "entity.too.large") {
    return res.status(413).json({
      error: "Payload too large",
      message: "Размер запроса превышает допустимые 10MB",
    });
  }

  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

// Запуск сервера
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
