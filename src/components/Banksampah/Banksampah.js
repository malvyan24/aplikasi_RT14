import React from "react";
import TambahDataSampah from "./TambahDataSampah";
import DataSampah from "./DataSampah";
import { FaPlus, FaListUl, FaSyncAlt, FaPrint } from "react-icons/fa";
import "./Banksampah.css"; // Pastikan mengimpor CSS dengan benar

const Banksampah = () => {
    const handleRefresh = () => {
        window.location.reload();
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="container py-3 dw-page">
            <div className="dw-header mb-2">
                <h1>Bank Sampah RT 14</h1>
            </div>

            <div className="card mb-3 dw-toolbar">
                <div className="card-body">
                    <div className="dw-toolbar"> {/* Pembungkus flexbox */}
                        <button className="btn btn-primary btn-sm">
                            <FaPlus className="me-1" />
                            <span>Tambah Data</span>
                        </button>

                        <button className="btn btn-light btn-sm">
                            <FaListUl className="me-1" />
                            <span>Lihat Data</span>
                        </button>

                        <button
                            className="btn btn-secondary btn-sm"
                            type="button"
                            onClick={handleRefresh}
                        >
                            <FaSyncAlt className="me-1" />
                            <span>Refresh</span>
                        </button>

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
                <div className="col-12">
                    <div className="card dw-main">
                        <div className="card-body">
                            <DataSampah />
                        </div>
                    </div>
                </div>

                <div className="col-12">
                    <div className="card dw-form-wrapper">
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