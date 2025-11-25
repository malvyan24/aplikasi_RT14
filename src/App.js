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
            <Route path="/kesehatan" element={<Kesehatan />} />
            <Route path="/kegiatan" element={<KegiatanLingkungan />} />
            <Route path="/Banksampah" element={<Banksampah />} />
            <Route path="*" element={<div>Halaman tidak ditemukan</div>} />
          </Routes>
        </main>
      </Router>
    </ApolloProvider>
  );
};

export default App;