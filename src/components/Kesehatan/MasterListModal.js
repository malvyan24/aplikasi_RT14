import React from "react";
import { FaTimes, FaBaby, FaBlind, FaUsers, FaPrint } from "react-icons/fa";

const MasterListModal = ({ show, onClose, type, data, calculateAge }) => {
  if (!show) return null;

  // Konfigurasi dinamis (Warna Header mengikuti tema kartu)
  const config = {
    warga: { title: "Seluruh Warga RT 14", icon: <FaUsers className="me-2"/>, bg: "#ff6b81" },
    balita: { title: "Data Balita (0-5 th)", icon: <FaBaby className="me-2"/>, bg: "#4facfe" },
    lansia: { title: "Data Lansia (60+ th)", icon: <FaBlind className="me-2"/>, bg: "#fa709a" }
  };

  const { title, icon, bg } = config[type] || config.warga;

  return (
    // 1. OVERLAY KUSTOM
    <div 
      className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center" 
      style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 9999 }}
      onClick={onClose}
    >
      {/* 2. CONTAINER KUSTOM (Lebar 90% Maksimal 1100px) */}
      <div 
        className="bg-white rounded-3 shadow-lg d-flex flex-column" 
        style={{ width: '90%', maxWidth: '1100px', maxHeight: '90vh', overflow: 'hidden' }}
        onClick={e => e.stopPropagation()}
      >
        
        {/* 3. HEADER MODAL */}
        <div className="p-3 px-4 d-flex justify-content-between align-items-center text-white" style={{ background: bg }}>
          <h5 className="mb-0 fw-bold d-flex align-items-center">
            {icon} Master List: {title}
          </h5>
          <div className="d-flex align-items-center gap-3">
             <button className="btn btn-sm bg-white text-dark fw-bold rounded-pill px-3 border-0 shadow-sm">
               <FaPrint className="me-1"/> Cetak List
             </button>
             <FaTimes className="cursor-pointer fs-5" onClick={onClose} title="Tutup" />
          </div>
        </div>

        {/* 4. BODY MODAL */}
        <div className="p-4" style={{ overflowY: 'auto' }}>
          
          <div className="table-responsive border rounded-3">
            <table className="table table-hover mb-0 align-middle">
              <thead className="bg-light">
                <tr>
                  <th className="ps-4 py-3">Nama Lengkap</th>
                  <th className="text-center">Usia</th>
                  <th>Nomor NIK</th>
                  <th className="text-center pe-4">Status Kesehatan</th>
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? data.map((item) => (
                  <tr key={item.id}>
                    <td className="ps-4 py-3">
                      <div className="fw-bold text-success" style={{ fontSize: '1rem' }}>{item.name}</div>
                      <small className="text-muted">{item.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</small>
                    </td>
                    <td className="text-center">
                        {/* PERUBAHAN DI SINI:
                            Warna background dihilangkan (bg-transparent), 
                            hanya memakai outline border abu-abu dan teks gelap.
                        */}
                        <span className="badge border border-secondary text-dark rounded-pill px-3 py-2 fw-bold" style={{ fontSize: '0.85rem', backgroundColor: 'transparent' }}>
                            {calculateAge(item.dateOfBirth)} Thn
                        </span>
                    </td>
                    <td className="text-muted">{item.nik}</td>
                    <td className="text-center pe-4">
                      <span className={`badge-pill ${item.healthData?.healthStatus === 'DARURAT' ? 'b-darurat' : item.healthData?.healthStatus === 'PANTAUAN' ? 'b-pantau' : 'b-sehat'}`}>
                        {item.healthData?.healthStatus || "BELUM CEK"}
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="4" className="text-center py-5 text-muted">Data tidak ditemukan.</td></tr>
                )}
              </tbody>
            </table>
          </div>

        </div>

        {/* 5. FOOTER MODAL */}
        <div className="p-3 px-4 bg-light border-top d-flex justify-content-between align-items-center">
          <span className="text-muted small">Total data terdaftar: <strong className="text-dark fs-6">{data.length}</strong> jiwa</span>
          <button className="btn btn-secondary px-4 fw-bold rounded-3 border-0" onClick={onClose}>Tutup</button>
        </div>

      </div>
    </div>
  );
};

export default MasterListModal;