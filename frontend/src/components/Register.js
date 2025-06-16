import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Register.css';
import illustration from '../assets/illustration.png';

export default function Register() {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Ошибка регистрации');
      }
      alert('Регистрация успешна, теперь войдите');
      navigate('/login');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="register-page">
      <div className="register-box">
        <h2>Create an Account</h2>
        <form onSubmit={handleSubmit} className="register-form">
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
          <button type="submit">Register</button>
        </form>
        <p className="register-login">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
      <div className="register-illustration">
        <img src={illustration} alt="Crypto Illustration" />
      </div>
    </div>
  );
}
