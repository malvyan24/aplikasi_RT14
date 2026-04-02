import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ApolloProvider } from "@apollo/client";
import client from "./apolloClient";

// IMPORT KOMPONEN SHARED
import Login from "./components/shared/Login/Login";
import Register from "./components/shared/Registrasi/Register"; 
import Navbar from "./components/shared/Navbar/Navbar"; // Navbar Admin
import NavbarWarga from "./components/shared/NavbarWarga/NavbarWarga"; // Navbar Warga

// IMPORT HALAMAN ADMIN RT
import HomeAdmin from "./pages/admin/Home/Home";
import Datawarga from "./pages/admin/Datawarga/Datawarga";
import Kesehatan from "./pages/admin/Kesehatan/Kesehatan";
import BankSampah from "./pages/admin/Banksampah/Banksampah"; // ✅ Pastikan path ini benar kawan
import KegiatanLingkungan from "./pages/admin/Kegiatanlingkungan/Kegiatanlingkungan";

// 👇 IMPORT HALAMAN WARGA 👇
import Dashboardwarga from "./pages/warga/Dashboardwarga";

import './App.css'; 

const App = () => {
  // Ambil token dan role dari localStorage agar status login awet saat refresh
  const [token, setToken] = useState(localStorage.getItem("authToken"));
  const [role, setRole] = useState(localStorage.getItem("userRole"));

  const handleLogout = () => {
    localStorage.clear();
    setToken(null);
    setRole(null); 
  };

  return (
    <ApolloProvider client={client}>
      <Router>
        {/* === AREA GUEST (BELUM LOGIN) === */}
        {!token ? (
          <Routes>
            <Route path="/login" element={<Login setToken={setToken} setRole={setRole} />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        ) : (
          /* === AREA PROTECTED (SUDAH LOGIN) === */
          <>
            {/* LOGIKA PEMISAH NAVBAR */}
            {role === 'rt' ? (
              <Navbar onLogout={handleLogout} />
            ) : (
              <NavbarWarga onLogout={handleLogout} />
            )}
            
            <div className="app-nav-spacer" style={{ height: '70px' }} />
            <div className="app-container">
              
              {/* JALUR KHUSUS ADMIN RT */}
              {role === 'rt' && (
                <Routes>
                  <Route path="/" element={<HomeAdmin />} />
                  <Route path="/datawarga" element={<Datawarga />} />
                  <Route path="/kesehatan" element={<Kesehatan />} />
                  <Route path="/lingkungan" element={<KegiatanLingkungan />} />
                  <Route path="/banksampah" element={<BankSampah />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              )}

              {/* JALUR KHUSUS WARGA */}
              {role === 'warga' && (
                <Routes>
                  <Route path="/" element={<Dashboardwarga />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              )}

            </div>
          </>
        )}
      </Router>
    </ApolloProvider>
  );
};

export default App;