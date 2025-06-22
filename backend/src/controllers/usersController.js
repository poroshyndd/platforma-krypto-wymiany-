const pool = require('../config/database');

exports.getCount = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT COUNT(*) FROM users');
    res.json({ count: +rows[0].count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при подсчёте пользователей' });
  }
};
