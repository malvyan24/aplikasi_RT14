import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_WARGA } from "../../graphql/userQueries";
import HealthStatsChart from "./HealthStatsChart";
import TambahDataKesehatan from "./TambahDataKesehatan";
import DaftarKesehatan from "./DaftarKesehatan";
import MasterListModal from "./MasterListModal"; // Import modal baru
import { FaHeartbeat, FaBaby, FaBlind, FaBriefcaseMedical } from "react-icons/fa";
import "./Kesehatan.css";

const Kesehatan = () => {
  const [searchTerm, setSearchTerm] = useState("");
  // State untuk mengontrol modal
  const [modalConfig, setModalConfig] = useState({ show: false, type: "warga", data: [] });

  const { data } = useQuery(GET_WARGA);

  const calculateAge = (dob) => {
    if (!dob) return 0;
    const birth = new Date(isNaN(dob) ? dob : Number(dob));
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    if (today.getMonth() < birth.getMonth() || (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) age--;
    return age;
  };

  const members = data?.families?.flatMap(f => f.members) || [];
  const balita = members.filter(m => calculateAge(m.dateOfBirth) <= 5);
  const lansia = members.filter(m => calculateAge(m.dateOfBirth) >= 60);

  // Fungsi pembuka modal
  const openList = (type, listData) => {
    setModalConfig({ show: true, type, data: listData });
  };

  return (
    <div className="health-wrapper">
      <div className="d-flex align-items-center mb-4">
        <div className="cpink p-3 rounded-4 text-white me-3 shadow-sm"><FaBriefcaseMedical size={24} /></div>
        <h3 className="fw-bold text-dark mb-0">Layanan Kesehatan RT 14</h3>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-lg-8">
          <div className="row g-3">
            {/* Kartu 1: Warga Terdaftar (Bisa Klik!) */}
            <div className="col-md-6" onClick={() => openList("warga", members)} style={{ cursor: "pointer" }}>
              <div className="card health-card cpink p-4 shadow-sm h-100 position-relative">
                <h6 className="fw-bold opacity-75">Warga Terdaftar</h6>
                <h3 className="fw-bold">{members.length} Orang</h3>
                <div className="mt-2 small fw-bold bg-white bg-opacity-25 p-1 rounded d-inline-block">Klik untuk detail →</div>
                <FaHeartbeat size={40} className="position-absolute end-0 bottom-0 m-3 opacity-25" />
              </div>
            </div>

            {/* Kartu 2: Balita (Bisa Klik!) */}
            <div className="col-md-6" onClick={() => openList("balita", balita)} style={{ cursor: "pointer" }}>
              <div className="card health-card cblue p-4 shadow-sm h-100 position-relative">
                <h6 className="fw-bold opacity-75">Balita (0-5 th)</h6>
                <h3 className="fw-bold">{balita.length} Anak</h3>
                <div className="mt-2 small fw-bold bg-white bg-opacity-25 p-1 rounded d-inline-block">Klik untuk detail →</div>
                <FaBaby size={40} className="position-absolute end-0 bottom-0 m-3 opacity-25" />
              </div>
            </div>

            {/* Kartu 3: Lansia (Bisa Klik!) */}
            <div className="col-md-12" onClick={() => openList("lansia", lansia)} style={{ cursor: "pointer" }}>
              <div className="card health-card corange p-4 shadow-sm position-relative">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="fw-bold opacity-75">Lansia (60+ th)</h6>
                    <h3 className="fw-bold">{lansia.length} Lansia</h3>
                    <div className="mt-2 small fw-bold bg-white bg-opacity-25 p-1 rounded d-inline-block">Klik untuk detail →</div>
                  </div>
                  <FaBlind size={50} className="opacity-25" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <HealthStatsChart />
        </div>
      </div>

      {/* Input Data Kesehatan */}
      <TambahDataKesehatan allMembers={members} />
      
      {/* Riwayat Pemeriksaan Umum */}
      <div className="bg-white p-4 rounded-4 shadow-sm mt-4 border">
        <div className="d-flex justify-content-between mb-3 align-items-center">
          <h5 className="fw-bold text-dark mb-0">Riwayat Pemeriksaan Umum</h5>
          <input type="text" className="form-control w-25 rounded-pill shadow-sm" placeholder="Cari warga..." onChange={e => setSearchTerm(e.target.value)} />
        </div>
        <DaftarKesehatan searchTerm={searchTerm} />
      </div>

      {/* RENDER MODAL */}
      <MasterListModal 
        show={modalConfig.show}
        type={modalConfig.type}
        data={modalConfig.data}
        onClose={() => setModalConfig({ ...modalConfig, show: false })}
        calculateAge={calculateAge}
      />
    </div>
  );
};

export default Kesehatan;