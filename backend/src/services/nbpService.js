// src/services/nbpService.js
const axios = require('axios');

// Базовый URL NBP
const NBP_API = 'http://api.nbp.pl/api';

/**
 * Получить текущий курс для заданной трехбуквенной валюты.
 * @param {string} currency — пример: 'USD', 'EUR'
 * @returns {Promise<number>} — курс
 */
async function getRate(currency) {
  // Таблица A содержит курсы к злотому
  const url = `${NBP_API}/exchangerates/rates/A/${currency}/?format=json`;
  const resp = await axios.get(url);
  // Структура: resp.data.rates — массив с одним объектом { no, effectiveDate, mid }
  const rateObj = resp.data.rates[0];
  return rateObj.mid;
}

module.exports = { getRate };
