require('dotenv').config();
const express = require('express');
const cors    = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Подключаем пул PostgreSQL
const pool = require('./config/database');

// Тест соединения с БД
;(async () => {
  try {
    const { rows } = await pool.query('SELECT NOW()');
    console.log('Postgres connected at', rows[0].now);
  } catch (err) {
    console.error('Postgres connection error:', err);
    process.exit(1);
  }
})();

// Импорт контроллеров и миддлвэров
const authController     = require('./controllers/authController');
const authMiddleware     = require('./middlewares/authMiddleware');
const ratesController    = require('./controllers/ratesController');
const paymentsController = require('./controllers/paymentsController');

// 1) Auth
app.post('/auth/register', authController.register);
app.post('/auth/login',    authController.login);

// 2) Публичные курсы
app.get('/rates/all',       ratesController.getAll);
app.get('/rates/:currency', ratesController.getRate);

// 3) Остальные публичные
app.get('/', (req, res) => res.send('API up and running 🔥'));
app.get('/users/count', async (req, res) => {
  const { rows } = await pool.query('SELECT COUNT(*) FROM users');
  res.json({ count: +rows[0].count });
});

// 4) Защищённые маршруты
app.get('/users/me', authMiddleware, (req, res) => {
  // authMiddleware кладёт в req.user { id, email, balance… }
  res.json(req.user);
});

// Платежи
app.post('/payments',         authMiddleware, paymentsController.createPayment);
app.get('/payments/:id',      authMiddleware, paymentsController.getPaymentStatus);
app.post('/payments/webhook', express.json(),  paymentsController.webhook);

// **Новый роут — история платежей**
app.get(
  '/payments/history',
  authMiddleware,
  paymentsController.getHistory
);

// 5) 404 + глобальный хэндлер ошибок
app.use((req, res) => res.status(404).json({ error: 'Not Found' }));
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
