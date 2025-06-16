// backend/test-payu.js
const { createOrder } = require('./src/services/payuService');

(async()=>{
  try {
    const order = await createOrder({
      amount:      1,
      currency:    'PLN',
      description: 'Test',
      extOrderId:  `test-${Date.now()}`,
      notifyUrl:   'https://example.com/webhook',
      continueUrl: 'https://example.com/return',
      buyerEmail:  'user@example.com',
    });
    console.log('✅ Order created:', order);
  } catch(e) {
    console.error('❌ Create order error:', e);
  }
})();
