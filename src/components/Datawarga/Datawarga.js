import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import * as XLSX from 'xlsx'; // IMPORT LIBRARY EXCEL
import { GET_WARGA } from '../../graphql/userQueries';
import { CREATE_FAMILY, DELETE_FAMILY, ADD_CITIZEN, UPDATE_FAMILY, UPDATE_CITIZEN, DELETE_CITIZEN } from '../../graphql/userMutations';
import { FaEye, FaEdit, FaTrash, FaUserPlus, FaUsers, FaIdCard, FaSearch, FaTimes, FaSave, FaUndo, FaFileExcel } from 'react-icons/fa'; // Tambah Icon Excel
import Swal from 'sweetalert2'; 
import './Datawarga.css';

const DataWarga = () => {
  // --- STATE ---
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals
  const [selectedFamilyId, setSelectedFamilyId] = useState(null); 
  const [showAddKKModal, setShowAddKKModal] = useState(false);
  const [showEditKKModal, setShowEditKKModal] = useState(false);

  // Forms
  const [newKK, setNewKK] = useState({ kepalaKeluarga: '', noKK: '', address: '', ownershipStatus: 'OWNED' });
  const [editKK, setEditKK] = useState({ id: '', kepalaKeluarga: '', noKK: '', address: '', ownershipStatus: '' });
  const [memberForm, setMemberForm] = useState({ id: null, name: '', nik: '', relationship: 'Anak', dateOfBirth: '', gender: 'L' });
  const [isEditingMember, setIsEditingMember] = useState(false);

  // --- QUERY ---
  const { data, loading, error, refetch } = useQuery(GET_WARGA, {
    pollInterval: 0,
    fetchPolicy: "network-only"
  });

  const selectedFamily = selectedFamilyId ? data?.families.find(f => f.id === selectedFamilyId) : null;

  // --- MUTATIONS (SAMA SEPERTI SEBELUMNYA) ---
  const [createFamily] = useMutation(CREATE_FAMILY, {
    onCompleted: () => { Swal.fire('Sukses', 'KK berhasil dibuat!', 'success'); setShowAddKKModal(false); setNewKK({ kepalaKeluarga: '', noKK: '', address: '', ownershipStatus: 'OWNED' }); refetch(); },
    onError: (err) => Swal.fire('Gagal', err.message, 'error')
  });

  const [updateFamily] = useMutation(UPDATE_FAMILY, {
    onCompleted: () => { Swal.fire('Berhasil', 'KK diperbarui!', 'success'); setShowEditKKModal(false); refetch(); },
    onError: (err) => Swal.fire('Gagal', err.message, 'error')
  });

  const [deleteFamily] = useMutation(DELETE_FAMILY, {
    onCompleted: () => { Swal.fire('Terhapus!', 'KK dihapus.', 'success'); refetch(); },
    onError: (err) => Swal.fire('Gagal', err.message, 'error')
  });

  const [addCitizen] = useMutation(ADD_CITIZEN, {
    onCompleted: async () => { await refetch(); Swal.fire('Sukses', 'Anggota ditambahkan!', 'success'); resetMemberForm(); },
    onError: (err) => Swal.fire('Gagal Tambah', err.message, 'error')
  });

  const [updateCitizen] = useMutation(UPDATE_CITIZEN, {
    onCompleted: async () => { await refetch(); Swal.fire('Berhasil', 'Data Anggota diupdate!', 'success'); resetMemberForm(); },
    onError: (err) => Swal.fire('Gagal Update', err.message, 'error')
  });

  const [deleteCitizen] = useMutation(DELETE_CITIZEN, {
    onCompleted: async () => { await refetch(); Swal.fire('Terhapus', 'Anggota dihapus.', 'success'); },
    onError: (err) => Swal.fire('Gagal Hapus', err.message, 'error')
  });

  // --- FITUR BARU: EXPORT TO EXCEL ---
  const handleExportExcel = () => {
    if (!data?.families) return Swal.fire('Info', 'Belum ada data untuk diexport', 'info');

    // 1. Ratakan Data (Flatten Data) agar rapi di Excel
    const flatData = [];
    data.families.forEach(fam => {
      // Jika KK punya anggota, masukkan per baris
      if (fam.members.length > 0) {
        fam.members.forEach(member => {
          flatData.push({
            'No. KK': fam.noKK,
            'Kepala Keluarga': fam.kepalaKeluarga,
            'Alamat': fam.address,
            'Status Rumah': fam.ownershipStatus,
            'Nama Anggota': member.name,
            'NIK': member.nik,
            'Gender': member.gender,
            'Hubungan': member.relationship,
            'Tgl Lahir': formatDate(member.dateOfBirth),
            'Usia': calculateAge(member.dateOfBirth)
          });
        });
      } else {
        // Jika KK kosong (belum ada anggota)
        flatData.push({
          'No. KK': fam.noKK,
          'Kepala Keluarga': fam.kepalaKeluarga,
          'Alamat': fam.address,
          'Status Rumah': fam.ownershipStatus,
          'Nama Anggota': '-', 'NIK': '-', 'Gender': '-', 'Hubungan': '-', 'Tgl Lahir': '-', 'Usia': '-'
        });
      }
    });

    // 2. Buat Workbook
    const worksheet = XLSX.utils.json_to_sheet(flatData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan Data Warga");

    // 3. Download File
    XLSX.writeFile(workbook, `Laporan_Warga_RT14_${new Date().toISOString().slice(0,10)}.xlsx`);
    
    Swal.fire('Berhasil', 'Laporan Excel berhasil didownload!', 'success');
  };

  // --- HANDLERS LAINNYA ---
  const resetMemberForm = () => { setMemberForm({ id: null, name: '', nik: '', relationship: 'Anak', dateOfBirth: '', gender: 'L' }); setIsEditingMember(false); };
  const handleOpenEditKK = (family) => { setEditKK({ ...family }); setShowEditKKModal(true); };
  const handleUpdateKK = (e) => { e.preventDefault(); updateFamily({ variables: { ...editKK } }); };
  const handleCreateKK = (e) => { e.preventDefault(); createFamily({ variables: { ...newKK } }); };
  
  const handleDeleteKK = (id) => {
    Swal.fire({ title: 'Hapus KK?', text: "Data anggota juga hilang!", icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33', confirmButtonText: 'Ya, Hapus!' })
    .then((res) => { if (res.isConfirmed) deleteFamily({ variables: { id } }); });
  };

  const handleEditMemberClick = (member) => {
    let formattedDate = '';
    if (member.dateOfBirth) {
       const d = parseDate(member.dateOfBirth);
       if (d) formattedDate = d.toISOString().split('T')[0];
    }
    setMemberForm({ id: member.id, name: member.name, nik: member.nik, relationship: member.relationship, gender: member.gender || 'L', dateOfBirth: formattedDate });
    setIsEditingMember(true);
    const formCard = document.querySelector('.form-card');
    if(formCard) formCard.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmitMember = (e) => {
    e.preventDefault();
    if(!selectedFamilyId) return;
    const payload = { ...memberForm };
    if (isEditingMember) updateCitizen({ variables: { ...payload } });
    else addCitizen({ variables: { familyId: selectedFamilyId, ...payload, address: 'Bogor', religion: 'Islam', profession: '-', placeOfBirth: 'Bogor' } });
  };

  const handleDeleteMember = (id) => {
    Swal.fire({ title: 'Hapus Anggota?', text: "Data tidak bisa dikembalikan!", icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33', confirmButtonText: 'Ya, Hapus!' })
    .then((res) => { if (res.isConfirmed) deleteCitizen({ variables: { id } }); });
  };

  // Logic Tanggal & Umur
  const parseDate = (val) => {
    if (!val) return null;
    const isTimestamp = /^-?\d+$/.test(String(val));
    const date = new Date(isTimestamp ? Number(val) : val);
    return isNaN(date.getTime()) ? null : date;
  };
  const formatDate = (val) => { const date = parseDate(val); return date ? date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : "-"; };
  const calculateAge = (val) => { const date = parseDate(val); if(!date) return "-"; const age = new Date().getFullYear() - date.getFullYear(); return age; };

  const filteredFamilies = data?.families.filter(f => 
    f.kepalaKeluarga.toLowerCase().includes(searchTerm.toLowerCase()) || f.noKK.includes(searchTerm)
  );

  if (loading) return <div className="p-5 text-center">🔄 Loading data...</div>;

  return (
    <div className="dw-page">
      {/* HEADER & TOOLBAR */}
      <div className="row mb-4">
        <div className="col-md-6 mb-3">
          <div className="warga-card gradient-blue p-4 text-white">
            <h2 className="fw-bold">{data?.families.length || 0} Keluarga</h2>
            <p className="opacity-75 mb-0">Total KK Terdaftar</p>
            <FaIdCard style={{position:'absolute', right:20, bottom:20, fontSize:'4rem', opacity:0.2}}/>
          </div>
        </div>
        <div className="col-md-6 mb-3">
          <div className="warga-card gradient-green p-4 text-white">
            <h2 className="fw-bold">{data?.families.reduce((acc, curr) => acc + curr.members.length, 0) || 0} Orang</h2>
            <p className="opacity-75 mb-0">Total Warga</p>
            <FaUsers style={{position:'absolute', right:20, bottom:20, fontSize:'4rem', opacity:0.2}}/>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div className="position-relative flex-grow-1" style={{maxWidth:'500px'}}>
          <FaSearch className="position-absolute top-50 translate-middle-y ms-3 text-secondary"/>
          <input className="dw-input ps-5" placeholder="Cari Nama Kepala Keluarga / No. KK..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
        
        {/* BUTTON GROUP (EXPORT & ADD) */}
        <div className="d-flex gap-2">
          {/* TOMBOL EXPORT BARU */}
          <button className="btn-warga-primary" onClick={handleExportExcel} style={{backgroundColor: '#10B981', maxWidth:'180px'}}>
            <FaFileExcel className="me-2"/> EXPORT EXCEL
          </button>
          
          <button className="btn-warga-primary" onClick={() => setShowAddKKModal(true)} style={{maxWidth:'180px'}}>
            <FaUserPlus className="me-2"/> TAMBAH KK
          </button>
        </div>
      </div>

      {/* TABLE UTAMA */}
      <div className="table-warga-container">
        <table className="table table-hover align-middle mb-0" style={{width:'100%'}}>
          <thead className="table-warga-header">
            <tr>
              <th>No KK</th><th>Kepala Keluarga</th><th>Alamat</th><th className="text-center">Status</th><th className="text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredFamilies?.map(fam => (
              <tr key={fam.id}>
                <td className="fw-bold text-secondary">{fam.noKK}</td>
                <td className="fw-bold text-primary">{fam.kepalaKeluarga}</td>
                <td className="small text-muted">{fam.address}</td>
                <td className="text-center"><span className={`badge-pill ${fam.ownershipStatus === 'OWNED' ? 'badge-owned' : 'badge-rent'}`}>{fam.ownershipStatus}</span></td>
                <td className="text-center">
                  <button className="btn-action-circle text-primary" onClick={() => { setSelectedFamilyId(fam.id); resetMemberForm(); }}><FaEye/></button>
                  <button className="btn-action-circle text-warning" onClick={() => handleOpenEditKK(fam)}><FaEdit/></button>
                  <button className="btn-action-circle text-danger" onClick={() => handleDeleteKK(fam.id)}><FaTrash/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL 1 & 2 (ADD/EDIT KK) - SAMA PERSIS SEBELUMNYA */}
      {showAddKKModal && (
        <div className="modal-overlay" onClick={() => setShowAddKKModal(false)}>
          <div className="modal-container modal-small" onClick={e => e.stopPropagation()}>
            <div className="modal-header-blue">
              <h5 className="mb-0 fw-bold"><FaUserPlus className="me-2"/> Tambah KK</h5>
              <FaTimes className="cursor-pointer" onClick={() => setShowAddKKModal(false)}/>
            </div>
            <div className="modal-body">
              <form onSubmit={handleCreateKK} className="d-grid gap-3">
                <div><label className="small fw-bold">Kepala Keluarga</label><input className="dw-input" required value={newKK.kepalaKeluarga} onChange={e => setNewKK({...newKK, kepalaKeluarga: e.target.value})} /></div>
                <div><label className="small fw-bold">No KK</label><input className="dw-input" required value={newKK.noKK} onChange={e => setNewKK({...newKK, noKK: e.target.value})} /></div>
                <div><label className="small fw-bold">Alamat</label><input className="dw-input" required value={newKK.address} onChange={e => setNewKK({...newKK, address: e.target.value})} /></div>
                <div>
                  <label className="small fw-bold">Status</label>
                  <select className="dw-input" value={newKK.ownershipStatus} onChange={e => setNewKK({...newKK, ownershipStatus: e.target.value})}>
                    <option value="OWNED">Milik Sendiri</option><option value="RENT">Kontrak</option><option value="OFFICIAL">Dinas</option>
                  </select>
                </div>
                <button type="submit" className="btn-warga-primary mt-3">SIMPAN</button>
              </form>
            </div>
          </div>
        </div>
      )}

      {showEditKKModal && (
        <div className="modal-overlay" onClick={() => setShowEditKKModal(false)}>
          <div className="modal-container modal-small" onClick={e => e.stopPropagation()}>
            <div className="modal-header-blue" style={{background:'#fbc531', color:'#333'}}>
              <h5 className="mb-0 fw-bold"><FaEdit className="me-2"/> Edit KK</h5>
              <FaTimes className="cursor-pointer" onClick={() => setShowEditKKModal(false)}/>
            </div>
            <div className="modal-body">
              <form onSubmit={handleUpdateKK} className="d-grid gap-3">
                <div><label className="small fw-bold">Kepala Keluarga</label><input className="dw-input" required value={editKK.kepalaKeluarga} onChange={e => setEditKK({...editKK, kepalaKeluarga: e.target.value})} /></div>
                <div><label className="small fw-bold">No KK</label><input className="dw-input" required value={editKK.noKK} onChange={e => setEditKK({...editKK, noKK: e.target.value})} /></div>
                <div><label className="small fw-bold">Alamat</label><input className="dw-input" required value={editKK.address} onChange={e => setEditKK({...editKK, address: e.target.value})} /></div>
                <div>
                  <label className="small fw-bold">Status</label>
                  <select className="dw-input" value={editKK.ownershipStatus} onChange={e => setEditKK({...editKK, ownershipStatus: e.target.value})}>
                    <option value="OWNED">Milik Sendiri</option><option value="RENT">Kontrak</option><option value="OFFICIAL">Dinas</option>
                  </select>
                </div>
                <button type="submit" className="btn-warga-primary mt-3" style={{background:'#fbc531', color:'#333'}}>UPDATE</button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: DETAIL ANGGOTA + EDIT FEATURE */}
      {selectedFamily && (
        <div className="modal-overlay" onClick={() => setSelectedFamilyId(null)}>
          <div className="modal-container modal-large" onClick={e => e.stopPropagation()}>
            <div className="modal-header-blue">
              <div>
                <h5 className="mb-0 fw-bold"><FaUsers className="me-2"/> {selectedFamily.kepalaKeluarga}</h5>
                <small className="opacity-75">No KK: {selectedFamily.noKK}</small>
              </div>
              <FaTimes className="cursor-pointer fs-4" onClick={() => setSelectedFamilyId(null)}/>
            </div>

            <div className="modal-body">
              <div className="form-card" style={{borderTop: isEditingMember ? '4px solid #fbc531' : '4px solid #0d6efd'}}>
                <h6 className="fw-bold mb-3 border-bottom pb-2" style={{color: isEditingMember ? '#e1b12c' : '#0d6efd'}}>
                  {isEditingMember ? <><FaEdit className="me-2"/> Edit Anggota</> : <><FaUserPlus className="me-2"/> Registrasi Anggota Baru</>}
                </h6>
                <form onSubmit={handleSubmitMember}>
                  <div className="custom-form-grid">
                    <div>
                      <label className="small fw-bold text-muted mb-1">Nama Lengkap</label>
                      <input className="dw-input" required value={memberForm.name} onChange={e => setMemberForm({...memberForm, name: e.target.value})} placeholder="Nama"/>
                    </div>
                    <div>
                      <label className="small fw-bold text-muted mb-1">NIK</label>
                      <input className="dw-input" required value={memberForm.nik} onChange={e => setMemberForm({...memberForm, nik: e.target.value})} placeholder="NIK"/>
                    </div>
                    <div>
                        <label className="small fw-bold text-muted mb-1">Gender</label>
                        <select className="dw-input" value={memberForm.gender} onChange={e => setMemberForm({...memberForm, gender: e.target.value})}>
                            <option value="L">Laki-laki</option><option value="P">Perempuan</option>
                        </select>
                    </div>
                    <div>
                      <label className="small fw-bold text-muted mb-1">Hubungan</label>
                      <select className="dw-input" value={memberForm.relationship} onChange={e => setMemberForm({...memberForm, relationship: e.target.value})}>
                        <option>Anak</option><option>Istri</option><option>Suami</option><option>Famili</option><option>Kepala Keluarga</option>
                      </select>
                    </div>
                    <div>
                      <label className="small fw-bold text-muted mb-1">Tgl Lahir</label>
                      <input type="date" className="dw-input" required value={memberForm.dateOfBirth} onChange={e => setMemberForm({...memberForm, dateOfBirth: e.target.value})} />
                    </div>
                    <div>
                        <label className="d-block mb-1">&nbsp;</label>
                        <div className="d-flex gap-2">
                          <button type="submit" className="btn-warga-primary shadow-sm" style={{background: isEditingMember ? '#fbc531' : '#ff4757', color: isEditingMember ? '#333' : 'white'}}>
                              <FaSave className="me-2"/> {isEditingMember ? 'UPDATE' : 'SIMPAN'}
                          </button>
                          {isEditingMember && (
                            <button type="button" className="btn btn-secondary" onClick={resetMemberForm}>
                              <FaUndo/> Batal
                            </button>
                          )}
                        </div>
                    </div>
                  </div>
                </form>
              </div>

              <div className="table-responsive border rounded-3 bg-white mt-4">
                <table className="table table-hover mb-0">
                  <thead className="bg-light text-secondary small text-uppercase">
                    <tr>
                      <th className="p-3">Nama</th><th className="p-3">NIK</th><th className="p-3">L/P</th><th className="p-3">Hubungan</th><th className="p-3">Tgl Lahir</th><th className="p-3 text-center">Usia</th><th className="p-3 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedFamily.members.map((m) => (
                      <tr key={m.id} className={isEditingMember && memberForm.id === m.id ? "table-warning" : ""}>
                        <td className="fw-bold text-primary p-3">{m.name}</td>
                        <td className="text-muted p-3 small">{m.nik}</td>
                        <td className="p-3">{m.gender === 'L' ? 'L' : 'P'}</td>
                        <td className="p-3"><span className="badge bg-info bg-opacity-10 text-dark px-2">{m.relationship}</span></td>
                        <td className="p-3 small">{formatDate(m.dateOfBirth)}</td>
                        <td className="p-3 text-center"><span className="badge bg-success rounded-pill px-3">{calculateAge(m.dateOfBirth)} Thn</span></td>
                        <td className="p-3 text-center">
                          <button className="btn-action-circle text-warning border-warning" onClick={() => handleEditMemberClick(m)} title="Edit">
                            <FaEdit/>
                          </button>
                          <button className="btn-action-circle text-danger border-danger ms-2" onClick={() => handleDeleteMember(m.id)} title="Hapus">
                            <FaTrash/>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="p-3 bg-white border-top text-end">
              <button className="btn btn-secondary btn-sm px-4" onClick={() => setSelectedFamilyId(null)}>Tutup</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataWarga;