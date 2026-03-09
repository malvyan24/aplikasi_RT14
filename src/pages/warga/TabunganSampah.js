import React from 'react';
import { useQuery, gql } from '@apollo/client';

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

export default function TabunganSampah() {
  const familyId = localStorage.getItem("familyId");
  const { loading, data } = useQuery(GET_LOGS);

  // Filter hanya data milik user yang sedang login
  const myLogs = data?.allTrashLogs.filter(l => l.familyId === familyId);

  return (
    <div className="warga-page">
      <h3>Riwayat Setoran Sampah</h3>
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
            {myLogs?.map((log, i) => (
              <tr key={i}>
                <td>{new Date(log.txnDate).toLocaleDateString('id-ID')}</td>
                <td><strong>{log.trashType}</strong></td>
                <td>{log.weight} Kg</td>
                <td className="text-green">Rp {log.debit.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}