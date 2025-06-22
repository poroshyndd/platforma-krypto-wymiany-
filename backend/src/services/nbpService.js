const axios = require('axios');

const NBP_API = 'http://api.nbp.pl/api';

async function getRate(currency) {
  const url = `${NBP_API}/exchangerates/rates/A/${currency}/?format=json`;
  const resp = await axios.get(url);
  const rateObj = resp.data.rates[0];
  return rateObj.mid;
}

module.exports = { getRate };
