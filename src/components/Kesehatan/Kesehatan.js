import React, { useState } from "react";
import { useQuery, gql } from "@apollo/client";
import { FaHeartbeat, FaUsers, FaBaby, FaBlind, FaSearch } from "react-icons/fa";

import TambahDataKesehatan from "./TambahDataKesehatan";
import DaftarKesehatan from "./DaftarKesehatan";
import MasterListModal from "./MasterListModal";
import DashboardPintar from "./DashboardPintar";
import "./Kesehatan.css";

const GET_CITIZENS_FOR_HEALTH = gql`
  query GetCitizensForHealth {
    citizens {
      id name nik gender dateOfBirth phone
      family {
        id kepalaKeluarga
        members { id name phone relationship }
      }
      healthData { healthStatus }
    }
  }
`;

const Kesehatan = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [modalConfig, setModalConfig] = useState({ show: false, type: "warga", data: [] });

  // PENGATURAN OTOMATIS: Polling setiap 2 detik
  const { data, loading, error } = useQuery(GET_CITIZENS_FOR_HEALTH, {
    pollInterval: 2000, 
    fetchPolicy: "network-only"
  });

  const calculateAge = (dob) => {
    if (!dob) return null;
    let birth = !isNaN(dob) ? new Date(parseInt(dob)) : new Date(dob);
    if (isNaN(birth.getTime())) return null;
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

  if (loading) return <div className="p-5 text-center fw-bold text-primary">🔄 Menyinkronkan Data...</div>;
  if (error) return <div className="p-5 text-center text-danger">⚠️ Error: {error.message}</div>;

  const allMembers = data?.citizens || [];
  const balitaData = allMembers.filter(m => {
    const age = calculateAge(m.dateOfBirth);
    return age !== null && age >= 0 && age <= 5;
  });
  const lansiaData = allMembers.filter(m => {
    const age = calculateAge(m.dateOfBirth);
    return age !== null && age >= 60;
  });

  return (
    <div className="health-wrapper">
      <div className="d-flex align-items-center mb-4">
        <div className="bg-white p-3 rounded-circle shadow-sm text-health-primary me-3 border border-pink">
          <FaHeartbeat size={28} />
        </div>
        <div>
          <h4 className="fw-bold mb-0 text-dark">Layanan Kesehatan RT 14</h4>
          <p className="text-muted small mb-0">Update Otomatis • Real-time System</p>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-md-4" onClick={() => setModalConfig({ show: true, type: "warga", data: allMembers })} style={{cursor:'pointer'}}>
          <div className="card health-card cpink p-4 h-100 shadow-sm">
            <div className="d-flex justify-content-between align-items-center">
              <div><h6 className="fw-bold mb-1">Total Warga</h6><h2 className="fw-bold mb-0">{allMembers.length}</h2></div>
              <FaUsers size={40} opacity={0.7} />
            </div>
          </div>
        </div>
        <div className="col-md-4" onClick={() => setModalConfig({ show: true, type: "balita", data: balitaData })} style={{cursor:'pointer'}}>
          <div className="card health-card cblue p-4 h-100 shadow-sm">
            <div className="d-flex justify-content-between align-items-center">
              <div><h6 className="fw-bold mb-1">Balita (0-5 Thn)</h6><h2 className="fw-bold mb-0">{balitaData.length}</h2></div>
              <FaBaby size={40} opacity={0.7} />
            </div>
          </div>
        </div>
        <div className="col-md-4" onClick={() => setModalConfig({ show: true, type: "lansia", data: lansiaData })} style={{cursor:'pointer'}}>
          <div className="card health-card corange p-4 h-100 shadow-sm">
            <div className="d-flex justify-content-between align-items-center">
              <div><h6 className="fw-bold mb-1">Lansia (60+ Thn)</h6><h2 className="fw-bold mb-0">{lansiaData.length}</h2></div>
              <FaBlind size={40} opacity={0.7} />
            </div>
          </div>
        </div>
      </div>

      <DashboardPintar allMembers={allMembers} />
      <TambahDataKesehatan allMembers={allMembers} />
      
      <div className="d-flex justify-content-between align-items-center mt-5 mb-3">
        <h5 className="fw-bold text-dark mb-0">Riwayat Pemeriksaan</h5>
        <div className="input-group w-25 shadow-sm">
          <span className="input-group-text bg-white border-0 text-muted"><FaSearch /></span>
          <input type="text" className="form-control border-0 ps-0" placeholder="Cari nama..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
      </div>
      <DaftarKesehatan searchTerm={searchTerm} />

      <MasterListModal 
        show={modalConfig.show} 
        onClose={() => setModalConfig({ ...modalConfig, show: false })} 
        type={modalConfig.type} 
        data={modalConfig.data} 
        calculateAge={calculateAge} 
      />
    </div>
  );
};

export default Kesehatan;