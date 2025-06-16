import React from 'react';
import './Topbar.css';

export default function Topbar({ onDeposit, onWithdraw, onLogout, balance }) {
  return (
    <div className="topbar">
      <span className="balance">Balance: {balance} 100 PLN</span>
      <button className="btn green" onClick={onDeposit}>Deposit</button>
      <button className="btn red" onClick={onWithdraw}>Withdraw</button>
      <button className="btn" onClick={onLogout}>Logout</button>
    </div>
  );
}
