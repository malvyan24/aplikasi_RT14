import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Import dengan benar

import Navbar from "./components/Navbar/Navbar"; // Pastikan path benar
import Home from "./components/Home/Home"; // Pastikan path benar
import Login from "./components/Login/Login"; // Pastikan path benar
import Datawarga from "./components/Datawarga/Datawarga"; // Pastikan path benar
import Kesehatan from "./components/Kesehatan/Kesehatan"; // Pastikan path benar
// import Kegiatan from "./components/Kegiatan/Kegiatan"; // Komentar jika belum siap
import Banksampah from "./components/Banksampah/Banksampah"; // Pastikan path benar


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
          <Route path="/datawarga" element={<Datawarga />} /> {/* Halaman data warga */}
          <Route path="/kesehatan" element={<Kesehatan />} /> {/* Halaman kesehatan */}
          {/* Tambah rute berikut setelah komponen siap */}
          {/* <Route path="/kegiatan" element={<Kegiatan />} /> */}
          <Route path="/Banksampah" element={<Banksampah />} /> {/* Halaman Bank Sampah */}

          {/* 404 fallback */}
          <Route path="*" element={<div>Halaman tidak ditemukan</div>} />
        </Routes>
      </main>
    </Router>
  );
};

export default App;
