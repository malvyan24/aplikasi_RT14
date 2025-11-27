// src/components/Banksampah/TambahkanDataSampah.js
import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { ADD_SAMPAH } from "../../graphql/sampahMutations"; // Pastikan path tepat
import { GET_SAMPAH } from "../../graphql/sampahQueries"; // Pastikan path tepat

const TambahDataSampah = () => {
  const [jenisSampah, setJenisSampah] = useState("");
  const [berat, setBerat] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [addSampah, { loading, error }] = useMutation(ADD_SAMPAH, {
    refetchQueries: [{ query: GET_SAMPAH }],
    onCompleted: () => {
      setSuccessMsg("Data sampah berhasil ditambahkan.");
      setTimeout(() => setSuccessMsg(""), 2500);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Menambahkan logika untuk memastikan bahwa berat adalah angka
    if (!jenisSampah || isNaN(berat) || !tanggal) {
      alert("Silakan isi semua kolom dengan benar.");
      return;
    }

    await addSampah({
      variables: {
        jenisSampah,
        berat: parseFloat(berat), // Pastikan berat adalah angka
        tanggal,
      },
    });

    // Reset form setelah berhasil
    setJenisSampah("");
    setBerat("");
    setTanggal("");
  };

  return (
    <form className="dw-form row g-2" onSubmit={handleSubmit}>
      <div className="dw-form-group col-md-4">
        <label>Jenis Sampah</label>
        <input
          type="text"
          className="form-control form-control-sm"
          value={jenisSampah}
          onChange={(e) => setJenisSampah(e.target.value)}
          required
        />
      </div>

      <div className="dw-form-group col-md-4">
        <label>Berat (kg)</label>
        <input
          type="number"
          className="form-control form-control-sm"
          value={berat}
          onChange={(e) => setBerat(e.target.value)}
          required
        />
      </div>

      <div className="dw-form-group col-md-4">
        <label>Tanggal</label>
        <input
          type="date"
          className="form-control form-control-sm"
          value={tanggal}
          onChange={(e) => setTanggal(e.target.value)}
          required
        />
      </div>

      <div className="dw-form-actions col-12 mt-2">
        <button
          type="submit"
          className="btn btn-primary btn-sm"
          disabled={loading}
        >
          {loading ? "Menyimpan..." : "Simpan"}
        </button>
      </div>

      {successMsg && <p className="dw-success">{successMsg}</p>}
      {error && <p className="dw-error">Error: {error.message}</p>}
    </form>
  );
};

export default TambahDataSampah;
