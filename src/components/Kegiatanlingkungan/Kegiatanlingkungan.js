import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_KAS_DATA } from '../../graphql/kegiatanQueries';
import { 
  FaCalendarAlt, FaShieldAlt, FaPlusCircle, FaUsers, FaWallet, 
  FaArrowUp, FaArrowDown, FaChartPie, FaHistory, FaClock, FaMapMarkerAlt 
} from 'react-icons/fa';
import './Kegiatanlingkungan.css'; // Sesuaikan huruf kecil agar tidak eror lagi

const KegiatanLingkungan = () => {
  const [activeTab, setActiveTab] = useState('kegiatan');
  const [selectedKegiatan, setSelectedKegiatan] = useState(null);

  // 1. Load Data Kas dari Backend
  const { data: kasData, loading: kasLoading } = useQuery(GET_KAS_DATA, {
    variables: { month: "Februari", year: "2026" }
  });

  // 2. Data Dummy Kegiatan (KODE YANG TADI HILANG SUDAH SAYA MASUKKAN LAGI)
  const kegiatan = [
    {
      id: 1,
      nama: "Kerja Bakti Akbar",
      jenis: "Kebersihan",
      tanggal: "15 Februari 2026",
      jam: "07:00 - Selesai",
      lokasi: "Lapangan Utama & Selokan RT 14",
      deskripsi: "Kegiatan rutin bulanan untuk menjaga kebersihan lingkungan. Mohon warga membawa peralatan masing-masing.",
      icon: "🧹",
      warna: "#2ecc71"
    },
    {
      id: 2,
      nama: "Posyandu Balita & Lansia",
      jenis: "Kesehatan",
      tanggal: "18 Februari 2026",
      jam: "09:00 - 12:00",
      lokasi: "Balai Warga RT 14",
      deskripsi: "Pemeriksaan kesehatan rutin meliputi penimbangan balita dan pemberian vitamin.",
      icon: "👶",
      warna: "#ff7675"
    },
    {
      id: 3,
      nama: "Ronda Malam Regu A",
      jenis: "Keamanan",
      tanggal: "Setiap Malam",
      jam: "22:00 - 04:00",
      lokasi: "Pos Siskamling",
      deskripsi: "Jadwal siskamling rutin untuk menjaga keamanan wilayah RT 14.",
      icon: "👮‍♂️",
      warna: "#0984e3"
    }
  ];

  const jadwalRonda = [
    { hari: "Senin", petugas: ["Bambang", "Sutrisno", "Agus", "Mulyono"], regu: "Regu 1" },
    { hari: "Selasa", petugas: ["Dedi", "Rahmat", "Iwan", "Budi"], regu: "Regu 2" },
    { hari: "Rabu", petugas: ["Heri", "Ujang", "Asep", "Cecep"], regu: "Regu 3" },
    { hari: "Kamis", petugas: ["Joko", "Slamet", "Anto", "Eko"], regu: "Regu 4" },
    { hari: "Jumat", petugas: ["Yanto", "Roni", "Dani", "Gani"], regu: "Regu 5" },
    { hari: "Sabtu", petugas: ["Zaki", "Fikri", "Haikal", "Rizky"], regu: "Regu Khusus" },
    { hari: "Minggu", petugas: ["Siskamling Gabungan", "Warga Kerja Bakti"], regu: "All Team" },
  ];

  const today = new Date().toLocaleDateString('id-ID', { weekday: 'long' });

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
  };

  return (
    <div className="env-wrapper">
      <div className="env-header text-start">
        <h2 className="fw-bold text-dark"><FaShieldAlt className="text-primary me-2"/>Lingkungan & Keamanan RT 14</h2>
        <p className="text-muted">Manajemen jadwal siskamling dan transparansi keuangan warga secara terpusat.</p>
      </div>

      {/* Navigasi Tab */}
      <div className="tab-nav-pill">
        <button className={`nav-pill-btn ${activeTab === 'kegiatan' ? 'active' : ''}`} onClick={() => setActiveTab('kegiatan')}>
          <FaCalendarAlt className="me-2"/> Kegiatan
        </button>
        <button className={`nav-pill-btn ${activeTab === 'ronda' ? 'active' : ''}`} onClick={() => setActiveTab('ronda')}>
          <FaUsers className="me-2"/> Ronda
        </button>
        <button className={`nav-pill-btn ${activeTab === 'kas' ? 'active' : ''}`} onClick={() => setActiveTab('kas')}>
          💰 Transparansi Kas
        </button>
      </div>

      <div className="content-area text-start">
        
        {/* --- TAB 1: KEGIATAN WARGA --- */}
        {activeTab === 'kegiatan' && (
          <div className="fade-in">
            <div className="card-input shadow-sm border-0 rounded-4 mb-4">
              <div className="card-body p-4">
                <h6 className="fw-bold mb-3"><FaPlusCircle className="text-primary me-2"/> Publikasikan Kegiatan Baru</h6>
                <div className="row g-3">
                  <div className="col-md-4"><input type="text" className="form-control rounded-pill" placeholder="Nama Kegiatan..." /></div>
                  <div className="col-md-3">
                    <select className="form-select rounded-pill">
                      <option>Jenis...</option><option>Kebersihan</option><option>Kesehatan</option><option>Keamanan</option>
                    </select>
                  </div>
                  <div className="col-md-3"><input type="date" className="form-control rounded-pill" /></div>
                  <div className="col-md-2"><button className="btn btn-primary w-100 rounded-pill fw-bold">Publikasi</button></div>
                </div>
              </div>
            </div>
            <div className="row g-4">
              {kegiatan.map((item) => (
                <div key={item.id} className="col-md-4">
                  <div className="activity-card-new shadow-sm h-100">
                    <div className="activity-top" style={{ backgroundColor: item.warna }}>
                      <span className="icon-box">{item.icon}</span>
                      <span className="badge-type">{item.jenis}</span>
                    </div>
                    <div className="activity-body p-4">
                      <h5 className="fw-bold text-dark mb-3">{item.nama}</h5>
                      <div className="info-item mb-2"><FaCalendarAlt className="me-2 text-muted" /> {item.tanggal}</div>
                      <div className="info-item mb-2"><FaClock className="me-2 text-muted" /> {item.jam}</div>
                      <div className="info-item mb-4"><FaMapMarkerAlt className="me-2 text-muted" /> <span className="small">{item.lokasi}</span></div>
                      <button className="btn w-100 rounded-pill fw-bold" style={{ border: `2px solid ${item.warna}`, color: item.warna }} onClick={() => setSelectedKegiatan(item)}>Lihat Detail</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- TAB 2: JADWAL RONDA --- */}
        {activeTab === 'ronda' && (
          <div className="fade-in">
            <div className="alert-security shadow-sm border-0 p-3 rounded-4 mb-4 d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <div className="pulse-container me-3"><span className="pulse-dot"></span></div>
                <span className="fw-bold">Status Keamanan Malam Ini: <span className="text-success">Siaga Aman</span></span>
              </div>
            </div>
            <div className="table-responsive shadow-sm rounded-4 overflow-hidden border">
              <table className="table table-hover align-middle mb-0">
                <thead className="bg-light">
                  <tr className="small text-muted text-uppercase">
                    <th className="px-4 py-3">Hari</th><th className="py-3">Regu</th><th className="py-3">Petugas</th>
                  </tr>
                </thead>
                <tbody>
                  {jadwalRonda.map((val, index) => (
                    <tr key={index} className={today === val.hari ? 'table-active' : ''}>
                      <td className="px-4 fw-bold">{val.hari} {today === val.hari && <span className="badge bg-primary ms-2">Hari Ini</span>}</td>
                      <td><span className="badge bg-dark-subtle text-dark px-3 py-2">{val.regu}</span></td>
                      <td>
                        <div className="d-flex flex-wrap gap-2">
                          {val.petugas.map((nama, i) => (<span key={i} className="badge-name">{nama}</span>))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- TAB 3: TRANSPARANSI KAS --- */}
        {activeTab === 'kas' && (
          <div className="fade-in">
            <div className="row g-3 mb-4">
              <div className="col-md-3">
                <div className="card-stat bg-white shadow-sm p-4 rounded-4 border-0">
                  <small className="text-muted d-block fw-bold">SALDO KAS</small>
                  <h4 className="fw-bold text-primary mb-0">{formatRupiah(kasData?.getKasSummary?.balance || 0)}</h4>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card-stat bg-white shadow-sm p-4 rounded-4 border-0">
                  <small className="text-muted d-block fw-bold text-success">TOTAL MASUK</small>
                  <h4 className="fw-bold text-success mb-0">+{formatRupiah(kasData?.getKasSummary?.totalIn || 0)}</h4>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card-stat bg-white shadow-sm p-4 rounded-4 border-0">
                  <small className="text-muted d-block fw-bold text-danger">TOTAL KELUAR</small>
                  <h4 className="fw-bold text-danger mb-0">-{formatRupiah(kasData?.getKasSummary?.totalOut || 0)}</h4>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card-stat bg-white shadow-sm p-4 rounded-4 border-0">
                  <small className="text-muted d-block fw-bold">WARGA LUNAS</small>
                  <h4 className="fw-bold text-dark mb-0">{kasData?.getKasSummary?.paidPercentage?.toFixed(0)}%</h4>
                </div>
              </div>
            </div>
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
              <div className="card-header bg-white p-4 border-0"><h6 className="fw-bold mb-0"><FaHistory className="me-2 text-primary"/> Riwayat Pengeluaran Kas</h6></div>
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light"><tr className="small text-muted text-uppercase">
                    <th className="px-4">Kegiatan</th><th>Kategori</th><th>Tanggal</th><th className="text-end px-4">Jumlah</th>
                  </tr></thead>
                  <tbody>
                    {kasData?.getAllExpenses?.map((ex) => (
                      <tr key={ex.id}>
                        <td className="px-4 fw-bold">{ex.title}</td>
                        <td><span className="badge bg-light text-primary border">{ex.category}</span></td>
                        <td className="text-muted small">{new Date(isNaN(ex.date) ? ex.date : Number(ex.date)).toLocaleDateString('id-ID', {day: '2-digit', month: 'long', year: 'numeric'})}</td>
                        <td className="text-end px-4 fw-bold text-danger">- {formatRupiah(ex.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL DETAIL KEGIATAN */}
      {selectedKegiatan && (
        <div className="modal-overlay" onClick={() => setSelectedKegiatan(null)}>
          <div className="modal-content-new shadow-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-top" style={{ backgroundColor: selectedKegiatan.warna }}>
              <span className="modal-main-icon">{selectedKegiatan.icon}</span>
              <button className="close-x" onClick={() => setSelectedKegiatan(null)}>&times;</button>
            </div>
            <div className="p-4">
              <h3 className="fw-bold text-dark">{selectedKegiatan.nama}</h3>
              <p className="text-muted small mb-4">{selectedKegiatan.deskripsi}</p>
              <button className="btn btn-secondary w-100 rounded-pill fw-bold" onClick={() => setSelectedKegiatan(null)}>Tutup</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KegiatanLingkungan;