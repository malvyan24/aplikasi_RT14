import React, { useState } from 'react';
import './Banksampah.css';

const BankSampah = () => {
  const [idBankSampah, setIdBankSampah] = useState('');
  const [nama, setNama] = useState('');
  const [alamat, setAlamat] = useState('');
  const [jenisSampah, setJenisSampah] = useState('');
  const [berat, setBerat] = useState('');
  const [tanggal, setTanggal] = useState('');
  const [dataBankSampah, setDataBankSampah] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newData = {
      idBankSampah,
      nama,
      alamat,
      jenisSampah,
      berat,
      tanggal,
    };
    setDataBankSampah([...dataBankSampah, newData]);
    setIdBankSampah('');
    setNama('');
    setAlamat('');
    setJenisSampah('');
    setBerat('');
    setTanggal('');
  };

  return (
    <div className="bank-sampah-container">
      <h2>Bank Sampah RT 14</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="ID Bank Sampah"
          value={idBankSampah}
          onChange={(e) => setIdBankSampah(e.target.value)}
        />
        <input
          type="text"
          placeholder="Nama"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
        />
        <input
          type="text"
          placeholder="Alamat"
          value={alamat}
          onChange={(e) => setAlamat(e.target.value)}
        />
        <input
          type="text"
          placeholder="Jenis Sampah"
          value={jenisSampah}
          onChange={(e) => setJenisSampah(e.target.value)}
        />
        <input
          type="text"
          placeholder="Berat Sampah (kg)"
          value={berat}
          onChange={(e) => setBerat(e.target.value)}
        />
        <input
          type="date"
          value={tanggal}
          onChange={(e) => setTanggal(e.target.value)}
        />
        <button type="submit">Tambah</button>
      </form>
      
      <table>
        <thead>
          <tr>
            <th>ID Bank Sampah</th>
            <th>Nama</th>
            <th>Alamat</th>
            <th>Jenis Sampah</th>
            <th>Berat (kg)</th>
            <th>Tanggal</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {dataBankSampah.map((item, index) => (
            <tr key={index}>
              <td>{item.idBankSampah}</td>
              <td>{item.nama}</td>
              <td>{item.alamat}</td>
              <td>{item.jenisSampah}</td>
              <td>{item.berat}</td>
              <td>{item.tanggal}</td>
              <td>
                <button className="yellow">Edit</button>
                <button className="red">Hapus</button>
                <button className="green">Cetak</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BankSampah;
