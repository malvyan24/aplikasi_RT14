import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { ADD_HEALTH_RECORD } from "../../graphql/healthMutations";
import { GET_ALL_HEALTH_RECORDS } from "../../graphql/healthQueries";

const TambahDataKesehatan = ({ allMembers }) => {
  const [form, setForm] = useState({ citizenId: "", healthStatus: "SEHAT", bloodType: "O", notes: "" });

  const [addRecord, { loading }] = useMutation(ADD_HEALTH_RECORD, {
    refetchQueries: [{ query: GET_ALL_HEALTH_RECORDS }],
    onCompleted: () => {
      alert("Data Pemeriksaan Berhasil Disimpan!");
      setForm({ ...form, citizenId: "", notes: "" });
    },
    onError: (err) => alert("Gagal menyimpan: " + err.message)
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.citizenId) return alert("Pilih nama warga!");
    addRecord({ variables: { ...form, height: 0, weight: 0, chronicDisease: "-" } });
  };

  return (
    <div className="health-form mb-4">
      <h6 className="fw-bold text-primary mb-3">Input Pemeriksaan Warga</h6>
      <form onSubmit={handleSubmit}>
        <div className="row g-2 align-items-end">
          <div className="col-md-3">
            <label className="small fw-bold text-muted mb-1">Pilih Nama Warga</label>
            <select className="form-select health-input" value={form.citizenId} required onChange={e => setForm({...form, citizenId: e.target.value})}>
              <option value="">-- Pilih Warga --</option>
              {allMembers.map(c => <option key={c.id} value={c.id}>{c.name} ({c.nik})</option>)}
            </select>
          </div>
          <div className="col-md-2">
            <label className="small fw-bold text-muted mb-1">Status</label>
            <select className="form-select health-input" value={form.healthStatus} onChange={e => setForm({...form, healthStatus: e.target.value})}>
              <option value="SEHAT">SEHAT</option><option value="PANTAUAN">PANTAUAN</option><option value="DARURAT">DARURAT</option>
            </select>
          </div>
          <div className="col-md-2">
            <label className="small fw-bold text-muted mb-1">Gol. Darah</label>
            <select className="form-select health-input" value={form.bloodType} onChange={e => setForm({...form, bloodType: e.target.value})}>
              <option value="A">A</option><option value="B">B</option><option value="AB">AB</option><option value="O">O</option>
            </select>
          </div>
          <div className="col-md-3">
            <label className="small fw-bold text-muted mb-1">Catatan</label>
            <input type="text" className="form-control health-input" placeholder="Riwayat sakit..." value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} />
          </div>
          <div className="col-md-2">
            <button type="submit" className="btn btn-primary w-100 fw-bold" disabled={loading} style={{height: '40px'}}>
              {loading ? "..." : "Simpan Data"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TambahDataKesehatan;