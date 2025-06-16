import React, { useEffect } from 'react';

export default function PaymentResult() {
  useEffect(() => {
    // Тут можно разобрать query params и показать статус
  }, []);

  return (
    <div>
      <h1>Результат оплаты</h1>
      <p>Спасибо, ваш платёж принят!</p>
      <a href="/">← Назад на главную</a>
    </div>
  );
}
