import React from "react";
import TambahDataSampah from "./TambahDataSampah";
import DataSampah from "./DataSampah";
import { FaPlus, FaEye, FaSyncAlt, FaPrint } from "react-icons/fa";
import "./Banksampah.css";

const Banksampah = () => {
  const handleRefresh = () => window.location.reload();
  const handlePrint = () => window.print();

  return (
    <div className="container py-3 bank-sampah-page">
      <div className="bank-sampah-header mb-2">
        <h1>Bank Sampah RT 14</h1>
      </div>

      {/* Toolbar Card */}
      <div className="card mb-3 bank-sampah-toolbar-card">
        <div className="card-body">
          <div className="bank-sampah-toolbar">
            <button className="btn btn-primary btn-sm" type="button">
              <FaPlus className="me-1" />
              <span>Tambah Data</span>
            </button>

            <button className="btn btn-light btn-sm" type="button">
              <FaEye className="me-1" />
              <span>Lihat Data</span>
            </button>

            <button className="btn btn-secondary btn-sm" type="button" onClick={handleRefresh}>
              <FaSyncAlt className="me-1" />
              <span>Refresh</span>
            </button>

            <button className="btn btn-success btn-sm" type="button" onClick={handlePrint}>
              <FaPrint className="me-1" />
              <span>Cetak</span>
            </button>
          </div>
        </div>
      </div>

      <div className="row g-3">
        {/* Data / Tabel */}
        <div className="col-12">
          <div className="card bank-sampah-main">
            <div className="card-body">
              <DataSampah />
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="col-12">
          <div className="card bank-sampah-form-wrapper">
            <div className="card-header">
              <h2 className="mb-0">Form Tambah Data Sampah</h2>
            </div>
            <div className="card-body">
              <TambahDataSampah />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banksampah;
