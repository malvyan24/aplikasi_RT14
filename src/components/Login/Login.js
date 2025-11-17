import React, { useState } from 'react';
import './Login.css'; // Import CSS untuk styling

function Login() {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Logic untuk login bisa ditambahkan di sini
        console.log("Nama:", name, "Kata Sandi:", password);
    };

    return (
        <div className="login-container">
            <h1>Selamat Datang Di Web SiRT</h1>
            <h2>Masukkan Nama & Kata Sandi</h2>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    placeholder="Nama" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    required 
                />
                <input 
                    type="password" 
                    placeholder="Katasandi" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                />
                <button type="submit">Masuk</button>
            </form>
            <a href="#!">Lupa Password?</a>
        </div>
    );
}

export default Login;