import React, { useState } from 'react';
import './Datawarga.css';

const Datawarga = () => {
  const [nik, setNik] = useState('');
  const [nama, setNama] = useState('');
  const [alamat, setAlamat] = useState('');
  const [status, setStatus] = useState('');
  const [tglMasuk, setTglMasuk] = useState('');
  const [dataWarga, setDataWarga] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newData = {
      nik,
      nama,
      alamat,
      status,
      tglMasuk,
    };
    setDataWarga([...dataWarga, newData]);
    setNik('');
    setNama('');
    setAlamat('');
    setStatus('');
    setTglMasuk('');
  };

  return (
    <div className="datawarga-container">
      <h2>FORM INPUT DATA WARGA</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="NIK"
          value={nik}
          onChange={(e) => setNik(e.target.value)}
        />
        <input
          type="text"
          placeholder="Nama Kepala Keluarga"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
        />
        <input
          type="text"
          placeholder="Alamat Rumah"
          value={alamat}
          onChange={(e) => setAlamat(e.target.value)}
        />
        <input
          type="text"
          placeholder="Status Rumah"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        />
        <input
          type="date"
          placeholder="Tanggal Masuk"
          value={tglMasuk}
          onChange={(e) => setTglMasuk(e.target.value)}
        />
        <button type="submit">Tambah</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>NIK</th>
            <th>Nama Kepala Keluarga</th>
            <th>Alamat Rumah</th>
            <th>Status Rumah</th>
            <th>Tgl Masuk</th>
          </tr>
        </thead>
        <tbody>
          {dataWarga.map((warga, index) => (
            <tr key={index}>
              <td>{warga.nik}</td>
              <td>{warga.nama}</td>
              <td>{warga.alamat}</td>
              <td>{warga.status}</td>
              <td>{warga.tglMasuk}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Datawarga;
