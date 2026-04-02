import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import "./Home.css";

// GraphQL Queries
import { GET_WARGA } from "../../../graphql/dashboardQueries";
import { GET_SAMPAH_STATS } from "../../../graphql/dashboardQueries";
import { GET_HEALTH_STATS } from "../../../graphql/dashboardQueries";
import { GET_KAS_DATA } from "../../../graphql/dashboardQueries";

// Icons
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
  FaMoneyBillWave,
} from "react-icons/fa";

const Home = () => {
  const navigate = useNavigate();

  // ─── FETCH DATA REAL-TIME ───────────────────────────────────────────
  const { data: wargaData, loading: wargaLoading } = useQuery(GET_WARGA);
  const { data: sampahData, loading: sampahLoading } = useQuery(GET_SAMPAH_STATS);
  const { data: healthData, loading: healthLoading } = useQuery(GET_HEALTH_STATS);
  const { data: kasData, loading: kasLoading } = useQuery(GET_KAS_DATA, {
    variables: { month: "Februari", year: "2026" },
  });

  const isLoading = wargaLoading || sampahLoading || healthLoading || kasLoading;

  // ─── HITUNG STATISTIK DARI DATA BACKEND ─────────────────────────────
  const totalKeluarga = wargaData?.families?.length || 0;

  const totalWarga = wargaData?.families?.reduce(
    (acc, family) => acc + (family.members?.length || 0),
    0
  ) || 0;

  const totalBeratSampah = sampahData?.sampahStats?.totalBerat || 0;

  const totalUangSampah = sampahData?.sampahStats?.totalUang || 0;

  const totalDataKesehatan = healthData?.getHealthStats?.reduce(
    (acc, item) => acc + (item.count || 0),
    0
  ) || 0;

  const saldoKasRT = kasData?.getKasSummary?.balance || 0;

  // ─── FORMAT RUPIAH ──────────────────────────────────────────────────
  const formatRupiah = (number) => {
    if (number >= 1_000_000) {
      return `Rp ${(number / 1_000_000).toFixed(1)} Jt`;
    }
    if (number >= 1_000) {
      return `Rp ${(number / 1_000).toFixed(0)} Rb`;
    }
    return `Rp ${number}`;
  };

  // ─── STATISTIK CARDS (SEKARANG DINAMIS) ─────────────────────────────
  const stats = [
    {
      id: 1,
      label: "Total Keluarga",
      value: `${totalKeluarga} KK`,
      icon: <FaHome />,
      class: "stat-blue",
    },
    {
      id: 2,
      label: "Total Warga",
      value: `${totalWarga} Org`,
      icon: <FaUsers />,
      class: "stat-white",
    },
    {
      id: 3,
      label: "Kas Sampah",
      value: formatRupiah(totalUangSampah),
      icon: <FaWallet />,
      class: "stat-white",
    },
    {
      id: 4,
      label: "Berat Sampah",
      value: `${totalBeratSampah.toFixed(1)} Kg`,
      icon: <FaRecycle />,
      class: "stat-white",
    },
    {
      id: 5,
      label: "Data Kesehatan",
      value: `${totalDataKesehatan} Data`,
      icon: <FaHeartbeat />,
      class: "stat-white",
    },
    {
      id: 6,
      label: "Saldo Kas RT",
      value: formatRupiah(saldoKasRT),
      icon: <FaMoneyBillWave />,
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

  // Tampilkan nama admin yang dinamis
  const adminName = localStorage.getItem("userName") || "Pak Admin";

  return (
    <div className="home-page">
      {/* Banner Utama */}
      <div className="hero-banner">
        <div className="hero-content">
          <h1>
            Halo, {adminName}! <FaHandPaper className="wave-icon" />
          </h1>
          <p>
            Kelola data warga & kegiatan RT 14 jadi lebih mudah dan berwarna.
          </p>
        </div>
        <div className="hero-logo-box">
          <img src="/image/logoSiRT.png" alt="SIRT Logo" />
        </div>
      </div>

      {/* Row Statistik Utama — Sekarang Real-Time! */}
      <div className="stats-row">
        {stats.map((s) => (
          <div key={s.id} className={`stat-box ${s.class} ${isLoading ? "stat-loading" : ""}`}>
            <div className="stat-icon-circle">{s.icon}</div>
            <div className="stat-text">
              <span className="label">{s.label}</span>
              <span className="value">
                {isLoading ? "..." : s.value}
              </span>
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
