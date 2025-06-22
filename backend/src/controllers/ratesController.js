const fetch = require('node-fetch');

exports.getAll = async (req, res) => {
  try {
    const currencies = [
      'USD','EUR','GBP','CHF','CAD','AUD','JPY',
      'CNY','SEK','NOK','DKK','CZK','HUF','RON',
      'BGN','TRY','INR','BRL','ZAR'
    ];

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


exports.getCryptoRates = async (req, res) => {
  try {
    const ids = ['bitcoin','ethereum','ripple','litecoin','solana','dogecoin'];
    const query = ids.join('%2C');
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${query}&vs_currencies=pln&include_24hr_change=true`;
    const r = await fetch(url);
    if (!r.ok) throw new Error('CoinGecko API error');
    const data = await r.json();

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
