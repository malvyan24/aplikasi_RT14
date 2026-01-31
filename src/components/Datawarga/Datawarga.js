import React from "react";
import "./Datawarga.css";
import AddUser from "./AddUser";
import UserList from "./UserList";
// PERBAIKAN 1: Tambahkan FaTrash ke dalam import
import { FaPlus, FaTrash, FaSyncAlt, FaPrint } from "react-icons/fa";

const Datawarga = () => {
  const handleRefresh = () => {
    window.location.reload();
  };

  const handlePrint = () => {
    window.print();
  };

  // Fungsi scroll ke form tambah data
  const scrollToForm = () => {
    const formElement = document.getElementById("form-tambah-warga");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="container py-3 dw-page">
      <div className="dw-header mb-2">
        <h1>Data Warga</h1>
      </div>

      {/* Toolbar Card */}
      {/* PERBAIKAN 2: Ubah class 'ks-toolbar-card' jadi 'dw-toolbar' atau hapus jika pakai bootstrap murni */}
      <div className="card mb-3 dw-toolbar-card">
        <div className="card-body">
          <div className="dw-toolbar d-flex gap-2 flex-wrap">
            {/* Tombol Tambah Data (Biru) - Ditambah fungsi Scroll */}
            <button
              className="btn btn-primary btn-sm"
              type="button"
              onClick={scrollToForm}
            >
              <FaPlus className="me-1" />
              <span>Tambah Data</span>
            </button>

            {/* Tombol Hapus Data (Putih) */}
            <button className="btn btn-light btn-sm" type="button">
              {/* Sekarang FaTrash sudah diimport, error akan hilang */}
              <FaTrash className="me-1" />
              <span>Hapus Data</span>
            </button>

            {/* Tombol Refresh (Abu) */}
            <button
              className="btn btn-secondary btn-sm"
              type="button"
              onClick={handleRefresh}
            >
              <FaSyncAlt className="me-1" />
              <span>Refresh</span>
            </button>

            {/* Tombol Cetak (Hijau) */}
            <button
              className="btn btn-success btn-sm"
              type="button"
              onClick={handlePrint}
            >
              <FaPrint className="me-1" />
              <span>Cetak</span>
            </button>
          </div>
        </div>
      </div>

      <div className="row g-3">
        {/* Bagian List Warga */}
        <div className="col-12">
          <div className="card dw-main shadow-sm border-0">
            <div className="card-body p-0">
              <UserList />
            </div>
          </div>
        </div>

        {/* Bagian Form Tambah Data */}
        <div className="col-12" id="form-tambah-warga">
          <div className="card dw-form-wrapper shadow-sm border-0">
            {/* PERBAIKAN 3: Header dibuat abu-abu (bg-light) agar mirip halaman Kesehatan */}
            <div className="card-header bg-light py-3">
              <h6 className="mb-0 fw-bold text-dark">Form Tambah Data Warga</h6>
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
