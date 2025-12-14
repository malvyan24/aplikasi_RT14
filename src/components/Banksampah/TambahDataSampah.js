import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { ADD_SAMPAH } from "../../graphql/sampahMutations";
import { GET_SAMPAH } from "../../graphql/sampahQueries";

const TambahDataSampah = () => {
  const [jenisSampah, setJenisSampah] = useState("");
  const [berat, setBerat] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [idBankSampah, setIdBankSampah] = useState("");
  const [nama, setNama] = useState("");
  const [alamat, setAlamat] = useState("");
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

    if (
      !jenisSampah ||
      isNaN(berat) ||
      !tanggal ||
      !idBankSampah ||
      !nama ||
      !alamat
    ) {
      alert("Silakan isi semua kolom dengan benar.");
      return;
    }

    await addSampah({
      variables: {
        idBankSampah,
        nama,
        alamat,
        jenisSampah,
        berat: parseFloat(berat),
        tanggal,
      },
    });

    setIdBankSampah("");
    setNama("");
    setAlamat("");
    setJenisSampah("");
    setBerat("");
    setTanggal("");
  };

  return (
    <form className="dw-form bank-sampah-form" onSubmit={handleSubmit}>
      <div className="dw-form-group">
        <label>ID Bank Sampah</label>
        <input
          type="text"
          className="form-control"
          value={idBankSampah}
          onChange={(e) => setIdBankSampah(e.target.value)}
          required
        />
      </div>

      <div className="dw-form-group">
        <label>Nama</label>
        <input
          type="text"
          className="form-control"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          required
        />
      </div>

      <div className="dw-form-group">
        <label>Alamat</label>
        <input
          type="text"
          className="form-control"
          value={alamat}
          onChange={(e) => setAlamat(e.target.value)}
          required
        />
      </div>

      <div className="dw-form-group">
        <label>Jenis Sampah</label>
        <input
          type="text"
          className="form-control"
          value={jenisSampah}
          onChange={(e) => setJenisSampah(e.target.value)}
          required
        />
      </div>

      <div className="dw-form-group">
        <label>Berat (kg)</label>
        <input
          type="number"
          className="form-control"
          value={berat}
          onChange={(e) => setBerat(e.target.value)}
          required
        />
      </div>

      <div className="dw-form-group">
        <label>Tanggal</label>
        <input
          type="date"
          className="form-control"
          value={tanggal}
          onChange={(e) => setTanggal(e.target.value)}
          required
        />
      </div>

      <div className="dw-form-actions mt-2 bank-sampah-actions">
        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={loading}
        >
          {loading ? "Menyimpan..." : "Simpan"}
        </button>
      </div>

      {successMsg && <p className="bank-sampah-success">{successMsg}</p>}
      {error && <p className="bank-sampah-error">Error: {error.message}</p>}
    </form>
  );
};

export default TambahDataSampah;
