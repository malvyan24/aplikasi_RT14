import React from "react";
import { useQuery } from "@apollo/client";
import { GET_WARGA } from "../../graphql/userQueries"; // Pastikan path sudah benar

const UserList = () => {
  // 1. Tarik Data dari Backend
  const { loading, error, data } = useQuery(GET_WARGA, {
    pollInterval: 5000, // Opsional: Auto-refresh setiap 5 detik
  });

  if (loading) return <p className="text-center p-3">Sedang memuat data...</p>;
  if (error) return <p className="text-danger p-3">Error: {error.message}</p>;

  // 2. Jika data kosong
  if (!data || !data.families || data.families.length === 0) {
    return <p className="text-center p-3">Belum ada data warga.</p>;
  }

  return (
    <div className="table-responsive">
      <table className="table table-striped table-hover text-left dw-table">
        <thead className="table-dark">
          <tr>
            <th>No KK (NIK)</th>
            <th>Kepala Keluarga</th>
            <th>Alamat</th>
            <th>Status Rumah</th>
            <th>Detail</th>
          </tr>
        </thead>
        <tbody>
          {/* 3. Mapping Data dari Backend ke Tabel */}
          {data.families.map((item) => (
            <tr key={item.id}>
              <td>{item.noKK}</td>
              <td>{item.kepalaKeluarga}</td>
              <td>{item.address}</td>
              <td>
                <span className={`badge ${item.ownershipStatus === 'OWNED' ? 'bg-success' : 'bg-warning'}`} >
                  {item.ownershipStatus}
                </span>
              </td>
              <td>
                <button className="btn btn-sm btn-primary">Lihat</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;