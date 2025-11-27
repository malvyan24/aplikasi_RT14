// src/components/Kesehatan/Kesehatan.js
import React from "react";
import "./Kesehatan.css"; // Impor CSS untuk styling
import TambahDataKesehatan from "./TambahDataKesehatan"; // Komponen untuk menambah data
import DaftarKesehatan from "./DaftarKesehatan"; // Komponen untuk menampilkan daftar data
import { FaPlus, FaEye, FaSyncAlt, FaPrint } from "react-icons/fa"; // Impor ikon

const Kesehatan = () => {
  const handleRefresh = () => {
    window.location.reload();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="container py-3 dw-page">
      <div className="dw-header mb-2">
        <h1>Data Kesehatan Warga</h1>
      </div>

      <div className="card mb-3 dw-toolbar">
        <div className="card-body">
          <div className="dw-toolbar">
            <button className="btn btn-primary btn-sm">
              <FaPlus className="me-1" />
              Tambah Data
            </button>

            <button className="btn btn-light btn-sm">
              <FaEye className="me-1" />
              Lihat Data
            </button>

            <button className="btn btn-secondary btn-sm" onClick={handleRefresh}>
              <FaSyncAlt className="me-1" />
              Refresh
            </button>

            <button className="btn btn-success btn-sm" onClick={handlePrint}>
              <FaPrint className="me-1" />
              Cetak
            </button>
          </div>
        </div>
      </div>

      <div className="row g-3">
        <div className="col-12">
          <div className="card dw-main">
            <div className="card-body">
              <DaftarKesehatan />
            </div>
          </div>
        </div>

        <div className="col-12">
          <div className="card dw-form-wrapper">
            <div className="card-header">
              <h2 className="mb-0">Form Tambah Data Kesehatan</h2>
            </div>
            <div className="card-body">
              <TambahDataKesehatan />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Kesehatan;