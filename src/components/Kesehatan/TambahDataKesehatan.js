import React, { useState } from "react";

const TambahDataKesehatan = () => {
  const [nik, setNik] = useState("");
  const [noKK, setNoKK] = useState("");
  const [nama, setNama] = useState("");
  const [golonganDarah, setGolonganDarah] = useState("");
  const [tinggiBadan, setTinggiBadan] = useState("");
  const [beratBadan, setBeratBadan] = useState("");
  const [riwayatPenyakit, setRiwayatPenyakit] = useState("");
  const [apakahDisabilitas, setApakahDisabilitas] = useState("");
  const [tanggalPemeriksaan, setTanggalPemeriksaan] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      nik, noKK, nama, golonganDarah, tinggiBadan, beratBadan,
      riwayatPenyakit, apakahDisabilitas, tanggalPemeriksaan
    });

    setNik("");
    setNoKK("");
    setNama("");
    setGolonganDarah("");
    setTinggiBadan("");
    setBeratBadan("");
    setRiwayatPenyakit("");
    setApakahDisabilitas("");
    setTanggalPemeriksaan("");
  };

  return (
    <form className="dw-form ks-form" onSubmit={handleSubmit}>
      <div className="dw-form-group">
        <label>NIK</label>
        <input type="text" className="form-control" value={nik} onChange={(e) => setNik(e.target.value)} required />
      </div>

      <div className="dw-form-group">
        <label>No KK</label>
        <input type="text" className="form-control" value={noKK} onChange={(e) => setNoKK(e.target.value)} required />
      </div>

      <div className="dw-form-group">
        <label>Nama</label>
        <input type="text" className="form-control" value={nama} onChange={(e) => setNama(e.target.value)} required />
      </div>

      <div className="dw-form-group">
        <label>Golongan Darah</label>
        <input type="text" className="form-control" value={golonganDarah} onChange={(e) => setGolonganDarah(e.target.value)} required />
      </div>

      <div className="dw-form-group">
        <label>Tinggi Badan</label>
        <input type="text" className="form-control" value={tinggiBadan} onChange={(e) => setTinggiBadan(e.target.value)} required />
      </div>

      <div className="dw-form-group">
        <label>Berat Badan</label>
        <input type="text" className="form-control" value={beratBadan} onChange={(e) => setBeratBadan(e.target.value)} required />
      </div>

      <div className="dw-form-group">
        <label>Riwayat Penyakit</label>
        <input type="text" className="form-control" value={riwayatPenyakit} onChange={(e) => setRiwayatPenyakit(e.target.value)} required />
      </div>

      <div className="dw-form-group">
        <label>Apakah Disabilitas</label>
        <input type="text" className="form-control" value={apakahDisabilitas} onChange={(e) => setApakahDisabilitas(e.target.value)} required />
      </div>

      <div className="dw-form-group">
        <label>Tanggal Pemeriksaan</label>
        <input type="date" className="form-control" value={tanggalPemeriksaan} onChange={(e) => setTanggalPemeriksaan(e.target.value)} required />
      </div>

      <div className="dw-form-actions mt-3 ks-form-actions">
        <button type="submit" className="btn btn-primary w-100">
          Simpan
        </button>
      </div>
    </form>
  );
};

export default TambahDataKesehatan;
