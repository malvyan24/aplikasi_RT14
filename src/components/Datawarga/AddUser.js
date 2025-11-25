// src/components/Datawarga/AddUser.js
import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { ADD_WARGA } from "../../graphql/userMutations";
import { GET_WARGA } from "../../graphql/userQueries";

const AddUser = () => {
  const [nik, setNik] = useState("");
  const [nama, setNama] = useState("");
  const [alamat, setAlamat] = useState("");
  const [status, setStatus] = useState("");
  const [tglMasuk, setTglMasuk] = useState("");

  const [addWarga, { loading, error }] = useMutation(ADD_WARGA, {
    refetchQueries: [{ query: GET_WARGA }],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addWarga({
        variables: {
          nik,
          nama,
          alamat,
          status,
          tglMasuk,
        },
      });

      // reset form
      setNik("");
      setNama("");
      setAlamat("");
      setStatus("");
      setTglMasuk("");
    } catch (err) {
      console.error("Gagal menambah data warga:", err);
    }
  };

  return (
    <>
      <h3>Form Input Data Warga</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="NIK"
          value={nik}
          onChange={(e) => setNik(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Nama Kepala Keluarga"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Alamat Rumah"
          value={alamat}
          onChange={(e) => setAlamat(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Status Rumah"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          required
        />
        <input
          type="date"
          placeholder="Tanggal Masuk"
          value={tglMasuk}
          onChange={(e) => setTglMasuk(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Menyimpan..." : "Tambah"}
        </button>

        {error && (
          <p style={{ color: "yellow", marginTop: "8px" }}>
            Error tambah data: {error.message}
          </p>
        )}
      </form>
    </>
  );
};

export default AddUser;