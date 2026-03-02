import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ApolloProvider } from "@apollo/client";
import client from "./apolloClient";

import Login from "./components/Login/Login";
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
  const [token, setToken] = useState(localStorage.getItem("authToken"));

  const handleLogout = () => {
    localStorage.clear();
    setToken(null);
  };

  return (
    <ApolloProvider client={client}>
      {!token ? (
        <Login setToken={setToken} />
      ) : (
        <Router>
          <Navbar onLogout={handleLogout} />
          <div className="app-nav-spacer" style={{ height: '70px' }} />
          <div className="app-container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/datawarga" element={<Datawarga />} />
              <Route path="/kesehatan" element={<Kesehatan />} />
              <Route path="/lingkungan" element={<KegiatanLingkungan />} />
              <Route path="/banksampah" element={<Banksampah />} />
              <Route path="/datasampah" element={<DataSampah />} />
              <Route path="/tambahdatasampah" element={<TambahDataSampah />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </Router>
      )}
    </ApolloProvider>
  );
};

export default App;