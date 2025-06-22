const pool   = require('../config/database');
const bcrypt = require('bcrypt');
const jwt    = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';

exports.register = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email и пароль обязательны' });
  }
  try {
    const { rows: existing } = await pool.query(
      'SELECT 1 FROM users WHERE email = $1',
      [email]
    );
    if (existing.length) {
      return res.status(409).json({ error: 'Пользователь уже существует' });
    }
    const password_hash = await bcrypt.hash(password, 10);

    const { rows } = await pool.query(
      `INSERT INTO users (email, password_hash)
       VALUES ($1, $2)
       RETURNING id, email, roles, created_at`,
      [email, password_hash]
    );
    const user = rows[0];

    const token = jwt.sign(
      { user_id: user.id, roles: user.roles },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({
      user:  { id: user.id, email: user.email, roles: user.roles },
      token
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email и пароль обязательны' });
  }
  try {
    const { rows } = await pool.query(
      'SELECT id, password_hash, roles FROM users WHERE email = $1',
      [email]
    );
    if (!rows.length) {
      return res.status(401).json({ error: 'Неверные учётные данные' });
    }
    const user = rows[0];

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: 'Неверные учётные данные' });
    }

    const token = jwt.sign(
      { user_id: user.id, roles: user.roles },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
};
