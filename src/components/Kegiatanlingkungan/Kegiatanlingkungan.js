import React, { useState } from 'react';
import './Kegiatanlingkungan.css';

const KegiatanLingkungan = () => {
  const [activeTab, setActiveTab] = useState('kegiatan'); // Tab: kegiatan atau ronda
  const [selectedKegiatan, setSelectedKegiatan] = useState(null);

  // Data Dummy Kegiatan
  const [kegiatan] = useState([
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
  ]);

  // Data Jadwal Ronda
  const jadwalRonda = [
    { hari: "Senin", petugas: ["Bambang", "Sutrisno", "Agus", "Mulyono"], regu: "Regu 1" },
    { hari: "Selasa", petugas: ["Dedi", "Rahmat", "Iwan", "Budi"], regu: "Regu 2" },
    { hari: "Rabu", petugas: ["Heri", "Ujang", "Asep", "Cecep"], regu: "Regu 3" },
    { hari: "Kamis", petugas: ["Joko", "Slamet", "Anto", "Eko"], regu: "Regu 4" },
    { hari: "Jumat", petugas: ["Yanto", "Roni", "Dani", "Gani"], regu: "Regu 5" },
    { hari: "Sabtu", petugas: ["Zaki", "Fikri", "Haikal", "Rizky"], regu: "Regu Khusus" },
    { hari: "Minggu", petugas: ["Warga Kerja Bakti", "Siskamling Gabungan"], regu: "All Team" },
  ];

  return (
    <div className="kegiatan-container">
      <div className="kegiatan-header">
        <h1>🌱 Lingkungan & Keamanan RT 14</h1>
        <p>Kelola kegiatan warga dan pantau keamanan lingkungan dalam satu pintu.</p>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button 
          className={`tab-btn ${activeTab === 'kegiatan' ? 'active' : ''}`}
          onClick={() => setActiveTab('kegiatan')}
        >
          📅 Kegiatan Warga
        </button>
        <button 
          className={`tab-btn ${activeTab === 'ronda' ? 'active' : ''}`}
          onClick={() => setActiveTab('ronda')}
        >
          👮‍♂️ Jadwal Ronda (Siskamling)
        </button>
      </div>

      {activeTab === 'kegiatan' ? (
        <>
          {/* Form Tambah Kegiatan */}
          <div className="input-card">
            <h3><span style={{color: '#6c5ce7'}}>+</span> Tambah Kegiatan Baru</h3>
            <div className="input-grid">
              <input type="text" placeholder="Nama Kegiatan..." className="form-input" />
              <select className="form-input">
                <option>Pilih Jenis...</option>
                <option>Kebersihan</option>
                <option>Kesehatan</option>
                <option>Keamanan</option>
              </select>
              <input type="date" className="form-input" />
              <button className="btn-publikasi">Publikasikan</button>
            </div>
          </div>

          {/* Grid Kegiatan */}
          <div className="kegiatan-grid">
            {kegiatan.map((item) => (
              <div key={item.id} className="activity-card">
                <div className="card-accent" style={{ backgroundColor: item.warna }}></div>
                <div className="card-content">
                  <div className="card-header-top">
                    <span className="activity-icon">{item.icon}</span>
                    <span className="activity-badge" style={{ color: item.warna, backgroundColor: item.warna + '15' }}>
                      {item.jenis}
                    </span>
                  </div>
                  <h2 className="activity-title">{item.nama}</h2>
                  <div className="activity-info">
                    <p>📅 <strong>Tanggal:</strong> {item.tanggal}</p>
                    <p>⏰ <strong>Waktu:</strong> {item.jam}</p>
                    <p>📍 <strong>Lokasi:</strong> {item.lokasi}</p>
                  </div>
                  <button 
                    className="btn-detail" 
                    style={{ border: `2px solid ${item.warna}`, color: item.warna }}
                    onClick={() => setSelectedKegiatan(item)}
                  >
                    Lihat Detail
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        /* SEKSI JADWAL RONDA */
        <div className="ronda-section">
          <div className="ronda-info-card">
            <div className="ronda-status">
              <span className="status-dot animate-pulse"></span>
              <strong>Status Malam Ini:</strong> Siaga Aman
            </div>
            <p className="text-muted small">Diharapkan petugas ronda hadir 15 menit sebelum jam mulai (22:00).</p>
          </div>

          <div className="ronda-table-container">
            <table className="ronda-table">
              <thead>
                <tr>
                  <th>Hari</th>
                  <th>Regu</th>
                  <th>Petugas Siskamling</th>
                </tr>
              </thead>
              <tbody>
                {jadwalRonda.map((val, index) => (
                  <tr key={index} className={new Date().toLocaleDateString('id-ID', {weekday: 'long'}) === val.hari ? 'today-row' : ''}>
                    <td className="day-cell">{val.hari}</td>
                    <td className="regu-cell">
                        <span className="badge-regu">{val.regu}</span>
                    </td>
                    <td className="petugas-cell">
                      {val.petugas.map((nama, i) => (
                        <span key={i} className="name-tag">{nama}</span>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Detail (Tetap Sama) */}
      {selectedKegiatan && (
        <div className="modal-overlay" onClick={() => setSelectedKegiatan(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-box" style={{ backgroundColor: selectedKegiatan.warna }}>
              <span className="modal-icon">{selectedKegiatan.icon}</span>
              <button className="close-btn" onClick={() => setSelectedKegiatan(null)}>&times;</button>
            </div>
            <div className="modal-body">
              <span className="modal-badge-type" style={{ color: selectedKegiatan.warna }}>{selectedKegiatan.jenis}</span>
              <h2>{selectedKegiatan.nama}</h2>
              <div className="modal-info-list">
                <p>📅 <strong>Tanggal:</strong> {selectedKegiatan.tanggal}</p>
                <p>⏰ <strong>Waktu:</strong> {selectedKegiatan.jam}</p>
                <p>📍 <strong>Lokasi:</strong> {selectedKegiatan.lokasi}</p>
              </div>
              <hr />
              <h4>Deskripsi Kegiatan:</h4>
              <p className="modal-description-text">{selectedKegiatan.deskripsi}</p>
              <button className="btn-modal-close" onClick={() => setSelectedKegiatan(null)}>Tutup</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KegiatanLingkungan;