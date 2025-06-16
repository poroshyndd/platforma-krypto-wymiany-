// src/components/WithdrawModal.js
import React, { useState } from 'react';
import './WithdrawModal.css';

export default function WithdrawModal({ isOpen, onClose, onSubmit }) {
  const [amount, setAmount] = useState('');

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal withdraw-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <h2>Вывести со счёта</h2>
        <label>
          Сумма (PLN):
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="100.00"
          />
        </label>
        <button
          className="btn btn-primary"
          onClick={() => {
            onSubmit(parseFloat(amount));
            setAmount('');
          }}
          disabled={!amount || parseFloat(amount) <= 0}
        >
          Отправить
        </button>
      </div>
    </div>
  );
}
