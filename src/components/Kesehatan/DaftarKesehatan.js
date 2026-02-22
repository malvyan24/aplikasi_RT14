import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_ALL_HEALTH_RECORDS } from "../../graphql/healthQueries";
import { DELETE_HEALTH_RECORD } from "../../graphql/healthMutations";
import { FaTrash, FaEdit, FaHistory, FaFileMedicalAlt, FaFemale } from "react-icons/fa";

const DaftarKesehatan = ({ searchTerm }) => {
  const [historyWarga, setHistoryWarga] = useState(null);
  const { data, loading } = useQuery(GET_ALL_HEALTH_RECORDS, { pollInterval: 3000 });
  const [deleteRecord] = useMutation(DELETE_HEALTH_RECORD, { refetchQueries: [{ query: GET_ALL_HEALTH_RECORDS }] });

  if (loading) return <div className="p-4 text-center">Menyinkronkan data...</div>;

  const allRecords = data?.getAllHealthRecords || [];
  
  // Tampilkan data UNIK per warga di tabel depan (ambil yang terbaru)
  const filteredData = Array.from(new Set(allRecords.map(r => r.citizen?.id)))
    .map(id => allRecords.find(r => r.citizen?.id === id))
    .filter((h) => h.citizen?.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="table-responsive bg-white rounded-4 shadow-sm border overflow-hidden mt-3 text-start">
      <table className="table table-hover mb-0 align-middle">
        <thead className="table-pink">
          <tr style={{fontSize:'0.85rem'}}>
            <th className="ps-4 py-3">NAMA & UMUR</th>
            <th className="text-center">TANGGAL</th>
            <th className="text-center">KONDISI</th>
            <th className="text-center">HASIL CEK</th>
            <th>KETERANGAN</th>
            <th className="text-center">AKSI</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((h) => (
            <tr key={h.id} style={{fontSize:'0.9rem'}}>
              <td className="ps-4">
                <div className="fw-bold">{h.citizen?.name}</div>
                {h.isPregnant && <span className="badge bg-primary-light text-primary small p-1 rounded-circle"><FaFemale size={10}/></span>}
                <small className="text-muted">{h.citizen?.nik} • <span className="text-primary fw-bold">3 Thn</span></small>
              </td>
              <td className="text-center text-muted small fw-bold">
                {new Date(parseInt(h.createdAt)).toLocaleDateString("id-ID", { day: '2-digit', month: 'short', year: 'numeric' })}
              </td>
              <td className="text-center">
                <span className={`badge-pill ${h.healthStatus === 'DARURAT' ? 'b-darurat' : 'b-sehat'}`}>{h.healthStatus}</span>
                <div className="small fw-bold mt-2 text-muted">Gol: {h.bloodType}</div>
              </td>
              <td className="text-center">
                <div className="small fw-bold text-muted">TB: {h.height} cm | BB: {h.weight} kg</div>
                <div className="small fw-bold text-danger mt-1">Tensi: {h.bloodPressure} | Gula: {h.bloodSugar}</div>
              </td>
              <td className="small text-muted">
                {h.isPregnant && <div className="text-primary fw-bold mb-1">HPL: 21/2/2026</div>}
                {h.notes || "-"}
              </td>
              <td className="text-center">
                <div className="d-flex justify-content-center gap-1">
                  <button className="btn btn-sm btn-outline-primary border-0" onClick={() => setHistoryWarga({ name: h.citizen?.name, records: allRecords.filter(r => r.citizen?.id === h.citizen?.id).sort((a,b)=>parseInt(b.createdAt)-parseInt(a.createdAt)) })}>
                    <FaHistory size={16} />
                  </button>
                  <button className="btn btn-sm btn-outline-warning border-0"><FaEdit size={16} /></button>
                  <button className="btn btn-sm btn-outline-danger border-0" onClick={() => window.confirm("Hapus?") && deleteRecord({variables:{id:h.id}})}><FaTrash size={16} /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MODAL TRACK RECORD (Tampilan image_260658) */}
      {historyWarga && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.7)", position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 1070 }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="modal-header bg-dark text-white border-0 py-3">
                <h5 className="mb-0 fw-bold d-flex align-items-center"><FaFileMedicalAlt className="me-2 text-info"/> Track Record: {historyWarga.name}</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setHistoryWarga(null)}></button>
              </div>
              <div className="modal-body p-0" style={{maxHeight:'60vh', overflowY:'auto'}}>
                <table className="table table-striped mb-0 text-center small">
                  <thead className="table-light sticky-top">
                    <tr><th>TANGGAL</th><th>BB (kg)</th><th>TB (cm)</th><th>STATUS</th><th>CATATAN</th></tr>
                  </thead>
                  <tbody>
                    {historyWarga.records.map(r => (
                      <tr key={r.id}>
                        <td className="fw-bold">{new Date(parseInt(r.createdAt)).toLocaleDateString('id-ID')}</td>
                        <td className="text-primary fw-bold">{r.weight}</td><td className="text-danger fw-bold">{r.height}</td>
                        <td><span className="badge bg-success">{r.healthStatus}</span></td>
                        <td className="text-start">{r.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DaftarKesehatan;