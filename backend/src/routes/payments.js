// routes/payments.js
const express = require('express');
const router  = express.Router();
const paymentController = require('../controllers/paymentController');

router.post('/start', paymentController.startPayment);
// сюда же добавьте вебхук-обработчик, если нужен:
// router.post('/webhook', paymentController.webhookHandler);

module.exports = router;
