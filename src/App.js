import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import Home from "./components/Home/Home";
import Login from "./components/Login/Login";
import Datawarga from "./components/Datawarga/Datawarga";
import Kesehatan from "./components/Kesehatan/Kesehatan";
import KegiatanLingkungan from "./components/Kegiatanlingkungan/Kegiatanlingkungan"; // Pastikan nama file sesuai
import Banksampah from "./components/Banksampah/Banksampah";

const App = () => {
  return (
    <Router>
      {/* Navbar selalu ada di semua halaman */}
      <Navbar />

      {/* Konten halaman */}
      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "16px" }}>
        <Routes>
          <Route path="/" element={<Home />} /> {/* Home halaman utama */}
          <Route path="/login" element={<Login />} /> {/* Halaman login */}
          <Route path="/datawarga" element={<Datawarga />} />{" "}
          {/* Halaman data warga */}
          <Route path="/kesehatan" element={<Kesehatan />} />{" "}
          {/* Halaman kesehatan */}
          <Route path="/kegiatan" element={<KegiatanLingkungan />} />{" "}
          {/* Halaman kegiatan lingkungan */}
          <Route path="/Banksampah" element={<Banksampah />} />{" "}
          {/* Halaman Bank Sampah */}
          {/* 404 fallback */}
          <Route path="*" element={<div>Halaman tidak ditemukan</div>} />
        </Routes>
      </main>
    </Router>
  );
};

export default App;
