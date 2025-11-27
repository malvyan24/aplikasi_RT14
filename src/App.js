// src/App.js
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
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
import DataSampah from "./components/Banksampah/DataSampah"; // Import DataSampah
import TambahDataSampah from "./components/Banksampah/TambahDataSampah"; 

const App = () => {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Navbar />
        <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "16px" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/datawarga" element={<Datawarga />} />
            <Route path="/kesehatan" element={<Kesehatan />} /> {/* Rute untuk Kesehatan */}
            <Route path="/lingkungan" element={<KegiatanLingkungan />} />
            <Route path="/banksampah" element={<Banksampah />} />
            <Route path="/datasampah" element={<DataSampah />} /> {/* Rute untuk Data Sampah */}
            <Route path="/tambahdatasampah" element={<TambahDataSampah />} /> {/* Rute untuk Tambah Data Sampah */}
            <Route path="*" element={<div>Halaman tidak ditemukan</div>} />
          </Routes>
        </main>
      </Router>
    </ApolloProvider>
  );
};

export default App;