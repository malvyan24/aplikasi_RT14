import React from 'react';
import { useQuery } from '@apollo/client';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { GET_HEALTH_STATS } from '../../graphql/healthQueries';

const HealthStatsChart = () => {
  const { data, loading } = useQuery(GET_HEALTH_STATS, { pollInterval: 5000 });

  if (loading) return <p className="text-center p-3 small text-muted">Memuat Statistik...</p>;

  const COLORS = { 'SEHAT': '#20c997', 'PANTAUAN': '#fbc531', 'DARURAT': '#ff4757' };

  const chartData = data?.getHealthStats.map(item => ({
    name: item.status,
    value: item.count
  })) || [];

  return (
    <div className="bg-white p-4 rounded-4 shadow-sm border h-100">
      <h6 className="fw-bold text-dark mb-4 text-center">Statistik Kondisi Warga</h6>
      <div style={{ width: '100%', height: 220 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#dee2e6'} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36}/>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default HealthStatsChart;