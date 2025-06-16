import React, { useState } from 'react';
import './DepositModal.css';

export default function DepositModal({ isOpen, onClose, onSubmit }) {
  const [amount, setAmount] = useState('');

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal deposit-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <h2>Пополнить баланс</h2>
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
