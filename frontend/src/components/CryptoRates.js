import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts'
import './CryptoRates.css'

const COINS = [
  { id: 'bitcoin',   name: 'Bitcoin'   },
  { id: 'ethereum',  name: 'Ethereum'  },
  { id: 'bnb',       name: 'BNB'       },
  { id: 'cardano',   name: 'Cardano'   },
  { id: 'dogecoin',  name: 'Dogecoin'  },
  { id: 'ripple',    name: 'Ripple'    },
  { id: 'solana',    name: 'Solana'    },
  { id: 'litecoin',  name: 'Litecoin'  },
  { id: 'polkadot',  name: 'Polkadot'  },
  { id: 'chainlink', name: 'Chainlink' },
  { id: 'polygon',   name: 'Polygon'   },
  { id: 'avalanche', name: 'Avalanche' },
  { id: 'tezos',     name: 'Tezos'     },
  { id: 'vechain',   name: 'VeChain'   },
  { id: 'filecoin',  name: 'Filecoin'  },
  { id: 'tron',      name: 'TRON'      },
  { id: 'eos',       name: 'EOS'       },
  { id: 'aave',      name: 'Aave'      },
]

export default function CryptoRates() {
  const [market, setMarket] = useState(null)
  const [rates, setRates]   = useState([])
  const [error, setError]   = useState('')
  const [modal, setModal]   = useState(null)
  const [hist, setHist]     = useState([])

  useEffect(() => {
    fetchMarket()
    fetchRates()
    const iv = setInterval(fetchRates, 60_000)
    return () => clearInterval(iv)
  }, [])

  function fetchMarket() {
    axios.get('https://api.coingecko.com/api/v3/global')
      .then(({data}) => setMarket(data.data))
      .catch(() => {})
  }

  function fetchRates() {
    axios.get('https://api.coingecko.com/api/v3/coins/markets', {
        params: {
          vs_currency: 'pln',
          ids: COINS.map(c => c.id).join(','),
          order: 'market_cap_desc'
        }
      })
      .then(({data}) => {
        setRates(data)
        setError('')
      })
      .catch(() => setError('Failed to load crypto rates'))
  }

  function openModal(id) {
    setModal(id)
    axios.get(`https://api.coingecko.com/api/v3/coins/${id}/market_chart`, {
        params: { vs_currency: 'pln', days: 7 }
      })
      .then(({data}) => {
        const chart = data.prices.map(([ts, p]) => ({
          date: new Date(ts).toLocaleDateString('en-US',{month:'numeric',day:'numeric'}),
          price: Number(p.toFixed(2))
        }))
        setHist(chart)
      })
      .catch(() => setHist([]))
  }

  function closeModal() {
    setModal(null)
    setHist([])
  }

  if (error) return <p className="error">{error}</p>
  if (!market || !rates.length) return <p className="loading">Loading…</p>

  return (
    <div className="crypto-page">
      <div className="market-info">
        <div><strong>Market Cap:</strong> {market.total_market_cap.pln.toLocaleString()} PLN</div>
        <div><strong>24h Volume:</strong> {market.total_volume.pln.toLocaleString()} PLN</div>
      </div>

      <div className="coins-grid">
        {COINS.map(c => {
          const info = rates.find(r => r.id === c.id) || {}
          const price = info.current_price != null
            ? info.current_price.toLocaleString(undefined,{ minimumFractionDigits:2, maximumFractionDigits:2 }) + ' PLN'
            : '–'
          const pct = info.price_change_percentage_24h != null
            ? `${info.price_change_percentage_24h.toFixed(2)}%`
            : '–'
          const neg = info.price_change_percentage_24h < 0

          return (
            <div key={c.id} className="coin-card" onClick={() => openModal(c.id)}>
              <div className="coin-name">{c.name}</div>
              <div className="coin-price">{price}</div>
              <div className={`coin-change ${neg?'neg':'pos'}`}>
                {neg ? '' : '+'}{pct} (24h)
              </div>
            </div>
          )
        })}
      </div>

      {modal && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>×</button>
            <h3>{COINS.find(c=>c.id===modal).name} — last 7 days</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={hist}>
                <XAxis dataKey="date" tick={{fill:'#ccc',fontSize:12}}/>
                <YAxis tick={{fill:'#ccc',fontSize:12}}/>
                <Tooltip contentStyle={{background:'#2a2d3a',border:'none'}}/>
                <Line type="monotone" dataKey="price" stroke="#6f6" dot={false}/>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  )
}
