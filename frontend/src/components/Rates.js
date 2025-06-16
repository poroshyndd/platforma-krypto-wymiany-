import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Rates({ base, symbols }) {
  const [rates, setRates] = useState({});
  const [err, setErr]     = useState('');

  useEffect(() => {
    Promise.all(symbols.map(cur =>
      axios.get(`http://localhost:3000/rates/${cur}`)
        .then(r => ({ cur, rate: r.data.rate }))
    ))
    .then(results => {
      const obj = {};
      results.forEach(({ cur, rate }) => obj[cur] = rate);
      setRates(obj);
    })
    .catch(e => setErr('Ошибка загрузки'));
  }, [symbols]);

  if (err) return <p>{err}</p>;
  if (!Object.keys(rates).length) return <p>Загрузка…</p>;

  return (
    <table>
      <thead>
        <tr><th>Валюта</th><th>Курс (1 {base} = ...)</th></tr>
      </thead>
      <tbody>
        {symbols.map(cur => (
          <tr key={cur}>
            <td>{cur}</td>
            <td>{rates[cur].toFixed(4)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
