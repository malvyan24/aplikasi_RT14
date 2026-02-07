import React, { useState } from 'react';

const TambahDataSampah = ({ onSimpan }) => {
  const [formData, setFormData] = useState({
    idBank: '', nama: '', alamat: '', jenis: '', berat: '', tanggal: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSimpan(formData);
    alert("Data Sampah Berhasil Disimpan!");
  };

  return (
    <div className="form-container">
      <h3>Form Tambah Data Sampah</h3>
      <form onSubmit={handleSubmit} className="grid-form">
        <div className="input-group">
          <label>ID Bank Sampah</label>
          <input type="text" placeholder="ID..." onChange={(e) => setFormData({...formData, idBank: e.target.value})} />
        </div>
        <div className="input-group">
          <label>Nama</label>
          <input type="text" placeholder="Nama Warga..." onChange={(e) => setFormData({...formData, nama: e.target.value})} />
        </div>
        <div className="input-group">
          <label>Alamat</label>
          <input type="text" placeholder="Alamat..." onChange={(e) => setFormData({...formData, alamat: e.target.value})} />
        </div>
        <div className="input-group">
          <label>Jenis Sampah</label>
          <input type="text" placeholder="Plastik/Kertas/Logam..." onChange={(e) => setFormData({...formData, jenis: e.target.value})} />
        </div>
        <div className="input-group">
          <label>Berat (kg)</label>
          <input type="number" placeholder="0" onChange={(e) => setFormData({...formData, berat: e.target.value})} />
        </div>
        <div className="input-group">
          <label>Tanggal</label>
          <input type="date" onChange={(e) => setFormData({...formData, tanggal: e.target.value})} />
        </div>
        <button type="submit" className="btn-simpan">Simpan</button>
      </form>
    </div>
  );
};

export default TambahDataSampah;