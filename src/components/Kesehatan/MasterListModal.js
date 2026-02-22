import React from "react";
import { FaTimes, FaUser, FaIdCard, FaMapMarkerAlt, FaBirthdayCake, FaPhone, FaVenusMars } from "react-icons/fa";

const MasterListModal = ({ warga, onClose }) => {
  if (!warga) return null;

  return (
    <div 
      className="modal-overlay d-flex align-items-center justify-content-center"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        zIndex: 9999, // MEMAKSA MUNCUL DI PALING DEPAN
        backdropFilter: "blur(5px)"
      }}
      onClick={onClose}
    >
      <div 
        className="modal-content border-0 shadow-lg rounded-4 overflow-hidden animate__animated animate__zoomIn"
        style={{ maxWidth: "500px", width: "90%", backgroundColor: "#fff" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER MODAL */}
        <div className="p-4 text-white d-flex justify-content-between align-items-center" style={{ backgroundColor: "#ff6b81" }}>
          <h5 className="mb-0 fw-bold"><FaIdCard className="me-2" /> Identitas Lengkap Warga</h5>
          <button className="btn-close btn-close-white" onClick={onClose}></button>
        </div>

        {/* BODY MODAL */}
        <div className="p-4 text-start">
          <div className="text-center mb-4">
            <div className="bg-light d-inline-block p-3 rounded-circle shadow-sm mb-2">
              <FaUser size={50} className="text-secondary" />
            </div>
            <h4 className="fw-bold text-dark mb-0">{warga.name}</h4>
            <span className="badge bg-primary-subtle text-primary rounded-pill px-3">{warga.relationship || "Warga RT 14"}</span>
          </div>

          <div className="row g-3">
            <div className="col-12 border-bottom pb-2">
              <label className="small text-muted fw-bold d-block"><FaIdCard className="me-1"/> NIK</label>
              <span className="text-dark fw-bold">{warga.nik || "-"}</span>
            </div>
            <div className="col-6 border-bottom pb-2">
              <label className="small text-muted fw-bold d-block"><FaVenusMars className="me-1"/> Jenis Kelamin</label>
              <span className="text-dark">{warga.gender || "-"}</span>
            </div>
            <div className="col-6 border-bottom pb-2">
              <label className="small text-muted fw-bold d-block"><FaBirthdayCake className="me-1"/> Tempat, Tgl Lahir</label>
              <span className="text-dark small">{warga.placeOfBirth}, {warga.dateOfBirth}</span>
            </div>
            <div className="col-12 border-bottom pb-2">
              <label className="small text-muted fw-bold d-block"><FaPhone className="me-1"/> No. Telepon</label>
              <span className="text-dark">{warga.phone || "-"}</span>
            </div>
            <div className="col-12">
              <label className="small text-muted fw-bold d-block"><FaMapMarkerAlt className="me-1"/> Alamat Domisili</label>
              <span className="text-dark small">{warga.address || "RT 14 RW 05, Desa Alue Awe"}</span>
            </div>
          </div>
        </div>

        {/* FOOTER MODAL */}
        <div className="p-3 bg-light text-end">
          <button className="btn btn-secondary fw-bold px-4 rounded-pill" onClick={onClose}>Tutup</button>
        </div>
      </div>
    </div>
  );
};

export default MasterListModal;