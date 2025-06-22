const express = require('express');
const router  = express.Router();
const paymentController = require('../controllers/paymentController');

router.post('/start', paymentController.startPayment);
module.exports = router;
