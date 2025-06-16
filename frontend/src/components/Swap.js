import React, { useState, useEffect } from 'react';
import './Swap.css';

const CRYPTOS = [
  { code: 'BTC', name: 'Bitcoin' },
  { code: 'ETH', name: 'Ethereum' },
  { code: 'LTC', name: 'Litecoin' },
];

const FIATS = [
  { code: 'USD', name: 'US Dollar' },
  { code: 'EUR', name: 'Euro' },
  { code: 'PLN', name: 'Polish Złoty' },
];

export default function Swap() {
  const [fromCurr, setFromCurr] = useState('BTC');
  const [toCurr,   setToCurr]   = useState('USD');
  const [amount,   setAmount]   = useState(1);
  const [rate,     setRate]     = useState(null);

  useEffect(() => {
    // эмулируем fetch курса
    const prices = { BTC: 105000, ETH: 2500, LTC: 85 };
    const base = prices[fromCurr] ?? 1;
    const target = toCurr === 'USD' ? base : (base * (prices[toCurr] ?? 1));
    setRate(target);
  }, [fromCurr, toCurr]);

  return (
    <div className="swap-page">
      <h2>Swap</h2>
      <div className="swap-box">
        <div className="field">
          <label>From</label>
          <select value={fromCurr} onChange={e => setFromCurr(e.target.value)}>
            {CRYPTOS.map(c => (
              <option key={c.code} value={c.code}>
                {c.code} — {c.name}
              </option>
            ))}
          </select>
          <input
            type="number"
            value={amount}
            min="0"
            onChange={e => setAmount(e.target.value)}
          />
        </div>

        <div className="arrow">↔</div>

        <div className="field">
          <label>To</label>
          <select value={toCurr} onChange={e => setToCurr(e.target.value)}>
            {FIATS.map(c => (
              <option key={c.code} value={c.code}>
                {c.code} — {c.name}
              </option>
            ))}
          </select>
          <input readOnly value={rate ? (amount * rate).toFixed(2) : '…'} />
        </div>

        <button className="swap-button">Swap</button>
      </div>
      <div className="rate-info">
        {amount} {fromCurr} ≈ {rate ? (amount * rate).toFixed(2) : '…'} {toCurr}
      </div>
    </div>
  );
}
