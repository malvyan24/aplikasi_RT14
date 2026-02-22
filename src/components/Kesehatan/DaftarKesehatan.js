import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_ALL_HEALTH_RECORDS } from "../../graphql/healthQueries";
import { DELETE_HEALTH_RECORD, UPDATE_HEALTH_RECORD } from "../../graphql/healthMutations";
import MasterListModal from "./MasterListModal"; // Import Modal Identitas
import { FaTrash, FaEdit, FaHistory, FaSave, FaTimes, FaUserTag } from "react-icons/fa";

const DaftarKesehatan = ({ searchTerm }) => {
  const [editRecord, setEditRecord] = useState(null);
  const [historyWarga, setHistoryWarga] = useState(null);
  const [selectedWarga, setSelectedWarga] = useState(null); // State untuk Modal Identitas
  const [activeTab, setActiveTab] = useState("UMUM");

  const { data, loading, refetch } = useQuery(GET_ALL_HEALTH_RECORDS, { pollInterval: 5000 });
  
  const [deleteRecord] = useMutation(DELETE_HEALTH_RECORD, { 
    onCompleted: () => { alert("Data berhasil dihapus"); refetch(); } 
  });

  const [updateRecord] = useMutation(UPDATE_HEALTH_RECORD, {
    onCompleted: () => {
      alert("✅ BERHASIL! Perubahan telah disimpan.");
      setEditRecord(null);
      refetch();
    }
  });

  const fixDate = (val) => {
    if (!val) return "-";
    const d = new Date(isNaN(val) ? val : Number(val));
    return isNaN(d.getTime()) ? val : d.toLocaleDateString("id-ID", { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const calculateAge = (dob) => {
    if (!dob) return 0;
    const birth = new Date(isNaN(dob) ? dob : Number(dob));
    return new Date().getFullYear() - birth.getFullYear();
  };

  if (loading) return <div className="p-4 text-center text-muted">🔄 Sinkronisasi riwayat...</div>;

  const allRecords = data?.getAllHealthRecords || [];
  
  // Filter data agar unik per warga untuk tampilan daftar utama
  const uniqueData = Array.from(new Set(allRecords.map(r => r.citizen?.id)))
    .map(id => allRecords.find(r => r.citizen?.id === id))
    .filter(h => h.citizen?.name?.toLowerCase().includes(searchTerm.toLowerCase()));

  const filtered = uniqueData.filter(h => {
    const age = calculateAge(h.citizen?.dateOfBirth);
    if (activeTab === "BALITA") return age <= 5;
    if (activeTab === "LANSIA") return age >= 60;
    return age > 5 && age < 60;
  });

  return (
    <div className="mt-3 text-start">
      {/* FILTER TAB */}
      <div className="d-flex gap-2 mb-4">
        {["BALITA", "UMUM", "LANSIA"].map(tab => (
          <button key={tab} className={`btn btn-sm rounded-pill px-4 fw-bold shadow-sm ${activeTab === tab ? 'btn-primary' : 'btn-light border text-muted'}`} onClick={() => setActiveTab(tab)}>
            {tab === "BALITA" ? "👶 Balita" : tab === "LANSIA" ? "👴 Lansia" : "🧑 Umum"}
          </button>
        ))}
      </div>

      <div className="table-responsive bg-white rounded-4 border shadow-sm overflow-hidden">
        <table className="table table-hover mb-0 align-middle">
          <thead className="table-pink">
            <tr className="small text-muted text-uppercase text-center">
              <th className="ps-4 text-start">Nama & Umur</th>
              <th>Tanggal</th>
              <th>Kondisi</th>
              <th>Hasil Cek</th>
              <th className="text-start">Keterangan</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((h) => (
              <tr key={h.id} className="text-center small">
                <td className="ps-4 text-start">
                  <div className="d-flex align-items-center">
                    {/* TOMBOL IDENTITAS BARU DI SAMPING NAMA */}
                    <button 
                      className="btn btn-sm btn-light rounded-circle me-2 p-1 text-primary shadow-sm"
                      title="Lihat Identitas Warga"
                      onClick={() => setSelectedWarga(h.citizen)}
                    >
                      <FaUserTag size={14} />
                    </button>
                    <div>
                      <div className="fw-bold text-dark">{h.citizen?.name}</div>
                      <small className="text-muted">{calculateAge(h.citizen?.dateOfBirth)} Thn</small>
                    </div>
                  </div>
                </td>
                <td className="text-muted">{fixDate(h.createdAt)}</td>
                <td>
                  <span className={`badge-pill ${h.healthStatus === 'DARURAT' ? 'b-darurat' : h.healthStatus === 'PANTAUAN' ? 'b-pantau' : 'b-sehat'}`}>{h.healthStatus}</span>
                  <div className="text-muted mt-1 fw-bold" style={{fontSize:'0.7rem'}}>Gol: {h.bloodType || '-'}</div>
                </td>
                <td>
                  <div className="fw-bold text-muted">{h.height}cm | {h.weight}kg</div>
                  <div className="text-danger fw-bold" style={{fontSize:'0.75rem'}}>{h.bloodPressure || '-'}</div>
                  <div className="text-primary fw-bold" style={{fontSize:'0.7rem'}}>Gula: {h.bloodSugar || '0'}</div>
                </td>
                <td className="text-start text-muted">
                  <div style={{maxWidth: '180px', whiteSpace: 'normal'}}>{h.notes || "-"}</div>
                </td>
                <td>
                  <div className="d-flex justify-content-center gap-1">
                    <button className="btn btn-sm text-primary border-0" onClick={() => setHistoryWarga({ name: h.citizen?.name, records: allRecords.filter(r => r.citizen?.id === h.citizen?.id).sort((a,b)=>Number(b.createdAt)-Number(a.createdAt)) })}><FaHistory /></button>
                    <button className="btn btn-sm text-warning border-0" onClick={() => setEditRecord({...h})}><FaEdit /></button>
                    <button className="btn btn-sm text-danger border-0" onClick={() => window.confirm("Hapus?") && deleteRecord({variables:{id:h.id}})}><FaTrash /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL EDIT (ANTI ERROR 400) */}
      {editRecord && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.6)", position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 1060 }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow-lg rounded-4 health-form">
              <div className="modal-header bg-primary text-white py-3 border-0 d-flex justify-content-between">
                <h5 className="mb-0 fw-bold"><FaEdit className="me-2" /> Edit Pemeriksaan</h5>
                <FaTimes style={{cursor:'pointer'}} onClick={() => setEditRecord(null)} />
              </div>
              <form onSubmit={(e) => {
                  e.preventDefault();
                  const variables = {
                    id: editRecord.id,
                    healthStatus: editRecord.healthStatus,
                    bloodType: editRecord.bloodType,
                    height: parseFloat(editRecord.height) || 0,
                    weight: parseFloat(editRecord.weight) || 0,
                    bloodPressure: String(editRecord.bloodPressure || "-"),
                    bloodSugar: parseInt(editRecord.bloodSugar) || 0,
                    notes: editRecord.notes || "-",
                  };
                  updateRecord({ variables });
                }}>
                <div className="modal-body p-4 bg-white text-start">
                  <div className="row g-3 mb-3">
                    <div className="col-6"><label className="small fw-bold text-muted mb-2">KONDISI</label>
                      <select className="form-select" value={editRecord.healthStatus} onChange={(e) => setEditRecord({ ...editRecord, healthStatus: e.target.value })}>
                        <option value="SEHAT">SEHAT</option><option value="PANTAUAN">PANTAUAN</option><option value="DARURAT">DARURAT</option>
                      </select>
                    </div>
                    <div className="col-6"><label className="small fw-bold text-muted mb-2">GOL. DARAH</label>
                      <select className="form-select" value={editRecord.bloodType} onChange={(e) => setEditRecord({ ...editRecord, bloodType: e.target.value })}>
                        <option value="A">A</option><option value="B">B</option><option value="AB">AB</option><option value="O">O</option>
                      </select>
                    </div>
                  </div>
                  <div className="row g-3 mb-3">
                    <div className="col-3"><label className="small fw-bold text-muted mb-2">TB</label><input type="text" className="form-control" value={editRecord.height} onChange={(e) => setEditRecord({ ...editRecord, height: e.target.value })} /></div>
                    <div className="col-3"><label className="small fw-bold text-muted mb-2">BB</label><input type="text" className="form-control" value={editRecord.weight} onChange={(e) => setEditRecord({ ...editRecord, weight: e.target.value })} /></div>
                    <div className="col-3"><label className="small fw-bold text-muted mb-2">TENSI</label><input type="text" className="form-control" value={editRecord.bloodPressure} onChange={(e) => setEditRecord({ ...editRecord, bloodPressure: e.target.value })} /></div>
                    <div className="col-3"><label className="small fw-bold text-muted mb-2">GULA</label><input type="number" className="form-control" value={editRecord.bloodSugar} onChange={(e) => setEditRecord({ ...editRecord, bloodSugar: e.target.value })} /></div>
                  </div>
                  <div className="mb-2"><label className="small fw-bold text-muted mb-2">KETERANGAN</label><textarea className="form-control" rows="3" value={editRecord.notes} onChange={(e) => setEditRecord({ ...editRecord, notes: e.target.value })}></textarea></div>
                </div>
                <div className="modal-footer border-0 p-3 d-flex justify-content-between bg-light">
                  <button type="button" className="btn btn-secondary px-4 fw-bold" onClick={() => setEditRecord(null)}>BATAL</button>
                  <button type="submit" className="btn btn-primary px-4 fw-bold shadow-sm" style={{backgroundColor: '#ff6b81', border: 'none'}}><FaSave className="me-2" /> SIMPAN</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL IDENTITAS WARGA (KONDISIONAL) */}
      {selectedWarga && (
        <MasterListModal 
          warga={selectedWarga} 
          onClose={() => setSelectedWarga(null)} 
        />
      )}

      {/* MODAL TRACK RECORD (RIWAYAT ANALISIS) */}
      {historyWarga && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(15, 23, 42, 0.9)", position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 1070 }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="modal-header bg-dark text-white py-3 border-0 d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-bold small"><FaHistory className="me-2 text-info"/> TRACK RECORD: {historyWarga.name}</h5>
                <FaTimes style={{cursor:'pointer'}} onClick={() => setHistoryWarga(null)} />
              </div>
              <div className="modal-body p-0" style={{maxHeight:'60vh', overflowY:'auto'}}>
                <table className="table table-striped mb-0 small text-center align-middle">
                  <thead className="table-light sticky-top"><tr className="text-muted"><th>TANGGAL</th><th>BB</th><th>TB</th><th>STATUS</th></tr></thead>
                  <tbody>
                    {historyWarga.records.map(r => (
                      <tr key={r.id}><td>{fixDate(r.createdAt)}</td><td className="fw-bold">{r.weight}kg</td><td className="fw-bold">{r.height}cm</td><td><span className={`badge ${r.healthStatus==='DARURAT'?'bg-danger':'bg-success'}`}>{r.healthStatus}</span></td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="modal-footer bg-light"><button className="btn btn-secondary btn-sm fw-bold w-100" onClick={() => setHistoryWarga(null)}>TUTUP</button></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DaftarKesehatan;