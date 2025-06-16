// backend/test-payu.js
require('dotenv').config();         // чтобы подтянуть .env
const { getOAuthToken, createOrder } = require('./src/services/payuService');

(async () => {
  try {
    const token = await getOAuthToken();
    console.log('✔ OAuth token:', token);

    const order = await createOrder({
      amount:      1.23,
      currency:    'PLN',
      description: 'Test topup',
      extOrderId:  `test-${Date.now()}`,
      notifyUrl:   'https://example.com/webhook',
      continueUrl: 'https://example.com/return',
      buyerEmail:  'user@example.com'
    });
    console.log('✔ Order created:', order);
  } catch (err) {
    console.error('❌ Error in test PayU:', err);
  }
})();
