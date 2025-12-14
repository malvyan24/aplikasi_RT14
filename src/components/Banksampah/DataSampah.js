import React from "react";

const DataSampah = () => {
  return (
    <div className="bank-sampah-table-wrapper">
      <table className="table table-striped table-hover bank-sampah-table">
        <thead className="table-dark">
          <tr>
            <th>Jenis Sampah</th>
            <th>Berat (kg)</th>
            <th>Tanggal</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Contoh Sampah</td>
            <td>25</td>
            <td>2025-01-01</td>
          </tr>
          {/* Tambahkan baris data lain di sini */}
        </tbody>
      </table>
    </div>
  );
};

export default DataSampah;
