import React from "react";
import { FaTimes, FaBaby, FaBlind, FaUsers, FaPrint } from "react-icons/fa";

const MasterListModal = ({ show, onClose, type, data, calculateAge }) => {
  if (!show) return null;

  // Konfigurasi dinamis berdasarkan tipe kartu yang diklik
  const config = {
    warga: { title: "Seluruh Warga RT 14", icon: <FaUsers />, theme: "cpink" },
    balita: { title: "Data Balita (0-5 th)", icon: <FaBaby />, theme: "cblue" },
    lansia: { title: "Data Lansia (60+ th)", icon: <FaBlind />, theme: "corange" }
  };

  const { title, icon, theme } = config[type] || config.warga;

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.7)', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1070 }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
          
          {/* Header Modal */}
          <div className={`modal-header ${theme} text-white py-3 border-0 d-flex justify-content-between align-items-center`}>
            <h5 className="mb-0 fw-bold d-flex align-items-center">
              <span className="me-2">{icon}</span> Master List: {title}
            </h5>
            <div className="d-flex align-items-center">
               <button className="btn btn-light btn-sm fw-bold me-3 rounded-pill px-3 shadow-sm">
                 <FaPrint className="me-1"/> Cetak List
               </button>
               <FaTimes style={{ cursor: 'pointer' }} onClick={onClose} size={20} />
            </div>
          </div>

          {/* Body Modal - Tabel */}
          <div className="modal-body p-0 bg-white" style={{ maxHeight: '65vh', overflowY: 'auto' }}>
            <table className="table table-hover mb-0 align-middle">
              <thead className="table-light sticky-top shadow-sm">
                <tr>
                  <th className="ps-4 py-3">NAMA LENGKAP</th>
                  <th className="text-center">USIA</th>
                  <th>NOMOR NIK</th>
                  <th className="text-center">STATUS KESEHATAN</th>
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? data.map((item) => (
                  <tr key={item.id}>
                    <td className="ps-4">
                      <div className="fw-bold">{item.name}</div>
                      <small className="text-muted">{item.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</small>
                    </td>
                    <td className="text-center">
                        <span className="badge rounded-pill bg-light text-dark border">
                            {calculateAge(item.dateOfBirth)} Thn
                        </span>
                    </td>
                    <td className="text-muted small font-monospace">{item.nik}</td>
                    <td className="text-center">
                      <span className={`badge-pill ${item.healthData?.healthStatus === 'DARURAT' ? 'b-darurat' : item.healthData?.healthStatus === 'PANTAUAN' ? 'b-pantau' : 'b-sehat'}`}>
                        {item.healthData?.healthStatus || "BELUM CEK"}
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="4" className="text-center py-5 text-muted">Data tidak ditemukan dalam database.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer Modal */}
          <div className="modal-footer bg-light border-0 p-3">
            <div className="me-auto small text-muted font-italic">Total data: {data.length} jiwa</div>
            <button className="btn btn-secondary px-4 fw-bold rounded-3 shadow-sm" onClick={onClose}>Tutup List</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MasterListModal;