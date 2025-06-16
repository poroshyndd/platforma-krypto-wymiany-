import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import Sidebar from './Sidebar';
import Topbar  from './Topbar';

import './Layout.css';

export default function Layout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="layout">
      <Sidebar />

      <div className="main-area">
        <Topbar onLogout={handleLogout} />
        <div className="layout-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
