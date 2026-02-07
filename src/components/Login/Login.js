import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Logika Mockup (Nanti bisa dihubungkan ke userQueries.js di folder graphql)
    if (credentials.username === 'admin' && credentials.password === 'admin123') {
      localStorage.setItem('userRole', 'admin');
      navigate('/beranda');
    } else if (credentials.username === 'warga' && credentials.password === 'warga123') {
      localStorage.setItem('userRole', 'warga');
      navigate('/lingkungan'); // Warga langsung diarahkan ke Lingkungan
    } else {
      alert('Username atau Password salah!');
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <div className="login-logo">
          <img src="/logo.svg" alt="SIRT" />
          <h2>Sistem Informasi RT 14</h2>
        </div>
        <form onSubmit={handleLogin}>
          <div className="input-field">
            <label>Username / NIK</label>
            <input 
              type="text" 
              placeholder="Masukkan username..." 
              onChange={(e) => setCredentials({...credentials, username: e.target.value})}
              required 
            />
          </div>
          <div className="input-field">
            <label>Password</label>
            <input 
              type="password" 
              placeholder="Masukkan password..." 
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              required 
            />
          </div>
          <button type="submit" className="btn-login">Masuk Sekarang</button>
        </form>
        <p className="login-footer">Lupa password? Hubungi Pengurus RT</p>
      </div>
    </div>
  );
};

export default Login;