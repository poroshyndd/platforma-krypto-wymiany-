// backend/src/services/payuService.js
require('dotenv').config();
const fetch  = require('node-fetch');
const qs     = require('qs');
const crypto = require('crypto');

const {
  PAYU_CLIENT_ID,
  PAYU_CLIENT_SECRET,
  PAYU_POS_ID,
  PAYU_MD5_KEY,
  PAYU_OAUTH_URL,
  PAYU_API_URL
} = require('../config/payu');

async function getOAuthToken() {
  if (!PAYU_CLIENT_ID || !PAYU_CLIENT_SECRET) {
    throw new Error('PAYU_CLIENT_ID или PAYU_CLIENT_SECRET не заданы в .env');
  }

  const basic = Buffer
    .from(`${PAYU_CLIENT_ID}:${PAYU_CLIENT_SECRET}`)
    .toString('base64');

  const resp = await fetch(PAYU_OAUTH_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${basic}`,
      'Accept': 'application/json'
    },
    body: qs.stringify({ grant_type: 'client_credentials' })
  });

  const text = await resp.text();

  if (!resp.ok) {
    console.error('→ [PayU] OAuth failed:', resp.status, text);
    throw new Error(`PayU OAuth error ${resp.status}`);
  }

  let json;
  try {
    json = JSON.parse(text);
  } catch (e) {
    console.error('→ [PayU] OAuth bad JSON:', text);
    throw new Error('PayU OAuth invalid JSON');
  }

  if (!json.access_token) {
    console.error('→ [PayU] OAuth no access_token in response:', json);
    throw new Error('PayU OAuth: access_token missing');
  }

  return json.access_token;
}

async function createOrder({
  amount, currency, description,
  extOrderId, notifyUrl, continueUrl, buyerEmail
}) {
  const token       = await getOAuthToken();
  const totalAmount = String(Math.round(amount * 100)); // PLN → grosze
  const signature   = crypto
    .createHash('md5')
    .update([PAYU_POS_ID, extOrderId, totalAmount, currency, PAYU_MD5_KEY].join('|'))
    .digest('hex');

  const body = {
    notifyUrl,
    continueUrl,
    customerIp:    '127.0.0.1',
    merchantPosId: PAYU_POS_ID,
    description,
    currencyCode:  currency,
    totalAmount,
    extOrderId,
    buyer: { email: buyerEmail },
    signature
  };

  const resp = await fetch(`${PAYU_API_URL}/orders`, {
    method:   'POST',
    headers:  {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${token}`,
      'Accept':        'application/json'
    },
    body: JSON.stringify(body),
    redirect: 'manual'
  });

  // PayU может вернуть 201 или 302 с Location
  if (!resp.ok && resp.status !== 302) {
    const txt = await resp.text();
    console.error('← [PayU] createOrder failed:', resp.status, txt);
    throw new Error(`PayU createOrder error ${resp.status}`);
  }

  // В JSON-ответе или в заголовке Location лежит redirectUri
  let data = {};
  try { data = await resp.json() } catch {}
  const redirectUri = data.redirectUri || resp.headers.get('location');
  if (!redirectUri) {
    throw new Error('PayU createOrder: redirectUri missing');
  }

  return {
    orderId:     data.orderId || null,
    redirectUri
  };
}

module.exports = { getOAuthToken, createOrder };
