import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import {
  FaUsers,
  FaHome,
  FaWallet,
  FaRecycle,
  FaBullhorn,
  FaCalendarAlt,
  FaHandPaper,
  FaHeartbeat,
  FaLeaf,
} from "react-icons/fa";

const Home = () => {
  const navigate = useNavigate();

  const stats = [
    {
      id: 1,
      label: "Total Keluarga",
      value: "99 KK",
      icon: <FaHome />,
      class: "stat-blue",
    },
    {
      id: 2,
      label: "Total Warga",
      value: "350 Org",
      icon: <FaUsers />,
      class: "stat-white",
    },
    {
      id: 3,
      label: "Kas Sampah",
      value: "Rp 4,7 Jt",
      icon: <FaWallet />,
      class: "stat-white",
    },
    {
      id: 4,
      label: "Berat Sampah",
      value: "1612 Kg",
      icon: <FaRecycle />,
      class: "stat-white",
    },
  ];

  const quickMenus = [
    {
      id: 1,
      label: "Data Warga",
      icon: <FaUsers />,
      color: "#7c3aed",
      path: "/datawarga",
    },
    {
      id: 2,
      label: "Kesehatan",
      icon: <FaHeartbeat />,
      color: "#ef4444",
      path: "/kesehatan",
    },
    {
      id: 3,
      label: "Lingkungan",
      icon: <FaLeaf />,
      color: "#22c55e",
      path: "/lingkungan",
    },
    {
      id: 4,
      label: "Bank Sampah",
      icon: <FaRecycle />,
      color: "#f59e0b",
      path: "/banksampah",
    },
  ];

  return (
    <div className="home-page">
      {/* Banner Utama */}
      <div className="hero-banner">
        <div className="hero-content">
          <h1>
            Halo, Pak Ahmad! <FaHandPaper className="wave-icon" />
          </h1>
          <p>
            Kelola data warga & kegiatan RT 14 jadi lebih mudah dan berwarna.
          </p>
        </div>
        <div className="hero-logo-box">
          <img src="/image/logoSiRT.png" alt="SIRT Logo" />
        </div>
      </div>

      {/* Row Statistik Utama */}
      <div className="stats-row">
        {stats.map((s) => (
          <div key={s.id} className={`stat-box ${s.class}`}>
            <div className="stat-icon-circle">{s.icon}</div>
            <div className="stat-text">
              <span className="label">{s.label}</span>
              <span className="value">{s.value}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        {/* Kolom Kiri: Menu & Pengumuman */}
        <div className="left-column">
          <div className="section-card">
            <h3 className="section-title">Akses Menu Cepat</h3>
            <div className="menu-grid">
              {quickMenus.map((m) => (
                <div
                  key={m.id}
                  className="menu-item"
                  onClick={() => navigate(m.path)}
                >
                  <div
                    className="menu-box"
                    style={{ backgroundColor: m.color }}
                  >
                    <div className="menu-icon-white">{m.icon}</div>
                    <span>{m.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="section-card">
            <div className="card-header">
              <h3>
                <FaBullhorn /> Pengumuman Terkini
              </h3>
              <button className="btn-small">Lihat Semua</button>
            </div>
            <div className="news-item">
              <div className="badge blue">18 OKT</div>
              <div className="news-desc">
                <h4>Kerja Bakti Saluran Air</h4>
                <p>Membawa cangkul & sapu lidi. Jam 07:00 WIB.</p>
              </div>
            </div>
            <div className="news-item">
              <div className="badge red">20 OKT</div>
              <div className="news-desc">
                <h4>Pembagian KKS Tahap 2</h4>
                <p>Warga terdaftar harap bawa FC KK & KTP.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Agenda */}
        <div className="right-column">
          <div className="section-card agenda-card">
            <div className="card-header">
              <h3>
                <FaCalendarAlt /> Agenda Kegiatan
              </h3>
              <button className="btn-small">Lihat Semua</button>
            </div>
            <div className="agenda-row">
              <div className="time-box purple">22:00</div>
              <div className="agenda-desc">
                <h4>Ronda Malam (Grup A)</h4>
                <p>Senin • Pos Kamling Utama</p>
              </div>
            </div>
            <div className="agenda-row">
              <div className="time-box green">08:00</div>
              <div className="agenda-desc">
                <h4>Posyandu Balita</h4>
                <p>Rabu • Rumah Ibu Sekretaris</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
