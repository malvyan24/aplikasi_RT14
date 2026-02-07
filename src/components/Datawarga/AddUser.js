import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { ADD_WARGA } from "../../graphql/userMutations";
import { GET_WARGA } from "../../graphql/userQueries";

const AddUser = () => {
  // State form
  const [nik, setNik] = useState(""); // Ini akan jadi No KK
  const [nama, setNama] = useState(""); // Ini akan jadi Kepala Keluarga
  const [alamat, setAlamat] = useState("");
  const [status, setStatus] = useState("OWNED"); // Default value backend
  const [tglMasuk, setTglMasuk] = useState(""); // *Note: Backend Family belum ada tglMasuk, ini opsional/skip dulu

  const [successMsg, setSuccessMsg] = useState("");

  // Setup Mutation
  const [addWarga, { loading, error }] = useMutation(ADD_WARGA, {
    // Biar setelah nambah, tabel otomatis update tanpa refresh
    refetchQueries: [{ query: GET_WARGA }],
    onCompleted: () => {
      setSuccessMsg("Data warga berhasil ditambahkan!");
      // Reset Form
      setNik("");
      setNama("");
      setAlamat("");
      setStatus("OWNED");
      setTglMasuk("");
      setTimeout(() => setSuccessMsg(""), 3000);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kirim data ke Backend
    // Kita petakan (Map) state frontend ke variabel backend
    await addWarga({
      variables: {
        noKK: nik, // NIK di form -> noKK di backend
        kepalaKeluarga: nama, // Nama di form -> kepalaKeluarga di backend
        address: alamat,
        ownershipStatus: status,
      },
    });
  };

  return (
    <form className="dw-form" onSubmit={handleSubmit}>
      {/* Input NIK / No KK */}
      <div className="dw-form-group">
        <label>Nomor Kartu Keluarga</label>
        <input
          type="number"
          className="form-control"
          value={nik}
          onChange={(e) => setNik(e.target.value)}
          placeholder="Masukkan 16 digit Nomor"
          required
        />
      </div>

      {/* Input Nama Kepala Keluarga */}
      <div className="dw-form-group">
        <label>Nama Kepala Keluarga</label>
        <input
          type="text"
          className="form-control"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          placeholder="Nama Lengkap"
          required
        />
      </div>

      {/* Input Alamat */}
      <div className="dw-form-group">
        <label>Alamat Rumah</label>
        <input
          type="text"
          className="form-control"
          value={alamat}
          onChange={(e) => setAlamat(e.target.value)}
          placeholder="Jl. Mawar No. 1"
          required
        />
      </div>

      {/* Input Status (Dropdown biar sesuai Enum Backend) */}
      <div className="dw-form-group">
        <label>Status Rumah</label>
        <select
          className="form-control"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="OWNED">Milik Sendiri (OWNED)</option>
          <option value="RENT">Sewa/Kontrak (RENT)</option>
          <option value="OFFICIAL">Dinas (OFFICIAL)</option>
        </select>
      </div>

      {/* Tanggal Masuk (Hanya UI, tidak dikirim ke backend dulu) */}
      <div className="dw-form-group">
        <label>Tanggal Masuk</label>
        <input
          type="date"
          className="form-control"
          value={tglMasuk}
          onChange={(e) => setTglMasuk(e.target.value)}
        />
      </div>

      <div className="dw-form-actions mt-3">
        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={loading}
        >
          {loading ? "Menyimpan ke Server..." : "Simpan Data"}
        </button>
      </div>

      {successMsg && (
        <div className="alert alert-success mt-2">{successMsg}</div>
      )}
      {error && (
        <div className="alert alert-danger mt-2">Gagal: {error.message}</div>
      )}
    </form>
  );
};

export default AddUser;
