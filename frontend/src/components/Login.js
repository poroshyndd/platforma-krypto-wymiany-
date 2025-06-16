import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';
import illustration from '../assets/illustration.png';

export default function Login() {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ email, password })
      });
      const body = await res.json();
      if (!res.ok) {
        throw new Error(body.error || 'Ошибка при логине');
      }
      // сохраняем токен
      localStorage.setItem('token', body.token);
      // и переходим на Swap
      navigate('/swap');
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h2>Welcome to Crypto Kantor</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </label>
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="login-register">
          No account? <Link to="/register">Register here</Link>
        </p>
      </div>
      <div className="login-illustration">
        <img src={illustration} alt="Crypto Illustration" />
      </div>
    </div>
  );
}
