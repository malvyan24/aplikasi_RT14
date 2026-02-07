import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { ADD_WARGA } from "../../graphql/userMutations";
import { GET_WARGA } from "../../graphql/userQueries";

const AddUser = () => {
  const [nik, setNik] = useState(""); 
  const [nama, setNama] = useState(""); 
  const [alamat, setAlamat] = useState("");
  const [status, setStatus] = useState("OWNED");
  const [successMsg, setSuccessMsg] = useState("");

  const [addWarga, { loading, error }] = useMutation(ADD_WARGA, {
    refetchQueries: [{ query: GET_WARGA }],
    onCompleted: () => {
      setSuccessMsg("Keluarga Baru Berhasil Didaftarkan!");
      setNik(""); setNama(""); setAlamat(""); setStatus("OWNED");
      setTimeout(() => setSuccessMsg(""), 3000);
    },
  });

  return (
    <div className="card shadow-sm border-0 mb-4 mt-4 overflow-hidden">
      <div className="card-header bg-white py-3 border-bottom text-center">
        <h6 className="fw-bold text-primary mb-0"><span className="me-2">+</span> </h6>
      </div>
      <div className="card-body p-4 bg-light bg-opacity-10">
        <form onSubmit={e => { e.preventDefault(); addWarga({ variables: { noKK: String(nik), kepalaKeluarga: nama, address: alamat, ownershipStatus: status } }); }}>
          <div className="row g-4 align-items-end">
            <div className="col-md-3">
              <label className="small fw-bold mb-2 text-secondary">Nomor Kartu Keluarga</label>
              <input type="number" className="form-control border-2 py-2" placeholder="16 digit No KK" value={nik} onChange={e => setNik(e.target.value)} required />
            </div>
            <div className="col-md-3">
              <label className="small fw-bold mb-2 text-secondary">Nama Kepala Keluarga</label>
              <input type="text" className="form-control border-2 py-2" placeholder="Nama Lengkap" value={nama} onChange={e => setNama(e.target.value)} required />
            </div>
            <div className="col-md-3">
              <label className="small fw-bold mb-2 text-secondary">Alamat Rumah</label>
              <input type="text" className="form-control border-2 py-2" placeholder="Jl. Mawar No. 1" value={alamat} onChange={e => setAlamat(e.target.value)} required />
            </div>
            <div className="col-md-3">
              <label className="small fw-bold mb-2 text-secondary">Status Rumah</label>
              <select className="form-select border-2 py-2 fw-bold" value={status} onChange={e => setStatus(e.target.value)}>
                <option value="OWNED">Milik Sendiri (OWNED)</option>
                <option value="RENT">Sewa/Kontrak (RENT)</option>
                <option value="OFFICIAL">Dinas (OFFICIAL)</option>
              </select>
            </div>
            <div className="col-12 mt-4 pt-2">
              <button type="submit" className="btn btn-primary w-100 fw-bold py-3 shadow-sm rounded-3" disabled={loading}>
                {loading ? "Menyimpan Data..." : "Simpan Data Keluarga"}
              </button>
            </div>
          </div>
        </form>
        {successMsg && <div className="alert alert-success mt-3 py-2 small shadow-sm border-0 bg-success text-white">{successMsg}</div>}
        {error && <div className="alert alert-danger mt-3 py-2 small shadow-sm">Gagal: {error.message}</div>}
      </div>
    </div>
  );
};

export default AddUser;