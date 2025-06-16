// src/components/Home.js
import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');

  const handlePay = async () => {
    try {
      const resp = await axios.post('http://localhost:3000/payments', {
        amount: 150,
        currency: 'PLN',
        description: 'Тестовый платёж',
        extOrderId: `order-${Date.now()}`,
        notifyUrl: 'https://example.com/webhook',
        continueUrl: window.location.origin + '/success'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // редиректим на payu
      window.location.href = resp.data.redirectUri;
    } catch (err) {
      setMessage(err.response?.data?.error || 'Ошибка при оплате');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Крипто-Кантор</h1>
      <button onClick={handlePay}>Оплатить 150 PLN</button>
      {message && <div style={{ color: 'red', marginTop: 10 }}>{message}</div>}
    </div>
  );
}
