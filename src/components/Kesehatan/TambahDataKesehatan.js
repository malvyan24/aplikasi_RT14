import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { ADD_HEALTH_RECORD } from "../../graphql/healthMutations";
import { GET_ALL_HEALTH_RECORDS } from "../../graphql/healthQueries";
import { FaSave, FaFemale, FaUserCheck } from "react-icons/fa";

const TambahDataKesehatan = ({ allMembers }) => {
  const [form, setForm] = useState({ 
    citizenId: "", healthStatus: "SEHAT", bloodType: "O", height: "", weight: "", 
    bloodPressure: "", bloodSugar: "", notes: "", isPregnant: false, hpl: "", pregnancyNotes: ""
  });
  const [searchWarga, setSearchWarga] = useState("");

  const [addRecord, { loading }] = useMutation(ADD_HEALTH_RECORD, {
    refetchQueries: [{ query: GET_ALL_HEALTH_RECORDS }, "GetCitizensForHealth"],
    onCompleted: () => {
      alert("✅ Riwayat Pemeriksaan Berhasil Ditambahkan!");
      setForm({ citizenId: "", healthStatus: "SEHAT", bloodType: "O", height: "", weight: "", bloodPressure: "", bloodSugar: "", notes: "", isPregnant: false, hpl: "", pregnancyNotes: "" });
      setSearchWarga("");
    },
    onError: (err) => alert("❌ Gagal: Pastikan database mengizinkan riwayat ganda untuk satu warga.")
  });

  const handleWargaChange = (e) => {
    const val = e.target.value;
    setSearchWarga(val); 
    const selectedWarga = allMembers?.find(c => `${c.name} - ${c.nik}` === val);
    if (selectedWarga) setForm({ ...form, citizenId: selectedWarga.id });
  };

  const selectedWargaData = allMembers?.find(c => c.id === form.citizenId);
  const isFemale = selectedWargaData?.gender?.startsWith('P') || selectedWargaData?.gender === 'PEREMPUAN';

  return (
    <div className="health-form mb-4 bg-white p-4 rounded-4 shadow-sm border mt-4 text-start">
      <div className="d-flex align-items-center mb-4">
        <div className="bg-primary-light p-2 rounded-3 me-3">
          <FaUserCheck className="text-primary" size={20} />
        </div>
        <h6 className="fw-bold text-dark mb-0">Input Hasil Pemeriksaan Baru (Tambah Riwayat)</h6>
      </div>

      <form onSubmit={(e) => {
          e.preventDefault();
          if (!form.citizenId) return alert("Pilih warga dulu!");
          addRecord({ variables: { ...form, height: parseFloat(form.height) || 0, weight: parseFloat(form.weight) || 0, bloodSugar: parseInt(form.bloodSugar) || 0, hpl: form.hpl ? new Date(form.hpl).toISOString() : null } });
      }}>
        {/* BARIS 1: IDENTITAS & FISIK */}
        <div className="row g-3 mb-3">
          <div className="col-md-4">
            <label className="small fw-bold text-muted mb-2 text-uppercase">Cari Nama / NIK</label>
            <input list="warga-list-k" className="form-control" placeholder="Ketik Nama..." value={searchWarga} onChange={handleWargaChange} required />
            <datalist id="warga-list-k">
              {allMembers?.map(c => <option key={c.id} value={`${c.name} - ${c.nik}`} />)}
            </datalist>
          </div>
          <div className="col-md-2">
            <label className="small fw-bold text-muted mb-2 text-uppercase">Status</label>
            <select className="form-select" value={form.healthStatus} onChange={e => setForm({...form, healthStatus: e.target.value})}>
              <option value="SEHAT">SEHAT</option><option value="PANTAUAN">PANTAUAN</option><option value="DARURAT">DARURAT</option>
            </select>
          </div>
          <div className="col-md-2">
            <label className="small fw-bold text-muted mb-2 text-uppercase">Gol. Darah</label>
            <select className="form-select" value={form.bloodType} onChange={e => setForm({...form, bloodType: e.target.value})}>
              <option value="A">A</option><option value="B">B</option><option value="AB">AB</option><option value="O">O</option>
            </select>
          </div>
          <div className="col-md-2">
            <label className="small fw-bold text-muted mb-2 text-uppercase">TB (cm)</label>
            <input type="number" step="0.1" className="form-control" value={form.height} onChange={e => setForm({...form, height: e.target.value})} />
          </div>
          <div className="col-md-2">
            <label className="small fw-bold text-muted mb-2 text-uppercase">BB (kg)</label>
            <input type="number" step="0.1" className="form-control" value={form.weight} onChange={e => setForm({...form, weight: e.target.value})} />
          </div>
        </div>

        {/* BARIS 2: MEDIS & NOTES */}
        <div className="row g-3 align-items-end mb-3">
          <div className="col-md-2">
            <label className="small fw-bold text-muted mb-2 text-uppercase">Tensi (mmHg)</label>
            <input type="text" className="form-control" placeholder="120/80" value={form.bloodPressure} onChange={e => setForm({...form, bloodPressure: e.target.value})} />
          </div>
          <div className="col-md-2">
            <label className="small fw-bold text-muted mb-2 text-uppercase">Gula Darah</label>
            <input type="number" className="form-control" value={form.bloodSugar} onChange={e => setForm({...form, bloodSugar: e.target.value})} />
          </div>
          <div className={isFemale ? "col-md-5" : "col-md-6"}>
            <label className="small fw-bold text-muted mb-2 text-uppercase">Keterangan / Catatan Pemeriksaan</label>
            <input type="text" className="form-control" placeholder="berat naik, batuk, dll..." value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} />
          </div>
          {isFemale && (
            <div className="col-md-3 d-flex align-items-center mb-2">
              <div className="form-check form-switch fs-5">
                <input className="form-check-input" type="checkbox" id="swH" checked={form.isPregnant} onChange={e => setForm({...form, isPregnant: e.target.checked})} />
                <label className="form-check-label fs-6 fw-bold ms-2 text-primary" htmlFor="swH"><FaFemale /> Hamil?</label>
              </div>
            </div>
          )}
          {!form.isPregnant && (
            <div className="col-md-2">
              <button type="submit" className="btn btn-primary w-100 fw-bold py-2 shadow-sm" disabled={loading}><FaSave className="me-2"/>Simpan</button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default TambahDataKesehatan;