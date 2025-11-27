// src/components/Datawarga/Datawarga.js
import React from "react";
import "./Datawarga.css"; // Impor CSS untuk styling
import AddUser from "./AddUser"; // Komponen untuk menambah pengguna
import UserList from "./UserList"; // Komponen untuk menampilkan daftar pengguna
import { FaPlus, FaEye, FaSyncAlt, FaPrint } from "react-icons/fa"; // Impor ikon

const Datawarga = () => {
  const handleRefresh = () => {
    window.location.reload();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="container py-3 dw-page">
      <div className="dw-header mb-2">
        <h1>Data Warga</h1>
      </div>

      <div className="card mb-3 dw-toolbar">
        <div className="card-body">
          <div className="dw-toolbar">
            <button className="btn btn-primary btn-sm">
              <FaPlus className="me-1" />
              <span>Tambah</span>
            </button>

            <button className="btn btn-light btn-sm">
              <FaEye className="me-1" />
              <span>Lihat Data</span>
            </button>

            <button className="btn btn-secondary btn-sm" onClick={handleRefresh}>
              <FaSyncAlt className="me-1" />
              <span>Refresh</span>
            </button>

            <button className="btn btn-success btn-sm" onClick={handlePrint}>
              <FaPrint className="me-1" />
              <span>Cetak</span>
            </button>
          </div>
        </div>
      </div>

      <div className="row g-3">
        <div className="col-12">
          <div className="card dw-main">
            <div className="card-body">
              <UserList />
            </div>
          </div>
        </div>

        <div className="col-12">
          <div className="card dw-form-wrapper">
            <div className="card-header">
              <h2 className="mb-0">Form Tambah Data Warga</h2>
            </div>
            <div className="card-body">
              <AddUser />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Datawarga;