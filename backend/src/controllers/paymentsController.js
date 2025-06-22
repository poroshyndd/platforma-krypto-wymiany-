const pool  = require('../config/database');
const crypto = require('crypto');
const { getOAuthToken } = require('../services/payuService');

exports.createPayment = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { amount, currency, description } = req.body;

    const token       = await getOAuthToken();
    const totalAmount = String(Math.floor(amount * 100));
    const extOrderId  = `user${userId}_${Date.now()}`;
    const signature   = crypto
      .createHash('md5')
      .update([
        process.env.PAYU_POS_ID,
        extOrderId,
        totalAmount,
        currency,
        process.env.PAYU_MD5_KEY
      ].join('|'))
      .digest('hex');

    const body = {
      notifyUrl:   `${process.env.APP_URL}/payments/webhook`,
      continueUrl: `${process.env.APP_URL}/payments/${extOrderId}`,
      customerIp:    req.ip,
      merchantPosId: process.env.PAYU_POS_ID,
      description,
      currencyCode:  currency,
      totalAmount,
      extOrderId,
      buyer: { email: req.user.email },
      signature
    };

    const resp = await fetch(`${process.env.PAYU_API_URL}/orders`, {
      method:   'POST',
      headers:  {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body:     JSON.stringify(body),
      redirect: 'manual'
    });

    const location = resp.headers.get('location');
    if (![201,302].includes(resp.status) || !location) {
      const txt = await resp.text();
      console.error('← [PayU] createOrder failed body:', txt);
      return res.status(500).json({ error: 'PayU createOrder failed' });
    }

    await pool.query(
      `INSERT INTO payments (user_id, ext_order_id, amount, currency, status)
       VALUES ($1,$2,$3,$4,$5)`,
      [userId, extOrderId, amount, currency, 'pending']
    );

    res.json({ redirectUri: location });
  } catch (err) {
    next(err);
  }
};

exports.getPaymentStatus = async (req, res, next) => {
  try {
    const { id } = req.params;      
    res.json({ status: 'completed' });
  } catch (err) {
    next(err);
  }
};

exports.webhook = async (req, res) => {
  res.sendStatus(200);
};

exports.getHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { rows } = await pool.query(
      `SELECT id, ext_order_id, amount, currency, status, created_at
         FROM payments
        WHERE user_id = $1
        ORDER BY created_at DESC`,
      [userId]
    );
    res.json(rows);
  } catch (err) {
    console.error('Error fetching payment history:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
