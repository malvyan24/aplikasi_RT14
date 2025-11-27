import React from "react";
import "./Datawarga.css";

const UserList = () => {
  // NOTE:
  // Saat ini tombol Tambah/Lihat Data/Refresh/Cetak belum punya fungsi khusus,
  // hanya untuk tampilan saja. Nanti bisa ditambahkan handler onClick.

  const handleRefresh = () => {
    // sementara hanya reload halaman
    window.location.reload();
  };

  const handlePrint = () => {
    // sementara pakai print browser
    window.print();
  };

  return (
    <div>
      {/* Contoh sederhana, ganti dengan tabel sebenarnya */}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Nama</th>
            <th>Alamat</th>
            <th>RT/RW</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Contoh Warga</td>
            <td>Jl. Contoh No. 1</td>
            <td>14/03</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
