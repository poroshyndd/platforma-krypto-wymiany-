// src/components/FiatRates.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function FiatRates() {
  const [rates, setRates] = useState([]);
  const [error, setError] = useState('');

  // Порядок основных валют
  const CURRENCIES = [
    'USD','EUR','GBP','CHF','CAD','AUD','JPY',
    'CNY','SEK','NOK','DKK','CZK','HUF','RON',
    'BGN','TRY','INR','BRL','ZAR'
  ];

  useEffect(() => {
    fetchRates();
    const iv = setInterval(fetchRates, 5 * 60 * 1000);
    return () => clearInterval(iv);
  }, []);

  function fetchRates() {
    axios.get('http://localhost:3000/rates/all')
      .then(res => {
        // Сортируем по заранее заданному порядку
        const sorted = res.data.sort(
          (a, b) => CURRENCIES.indexOf(a.currency) - CURRENCIES.indexOf(b.currency)
        );
        setRates(sorted);
        setError('');
      })
      .catch(() => {
        setError('Failed to load fiat rates');
      });
  }

  if (error) {
    return <p style={{ color: 'tomato', padding: 24 }}>{error}</p>;
  }
  if (!rates.length) {
    return <p style={{ padding: 24 }}>Loading…</p>;
  }

  // KPI
  const vals = rates.map(r => parseFloat(r.rate));
  const avg = (vals.reduce((sum, v) => sum + v, 0) / vals.length).toFixed(4);
  const mn  = Math.min(...vals).toFixed(4);
  const mx  = Math.max(...vals).toFixed(4);
  // убираем Δ% карточку, поэтому delta больше не нужен

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ color: '#fff', marginBottom: 16 }}>Fiat Rates</h2>

      {/* Карточки KPI */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))',
        gap: 16,
        marginBottom: 24
      }}>
        {[
          { title: 'Average', value: avg },
          { title: 'Min',     value: mn  },
          { title: 'Max',     value: mx  },
        ].map(({title, value}) => (
          <div key={title} style={{
            background: '#2a2d3a',
            padding: 16,
            borderRadius: 8,
            boxShadow: '0 2px 6px rgba(0,0,0,0.5)',
            textAlign: 'center'
          }}>
            <div style={{ color: '#aaa', fontSize: 14 }}>{title}</div>
            <div style={{ fontSize: 24, marginTop: 8, color: '#fff' }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Таблица курсов */}
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        background: '#2a2d3a',
        borderRadius: 8,
        overflow: 'hidden',
        boxShadow: '0 2px 6px rgba(0,0,0,0.5)'
      }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '1px solid #444' }}>
            <th style={{ padding: 12, color: '#fff' }}>Currency</th>
            <th style={{ padding: 12, color: '#fff' }}>Rate (PLN)</th>
          </tr>
        </thead>
        <tbody>
          {rates.map(r => (
            <tr key={r.currency} style={{ borderBottom: '1px solid #444' }}>
              <td style={{ padding: 12, color: '#fff' }}>{r.currency}</td>
              <td style={{ padding: 12, color: '#fff' }}>
                {parseFloat(r.rate).toFixed(4)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
