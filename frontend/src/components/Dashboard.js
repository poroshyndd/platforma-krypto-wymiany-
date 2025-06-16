// src/components/Dashboard.js
import React from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import ExchangePanel from './ExchangePanel'
import './Dashboard.css'  // подключаем стили ниже

export default function Dashboard({ onLogout }) {
  return (
    <div className="dashboard">
      {/* Левая боковая панель с навигацией */}
      <aside className="dashboard__sidebar">
        <Sidebar />
      </aside>

      {/* Основной контент */}
      <div className="dashboard__main">
        {/* Верхний бар с балансом / кнопками */}
        <header className="dashboard__topbar">
          <Topbar onLogout={onLogout} />
        </header>

        {/* Область контента (здесь стартовая страница обмена) */}
        <section className="dashboard__content">
          <ExchangePanel />
        </section>
      </div>
    </div>
  )
}
