import React from 'react';

const DataSampah = ({ items }) => {
  return (
    <div className="data-table-container">
      <table className="custom-table">
        <thead>
          <tr>
            <th>Jenis Sampah</th>
            <th>Berat (kg)</th>
            <th>Tanggal</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index}>
              <td>{item.jenis}</td>
              <td><strong>{item.berat} kg</strong></td>
              <td>{item.tanggal}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataSampah;