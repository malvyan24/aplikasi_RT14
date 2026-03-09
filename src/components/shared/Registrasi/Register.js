// import React, { useState } from 'react';
// import { useMutation, gql } from '@apollo/client';
// import { useNavigate, Link } from 'react-router-dom';
// import Swal from 'sweetalert2';
// import './Register.css'; 

// const REGISTER_USER = gql`
//   mutation RegisterUser($username: String!, $email: String!, $password: String!) {
//     registerUser(username: $username, email: $email, password: $password) {
//       success
//       message
//     }
//   }
// `;

// const Register = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     username: '',
//     email: '',
//     password: '',
//     confirmPassword: ''
//   });

//   const [registerUser, { loading }] = useMutation(REGISTER_USER, {
//     onCompleted: (data) => {
//       if (data.registerUser.success) {
//         Swal.fire({
//           icon: 'success',
//           title: 'Pendaftaran Berhasil!',
//           text: data.registerUser.message,
//           confirmButtonText: 'Lanjut Login'
//         }).then(() => {
//           navigate('/login'); 
//         });
//       }
//     },
//     onError: (err) => {
//       Swal.fire({
//         icon: 'error',
//         title: 'Pendaftaran Ditolak',
//         text: err.message.replace('GraphQL error: ', ''),
//       });
//     }
//   });

//   const handleRegister = (e) => {
//     e.preventDefault();
//     if (formData.password !== formData.confirmPassword) {
//       Swal.fire('Oops!', 'Password dan Konfirmasi Password tidak sama kawan!', 'warning');
//       return;
//     }
//     registerUser({ 
//       variables: { 
//         username: formData.username, 
//         email: formData.email, 
//         password: formData.password 
//       } 
//     });
//   };

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   return (
//     <div className="register-wrapper">
//       <div className="register-card">
//         <div className="register-header">
//           <img src="/image/logoSiRT.png" alt="Logo" className="app-logo" style={{width: '70px'}} />
//           <h2>Aktivasi Akun Warga</h2>
//           <p>Masukkan email yang terdaftar di RT 14</p>
//         </div>
        
//         <form onSubmit={handleRegister} className="register-body">
//           <div className="input-group">
//             <label>Username Baru</label>
//             <input type="text" name="username" placeholder="Contoh: asep123" value={formData.username} onChange={handleChange} required />
//           </div>
//           <div className="input-group">
//             <label>Email Terdaftar</label>
//             <input type="email" name="email" placeholder="Contoh: asep@warga.com" value={formData.email} onChange={handleChange} required />
//           </div>
//           <div className="input-group">
//             <label>Password</label>
//             <input type="password" name="password" placeholder="Buat password kawan..." value={formData.password} onChange={handleChange} required minLength="6" />
//           </div>
//           <div className="input-group">
//             <label>Konfirmasi Password</label>
//             <input type="password" name="confirmPassword" placeholder="Ketik ulang password..." value={formData.confirmPassword} onChange={handleChange} required />
//           </div>
//           <button type="submit" className="register-btn" disabled={loading}>
//             {loading ? 'Sistem Sedang Melacak Data...' : 'AKTIVASI SEKARANG'}
//           </button>
//         </form>
        
//         <div className="register-footer">
//           <p>Sudah punya akun? <Link to="/login" className="login-link">Masuk di sini</Link></p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Register;




// import React, { useState } from 'react';
// import { useMutation, gql } from '@apollo/client';
// import { useNavigate, Link } from 'react-router-dom';
// import Swal from 'sweetalert2';
// // Gunakan styling yang sama dengan login agar rapi
// import '../Login/Login.css'; 

// // GQL Mutation sesuai dengan kontrak di Backend
// const REGISTER_USER = gql`
//   mutation RegisterUser($username: String!, $email: String!, $password: String!) {
//     registerUser(username: $username, email: $email, password: $password) {
//       success
//       message
//     }
//   }
// `;

// const Register = () => {
//   const navigate = useNavigate();
  
//   // State untuk menampung input form
//   const [formData, setFormData] = useState({
//     username: '',
//     email: '',
//     password: '',
//     confirmPassword: ''
//   });

//   const [register, { loading }] = useMutation(REGISTER_USER, {
//     onCompleted: (data) => {
//       if (data.registerUser.success) {
//         Swal.fire({
//           icon: 'success',
//           title: 'Aktivasi Berhasil!',
//           text: data.registerUser.message,
//           confirmButtonText: 'Lanjut Login'
//         }).then(() => {
//           navigate('/login'); 
//         });
//       }
//     },
//     onError: (err) => {
//       Swal.fire({
//         icon: 'error',
//         title: 'Pendaftaran Gagal',
//         text: err.message.replace('GraphQL error: ', ''),
//       });
//     }
//   });

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     // 1. Validasi kecocokan password
//     if (formData.password !== formData.confirmPassword) {
//       return Swal.fire('Oops!', 'Password dan Konfirmasi Password tidak cocok kawan!', 'warning');
//     }

//     // 2. Kirim data ke Backend (Sudah diperbaiki dari error duplicate key)
//     register({ 
//       variables: { 
//         username: formData.username, 
//         email: formData.email, 
//         password: formData.password 
//       } 
//     });
//   };

//   return (
//     <div className="login-wrapper">
//       <div className="login-card">
//         <div className="login-header">
//           <img src="/image/logoSiRT.png" alt="Logo" className="app-logo" style={{width: '70px'}} />
//           <h2>SiRT 14</h2>
//           <h3 style={{fontSize: '18px', color: '#1e3c72', marginBottom: '10px'}}>Aktivasi Akun Warga</h3>
//           <p>Masukkan email kawan yang terdaftar di database RT</p>
//         </div>
        
//         <form onSubmit={handleSubmit} className="login-body">
//           <div className="input-group">
//             <label>Username Baru</label>
//             <input 
//               type="text" 
//               name="username"
//               placeholder="Contoh: alpian123" 
//               value={formData.username} 
//               onChange={handleChange} 
//               required 
//             />
//           </div>

//           <div className="input-group">
//             <label>Email Terdaftar</label>
//             <input 
//               type="email" 
//               name="email"
//               placeholder="Contoh: warga@email.com" 
//               value={formData.email} 
//               onChange={handleChange} 
//               required 
//             />
//           </div>

//           <div className="input-group">
//             <label>Password</label>
//             <input 
//               type="password" 
//               name="password"
//               placeholder="Minimal 6 karakter" 
//               value={formData.password} 
//               onChange={handleChange} 
//               required 
//             />
//           </div>

//           <div className="input-group">
//             <label>Konfirmasi Password</label>
//             <input 
//               type="password" 
//               name="confirmPassword"
//               placeholder="Ulangi password kawan" 
//               value={formData.confirmPassword} 
//               onChange={handleChange} 
//               required 
//             />
//           </div>

//           <button type="submit" className="login-btn" disabled={loading} style={{background: '#10B981'}}>
//             {loading ? 'MENGECEK DATA...' : 'AKTIVASI AKUN'}
//           </button>
//         </form>
        
//         <div className="login-footer">
//           <p>Sudah punya akun? <Link to="/login" style={{color: '#2a5298', fontWeight: 'bold', textDecoration: 'none'}}>Masuk di sini</Link></p>
//           <div style={{marginTop: '15px', fontSize: '11px', color: '#888'}}>
//             © 2026 Pengurus RT 14 - Project Alpian
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Register;


// import React, { useState } from 'react';
// import { useMutation, gql } from '@apollo/client';
// import { useNavigate, Link } from 'react-router-dom';
// import Swal from 'sweetalert2';
// import '../Login/Login.css'; // Meminjam style login agar seragam

// const REGISTER_USER = gql`
//   mutation RegisterUser($username: String!, $email: String!, $password: String!) {
//     registerUser(username: $username, email: $email, password: $password) {
//       success
//       message
//     }
//   }
// `;

// const Register = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({ 
//     username: '', 
//     email: '', 
//     password: '', 
//     confirmPassword: '' 
//   });

//   const [register, { loading }] = useMutation(REGISTER_USER, {
//     onCompleted: (data) => {
//       Swal.fire('Berhasil!', data.registerUser.message, 'success')
//       .then(() => navigate('/login'));
//     },
//     onError: (err) => {
//       Swal.fire('Gagal', err.message.replace('GraphQL error: ', ''), 'error');
//     }
//   });

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (formData.password !== formData.confirmPassword) {
//       return Swal.fire('Oops', 'Konfirmasi password tidak cocok kawan!', 'warning');
//     }
    
//     register({ 
//       variables: { 
//         username: formData.username, 
//         email: formData.email, 
//         password: formData.password 
//       } 
//     });
//   };

//   return (
//     <div className="login-wrapper">
//       <div className="login-card">
//         <div className="login-header">
//           <h2>Aktivasi Akun</h2>
//           <p>Gunakan email yang terdaftar di RT 14</p>
//         </div>
        
//         <form onSubmit={handleSubmit} className="login-body">
//           <div className="input-group">
//             <label>Username Baru</label>
//             <input type="text" onChange={(e) => setFormData({...formData, username: e.target.value})} required />
//           </div>
//           <div className="input-group">
//             <label>Email Terdaftar</label>
//             <input type="email" onChange={(e) => setFormData({...formData, email: e.target.value})} required />
//           </div>
//           <div className="input-group">
//             <label>Password</label>
//             <input type="password" onChange={(e) => setFormData({...formData, password: e.target.value})} required />
//           </div>
//           <div className="input-group">
//             <label>Konfirmasi Password</label>
//             <input type="password" onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} required />
//           </div>
//           <button type="submit" className="login-btn" disabled={loading} style={{background: '#10B981'}}>
//             {loading ? 'MEMPROSES...' : 'AKTIVASI SEKARANG'}
//           </button>
//         </form>
//         <div className="login-footer">
//           <p>Sudah punya akun? <Link to="/login">Kembali Login</Link></p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Register;



import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../Login/Login.css';

const REGISTER_USER = gql`
  mutation RegisterUser($username: String!, $email: String!, $password: String!) {
    registerUser(username: $username, email: $email, password: $password) {
      success
      message
    }
  }
`;

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '' });

  const [register, { loading }] = useMutation(REGISTER_USER, {
    onCompleted: (data) => {
      Swal.fire('Berhasil!', data.registerUser.message, 'success')
      .then(() => navigate('/login'));
    },
    onError: (err) => Swal.fire('Gagal', err.message.replace('GraphQL error: ', ''), 'error')
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) return Swal.fire('Oops', 'Password tidak cocok!', 'warning');
    
    register({ 
      variables: { 
        username: formData.username, 
        email: formData.email, 
        password: formData.password 
      } 
    });
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h3>Aktivasi Warga RT 14</h3>
        <p style={{fontSize: '13px', marginBottom: '20px'}}>Gunakan email yang sudah didaftarkan Pak RT</p>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Username</label>
            <input type="text" onChange={(e) => setFormData({...formData, username: e.target.value})} required />
          </div>
          <div className="input-group">
            <label>Email</label>
            <input type="email" onChange={(e) => setFormData({...formData, email: e.target.value})} required />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input type="password" onChange={(e) => setFormData({...formData, password: e.target.value})} required />
          </div>
          <div className="input-group">
            <label>Konfirmasi Password</label>
            <input type="password" onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} required />
          </div>
          <button type="submit" className="login-btn" disabled={loading} style={{background: '#10B981'}}>
            {loading ? 'MENGECEK DATA...' : 'AKTIVASI AKUN'}
          </button>
        </form>
        <p style={{textAlign: 'center', marginTop: '15px'}}><Link to="/login">Sudah punya akun? Masuk</Link></p>
      </div>
    </div>
  );
};

export default Register;