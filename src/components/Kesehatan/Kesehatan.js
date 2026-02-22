import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_WARGA } from "../../graphql/userQueries";
import { GET_ALL_HEALTH_RECORDS } from "../../graphql/healthQueries";
import HealthStatsChart from "./HealthStatsChart";
import TambahDataKesehatan from "./TambahDataKesehatan";
import DaftarKesehatan from "./DaftarKesehatan";
import DashboardPintar from "./DashboardPintar";
import MasterListModal from "./MasterListModal"; // Import Modal Identitas
import { FaBriefcaseMedical, FaHeartbeat, FaBaby, FaBlind, FaTint, FaSearch, FaUserCircle, FaExternalLinkAlt } from "react-icons/fa";
import "./Kesehatan.css";

const Kesehatan = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBloodGroup, setSelectedBloodGroup] = useState(null);
  const [selectedWarga, setSelectedWarga] = useState(null); // State untuk buka Modal Identitas
  
  const { data: userData } = useQuery(GET_WARGA);
  const { data: healthData } = useQuery(GET_ALL_HEALTH_RECORDS);

  const calculateAge = (dob) => {
    if (!dob) return 0;
    const isTimestamp = /^-?\d+$/.test(String(dob));
    const birth = new Date(isTimestamp ? Number(dob) : dob);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    if (today.getMonth() < birth.getMonth() || (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) age--;
    return age;
  };

  const members = userData?.families?.flatMap((f) => f.members) || [];
  const balita = members.filter((m) => calculateAge(m.dateOfBirth) <= 5);
  const lansia = members.filter((m) => calculateAge(m.dateOfBirth) >= 60);

  const allRecords = healthData?.getAllHealthRecords || [];
  const bloodGroups = ["A", "B", "AB", "O"];

  const bloodStock = bloodGroups.map(type => {
    const donors = allRecords
      .filter(r => r.bloodType === type)
      .reduce((acc, current) => {
        const x = acc.find(item => item.citizen?.id === current.citizen?.id);
        if (!x) return acc.concat([current]);
        return acc;
      }, []);
    return { type, count: donors.length, donors };
  });

  const activeDonors = bloodStock.find(b => b.type === selectedBloodGroup)?.donors || [];

  return (
    <div className="health-wrapper text-start">
      <div className="d-flex align-items-center mb-4">
        <div className="cpink p-3 rounded-4 text-white me-3 shadow-sm">
          <FaBriefcaseMedical size={24} />
        </div>
        <h3 className="fw-bold text-dark mb-0">Layanan Kesehatan Digital RT 14</h3>
      </div>

      {/* --- SECTION 1: STATISTIK & DATABASE DARAH --- */}
      <div className="row g-3 mb-4 mt-2">
        <div className="col-lg-8">
          <div className="row g-3">
            <div className="col-md-4">
              <div className="card health-card cpink p-4 shadow-sm h-100 position-relative border-0 rounded-4">
                <h6 className="fw-bold opacity-75">Warga Terdaftar</h6>
                <h3 className="fw-bold">{members.length} Jiwa</h3>
                <FaHeartbeat size={40} className="position-absolute end-0 bottom-0 m-3 opacity-25" />
              </div>
            </div>
            <div className="col-md-4">
              <div className="card health-card cblue p-4 shadow-sm h-100 position-relative border-0 rounded-4">
                <h6 className="fw-bold opacity-75">Total Balita</h6>
                <h3 className="fw-bold">{balita.length} Anak</h3>
                <FaBaby size={40} className="position-absolute end-0 bottom-0 m-3 opacity-25" />
              </div>
            </div>
            <div className="col-md-4">
              <div className="card health-card corange p-4 shadow-sm h-100 position-relative border-0 rounded-4">
                <h6 className="fw-bold opacity-75">Total Lansia</h6>
                <h3 className="fw-bold">{lansia.length} Orang</h3>
                <FaBlind size={40} className="position-absolute end-0 bottom-0 m-3 opacity-25" />
              </div>
            </div>
            
            <div className="col-12">
              <div className="card border-0 shadow-sm rounded-4 bg-white p-4">
                <h6 className="fw-bold text-danger mb-3"><FaTint className="me-2"/>Database Golongan Darah (Klik untuk Detail)</h6>
                <div className="row g-2">
                  {bloodStock.map((item, idx) => (
                    <div className="col-3" key={idx} style={{ cursor: 'pointer' }} onClick={() => setSelectedBloodGroup(item.type)}>
                      <div className={`p-3 rounded-4 border-bottom border-4 transition-all ${selectedBloodGroup === item.type ? 'bg-danger text-white border-dark shadow' : 'bg-light border-danger text-center'}`}>
                        <div className={`fw-bold fs-4 ${selectedBloodGroup === item.type ? 'text-white' : 'text-danger'}`}>{item.type}</div>
                        <div className={`small fw-bold ${selectedBloodGroup === item.type ? 'text-white' : 'text-muted'}`}>{item.count} Pendonor</div>
                      </div>
                    </div>
                  ))}
                </div>

                {selectedBloodGroup && (
                  <div className="mt-4 p-3 bg-light rounded-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h6 className="fw-bold mb-0 text-dark">Daftar Pendonor Golongan Darah {selectedBloodGroup}</h6>
                      <button className="btn btn-sm btn-outline-secondary border-0" onClick={() => setSelectedBloodGroup(null)}>Tutup</button>
                    </div>
                    <div className="table-responsive">
                      <table className="table table-sm table-borderless align-middle mb-0">
                        <thead>
                          <tr className="text-muted small">
                            <th>Nama Lengkap</th>
                            <th>Kontak</th>
                            <th className="text-end">Aksi</th>
                          </tr>
                        </thead>
                        <tbody>
                          {activeDonors.map((d, i) => (
                            <tr key={i} className="border-bottom-faded">
                              <td className="fw-bold py-2"><FaUserCircle className="me-2 text-secondary" /> {d.citizen?.name}</td>
                              <td className="small text-muted">{d.citizen?.phone || "-"}</td>
                              <td className="text-end">
                                {/* SEKARANG TOMBOLNYA BERFUNGSI MEMBUKA MODAL */}
                                <button 
                                  className="btn btn-primary btn-sm rounded-pill px-3 shadow-sm" 
                                  style={{ fontSize: '0.7rem', backgroundColor: '#ff6b81', border: 'none' }}
                                  onClick={() => setSelectedWarga(d.citizen)}
                                >
                                  <FaExternalLinkAlt className="me-1" size={10} /> Profil Warga
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <HealthStatsChart />
        </div>
      </div>

      <DashboardPintar allMembers={members} />
      
      <div className="mt-4">
        <TambahDataKesehatan allMembers={members} />
      </div>

      <div className="bg-white p-4 rounded-4 shadow-sm mt-4 border">
        <div className="d-flex justify-content-between mb-3 align-items-center">
          <h5 className="fw-bold text-dark mb-0">Semua Riwayat Pemeriksaan</h5>
          <div className="position-relative w-25">
            <FaSearch className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
            <input type="text" className="form-control rounded-pill ps-5" placeholder="Cari Nama/NIK..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
        </div>
        <DaftarKesehatan searchTerm={searchTerm} />
      </div>

      {/* MODAL IDENTITAS WARGA (AKAN MUNCUL SAAT TOMBOL DIKLIK) */}
      {selectedWarga && (
        <MasterListModal 
          warga={selectedWarga} 
          onClose={() => setSelectedWarga(null)} 
        />
      )}
    </div>
  );
};

export default Kesehatan;