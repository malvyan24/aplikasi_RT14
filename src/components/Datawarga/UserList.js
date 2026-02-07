import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_WARGA, GET_ALL_CITIZENS } from "../../graphql/userQueries";
import { ADD_CITIZEN, DELETE_CITIZEN, DELETE_WARGA, UPDATE_FAMILY } from "../../graphql/userMutations";
import { FaEye, FaTrash, FaUsers, FaSearch, FaEdit, FaSave, FaTimes, FaUserPlus } from "react-icons/fa";

const UserList = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [editFamily, setEditFamily] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [memberForm, setMemberForm] = useState({ 
    name: "", nik: "", gender: "L", religion: "Islam", 
    placeOfBirth: "-", dateOfBirth: "", profession: "-", relationship: "KEPALA KELUARGA" 
  });

  const { loading, error, data } = useQuery(GET_WARGA, { pollInterval: 5000 });
  const [addCitizen] = useMutation(ADD_CITIZEN, { refetchQueries: [{ query: GET_WARGA }, { query: GET_ALL_CITIZENS }] });
  const [deleteCitizen] = useMutation(DELETE_CITIZEN, { refetchQueries: [{ query: GET_WARGA }] });
  const [deleteWarga] = useMutation(DELETE_WARGA, { refetchQueries: [{ query: GET_WARGA }] });

  // ANTI-ERROR 400 (Manual Mapping)
  const [updateWarga] = useMutation(UPDATE_FAMILY, { 
    refetchQueries: [{ query: GET_WARGA }],
    onCompleted: () => { alert("Data berhasil diperbarui!"); setEditFamily(null); },
    onError: (err) => alert("Gagal Update: " + err.message)
  });

  const formatTanggal = (dateString) => {
    if (!dateString) return "-";
    const d = new Date(isNaN(dateString) ? dateString : Number(dateString));
    return isNaN(d.getTime()) ? dateString : d.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  if (loading) return <div className="p-5 text-center fw-bold text-primary">Sinkronisasi Data RT 14...</div>;
  if (error) return <div className="alert alert-danger m-3">Error: {error.message}</div>;

  return (
    <div className="user-list-wrapper">
      {/* Search Bar */}
      <div className="p-3 bg-white border-bottom mb-4 rounded-3 shadow-sm d-flex align-items-center">
        <FaSearch className="text-muted me-3" />
        <input type="text" className="form-control border-0 bg-transparent shadow-none" placeholder="Cari kepala keluarga..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
      </div>

      {/* --- TABEL UTAMA (ALAMAT & STATUS RUMAH SUDAH BALIK) --- */}
      <div className="table-responsive bg-white rounded-3 shadow-sm border mb-4">
        <table className="table table-hover mb-0 align-middle">
          <thead className="bg-light">
            <tr>
              <th className="ps-4 py-3 small text-uppercase fw-bold">No KK</th>
              <th className="py-3 small text-uppercase fw-bold">Kepala Keluarga</th>
              <th className="py-3 small text-uppercase fw-bold">Alamat</th>
              <th className="py-3 small text-uppercase fw-bold">Status Rumah</th>
              <th className="text-center py-3 small text-uppercase fw-bold">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data?.families.filter(f => f.kepalaKeluarga.toLowerCase().includes(searchTerm.toLowerCase())).map((f) => (
              <tr key={f.id} className="border-bottom">
                <td className="fw-bold ps-4">{f.noKK}</td>
                <td className="fw-bold text-primary">{f.kepalaKeluarga}</td>
                <td className="text-muted small">{f.address}</td>
                <td>
                  <span className={`badge px-2 border py-1 ${f.ownershipStatus === 'RENT' ? 'bg-warning-subtle text-warning border-warning' : 'bg-success-subtle text-success border-success'}`}>
                    {f.ownershipStatus || "OWNED"}
                  </span>
                </td>
                <td className="text-center">
                  <div className="d-flex gap-2 justify-content-center">
                    <button className="btn btn-outline-primary btn-sm rounded-circle p-2" onClick={() => setSelectedUser(f)}><FaEye /></button>
                    <button className="btn btn-outline-warning btn-sm rounded-circle p-2" onClick={() => setEditFamily(f)}><FaEdit /></button>
                    <button className="btn btn-outline-danger btn-sm rounded-circle p-2" onClick={() => window.confirm("Hapus data keluarga?") && deleteWarga({ variables: { id: f.id } })}><FaTrash /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL EDIT (IKON FaSave & FaTimes UNTUK HAPUS WARNING) */}
      {editFamily && (
        <div className="modal show d-block p-4" style={{ backgroundColor: 'rgba(0,0,0,0.7)', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1060 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header bg-warning text-white py-3 border-0">
                <h5 className="fw-bold mb-0"><FaEdit className="me-2"/> Edit Data Keluarga</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setEditFamily(null)}></button>
              </div>
              <form onSubmit={e => {
                e.preventDefault();
                updateWarga({ variables: { 
                  id: editFamily.id, 
                  noKK: String(editFamily.noKK), 
                  kepalaKeluarga: editFamily.kepalaKeluarga, 
                  address: editFamily.address, 
                  ownershipStatus: editFamily.ownershipStatus 
                }});
              }}>
                <div className="modal-body p-4 bg-white">
                  <div className="mb-3"><label className="small fw-bold text-muted mb-2">Nomor KK</label><input type="text" className="form-control" value={editFamily.noKK} onChange={e => setEditFamily({...editFamily, noKK: e.target.value})} required /></div>
                  <div className="mb-3"><label className="small fw-bold text-muted mb-2">Kepala Keluarga</label><input type="text" className="form-control" value={editFamily.kepalaKeluarga} onChange={e => setEditFamily({...editFamily, kepalaKeluarga: e.target.value})} required /></div>
                  <div className="mb-3"><label className="small fw-bold text-muted mb-2">Alamat</label><input type="text" className="form-control" value={editFamily.address} onChange={e => setEditFamily({...editFamily, address: e.target.value})} required /></div>
                  <div className="mb-3"><label className="small fw-bold text-muted mb-2">Status Rumah</label>
                    <select className="form-select" value={editFamily.ownershipStatus} onChange={e => setEditFamily({...editFamily, ownershipStatus: e.target.value})}>
                      <option value="OWNED">OWNED</option><option value="RENT">RENT</option><option value="OFFICIAL">OFFICIAL</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer d-flex justify-content-between p-3 border-top-0">
                  <button type="button" className="btn btn-outline-secondary px-4 fw-bold rounded-3" onClick={() => setEditFamily(null)}><FaTimes className="me-2"/>Batal</button>
                  <button type="submit" className="btn btn-warning text-white px-4 fw-bold shadow-sm rounded-3"><FaSave className="me-2"/>Update Data</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DETAIL ANGGOTA (GRID RAPI) */}
      {selectedUser && (
        <div className="modal show d-block p-4" style={{ backgroundColor: 'rgba(15, 23, 42, 0.8)', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1050 }}>
          <div className="modal-dialog modal-xl modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="modal-header bg-primary text-white border-0 py-3">
                <h5 className="fw-bold mb-0"><FaUsers className="me-2"/> Anggota Keluarga: {selectedUser.kepalaKeluarga}</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setSelectedUser(null)}></button>
              </div>
              <div className="modal-body p-4 bg-light">
                <div className="bg-white p-4 rounded-4 mb-4 shadow-sm border border-primary border-opacity-10">
                  <h6 className="fw-bold text-primary mb-3"><FaUserPlus className="me-2"/>Registrasi Anggota Baru</h6>
                  <form onSubmit={e => { e.preventDefault(); addCitizen({ variables: { ...memberForm, familyId: selectedUser.id, address: selectedUser.address, nik: String(memberForm.nik) } }); }}>
                    <div className="row g-2 align-items-end">
                      <div className="col-md-3"><label className="small fw-bold text-muted mb-1">Nama Lengkap</label><input type="text" className="form-control form-control-sm border-2" required value={memberForm.name} onChange={e => setMemberForm({...memberForm, name: e.target.value})} /></div>
                      <div className="col-md-3"><label className="small fw-bold text-muted mb-1">NIK</label><input type="number" className="form-control form-control-sm border-2" required value={memberForm.nik} onChange={e => setMemberForm({...memberForm, nik: e.target.value})} /></div>
                      <div className="col-md-2"><label className="small fw-bold text-muted mb-1">Hubungan</label>
                        <select className="form-select form-select-sm border-2 fw-bold" value={memberForm.relationship} onChange={e => setMemberForm({...memberForm, relationship: e.target.value})}>
                          <option value="KEPALA KELUARGA">KEPALA KELUARGA</option><option value="ISTRI">ISTRI</option><option value="ANAK">ANAK</option>
                        </select>
                      </div>
                      <div className="col-md-2"><label className="small fw-bold text-muted mb-1">Agama</label>
                        <select className="form-select form-select-sm border-2 fw-bold" value={memberForm.religion} onChange={e => setMemberForm({...memberForm, religion: e.target.value})}>
                          <option value="Islam">Islam</option><option value="Kristen">Kristen</option><option value="Katolik">Katolik</option><option value="Hindu">Hindu</option><option value="Budha">Budha</option>
                        </select>
                      </div>
                      <div className="col-md-2"><label className="small fw-bold text-muted mb-1">Tgl Lahir</label><input type="date" className="form-control form-control-sm border-2" required value={memberForm.dateOfBirth} onChange={e => setMemberForm({...memberForm, dateOfBirth: e.target.value})} /></div>
                      <div className="col-12 mt-3"><button type="submit" className="btn btn-primary w-100 fw-bold py-2 shadow-sm rounded-3">Simpan Anggota Baru</button></div>
                    </div>
                  </form>
                </div>

                <div className="table-responsive bg-white rounded-4 border shadow-sm">
                  <table className="table mb-0 small table-striped align-middle">
                    <thead className="bg-light">
                      <tr><th className="ps-4 py-3">Nama</th><th>NIK</th><th>Hubungan</th><th>Tgl Lahir</th><th>Agama</th><th className="text-center">Aksi</th></tr>
                    </thead>
                    <tbody>
                      {data.families.find(f => f.id === selectedUser.id)?.members?.map(m => (
                        <tr key={m.id}>
                          <td className="ps-4 fw-bold text-primary">{m.name}</td><td className="text-muted small">{m.nik}</td>
                          <td><span className={`badge px-2 border py-1 ${(m.relationship || "").includes("KEPALA") ? "bg-primary" : (m.relationship || "").includes("ISTRI") ? "bg-success" : "bg-info-subtle text-info"}`}>{m.relationship || "Belum Set"}</span></td>
                          <td className="fw-bold">{formatTanggal(m.dateOfBirth)}</td><td>{m.religion || "Islam"}</td>
                          <td className="text-center"><button className="btn btn-sm text-danger" onClick={() => window.confirm("Hapus warga?") && deleteCitizen({ variables: { id: m.id } })}><FaTrash /></button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;