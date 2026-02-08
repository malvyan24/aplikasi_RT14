import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_WARGA } from '../../graphql/userQueries';
import { GET_SAMPAH_STATS } from '../../graphql/sampahQueries';
import { UPDATE_FAMILY_WASTE, DELETE_FAMILY_WASTE } from '../../graphql/sampahMutations';

const DataSampah = () => {
  const { data, loading, error } = useQuery(GET_WARGA);
  
  // State untuk mode edit inline
  const [editId, setEditId] = useState(null);
  const [newBerat, setNewBerat] = useState('');

  // Mutasi Update
  const [updateWaste] = useMutation(UPDATE_FAMILY_WASTE, {
    refetchQueries: [{ query: GET_WARGA }, { query: GET_SAMPAH_STATS }],
    onCompleted: () => {
      alert("✅ Data KK Berhasil Diperbarui!");
      setEditId(null);
    }
  });

  // Mutasi Hapus
  const [deleteWaste] = useMutation(DELETE_FAMILY_WASTE, {
    refetchQueries: [{ query: GET_WARGA }, { query: GET_SAMPAH_STATS }],
    onCompleted: () => alert("🗑️ Data Tabungan KK Telah Dihapus!")
  });

  const handleEditClick = (f) => {
    setEditId(f.id);
    setNewBerat(f.totalTabungan || 0);
  };

  const handleSaveEdit = (id) => {
    updateWaste({ variables: { familyId: id, totalTabungan: parseFloat(newBerat) } });
  };

  const handleDelete = (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus/reset seluruh tabungan KK ini?")) {
      deleteWaste({ variables: { familyId: id } });
    }
  };

  if (loading) return <div className="loading-state">Memuat data rekapitulasi...</div>;

  return (
    <div className="table-container-premium">
      <div className="table-header">
        <h3>📊 Rekapitulasi Tabungan Per KK</h3>
        <p>Kelola dan koreksi akumulasi sampah warga</p>
      </div>
      <div className="responsive-table-wrapper">
        <table className="modern-table">
          <thead>
            <tr>
              <th>Nomor KK</th>
              <th>Kepala Keluarga</th>
              <th>Total Tabungan</th>
              <th className="text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data?.families.map((f) => (
              <tr key={f.id} className={editId === f.id ? "row-editing" : ""}>
                <td><code className="kk-code">{f.noKK}</code></td>
                <td><strong>{f.kepalaKeluarga}</strong></td>
                <td>
                  {editId === f.id ? (
                    <div className="edit-input-group">
                      <input 
                        type="number" 
                        value={newBerat} 
                        onChange={(e) => setNewBerat(e.target.value)}
                        className="input-inline-edit"
                      />
                      <span>Kg</span>
                    </div>
                  ) : (
                    <span className="weight-badge">{f.totalTabungan || 0} Kg</span>
                  )}
                </td>
                <td className="action-cells">
                  {editId === f.id ? (
                    <>
                      <button onClick={() => handleSaveEdit(f.id)} className="btn-icon btn-check" title="Simpan">✔️</button>
                      <button onClick={() => setEditId(null)} className="btn-icon btn-cancel" title="Batal">❌</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleEditClick(f)} className="btn-icon btn-edit" title="Edit Data">✏️</button>
                      <button onClick={() => handleDelete(f.id)} className="btn-icon btn-delete" title="Hapus Data">🗑️</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataSampah;