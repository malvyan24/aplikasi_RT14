import React from "react";

const DaftarKesehatan = () => {
  const kesehatanData = [
    {
      nik: "1234567890123456",
      noKK: "1234567890",
      nama: "Contoh Warga",
      golonganDarah: "O",
      tinggiBadan: "170 cm",
      beratBadan: "70 kg",
      riwayatPenyakit: "Tidak Ada",
      apakahDisabilitas: "Tidak",
      tanggalPemeriksaan: "2023-10-01",
    },
    {
      nik: "1234567890123457",
      noKK: "1234567891",
      nama: "Warga Contoh 2",
      golonganDarah: "A",
      tinggiBadan: "160 cm",
      beratBadan: "60 kg",
      riwayatPenyakit: "Ada",
      apakahDisabilitas: "Ya",
      tanggalPemeriksaan: "2023-10-05",
    },
  ];

  return (
    <div className="ks-table-wrapper">
      <table className="table table-striped table-hover ks-table">
        <thead className="table-dark">
          <tr>
            <th>NIK</th>
            <th>No KK</th>
            <th>Nama</th>
            <th>Golongan Darah</th>
            <th>Tinggi Badan</th>
            <th>Berat Badan</th>
            <th>Riwayat Penyakit</th>
            <th>Disabilitas</th>
            <th>Tanggal Pemeriksaan</th>
          </tr>
        </thead>
        <tbody>
          {kesehatanData.map((row, idx) => (
            <tr key={idx}>
              <td>{row.nik}</td>
              <td>{row.noKK}</td>
              <td>{row.nama}</td>
              <td>{row.golonganDarah}</td>
              <td>{row.tinggiBadan}</td>
              <td>{row.beratBadan}</td>
              <td>{row.riwayatPenyakit}</td>
              <td>{row.apakahDisabilitas}</td>
              <td>{row.tanggalPemeriksaan}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DaftarKesehatan;
