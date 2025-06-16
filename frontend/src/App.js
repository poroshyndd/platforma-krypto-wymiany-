import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Swap from './components/Swap';
import FiatRates from './components/FiatRates';
import CryptoRates from './components/CryptoRates';
import History from './components/History';
import Layout from './components/Layout';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="swap" element={<Swap />} />
          <Route path="rates/all" element={<FiatRates />} />
          <Route path="rates/:curr" element={<CryptoRates />} />
          <Route path="payments/history" element={<History />} />
        </Route>
      </Routes>
    </Router>
  );
}
