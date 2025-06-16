import React, { useState } from 'react'
import './ExchangePanel.css'

export default function ExchangePanel() {
  const [fromVal, setFromVal] = useState(1)
  const [toVal,   setToVal]   = useState(1)

  return (
    <div className="exchange-panel">
      <label>
        From (ETH)
        <input
          type="number"
          value={fromVal}
          onChange={e => setFromVal(e.target.value)}
        />
      </label>
      <div className="swap-arrows">↔</div>
      <label>
        To (USDT)
        <input
          type="number"
          value={toVal}
          onChange={e => setToVal(e.target.value)}
        />
      </label>
      <button className="swap-btn">Swap</button>
    </div>
  )
}
