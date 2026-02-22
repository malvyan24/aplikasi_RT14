import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ApolloProvider } from "@apollo/client";
import client from "./apolloClient";

// Import Components
import Navbar from "./components/Navbar/Navbar";
import Home from "./components/Home/Home";
import Datawarga from "./components/Datawarga/Datawarga";
import Kesehatan from "./components/Kesehatan/Kesehatan";
import KegiatanLingkungan from "./components/Kegiatanlingkungan/Kegiatanlingkungan";
import Banksampah from "./components/Banksampah/Banksampah";
import DataSampah from "./components/Banksampah/DataSampah";
import TambahDataSampah from "./components/Banksampah/TambahDataSampah";

import './App.css'; 

const App = () => {
  // BYPASS: Langsung set token seolah-olah sudah login
  const [token, setToken] = useState("token-bypass-admin-rt14");

  useEffect(() => {
    // Memasukkan data palsu ke localStorage agar komponen lain tidak error
    localStorage.setItem("authToken", "token-bypass-admin-rt14");
    localStorage.setItem("user", "Admin RT 14 (Bypass)");
    localStorage.setItem("userRole", "admin");
  }, []);

  return (
    <ApolloProvider client={client}>
      <Router>
        {/* Navbar akan selalu muncul karena kita 'sudah login' */}
        <Navbar />
        
        {/* Spacer agar konten tidak tertutup Navbar */}
        <div className="app-nav-spacer" style={{ height: '70px' }} />

        <div className="app-container">
          <Routes>
            {/* Semua Route sekarang terbuka lebar */}
            <Route path="/" element={<Home />} />
            <Route path="/datawarga" element={<Datawarga />} />
            <Route path="/kesehatan" element={<Kesehatan />} />
            <Route path="/lingkungan" element={<KegiatanLingkungan />} />
            <Route path="/banksampah" element={<Banksampah />} />
            <Route path="/datasampah" element={<DataSampah />} />
            <Route path="/tambahdatasampah" element={<TambahDataSampah />} />

            {/* Jika user mengakses halaman yang tidak ada, arahkan ke Home */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </ApolloProvider>
  );
};

export default App;