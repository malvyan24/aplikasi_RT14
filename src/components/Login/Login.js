import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import Swal from 'sweetalert2';
import './Login.css'; 

// Mutation disesuaikan dengan AuthPayload di BE
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
      // Mengambil data dari payload login
      const { token, user } = data.login;

      // Simpan data ke LocalStorage untuk menjaga sesi tetap aktif
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', user.username);
      localStorage.setItem('userRole', user.role);
      
      // Update state token di App.js
      setToken(token);
      
      Swal.fire({
        icon: 'success',
        title: 'Selamat Datang!',
        text: `Halo, Pak ${user.username}`,
        showConfirmButton: false,
        timer: 1500
      }).then(() => {
        // Refresh kecil untuk memastikan semua komponen mendapat state terbaru
        window.location.reload(); 
      });
    },
    onError: (error) => {
      // Menampilkan pesan error asli dari Backend (misal: "User tidak ditemukan")
      Swal.fire({
        icon: 'error',
        title: 'Akses Ditolak',
        text: error.message || 'Username atau Password salah!',
      });
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Normalisasi: Kirim username dengan huruf kecil agar cocok dengan database
    login({ 
      variables: { 
        username: username.trim().toLowerCase(), 
        password: password 
      } 
    });
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-header">
          {/* Pastikan path logo benar sesuai folder public Kakak */}
          <img src="/image/logoSiRT.png" alt="Logo" className="app-logo" />
          <h2>Layanan Digital RT 14</h2>
          <p>Silakan masuk untuk mengelola data warga</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-body">
          <div className="input-group">
            <label>Username</label>
            <input
              type="text"
              placeholder="Masukkan username (adminrt14)"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
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
              autoComplete="current-password"
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