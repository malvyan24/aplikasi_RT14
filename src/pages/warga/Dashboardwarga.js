import React from 'react';
import { useQuery, gql } from '@apollo/client';
import './Warga.css';

// Query ini akan mengambil ID dari localStorage yang kita simpan saat Login
const GET_DASHBOARD_DATA = gql`
  query GetDashboard($id: ID!) {
    getFamilyById(id: $id) {
      kepalaKeluarga
      balance
      totalTabungan
      members { id }
    }
  }
`;

export default function DashboardWarga() {
  // Mengambil kunci familyId dari brankas browser
  const familyId = localStorage.getItem("familyId");
  
  const { loading, data } = useQuery(GET_DASHBOARD_DATA, { 
    variables: { id: familyId },
    skip: !familyId // Mencegah error jika ID belum ada
  });

  if (loading) return <div className="warga-loading">Memuat dashboard kawan...</div>;
  
  const family = data?.getFamilyById;

  return (
    <div className="warga-page">
      <div className="warga-welcome">
        <h2>Selamat Datang, Keluarga <span>{family?.kepalaKeluarga || 'Warga'}</span></h2>
        <p>Akses layanan mandiri digital warga RT 14.</p>
      </div>

      <div className="warga-grid">
        {/* KARTU SALDO */}
        <div className="warga-card card--green">
          <div className="card-icon">💰</div>
          <div className="card-info">
            <span className="label">Saldo Bank Sampah</span>
            <h3>Rp {family?.balance?.toLocaleString('id-ID') || 0}</h3>
          </div>
        </div>

        {/* KARTU BERAT SAMPAH */}
        <div className="warga-card card--blue">
          <div className="card-icon">♻️</div>
          <div className="card-info">
            <span className="label">Total Berat Sampah</span>
            <h3>{family?.totalTabungan || 0} Kg</h3>
          </div>
        </div>

        {/* KARTU ANGGOTA KELUARGA */}
        <div className="warga-card card--purple">
          <div className="card-icon">👥</div>
          <div className="card-info">
            <span className="label">Anggota Keluarga</span>
            <h3>{family?.members?.length || 0} Orang</h3>
          </div>
        </div>
      </div>
    </div>
  );
}