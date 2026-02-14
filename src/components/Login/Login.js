import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import Swal from 'sweetalert2';
import './Login.css'; // Pastikan CSS diimport di sini

const LOGIN_USER = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      user {
        username
        role
      }
    }
  }
`;

const Login = ({ setToken }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [login, { loading }] = useMutation(LOGIN_USER, {
    onCompleted: (data) => {
      const token = data.login.token;
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', data.login.user.username);
      setToken(token);
      
      Swal.fire({
        icon: 'success',
        title: 'Selamat Datang!',
        text: `Halo, Pak ${data.login.user.username}`,
        showConfirmButton: false,
        timer: 1500
      });
    },
    onError: (error) => {
      Swal.fire({
        icon: 'error',
        title: 'Akses Ditolak',
        text: 'Username atau Password salah!',
      });
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    login({ variables: { username, password } });
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-header">
          <img src="/image/logoSiRT.png" alt="Logo" className="app-logo" />
          <h2>Layanan Digital RT 14</h2>
          <p>Silakan masuk untuk mengelola data warga</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-body">
          <div className="input-group">
            <label>Username</label>
            <input
              type="text"
              placeholder="Masukkan username Anda"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          
          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Memverifikasi...' : 'MASUK KE SISTEM'}
          </button>
        </form>
        
        <div className="login-footer">
          <p>© 2026 Pengurus Rukun Tetangga 14 - Bogor</p>
        </div>
      </div>
    </div>
  );
};

export default Login;