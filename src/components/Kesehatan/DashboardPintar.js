import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_ALL_HEALTH_RECORDS } from '../../graphql/healthQueries';
import { FaBaby, FaHeartbeat, FaCalendarCheck, FaInfoCircle, FaCheckCircle, FaExclamationTriangle, FaArrowDown, FaArrowUp } from 'react-icons/fa';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DashboardPintar = ({ allMembers }) => {
  const { data: healthData, loading } = useQuery(GET_ALL_HEALTH_RECORDS);
  const [selectedToddler, setSelectedToddler] = useState("");

  if (loading) return <div className="p-5 text-center text-muted small">Menyusun Dashboard Kesehatan...</div>;

  const allRecords = healthData?.getAllHealthRecords || [];

  // --- 1. LOGIKA MONITORING IBU HAMIL (DATA UNIK TERBARU) ---
  const dataIbuHamil = allRecords
    .filter(r => r.isPregnant === true || (r.hpl && r.hpl !== "-"))
    .reduce((acc, current) => {
      const x = acc.find(item => item.citizen?.id === current.citizen?.id);
      if (!x) return acc.concat([current]);
      return acc;
    }, []);

  // --- 2. LOGIKA KMS BALITA ---
  const toddlers = allMembers?.filter(m => {
    const birth = new Date(isNaN(m.dateOfBirth) ? m.dateOfBirth : Number(m.dateOfBirth));
    return (new Date().getFullYear() - birth.getFullYear()) <= 5;
  }) || [];

  const toddlerHistory = allRecords
    .filter(r => r.citizen?.id === selectedToddler)
    .map(r => ({
      tanggal: new Date(isNaN(r.createdAt) ? r.createdAt : Number(r.createdAt)).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' }),
      timestamp: isNaN(r.createdAt) ? new Date(r.createdAt).getTime() : Number(r.createdAt),
      BeratBadan: r.weight,
      TinggiBadan: r.height
    }))
    .sort((a, b) => a.timestamp - b.timestamp);

  // --- 3. ALGORITMA ANALISA PERTUMBUHAN & SARAN GIZI ---
  const getKMSAnalysis = (history) => {
    if (!history || history.length < 1) return null;
    const latest = history[history.length - 1];

    if (history.length === 1) {
      return {
        color: 'info',
        icon: <FaInfoCircle />,
        title: 'Pemantauan Awal',
        desc: `Data awal tercatat: TB ${latest.TinggiBadan}cm, BB ${latest.BeratBadan}kg.`,
        saran: 'Lanjutkan pemberian ASI/MPASI bergizi dan timbang bulan depan.'
      };
    }

    const prev = history[history.length - 2];
    const bbTurun = latest.BeratBadan < prev.BeratBadan;
    const selisih = (latest.BeratBadan - prev.BeratBadan).toFixed(1);

    if (bbTurun) {
      return {
        color: 'danger',
        icon: <FaExclamationTriangle />,
        title: 'Waspada: Penurunan Berat Badan',
        desc: `Berat badan turun ${Math.abs(selisih)}kg dari bulan lalu!`,
        saran: 'Segera tambahkan asupan Protein Hewani (Telur/Ikan) dan cek ke Posyandu.'
      };
    }

    return {
      color: 'success',
      icon: <FaCheckCircle />,
      title: 'Pertumbuhan Optimal',
      desc: `Selamat! Berat badan naik ${selisih}kg. Tren pertumbuhan sangat baik.`,
      saran: 'Pertahankan pola makan gizi seimbang dan imunisasi rutin.'
    };
  };

  const analysis = getKMSAnalysis(toddlerHistory);

  return (
    <div className="dashboard-pintar-section text-start">
      
      {/* 1. MONITORING IBU HAMIL */}
      <div className="card border-0 shadow-sm rounded-4 bg-white mb-4">
        <div className="card-body p-4">
          <h6 className="fw-bold text-primary mb-4 d-flex align-items-center">
            <FaHeartbeat className="me-2 text-danger" /> Monitoring Ibu Hamil & HPL
          </h6>
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr className="small text-muted text-uppercase" style={{fontSize: '0.75rem'}}>
                  <th className="ps-3 py-3">Nama Ibu</th>
                  <th className="text-center">HPL (Estimasi)</th>
                  <th className="text-center">Kondisi</th>
                  <th className="text-center">Catatan</th>
                </tr>
              </thead>
              <tbody>
                {dataIbuHamil.map((ibu) => (
                  <tr key={ibu.id} style={{fontSize: '0.9rem'}}>
                    <td className="ps-3 fw-bold text-dark">{ibu.citizen?.name}</td>
                    <td className="text-center text-primary fw-bold">
                        {new Date(isNaN(ibu.hpl) ? ibu.hpl : Number(ibu.hpl)).toLocaleDateString('id-ID', {day:'2-digit', month:'long', year:'numeric'})}
                    </td>
                    <td className="text-center">
                      <span className={`fw-bold ${ibu.healthStatus === 'SEHAT' ? 'text-success' : 'text-warning'}`}>
                        {ibu.healthStatus}
                      </span>
                    </td>
                    <td className="text-center text-muted small">{ibu.notes || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 2. GRAFIK KMS DIGITAL PREMIUM */}
      <div className="card border-0 shadow-sm rounded-4 bg-white mb-4 overflow-hidden">
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h6 className="fw-bold text-primary mb-0"><FaBaby className="me-2"/>Grafik KMS Digital</h6>
              <small className="text-muted">Analisis Pertumbuhan Balita RT 14</small>
            </div>
            <select className="form-select w-50 border-0 bg-light rounded-pill shadow-sm small" value={selectedToddler} onChange={e => setSelectedToddler(e.target.value)}>
              <option value="">-- Pilih Nama Balita --</option>
              {toddlers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>

          {selectedToddler ? (
            <div className="row g-4">
              {/* Grafik Area Chart */}
              <div className="col-lg-9" style={{ height: 300 }}>
                <ResponsiveContainer>
                  <AreaChart data={toddlerHistory}>
                    <defs>
                      <linearGradient id="colorBB" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4facfe" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#4facfe" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorTB" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ff6b81" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#ff6b81" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                    <XAxis dataKey="tanggal" axisLine={false} tickLine={false} style={{fontSize: '0.75rem'}} />
                    <YAxis axisLine={false} tickLine={false} style={{fontSize: '0.75rem'}} />
                    <Tooltip contentStyle={{borderRadius: '15px', border: 'none', boxShadow: '0 5px 15px rgba(0,0,0,0.1)'}} />
                    <Legend verticalAlign="top" height={36} iconType="circle" />
                    <Area type="monotone" dataKey="BeratBadan" stroke="#4facfe" strokeWidth={4} fill="url(#colorBB)" name="BB (kg)" dot={{ r: 6, fill: '#4facfe', strokeWidth: 2, stroke: '#fff' }} />
                    <Area type="monotone" dataKey="TinggiBadan" stroke="#ff6b81" strokeWidth={4} fill="url(#colorTB)" name="TB (cm)" dot={{ r: 6, fill: '#ff6b81', strokeWidth: 2, stroke: '#fff' }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Panel Analisis Samping */}
              <div className="col-lg-3">
                {analysis && (
                  <div className={`p-3 rounded-4 bg-${analysis.color} bg-opacity-10 border-start border-4 border-${analysis.color} h-100`}>
                    <div className={`fw-bold text-${analysis.color} d-flex align-items-center mb-2`}>
                      {analysis.icon} <span className="ms-2">{analysis.title}</span>
                    </div>
                    <p className="small text-dark mb-2 fw-medium">{analysis.desc}</p>
                    <div className="p-2 bg-white rounded-3 small border">
                      <strong className="text-primary">💡 Saran:</strong><br/>
                      {analysis.saran}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-5">
              <FaBaby size={60} className="text-light mb-3" />
              <p className="text-muted">Pilih balita untuk melakukan analisis kesehatan otomatis.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPintar;