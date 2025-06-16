import React, { useEffect, useState } from 'react';
import './History.css';

export default function History() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:3000/payments/history', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => setHistory(data))
      .catch(err => console.error('Error loading history:', err));
  }, []);

  return (
    <div className="history-page">
      <h2>Transaction History</h2>
      <table className="history-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Currency</th>
          </tr>
        </thead>
        <tbody>
          {history.length === 0 ? (
            <tr>
              <td colSpan="4">No transactions found.</td>
            </tr>
          ) : (
            history.map((tx, index) => (
              <tr key={index}>
                <td>{new Date(tx.date).toLocaleString()}</td>
                <td>{tx.type}</td>
                <td>{tx.amount}</td>
                <td>{tx.currency}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
