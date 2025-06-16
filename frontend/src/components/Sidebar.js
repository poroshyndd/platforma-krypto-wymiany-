import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <h1>CRYPTO<br/>EXCHANGE</h1>
      <nav>
        <NavLink to="swap">Swap</NavLink>
        <NavLink to="rates/all">Fiat Rates</NavLink>
        <NavLink to="rates/BTC">Crypto Rates</NavLink>
        <NavLink to="payments/history">History</NavLink>
      </nav>
    </aside>
  );
}
