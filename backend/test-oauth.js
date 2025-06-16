require('dotenv').config();
const { getOAuthToken } = require('./src/services/payuService');

getOAuthToken()
  .then(t => console.log('✓ Получили токен:', t.slice(0,10)+'…'))
  .catch(err => console.error('❌ OAuth error:', err.message));
