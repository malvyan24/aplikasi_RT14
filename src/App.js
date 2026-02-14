import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ApolloProvider } from "@apollo/client";
import client from "./apolloClient";

// Import Components
import Navbar from "./components/Navbar/Navbar";
import Login from "./components/Login/Login";
import Home from "./components/Home/Home";
import Datawarga from "./components/Datawarga/Datawarga";
import Kesehatan from "./components/Kesehatan/Kesehatan";
import KegiatanLingkungan from "./components/Kegiatanlingkungan/Kegiatanlingkungan";
import Banksampah from "./components/Banksampah/Banksampah";
import DataSampah from "./components/Banksampah/DataSampah";
import TambahDataSampah from "./components/Banksampah/TambahDataSampah";

import './App.css'; // Pastikan ada file css global jika dibutuhkan

const App = () => {
  // 1. Cek Token di LocalStorage saat aplikasi mulai
  const [token, setToken] = useState(localStorage.getItem('authToken'));

  // 2. Fungsi Logout
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setToken(null);
    // Router akan otomatis me-render Login karena token null
  };

  return (
    <ApolloProvider client={client}>
      <Router>
        {/* LOGIC PROTEKSI HALAMAN */}
        {!token ? (
          // JIKA BELUM LOGIN -> Tampilkan Halaman Login Saja
          <Routes>
            <Route path="*" element={<Login setToken={setToken} />} />
          </Routes>
        ) : (
          // JIKA SUDAH LOGIN -> Tampilkan Aplikasi Lengkap
          <>
            {/* Kirim fungsi logout ke Navbar */}
            <Navbar onLogout={handleLogout} />

            {/* Spacer wajib agar konten tidak ketutup navbar fixed */}
            <div className="app-nav-spacer" style={{ height: '64px' }} />

            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/datawarga" element={<Datawarga />} />
              <Route path="/kesehatan" element={<Kesehatan />} />
              <Route path="/lingkungan" element={<KegiatanLingkungan />} />
              <Route path="/banksampah" element={<Banksampah />} />
              <Route path="/datasampah" element={<DataSampah />} />
              <Route path="/tambahdatasampah" element={<TambahDataSampah />} />
              
              {/* Redirect sembarang URL kembali ke Home */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </>
        )}
      </Router>
    </ApolloProvider>
  );
};

export default App;