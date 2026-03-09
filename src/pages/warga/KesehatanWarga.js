import React from 'react';
import { useQuery, gql } from '@apollo/client';

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

export default function KesehatanWarga() {
  const familyId = localStorage.getItem("familyId");
  const { loading, data } = useQuery(GET_HEALTH);

  const myHealth = data?.getAllHealthRecords.filter(h => h.familyId === familyId);

  return (
    <div className="warga-page">
      <h3>Status Kesehatan Keluarga</h3>
      <div className="health-container">
        {myHealth?.length === 0 ? (
          <p className="empty-msg">Belum ada catatan kesehatan khusus untuk keluarga kawan.</p>
        ) : (
          myHealth?.map((h, i) => (
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
  );
}