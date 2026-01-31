import React from "react";
import "./Kesehatan.css";
import TambahDataKesehatan from "./TambahDataKesehatan";
import DaftarKesehatan from "./DaftarKesehatan";
import { FaPlus, FaTrash, FaSyncAlt, FaPrint } from "react-icons/fa"; // Import FaTrash

const Kesehatan = () => {
  const handleRefresh = () => window.location.reload();
  const handlePrint = () => window.print();

  return (
    <div className="container py-3 ks-page">
      <div className="ks-header mb-2">
        <h1>Data Kesehatan Warga</h1>
      </div>

      {/* Toolbar Card */}
      <div className="card mb-3 ks-toolbar-card">
        <div className="card-body">
          <div className="ks-toolbar">
            {/* Tombol Tambah Data */}
            <button className="btn btn-primary btn-sm" type="button">
              <FaPlus className="me-1" />
              <span>Tambah Data</span>
            </button>

            {/* Tombol Hapus Data */}
            <button className="btn btn-light btn-sm" type="button">
              <FaTrash className="me-1" />
              <span>Hapus Data</span>
            </button>

            {/* Tombol Refresh */}
            <button className="btn btn-secondary btn-sm" type="button" onClick={handleRefresh}>
              <FaSyncAlt className="me-1" />
              <span>Refresh</span>
            </button>

            {/* Tombol Cetak */}
            <button className="btn btn-success btn-sm" type="button" onClick={handlePrint}>
              <FaPrint className="me-1" />
              <span>Cetak</span>
            </button>
          </div>
        </div>
      </div>

      <div className="row g-3">
        {/* List / Tabel */}
        <div className="col-12">
          <div className="card ks-main">
            <div className="card-body">
              <DaftarKesehatan />
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="col-12">
          <div className="card ks-form-wrapper">
            <div className="card-header">
              <h2 className="mb-0 ks-card-title">Form Tambah Data Kesehatan</h2>
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
