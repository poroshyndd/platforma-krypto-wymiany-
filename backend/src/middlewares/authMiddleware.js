const jwt  = require('jsonwebtoken');
const pool = require('../config/database');
const JWT_SECRET = process.env.JWT_SECRET;

module.exports = async (req, res, next) => {
  const hdr = req.headers.authorization || '';
  const [scheme, token] = hdr.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Нет JWT-токена, авторизуйтесь' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const { rows } = await pool.query(
      `SELECT id, email, roles, created_at
       FROM users WHERE id = $1`,
      [payload.user_id]
    );
    if (!rows.length) {
      return res.status(401).json({ error: 'Пользователь не найден' });
    }
    req.user = rows[0];
    next();
  } catch (err) {
    console.error('Auth error:', err);
    return res.status(401).json({ error: 'Неверный или просроченный токен' });
  }
};
