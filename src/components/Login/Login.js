import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import Swal from 'sweetalert2';
import './Login.css'; 

const LOGIN_USER = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      user { username role }
    }
  }
`;

const Login = ({ setToken }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [login, { loading }] = useMutation(LOGIN_USER, {
    onCompleted: (data) => {
      localStorage.setItem('authToken', data.login.token);
      localStorage.setItem('user', data.login.user.username);
      setToken(data.login.token);
      Swal.fire('Berhasil', 'Selamat Datang Pak RT!', 'success');
    },
    onError: (err) => Swal.fire('Gagal', err.message, 'error')
  });

  const handleLogin = (e) => {
    e.preventDefault();
    login({ variables: { username, password } });
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-header">
          <img src="/image/logoSiRT.png" alt="Logo" className="app-logo" style={{width: '80px'}} />
          <h2>SiRT 14 - Login Admin</h2>
          <p>Masukkan akses manual kawan</p>
        </div>
        
        <form onSubmit={handleLogin} className="login-body">
          <div className="input-group">
            <input 
              type="text" 
              placeholder="Username Manual" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
            />
          </div>
          <div className="input-group">
            <input 
              type="password" 
              placeholder="Password Manual" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Memverifikasi...' : 'MASUK SEKARANG'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;