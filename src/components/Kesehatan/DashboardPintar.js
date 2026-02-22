import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_ALL_HEALTH_RECORDS, GET_SCHEDULES } from '../../graphql/healthQueries';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FaCalendarAlt, FaTint, FaBaby, FaFemale, FaInfoCircle } from 'react-icons/fa';

const DashboardPintar = ({ allMembers }) => {
  const { data: healthData } = useQuery(GET_ALL_HEALTH_RECORDS, { pollInterval: 2000 });
  const { data: scheduleData } = useQuery(GET_SCHEDULES, { pollInterval: 5000 });
  const [selectedToddler, setSelectedToddler] = useState("");

  const toddlers = allMembers?.filter(m => {
    const birth = !isNaN(m.dateOfBirth) ? new Date(parseInt(m.dateOfBirth)) : new Date(m.dateOfBirth);
    return (new Date().getFullYear() - birth.getFullYear()) <= 5;
  }) || [];

  const toddlerHistory = healthData?.getAllHealthRecords
    ?.filter(r => r.citizen?.id === selectedToddler)
    .slice().sort((a, b) => parseInt(a.createdAt) - parseInt(b.createdAt))
    .map(r => ({
      tanggal: new Date(parseInt(r.createdAt)).toLocaleDateString('id-ID', {month:'short'}),
      BB: r.weight, TB: r.height
    })) || [];

  const uniquePregMoms = Array.from(new Set(healthData?.getAllHealthRecords?.filter(r => r.isPregnant).map(a => a.citizen?.id)))
    .map(id => healthData?.getAllHealthRecords?.find(a => a.citizen?.id === id));

  const bloodGroups = { 'A': [], 'B': [], 'AB': [], 'O': [] };
  allMembers?.forEach(m => {
    const latest = healthData?.getAllHealthRecords?.find(r => r.citizen?.id === m.id);
    if (latest?.bloodType && bloodGroups[latest.bloodType]) bloodGroups[latest.bloodType].push(m);
  });

  return (
    <div className="row g-4 mb-4 text-start">
      <div className="col-lg-8">
        <div className="card border-0 shadow-sm rounded-4 h-100 p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h6 className="fw-bold text-primary mb-0"><FaBaby className="me-2"/>Grafik KMS Balita</h6>
            <select className="form-select w-50" value={selectedToddler} onChange={e => setSelectedToddler(e.target.value)}>
              <option value="">-- Pilih Balita --</option>
              {toddlers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          {selectedToddler && (
            <div style={{ width: '100%', height: 250 }}>
              <ResponsiveContainer>
                <LineChart data={toddlerHistory}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="tanggal" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="BB" stroke="#4facfe" strokeWidth={4} dot={{r:6}} />
                  <Line type="monotone" dataKey="TB" stroke="#ff6b81" strokeWidth={4} dot={{r:6}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      <div className="col-lg-4">
        <div className="card border-0 shadow-sm rounded-4 mb-3 p-3">
          <h6 className="fw-bold text-danger mb-3 small"><FaTint className="me-2"/>Stok Darah</h6>
          <div className="row g-1 text-center">
            {['A', 'B', 'AB', 'O'].map(g => (
              <div key={g} className="col-3"><div className="p-2 rounded bg-light fw-bold text-danger small">{g}<br/>{bloodGroups[g].length}</div></div>
            ))}
          </div>
        </div>
        <div className="card border-0 shadow-sm rounded-4 h-50 p-3 overflow-auto">
          <h6 className="fw-bold text-warning mb-2 small"><FaCalendarAlt className="me-2"/>Jadwal</h6>
          {scheduleData?.getSchedules?.map(s => (
            <div key={s.id} className="p-2 mb-1 bg-light rounded small fw-bold">{s.title}</div>
          ))}
        </div>
      </div>

      <div className="col-12">
        <div className="card border-0 shadow-sm rounded-4 p-4">
          <h6 className="fw-bold text-primary mb-3"><FaFemale className="me-2"/>Monitor Ibu Hamil & Kontak Darurat (KK)</h6>
          <div className="table-responsive">
            <table className="table table-hover align-middle small mb-0">
              <thead className="table-light">
                <tr><th>NAMA IBU</th><th>HP PRIBADI</th><th className="text-danger">HP DARURAT</th><th>HPL</th></tr>
              </thead>
              <tbody>
                {uniquePregMoms.map(r => (
                  <tr key={r.id}>
                    <td className="fw-bold">{r.citizen?.name}</td>
                    <td>{r.citizen?.phone || "-"}</td>
                    <td className="text-danger fw-bold">{r.citizen?.family?.members?.find(m => m.name === r.citizen?.family?.kepalaKeluarga)?.phone || "-"}</td>
                    <td className="fw-bold">39 Mgg 6 Hr lagi</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPintar;