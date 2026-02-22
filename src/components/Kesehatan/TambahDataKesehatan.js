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
    refetchQueries: [{ query: GET_ALL_HEALTH_RECORDS }],
    onCompleted: () => {
      alert("✅ BERHASIL! Data kesehatan warga telah disimpan.");
      setForm({ citizenId: "", healthStatus: "SEHAT", bloodType: "O", height: "", weight: "", bloodPressure: "", bloodSugar: "", notes: "", isPregnant: false, hpl: "", pregnancyNotes: "" });
      setSearchWarga("");
    },
    onError: (err) => {
      console.error("DEBUG ERROR BE:", err);
      // Pesan error jika masih gagal sinkron dengan BE
      alert(`❌ GAGAL SIMPAN (400): ${err.message}\n\nPastikan TB, BB, dan Gula Darah hanya berisi angka.`);
    }
  });

  const handleWargaChange = (e) => {
    const val = e.target.value;
    setSearchWarga(val); 
    const selectedWarga = allMembers?.find(c => `${c.name} - ${c.nik}` === val);
    if (selectedWarga) {
      setForm(prev => ({ ...prev, citizenId: selectedWarga.id }));
    }
  };

  const selectedWargaData = allMembers?.find(c => c.id === form.citizenId);
  const isFemale = selectedWargaData?.gender?.toUpperCase() === 'P' || selectedWargaData?.gender?.toUpperCase() === 'PEREMPUAN';
  
  const calculateAge = (dob) => {
    if (!dob) return 0;
    const isTimestamp = /^-?\d+$/.test(String(dob));
    const birth = new Date(isTimestamp ? Number(dob) : dob);
    return new Date().getFullYear() - birth.getFullYear();
  };
  
  const citizenAge = calculateAge(selectedWargaData?.dateOfBirth);
  const canBePregnant = isFemale && citizenAge >= 14;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.citizenId) return alert("Pilih nama warga terlebih dahulu!");

    // --- FUNGSI SANITASI DATA (ANTI ERROR 400) ---
    const cleanFloat = (val) => {
        if (!val || val === "") return 0.0;
        const sanitized = String(val).replace(',', '.'); // Paksa koma jadi titik
        return parseFloat(sanitized) || 0.0;
    };

    const cleanInt = (val) => {
        if (!val || val === "") return 0;
        return parseInt(val) || 0;
    };

    // Mapping variables sesuai kontrak BE
    const variables = {
      citizenId: form.citizenId,
      healthStatus: form.healthStatus,
      bloodType: form.bloodType,
      notes: form.notes || "-",
      height: cleanFloat(form.height),
      weight: cleanFloat(form.weight),
      bloodPressure: form.bloodPressure || "-",
      bloodSugar: cleanInt(form.bloodSugar),
      isPregnant: Boolean(form.isPregnant),
      // Validasi HPL: Jika tidak hamil kirim null, jika hamil konversi ke ISO String
      hpl: form.isPregnant && form.hpl ? new Date(form.hpl).toISOString() : null,
      pregnancyNotes: form.isPregnant ? (form.pregnancyNotes || "-") : null
    };

    addRecord({ variables });
  };

  return (
    <div className="health-form mb-4 bg-white p-4 rounded-4 shadow-sm border mt-4 text-start">
      <div className="d-flex align-items-center mb-4">
        <div className="bg-primary-light p-2 rounded-3 me-3" style={{backgroundColor: '#fff0f3'}}>
          <FaUserCheck className="text-primary" size={20} />
        </div>
        <h6 className="fw-bold text-dark mb-0">Input Hasil Pemeriksaan Baru</h6>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row g-3 mb-3">
          <div className="col-md-4">
            <label className="small fw-bold text-muted mb-2 text-uppercase">Cari Nama / NIK</label>
            <input list="warga-list-k" className="form-control health-input" value={searchWarga} onChange={handleWargaChange} placeholder="Pilih Warga..." required />
            <datalist id="warga-list-k">
              {allMembers?.map(c => <option key={c.id} value={`${c.name} - ${c.nik}`} />)}
            </datalist>
          </div>
          <div className="col-md-2">
            <label className="small fw-bold text-muted mb-2 text-uppercase">Kondisi</label>
            <select className="form-select health-input" value={form.healthStatus} onChange={e => setForm({...form, healthStatus: e.target.value})}>
              <option value="SEHAT">SEHAT</option>
              <option value="PANTAUAN">PANTAUAN</option>
              <option value="DARURAT">DARURAT</option>
            </select>
          </div>
          <div className="col-md-2">
            <label className="small fw-bold text-muted mb-2 text-uppercase">Gol. Darah</label>
            <select className="form-select health-input" value={form.bloodType} onChange={e => setForm({...form, bloodType: e.target.value})}>
              <option value="A">A</option><option value="B">B</option><option value="AB">AB</option><option value="O">O</option>
            </select>
          </div>
          <div className="col-md-2">
            <label className="small fw-bold text-muted mb-2 text-uppercase">TB (CM)</label>
            <input type="text" className="form-control health-input" placeholder="Misal: 165.5" value={form.height} onChange={e => setForm({...form, height: e.target.value})} required />
          </div>
          <div className="col-md-2">
            <label className="small fw-bold text-muted mb-2 text-uppercase">BB (KG)</label>
            <input type="text" className="form-control health-input" placeholder="Misal: 60.2" value={form.weight} onChange={e => setForm({...form, weight: e.target.value})} required />
          </div>
        </div>

        <div className="row g-3 align-items-end mb-3">
          <div className="col-md-2">
            <label className="small fw-bold text-muted mb-2 text-uppercase">Tensi (mmHg)</label>
            <input type="text" className="form-control health-input" placeholder="120/80" value={form.bloodPressure} onChange={e => setForm({...form, bloodPressure: e.target.value})} />
          </div>
          <div className="col-md-2">
            <label className="small fw-bold text-muted mb-2 text-uppercase">Gula Darah</label>
            <input type="number" className="form-control health-input" placeholder="mg/dL" value={form.bloodSugar} onChange={e => setForm({...form, bloodSugar: e.target.value})} />
          </div>
          <div className={form.isPregnant ? "col-md-2" : (canBePregnant ? "col-md-4" : "col-md-6")}>
            <label className="small fw-bold text-muted mb-2 text-uppercase">Keterangan / Catatan</label>
            <input type="text" className="form-control health-input" placeholder="Isi catatan..." value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} />
          </div>

          {canBePregnant && (
            <div className="col-md-2 d-flex align-items-center mb-2">
              <div className="form-check form-switch fs-5">
                <input className="form-check-input" type="checkbox" id="swHamil" checked={form.isPregnant} onChange={e => setForm({...form, isPregnant: e.target.checked})} />
                <label className="form-check-label fs-6 fw-bold ms-2 text-primary" htmlFor="swHamil"><FaFemale /> Hamil?</label>
              </div>
            </div>
          )}

          {form.isPregnant && (
            <div className="col-md-2">
              <label className="small fw-bold text-primary mb-2 text-uppercase">Estimasi HPL</label>
              <input type="date" className="form-control health-input border-primary" value={form.hpl} onChange={e => setForm({...form, hpl: e.target.value})} required />
            </div>
          )}

          <div className="col-md-2">
            <button type="submit" className="btn btn-primary w-100 fw-bold py-2 shadow-sm d-flex align-items-center justify-content-center" disabled={loading} style={{backgroundColor: '#ff6b81', border: 'none'}}>
              {loading ? "MEMPROSES..." : <><FaSave className="me-2"/> SIMPAN</>}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TambahDataKesehatan;