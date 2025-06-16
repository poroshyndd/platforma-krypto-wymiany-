// src/components/PayButton.js
import React from 'react';

export default function PayButton({ amount, currency, description }) {
  const token = localStorage.getItem('token');

  const handlePay = async () => {
    try {
      const resp = await fetch('/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          amount,
          currency,
          description,
          extOrderId: 'order-' + Date.now(),
          notifyUrl: window.location.origin + '/payments/webhook',
          continueUrl: window.location.origin + '/payments/return'
        })
      });
      if (!resp.ok) throw new Error(await resp.text());
      const { redirectUri } = await resp.json();
      window.location.href = redirectUri;
    } catch (err) {
      alert('Ошибка при оплате: ' + err.message);
    }
  };

  return (
    <button onClick={handlePay}>
      Оплатить {amount} {currency}
    </button>
  );
}
