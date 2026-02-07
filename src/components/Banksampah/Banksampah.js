import React, { useState } from 'react';
import DataSampah from './DataSampah';
import TambahDataSampah from './TambahDataSampah';
import './Banksampah.css';

const Banksampah = () => {
  const [dataSampah, setDataSampah] = useState([
    { id: "BS-001", nama: "Muhamad Alpian", alamat: "Blok A1", jenis: "Plastik", berat: 25, tanggal: "2025-01-01" },
  ]);

  const handleSimpan = (newData) => {
    setDataSampah([...dataSampah, { ...newData, id: `BS-00${dataSampah.length + 1}` }]);
  };

  return (
    <div className="bank-sampah-container">
      <div className="header-section">
        <h1>♻️ Bank Sampah RT 14</h1>
        <div className="action-buttons">
          <button className="btn btn-tambah">+ Tambah Data</button>
          <button className="btn btn-hapus">🗑️ Hapus Data</button>
          <button className="btn btn-refresh">🔄 Refresh</button>
          <button className="btn btn-cetak">🖨️ Cetak</button>
        </div>
      </div>

      <div className="main-content">
        {/* Bagian Tabel */}
        <div className="card-section">
          <DataSampah items={dataSampah} />
        </div>

        {/* Bagian Form */}
        <div className="card-section">
          <TambahDataSampah onSimpan={handleSimpan} />
        </div>
      </div>
    </div>
  );
};

export default Banksampah;