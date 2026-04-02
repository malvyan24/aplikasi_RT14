import React, { useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import './Warga.css';

// ─── QUERY: Dashboard + Profil Keluarga ────────────────────────────────
const GET_FAMILY_FULL = gql`
  query GetFamilyFull($id: ID!) {
    getFamilyById(id: $id) {
      kepalaKeluarga
      noKK
      address
      balance
      totalTabungan
      members {
        id
        name
        nik
        relationship
        profession
        phone
        email
      }
    }
  }
`;

// ─── QUERY: Data Kesehatan ─────────────────────────────────────────────
const GET_HEALTH = gql`
  query GetHealth {
    getAllHealthRecords {
      familyId
      healthStatus
      notes
      createdAt
      citizen { name }
    }
  }
`;

// ─── QUERY: Riwayat Setoran Sampah ─────────────────────────────────────
const GET_LOGS = gql`
  query GetLogs {
    allTrashLogs {
      familyId
      trashType
      weight
      debit
      txnDate
    }
  }
`;

export default function DashboardWarga() {
  const familyId = localStorage.getItem("familyId");
  const [activeTab, setActiveTab] = useState('beranda');

  // ─── FETCH ALL DATA ──────────────────────────────────────────────────
  const { loading: loadFamily, data: familyData } = useQuery(GET_FAMILY_FULL, {
    variables: { id: familyId },
    skip: !familyId,
  });
  const { data: healthData } = useQuery(GET_HEALTH);
  const { data: logsData } = useQuery(GET_LOGS);

  if (loadFamily) return <div className="warga-loading">Memuat data...</div>;

  const family = familyData?.getFamilyById;
  const myHealth = healthData?.getAllHealthRecords?.filter(h => h.familyId === familyId) || [];
  const myLogs = logsData?.allTrashLogs?.filter(l => l.familyId === familyId) || [];

  const formatRupiah = (n) => `Rp ${(n || 0).toLocaleString('id-ID')}`;

  // ─── TAB CONFIG ──────────────────────────────────────────────────────
  const tabs = [
    { key: 'beranda', label: '🏠 Beranda' },
    { key: 'profil', label: '👨‍👩‍👧‍👦 Profil' },
    { key: 'kesehatan', label: '❤️ Kesehatan' },
    { key: 'sampah', label: '♻️ Sampah' },
  ];

  return (
    <div className="warga-page">
      {/* ── HEADER WELCOME ────────────────────────────────────────── */}
      <div className="warga-welcome">
        <h2>Selamat Datang, Keluarga <span>{family?.kepalaKeluarga || 'Warga'}</span></h2>
        <p>Portal layanan mandiri digital warga RT 14.</p>
      </div>

      {/* ── TAB NAVIGATION ────────────────────────────────────────── */}
      <div className="warga-tabs">
        {tabs.map(t => (
          <button
            key={t.key}
            className={`warga-tab-btn ${activeTab === t.key ? 'active' : ''}`}
            onClick={() => setActiveTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* TAB 1: BERANDA — Ringkasan Utama                            */}
      {/* ══════════════════════════════════════════════════════════════ */}
      {activeTab === 'beranda' && (
        <div className="warga-fade-in">
          <div className="warga-grid">
            <div className="warga-card card--green">
              <div className="card-icon">💰</div>
              <div className="card-info">
                <span className="label">Saldo Bank Sampah</span>
                <h3>{formatRupiah(family?.balance)}</h3>
              </div>
            </div>
            <div className="warga-card card--blue">
              <div className="card-icon">♻️</div>
              <div className="card-info">
                <span className="label">Total Berat Sampah</span>
                <h3>{family?.totalTabungan || 0} Kg</h3>
              </div>
            </div>
            <div className="warga-card card--purple">
              <div className="card-icon">👥</div>
              <div className="card-info">
                <span className="label">Anggota Keluarga</span>
                <h3>{family?.members?.length || 0} Orang</h3>
              </div>
            </div>
          </div>

          {/* Mini Kesehatan Preview */}
          <div className="warga-section">
            <div className="section-header">
              <h3>❤️ Catatan Kesehatan Terbaru</h3>
              <button className="btn-lihat" onClick={() => setActiveTab('kesehatan')}>Lihat Semua</button>
            </div>
            {myHealth.length === 0 ? (
              <p className="empty-msg">Belum ada catatan kesehatan.</p>
            ) : (
              myHealth.slice(0, 2).map((h, i) => (
                <div key={i} className="health-card">
                  <div className="health-top">
                    <strong>{h.citizen?.name}</strong>
                    <span className="status-badge">{h.healthStatus}</span>
                  </div>
                  <p className="health-notes italic">"{h.notes}"</p>
                </div>
              ))
            )}
          </div>

          {/* Mini Sampah Preview */}
          <div className="warga-section">
            <div className="section-header">
              <h3>♻️ Setoran Terakhir</h3>
              <button className="btn-lihat" onClick={() => setActiveTab('sampah')}>Lihat Semua</button>
            </div>
            {myLogs.length === 0 ? (
              <p className="empty-msg">Belum ada riwayat setoran.</p>
            ) : (
              <div className="table-container">
                <table className="warga-table">
                  <thead>
                    <tr><th>Tanggal</th><th>Jenis</th><th>Berat</th><th>Pendapatan</th></tr>
                  </thead>
                  <tbody>
                    {myLogs.slice(0, 3).map((log, i) => (
                      <tr key={i}>
                        <td>{new Date(log.txnDate).toLocaleDateString('id-ID')}</td>
                        <td><strong>{log.trashType}</strong></td>
                        <td>{log.weight} Kg</td>
                        <td className="text-green">{formatRupiah(log.debit)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* TAB 2: PROFIL KELUARGA                                       */}
      {/* ══════════════════════════════════════════════════════════════ */}
      {activeTab === 'profil' && (
        <div className="warga-fade-in">
          <div className="kk-box">
            <div className="kk-header">
              <p>NOMOR KARTU KELUARGA</p>
              <h1>{family?.noKK}</h1>
              <p className="address">{family?.address}</p>
            </div>
            <div className="member-list">
              <h3>Daftar Anggota Keluarga</h3>
              {family?.members?.map((m, i) => (
                <div key={i} className="member-item" style={{ flexWrap: 'wrap', gap: '10px' }}>
                  <div className="member-info">
                    <p className="name">{m.name}</p>
                    <p className="nik">NIK: {m.nik}</p>
                    <p className="nik" style={{ color: '#3b82f6', marginTop: '2px', fontWeight: 'bold' }}>
                      📧 {m.email && m.email !== "-" ? m.email : "Tidak ada email"} | 📞 {m.phone && m.phone !== "-" ? m.phone : "Tidak ada HP"}
                    </p>
                  </div>
                  <span className="tag">{m.relationship}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* TAB 3: DATA KESEHATAN                                        */}
      {/* ══════════════════════════════════════════════════════════════ */}
      {activeTab === 'kesehatan' && (
        <div className="warga-fade-in">
          <h3 className="warga-section-title">Status Kesehatan Keluarga</h3>
          <div className="health-container">
            {myHealth.length === 0 ? (
              <p className="empty-msg">Belum ada catatan kesehatan khusus untuk keluarga kawan.</p>
            ) : (
              myHealth.map((h, i) => (
                <div key={i} className="health-card">
                  <div className="health-top">
                    <strong>{h.citizen?.name}</strong>
                    <span className="status-badge">{h.healthStatus}</span>
                  </div>
                  <p className="health-notes italic">"{h.notes}"</p>
                  <small className="date">{new Date(h.createdAt).toLocaleDateString()}</small>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* TAB 4: RIWAYAT SETORAN SAMPAH                                */}
      {/* ══════════════════════════════════════════════════════════════ */}
      {activeTab === 'sampah' && (
        <div className="warga-fade-in">
          <h3 className="warga-section-title">Riwayat Setoran Sampah</h3>
          <div className="table-container">
            <table className="warga-table">
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>Jenis Sampah</th>
                  <th>Berat</th>
                  <th>Pendapatan</th>
                </tr>
              </thead>
              <tbody>
                {myLogs.length === 0 ? (
                  <tr><td colSpan="4" className="empty-msg" style={{ textAlign: 'center', padding: '30px' }}>Belum ada riwayat setoran.</td></tr>
                ) : (
                  myLogs.map((log, i) => (
                    <tr key={i}>
                      <td>{new Date(log.txnDate).toLocaleDateString('id-ID')}</td>
                      <td><strong>{log.trashType}</strong></td>
                      <td>{log.weight} Kg</td>
                      <td className="text-green">{formatRupiah(log.debit)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}