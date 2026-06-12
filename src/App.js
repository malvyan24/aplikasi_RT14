import React, { Suspense, lazy, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ApolloProvider } from "@apollo/client";
import client from "./apolloClient";

// IMPORT KOMPONEN SHARED (selalu dibutuhkan, tidak perlu lazy)
import Login from "./components/shared/Login/Login";
import Register from "./components/shared/Registrasi/Register"; 
import Navbar from "./components/shared/Navbar/Navbar";
import NavbarWarga from "./components/shared/NavbarWarga/NavbarWarga";
import './App.css'; 

// LAZY LOAD HALAMAN ADMIN (hanya dimuat saat dibutuhkan)
const HomeAdmin = lazy(() => import("./pages/admin/Home/Home"));
const Datawarga = lazy(() => import("./pages/admin/Datawarga/Datawarga"));
const Kesehatan = lazy(() => import("./pages/admin/Kesehatan/Kesehatan"));
const BankSampah = lazy(() => import("./pages/admin/Banksampah/Banksampah"));
const KegiatanLingkungan = lazy(() => import("./pages/admin/Kegiatanlingkungan/Kegiatanlingkungan"));

// LAZY LOAD HALAMAN WARGA
const Dashboardwarga = lazy(() => import("./pages/warga/Dashboardwarga"));

// Komponen loading fallback yang ringan
const PageLoader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{ width: '40px', height: '40px', border: '4px solid #e2e8f0', borderTop: '4px solid #6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }}></div>
      <p style={{ color: '#64748b', fontSize: '14px', fontWeight: 600 }}>Memuat halaman...</p>
    </div>
  </div>
);

const App = () => {
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
            {role === 'rt' ? (
              <Navbar onLogout={handleLogout} />
            ) : (
              <NavbarWarga onLogout={handleLogout} />
            )}
            
            <div className="app-nav-spacer" style={{ height: '70px' }} />
            <div className="app-container">
              <Suspense fallback={<PageLoader />}>
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
              </Suspense>
            </div>
          </>
        )}
      </Router>
    </ApolloProvider>
  );
};

export default App;