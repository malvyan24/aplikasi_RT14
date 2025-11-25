// src/components/Datawarga/UserList.js
import React from "react";
import { useQuery } from "@apollo/client";
import { GET_WARGA } from "../../graphql/userQueries";

const UserList = () => {
  const { data, loading, error } = useQuery(GET_WARGA);

  if (loading) return <p>Memuat data warga...</p>;
  if (error)
    return (
      <p style={{ color: "yellow" }}>Error memuat data: {error.message}</p>
    );

  return (
    <>
      <h3>Daftar Warga</h3>
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
          {data?.wargas?.map((warga) => (
            <tr key={warga.id}>
              <td>{warga.nik}</td>
              <td>{warga.nama}</td>
              <td>{warga.alamat}</td>
              <td>{warga.status}</td>
              <td>{warga.tglMasuk}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default UserList;