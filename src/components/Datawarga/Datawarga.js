import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_WARGA, GET_ALL_CITIZENS } from "../../graphql/userQueries";
import UserList from "./UserList";
import AddUser from "./AddUser";
import { 
  FaUsers, FaHome, FaPlus, FaChartLine, 
  FaArrowRight, FaPrint, FaClipboardList 
} from "react-icons/fa";

const Datawarga = () => {
  const [showStatDetail, setShowStatDetail] = useState(null);

  const { data: familyData } = useQuery(GET_WARGA, { pollInterval: 5000 });
  const { data: citizenData } = useQuery(GET_ALL_CITIZENS, { pollInterval: 5000 });

  const totalKK = familyData?.families?.length || 0;
  const totalJiwa = citizenData?.citizens?.length || 0;

  // Fungsi Cetak khusus untuk Master List
  const handlePrintMasterList = () => {
    window.print();
  };

  return (
    <div className="container py-4">
      {/* HEADER DASHBOARD (Tombol cetak dihapus dari sini) */}
      <div className="d-flex align-items-center mb-4 no-print">
        <div className="bg-primary text-white p-3 rounded-3 me-3 shadow-sm">
          <FaChartLine size={24} />
        </div>
        <div>
          <h3 className="fw-bold mb-0">Dashboard Data Warga</h3>
          <p className="text-muted mb-0 small text-uppercase">
            Admin: Muhamad Alpian (0110222184)
          </p>
        </div>
      </div>

      {/* KARTU STATISTIK INTERAKTIF */}
      <div className="row g-3 mb-4 no-print">
        <div className="col-md-6">
          <div 
            className="card border-0 shadow-sm bg-primary text-white p-4 h-100 cursor-pointer" 
            onClick={() => setShowStatDetail('KK')}
            style={{ cursor: 'pointer' }}
          >
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <h6 className="opacity-75">Total Kepala Keluarga (KK)</h6>
                <h2 className="fw-bold mb-0">{totalKK} Keluarga</h2>
                <small className="mt-2 d-block bg-white bg-opacity-25 rounded px-2 py-1">
                  Klik untuk detail <FaArrowRight size={10} />
                </small>
              </div>
              <FaHome size={40} className="opacity-50" />
            </div>
          </div>
        </div>
        
        <div className="col-md-6">
          <div 
            className="card border-0 shadow-sm bg-success text-white p-4 h-100 cursor-pointer" 
            onClick={() => setShowStatDetail('JIWA')}
            style={{ cursor: 'pointer' }}
          >
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <h6 className="opacity-75">Total Seluruh Warga (Jiwa)</h6>
                <h2 className="fw-bold mb-0">{totalJiwa} Orang</h2>
                <small className="mt-2 d-block bg-white bg-opacity-25 rounded px-2 py-1">
                  Klik untuk detail <FaArrowRight size={10} />
                </small>
              </div>
              <FaUsers size={40} className="opacity-50" />
            </div>
          </div>
        </div>
      </div>

      {/* DAFTAR KELUARGA UTAMA */}
      <div className="card border-0 shadow-sm mb-5 no-print">
        <div className="card-header bg-white py-3 fw-bold border-0">
          <FaClipboardList className="me-2 text-primary" /> Daftar Keluarga Terdaftar
        </div>
        <div className="card-body p-0">
          <UserList />
        </div>
      </div>

      {/* FORM REGISTRASI */}
      <div className="card border-0 shadow-sm bg-light mb-5 no-print">
        <div className="card-header bg-transparent py-3 fw-bold border-0 text-center text-primary">
          <FaPlus className="me-2" /> Form Registrasi Keluarga Baru
        </div>
        <div className="card-body">
          <AddUser />
        </div>
      </div>

      {/* --- MODAL MASTER LIST DENGAN TOMBOL CETAK DI DALAMNYA --- */}
      {showStatDetail && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.8)', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 10000 }}>
          <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content border-0 shadow-lg">
              <div className={`modal-header ${showStatDetail === 'KK' ? 'bg-primary' : 'bg-success'} text-white py-3`}>
                <h5 className="modal-title fw-bold">
                  {showStatDetail === 'KK' ? `Master List: ${totalKK} Keluarga` : `Master List: ${totalJiwa} Jiwa`}
                </h5>
                <div className="d-flex gap-2">
                  {/* TOMBOL CETAK SEKARANG DI SINI */}
                  <button className="btn btn-light btn-sm fw-bold d-flex align-items-center" onClick={handlePrintMasterList}>
                    <FaPrint className="me-1" /> Cetak List
                  </button>
                  <button type="button" className="btn-close btn-close-white" onClick={() => setShowStatDetail(null)}></button>
                </div>
              </div>
              <div className="modal-body p-0 bg-white">
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light small">
                      {showStatDetail === 'KK' ? (
                        <tr>
                          <th className="p-3">No KK</th>
                          <th>Kepala Keluarga</th>
                          <th>Alamat</th>
                          <th className="text-center">Anggota</th>
                        </tr>
                      ) : (
                        <tr>
                          <th className="p-3">NIK</th>
                          <th>Nama Lengkap</th>
                          <th>L/P</th>
                          <th>Pekerjaan</th>
                        </tr>
                      )}
                    </thead>
                    <tbody>
                      {showStatDetail === 'KK' ? (
                        familyData?.families.map(f => (
                          <tr key={f.id}>
                            <td className="p-3 fw-bold">{f.noKK}</td>
                            <td>{f.kepalaKeluarga}</td>
                            <td>{f.address}</td>
                            <td className="text-center">
                                <span className="badge bg-secondary">{f.members?.length} Orang</span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        citizenData?.citizens.map(c => (
                          <tr key={c.id}>
                            <td className="p-3 fw-bold">{c.nik}</td>
                            <td>{c.name}</td>
                            <td>{c.gender}</td>
                            <td>{c.profession}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="modal-footer border-0 bg-light no-print">
                <button className="btn btn-secondary px-4 fw-bold" onClick={() => setShowStatDetail(null)}>Tutup List</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Datawarga;