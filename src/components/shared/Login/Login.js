import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import './Login.css'; 

const LOGIN_USER = gql`
  mutation Login($identifier: String!, $password: String!) {
    login(identifier: $identifier, password: $password) {
      token
      user { 
        username 
        role 
        familyId # 👇 WAJIB DITAMBAHKAN AGAR BE MENGIRIM ID KELUARGA
      }
    }
  }
`;

const Login = ({ setToken, setRole }) => { 
  const navigate = useNavigate();
  const [loginAs, setLoginAs] = useState('warga'); 
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  const [login, { loading }] = useMutation(LOGIN_USER, {
    onCompleted: (data) => {
      const { token, user } = data.login;
      
      // 1. Simpan Token, Role, dan Info User ke brankas browser (localStorage)
      localStorage.setItem('authToken', token);
      localStorage.setItem('userRole', user.role);
      localStorage.setItem('userName', user.username);
      
      // 👇 SIMPAN FAMILY ID JIKA ADA 👇
      if (user.familyId) {
        localStorage.setItem('familyId', user.familyId);
      }
      
      // 2. Update state di App.js secara langsung
      setToken(token);
      setRole(user.role); 
      
      Swal.fire({
        icon: 'success',
        title: 'Akses Diterima',
        text: user.role === 'rt' ? 'Selamat Bertugas, Pak RT!' : 'Halo Warga, Selamat Datang!',
        timer: 1500,
        showConfirmButton: false
      }).then(() => navigate('/'));
    },
    onError: (err) => {
      Swal.fire('Gagal Login', err.message.replace('GraphQL error: ', ''), 'error');
    }
  });

  const handleLogin = (e) => {
    e.preventDefault();
    login({ variables: { identifier, password } });
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-header">
          <h2>SiRT 14</h2>
          <p>Portal Layanan Digital RT</p>
        </div>

        <div className="auth-toggle">
          <button type="button" className={loginAs === 'warga' ? 'active' : ''} onClick={() => {setLoginAs('warga'); setIdentifier('');}}>Warga</button>
          <button type="button" className={loginAs === 'admin' ? 'active' : ''} onClick={() => {setLoginAs('admin'); setIdentifier('');}}>Admin</button>
        </div>
        
        <form onSubmit={handleLogin} className="login-body">
          <div className="input-group">
            <label>{loginAs === 'warga' ? 'Email Warga' : 'Username Admin'}</label>
            <input 
              type={loginAs === 'warga' ? 'email' : 'text'} 
              value={identifier} 
              onChange={(e) => setIdentifier(e.target.value)} 
              required 
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'MEMVERIFIKASI...' : 'MASUK SEKARANG'}
          </button>
        </form>
        <div className="login-footer">
          {loginAs === 'warga' && <p>Belum punya akun? <Link to="/register">Aktivasi di sini</Link></p>}
        </div>
      </div>
    </div>
  );
};

export default Login;