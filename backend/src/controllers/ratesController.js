// backend/src/controllers/ratesController.js
const fetch = require('node-fetch'); // либо axios, если вы предпочитаете

// 1) Возвращает массив всех фиатных курсов (NBP API)
//    GET /rates/all
exports.getAll = async (req, res) => {
  try {
    // базовый список валют
    const currencies = [
      'USD','EUR','GBP','CHF','CAD','AUD','JPY',
      'CNY','SEK','NOK','DKK','CZK','HUF','RON',
      'BGN','TRY','INR','BRL','ZAR'
    ];

    // для каждой валюты делаем запрос к NBP
    const promises = currencies.map(code =>
      fetch(`http://api.nbp.pl/api/exchangerates/rates/A/${code}?format=json`)
        .then(r => {
          if (!r.ok) throw new Error(`Currency ${code} not found`);
          return r.json();
        })
        .then(body => ({
          currency: code,
          rate: body.rates[0].mid
        }))
    );

    const allRates = await Promise.all(promises);
    res.json(allRates);
  } catch (err) {
    console.error('Error in getAll:', err);
    res.status(502).json({ error: 'Failed to fetch all fiat rates' });
  }
};

// 2) Возвращает курс одной валюты по коду из params
//    GET /rates/:currency
exports.getRate = async (req, res) => {
  const { currency } = req.params;
  try {
    const r = await fetch(
      `http://api.nbp.pl/api/exchangerates/rates/A/${currency}?format=json`
    );
    if (!r.ok) {
      return res.status(404).json({ error: 'Currency not found' });
    }
    const body = await r.json();
    res.json({ currency, rate: body.rates[0].mid });
  } catch (err) {
    console.error('Error in getRate:', err);
    res.status(502).json({ error: 'Failed to fetch fiat rate' });
  }
};

// 3) Возвращает курсы криптовалют из CoinGecko
//    GET /crypto-rates
exports.getCryptoRates = async (req, res) => {
  try {
    // список монет для примера
    const ids = ['bitcoin','ethereum','ripple','litecoin','solana','dogecoin'];
    const query = ids.join('%2C');
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${query}&vs_currencies=pln&include_24hr_change=true`;
    const r = await fetch(url);
    if (!r.ok) throw new Error('CoinGecko API error');
    const data = await r.json();

    // преобразуем ответ в удобный массив
    const out = Object.entries(data).map(([id, info]) => ({
      id,
      price: info.pln,
      change24h: info.pln_24h_change
    }));

    res.json(out);
  } catch (err) {
    console.error('Error in getCryptoRates:', err);
    res.status(502).json({ error: 'Failed to fetch crypto rates' });
  }
};
