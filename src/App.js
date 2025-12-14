// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ApolloProvider } from "@apollo/client";
import client from "./apolloClient";

import Navbar from "./components/Navbar/Navbar";
import Home from "./components/Home/Home";
import Login from "./components/Login/Login";
import Datawarga from "./components/Datawarga/Datawarga";
import Kesehatan from "./components/Kesehatan/Kesehatan";
import KegiatanLingkungan from "./components/Kegiatanlingkungan/Kegiatanlingkungan";
import Banksampah from "./components/Banksampah/Banksampah";
import DataSampah from "./components/Banksampah/DataSampah";
import TambahDataSampah from "./components/Banksampah/TambahDataSampah";

const App = () => {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Navbar />

        {/* ✅ Spacer wajib: mencegah konten ketutup navbar fixed */}
        <div className="app-nav-spacer" />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/datawarga" element={<Datawarga />} />
          <Route path="/kesehatan" element={<Kesehatan />} />
          <Route path="/lingkungan" element={<KegiatanLingkungan />} />
          <Route path="/banksampah" element={<Banksampah />} />
          <Route path="/datasampah" element={<DataSampah />} />
          <Route path="/tambahdatasampah" element={<TambahDataSampah />} />
          <Route path="*" element={<div style={{ padding: 16 }}>Halaman tidak ditemukan</div>} />
        </Routes>
      </Router>
    </ApolloProvider>
  );
};

export default App;
