CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  login VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user'
);

CREATE TABLE IF NOT EXISTS posts (
  id SERIAL PRIMARY KEY,
  author INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  date TIMESTAMP DEFAULT NOW()
);

-- ===== USERS =====
INSERT INTO users (login, password, role) VALUES
('admin', 'admin123', 'admin'),
('user', 'user123', 'user');

-- ===== POSTS =====
INSERT INTO posts (author, title, description, date) VALUES
(
  1,
  'Добро пожаловать',
  '<p>Это первый тестовый пост от администратора</p>',
  NOW()
),
(
  2,
  'Первый пользовательский пост',
  '<p>Этот пост создан обычным пользователем</p>',
  NOW()
);
