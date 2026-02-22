import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import * as XLSX from 'xlsx'; 
import { GET_WARGA } from '../../graphql/userQueries';
import { CREATE_FAMILY, DELETE_FAMILY, ADD_CITIZEN, UPDATE_FAMILY, UPDATE_CITIZEN, DELETE_CITIZEN } from '../../graphql/userMutations';
import { FaEye, FaEdit, FaTrash, FaUserPlus, FaUsers, FaIdCard, FaSearch, FaTimes, FaSave, FaUndo, FaWhatsapp, FaInfoCircle, FaListUl } from 'react-icons/fa'; 
import Swal from 'sweetalert2'; 
import './Datawarga.css';

// Fungsi global agar SweetAlert selalu tampil paling depan
const fireSwal = (options) => {
  return Swal.fire({
    ...options,
    didOpen: () => {
      const swalContainer = document.querySelector('.swal2-container');
      if (swalContainer) swalContainer.style.zIndex = '999999';
    }
  });
};

const DataWarga = () => {
  // --- 1. STATES ---
  const [searchTerm, setSearchTerm] = useState('');
  const [searchWargaTerm, setSearchWargaTerm] = useState('');
  const [selectedFamilyId, setSelectedFamilyId] = useState(null); 
  
  const [showAddKKModal, setShowAddKKModal] = useState(false);
  const [showEditKKModal, setShowEditKKModal] = useState(false);
  const [showSearchWargaModal, setShowSearchWargaModal] = useState(false);
  const [showAllKKModal, setShowAllKKModal] = useState(false);
  
  const [selectedCitizenDetail, setSelectedCitizenDetail] = useState(null);

  const [newKK, setNewKK] = useState({ kepalaKeluarga: '', noKK: '', address: '', ownershipStatus: 'OWNED' });
  const [editKK, setEditKK] = useState({ id: '', kepalaKeluarga: '', noKK: '', address: '', ownershipStatus: '' });
  
  const [memberForm, setMemberForm] = useState({ 
    id: null, name: '', nik: '', relationship: 'Anak', dateOfBirth: '', gender: 'L', 
    phone: '', insurance: 'BPJS Mandiri' 
  });
  const [isEditingMember, setIsEditingMember] = useState(false);

  // --- 2. DATA FETCHING ---
  const { data, loading, error, refetch } = useQuery(GET_WARGA, {
    pollInterval: 0,
    fetchPolicy: "network-only"
  });

  // --- 3. MUTATIONS ---
  const [createFamily] = useMutation(CREATE_FAMILY, { onCompleted: () => { fireSwal({title:'Sukses', text:'KK Dibuat!', icon:'success'}); setShowAddKKModal(false); refetch(); }});
  const [updateFamily] = useMutation(UPDATE_FAMILY, { onCompleted: () => { fireSwal({title:'Berhasil', text:'KK Diperbarui!', icon:'success'}); setShowEditKKModal(false); refetch(); }});
  const [deleteFamily] = useMutation(DELETE_FAMILY, { onCompleted: () => { fireSwal({title:'Terhapus!', text:'KK dihapus.', icon:'success'}); refetch(); }});
  const [addCitizen] = useMutation(ADD_CITIZEN, { onCompleted: () => { refetch(); resetMemberForm(); }});
  const [updateCitizen] = useMutation(UPDATE_CITIZEN, { onCompleted: () => { refetch(); resetMemberForm(); }});
  const [deleteCitizen] = useMutation(DELETE_CITIZEN, { onCompleted: () => { refetch(); }});

  // --- 4. LOGIKA DATA ---
  const allCitizens = data?.families.flatMap(fam => 
    fam.members.map(m => ({ ...m, familyName: fam.kepalaKeluarga, familyNoKK: fam.noKK, familyId: fam.id }))
  ) || [];

  const filteredFamilies = data?.families.filter(f => {
    const s = searchTerm.toLowerCase();
    return f.kepalaKeluarga.toLowerCase().includes(s) || f.noKK.includes(s) || (f.address && f.address.toLowerCase().includes(s));
  }).sort((a, b) => b.id.localeCompare(a.id));

  const displayFamilies = filteredFamilies?.slice(0, 10);
  const selectedFamily = selectedFamilyId ? data?.families.find(f => f.id === selectedFamilyId) : null;

  const filteredCitizens = allCitizens.filter(c => 
    c.name.toLowerCase().includes(searchWargaTerm.toLowerCase()) || c.nik.includes(searchWargaTerm)
  ).slice(0, 15);

  // --- 5. HANDLERS ---
  const handleCreateKK = (e) => { e.preventDefault(); createFamily({ variables: { ...newKK } }); };
  const handleUpdateKK = (e) => { e.preventDefault(); updateFamily({ variables: { ...editKK } }); };
  const handleDeleteKK = (id) => {
    fireSwal({ title: 'Hapus KK?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33', confirmButtonText: 'Ya, Hapus!' })
    .then((res) => { if (res.isConfirmed) deleteFamily({ variables: { id } }); });
  };

  const parseDate = (val) => {
    if (!val) return null;
    const isTimestamp = /^-?\d+$/.test(String(val));
    const date = new Date(isTimestamp ? Number(val) : val);
    return isNaN(date.getTime()) ? null : date;
  };
  const calculateAge = (val) => { const date = parseDate(val); if(!date) return "-"; return new Date().getFullYear() - date.getFullYear(); };
  const formatDateForInput = (val) => { const d = parseDate(val); return d ? d.toISOString().split('T')[0] : ''; };
  const formatDateForDisplay = (val) => { const d = parseDate(val); return d ? d.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }) : '-'; };

  const resetMemberForm = () => { 
    setMemberForm({ id: null, name: '', nik: '', relationship: 'Anak', dateOfBirth: '', gender: 'L', phone: '', insurance: 'BPJS Mandiri' }); 
    setIsEditingMember(false); 
  };

  // FIX UNTUK TOMBOL EDIT: Auto Scroll ke atas ke arah form
  const handleEditMemberClick = (member) => {
    setMemberForm({ 
      id: member.id, name: member.name, nik: member.nik, relationship: member.relationship, 
      gender: member.gender || 'L', dateOfBirth: formatDateForInput(member.dateOfBirth),
      phone: member.phone || '', insurance: member.insurance || 'BPJS Mandiri' 
    });
    setIsEditingMember(true);
    
    // Auto-scroll ke bagian form agar user sadar formnya berubah
    const formElement = document.getElementById('form-tambah-anggota');
    if(formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSubmitMember = (e) => {
    e.preventDefault();
    if(!selectedFamilyId) return;
    const payload = { ...memberForm };
    if (isEditingMember) updateCitizen({ variables: { ...payload } });
    else addCitizen({ variables: { familyId: selectedFamilyId, ...payload, address: 'Bogor', religion: 'Islam', profession: '-', placeOfBirth: 'Bogor' } });
  };

  const handleDeleteMember = (id) => {
    fireSwal({ title: 'Hapus Anggota?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33', confirmButtonText: 'Ya, Hapus!' })
    .then((res) => { if (res.isConfirmed) deleteCitizen({ variables: { id } }); });
  };

  if (loading) return <div className="p-5 text-center">🔄 Memuat Data RT 14...</div>;

  return (
    <div className="dw-page">
      {/* HEADER CARDS */}
      <div className="row mb-4">
        <div className="col-md-6 mb-3">
          <div className="warga-card gradient-blue p-4 text-white cursor-pointer hover-effect" onClick={() => setShowAllKKModal(true)}>
            <h2 className="fw-bold">{data?.families.length || 0} Keluarga</h2>
            <p className="opacity-75 mb-0">Total KK Terdaftar (Klik Lihat Semua)</p>
            <FaIdCard className="card-bg-icon"/>
          </div>
        </div>
        <div className="col-md-6 mb-3">
          <div className="warga-card gradient-green p-4 text-white cursor-pointer hover-effect" onClick={() => setShowSearchWargaModal(true)}>
            <h2 className="fw-bold">{allCitizens.length} Orang</h2>
            <p className="opacity-75 mb-0">Total Warga (Klik Cari NIK/Nama)</p>
            <FaUsers className="card-bg-icon"/>
          </div>
        </div>
      </div>

      {/* DASHBOARD SEARCH & ADD KK */}
      <div className="d-flex justify-content-between align-items-center mb-4 gap-3">
        <div className="position-relative flex-grow-1" style={{maxWidth:'500px'}}>
          <FaSearch className="position-absolute top-50 translate-middle-y ms-3 text-secondary"/>
          <input className="dw-input ps-5" placeholder="Cari di dashboard..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
        <button className="btn-warga-primary" onClick={() => setShowAddKKModal(true)}><FaUserPlus className="me-2"/> TAMBAH KK</button>
      </div>

      {/* TABEL UTAMA */}
      <div className="table-warga-container">
        <h6 className="fw-bold mb-3"><FaListUl className="me-2"/> 10 Daftar Keluarga Terbaru</h6>
        <table className="table table-hover align-middle mb-0">
          <thead className="table-warga-header">
            <tr><th>No KK</th><th>Kepala Keluarga</th><th>Alamat</th><th className="text-center">Aksi</th></tr>
          </thead>
          <tbody>
            {displayFamilies?.map(fam => (
              <tr key={fam.id}>
                <td>{fam.noKK}</td>
                <td className="fw-bold text-primary">{fam.kepalaKeluarga}</td>
                <td className="small text-muted">{fam.address}</td>
                <td className="text-center">
                  <button className="btn-action-circle text-primary" title="Lihat" onClick={() => { setSelectedFamilyId(fam.id); resetMemberForm(); }}><FaEye/></button>
                  <button className="btn-action-circle text-warning" title="Edit" onClick={() => { setEditKK(fam); setShowEditKKModal(true); }}><FaEdit/></button>
                  <button className="btn-action-circle text-danger" title="Hapus" onClick={() => handleDeleteKK(fam.id)}><FaTrash/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- MODAL CARI WARGA INDIVIDU --- */}
      {showSearchWargaModal && (
        <div className="modal-overlay" onClick={() => setShowSearchWargaModal(false)}>
          <div className="modal-container modal-large" onClick={e => e.stopPropagation()}>
            <div className="modal-header-blue" style={{background:'#198754'}}>
              <h5 className="mb-0 fw-bold"><FaSearch className="me-2"/> Cari Warga (NIK/Nama)</h5>
              <FaTimes className="cursor-pointer" onClick={() => setShowSearchWargaModal(false)}/>
            </div>
            <div className="modal-body">
              <input autoFocus className="dw-input mb-3 py-3" placeholder="Ketik Nama atau NIK..." value={searchWargaTerm} onChange={e => setSearchWargaTerm(e.target.value)} />
              <div className="table-responsive border rounded-3">
                <table className="table table-hover mb-0 align-middle">
                  <thead className="bg-light">
                    <tr><th>Nama</th><th>NIK</th><th className="text-end pe-4">Aksi</th></tr>
                  </thead>
                  <tbody>
                    {filteredCitizens.map(c => (
                      <tr key={c.id}>
                        <td className="fw-bold text-success">{c.name}</td>
                        <td className="text-muted">{c.nik}</td>
                        <td className="text-end pe-3">
                          <button 
                            className="btn btn-sm btn-info text-white me-2" 
                            onClick={() => setSelectedCitizenDetail(c)}
                          >
                            <FaInfoCircle className="me-1"/> Detail
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-success" 
                            onClick={() => { setSelectedFamilyId(c.familyId); setShowSearchWargaModal(false); }}
                          >
                            Lihat KK
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL POPUP DETAIL WARGA (FIX Z-INDEX TERTINGGI) --- */}
      {selectedCitizenDetail && (
        <div 
          className="modal-overlay" 
          style={{ zIndex: 99999 }} 
          onClick={() => setSelectedCitizenDetail(null)}
        >
          <div 
            className="modal-container modal-small" 
            style={{ zIndex: 999999 }} 
            onClick={e => e.stopPropagation()}
          >
            <div className="modal-header-blue" style={{background: '#0dcaf0', color: '#000'}}>
              <h5 className="mb-0 fw-bold"><FaIdCard className="me-2"/> Biodata Lengkap Warga</h5>
              <FaTimes className="cursor-pointer fs-4" onClick={() => setSelectedCitizenDetail(null)}/>
            </div>
            <div className="modal-body">
              <div className="bg-light p-4 rounded-3 border">
                <table className="table table-sm table-borderless mb-0">
                  <tbody>
                    <tr><td className="text-muted" width="45%">Nama Lengkap</td><td className="fw-bold">: {selectedCitizenDetail.name}</td></tr>
                    <tr><td className="text-muted">NIK</td><td className="fw-bold">: {selectedCitizenDetail.nik}</td></tr>
                    <tr><td className="text-muted">Jenis Kelamin</td><td className="fw-bold">: {selectedCitizenDetail.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</td></tr>
                    <tr><td className="text-muted">Tempat, Tgl Lahir</td><td className="fw-bold">: {selectedCitizenDetail.placeOfBirth}, {formatDateForDisplay(selectedCitizenDetail.dateOfBirth)}</td></tr>
                    <tr><td className="text-muted">Agama</td><td className="fw-bold">: {selectedCitizenDetail.religion || '-'}</td></tr>
                    <tr><td className="text-muted">Pekerjaan</td><td className="fw-bold">: {selectedCitizenDetail.profession || '-'}</td></tr>
                    <tr><td className="text-muted">Alamat KK</td><td className="fw-bold">: {selectedCitizenDetail.address || '-'}</td></tr>
                    <tr><td className="text-muted">Status dlm Keluarga</td><td className="fw-bold">: {selectedCitizenDetail.relationship}</td></tr>
                    <tr>
                      <td className="text-muted">No. Handphone</td>
                      <td className="fw-bold text-success">: {selectedCitizenDetail.phone ? (
                        <a href={`https://wa.me/${selectedCitizenDetail.phone}`} target="_blank" rel="noreferrer" className="text-success text-decoration-none"><FaWhatsapp/> {selectedCitizenDetail.phone}</a>
                      ) : '-'}</td>
                    </tr>
                    <tr><td className="text-muted">Jaminan Kesehatan</td><td className="fw-bold text-primary">: {selectedCitizenDetail.insurance || 'Tidak Ada/Belum Terdata'}</td></tr>
                  </tbody>
                </table>
              </div>
              <div className="text-end mt-4">
                <button className="btn btn-secondary px-4" onClick={() => setSelectedCitizenDetail(null)}>Tutup</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: LIHAT SEMUA KK */}
      {showAllKKModal && (
        <div className="modal-overlay" onClick={() => setShowAllKKModal(false)}>
          <div className="modal-container modal-large" onClick={e => e.stopPropagation()}>
            <div className="modal-header-blue">
              <h5 className="mb-0 fw-bold"><FaIdCard className="me-2"/> Seluruh Daftar KK RT 14</h5>
              <FaTimes className="cursor-pointer" onClick={() => setShowAllKKModal(false)}/>
            </div>
            <div className="modal-body p-0">
              <div style={{maxHeight: '60vh', overflowY: 'auto'}}>
                <table className="table table-hover mb-0">
                  <thead className="sticky-top bg-white">
                    <tr><th className="ps-4">No. KK</th><th>Kepala Keluarga</th><th className="text-center">Aksi</th></tr>
                  </thead>
                  <tbody>
                    {filteredFamilies.map(fam => (
                      <tr key={fam.id}>
                        <td className="ps-4">{fam.noKK}</td>
                        <td className="fw-bold">{fam.kepalaKeluarga}</td>
                        <td className="text-center">
                          <button className="btn btn-sm btn-primary" onClick={() => { setSelectedFamilyId(fam.id); setShowAllKKModal(false); }}>Buka Detail</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: TAMBAH KK */}
      {showAddKKModal && (
        <div className="modal-overlay" onClick={() => setShowAddKKModal(false)}>
          <div className="modal-container modal-small" onClick={e => e.stopPropagation()}>
            <div className="modal-header-blue">
              <h5 className="mb-0 fw-bold">Tambah KK Baru</h5>
              <FaTimes className="cursor-pointer" onClick={() => setShowAddKKModal(false)}/>
            </div>
            <div className="modal-body">
              <form onSubmit={handleCreateKK} className="d-grid gap-3">
                <input className="dw-input" placeholder="Nama Kepala Keluarga" required onChange={e => setNewKK({...newKK, kepalaKeluarga: e.target.value})} />
                <input className="dw-input" placeholder="Nomor KK" required onChange={e => setNewKK({...newKK, noKK: e.target.value})} />
                <input className="dw-input" placeholder="Alamat Lengkap" required onChange={e => setNewKK({...newKK, address: e.target.value})} />
                <button type="submit" className="btn-warga-primary w-100">SIMPAN DATA</button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: DETAIL KELUARGA (VIEW & EDIT MEMBERS) */}
      {selectedFamily && (
        <div className="modal-overlay" onClick={() => setSelectedFamilyId(null)}>
          <div className="modal-container modal-large" onClick={e => e.stopPropagation()}>
            <div className="modal-header-blue">
              <h5 className="mb-0 fw-bold"><FaUsers className="me-2"/> Detail KK: {selectedFamily.kepalaKeluarga}</h5>
              <FaTimes className="cursor-pointer fs-4" onClick={() => setSelectedFamilyId(null)}/>
            </div>
            <div className="modal-body p-4">
              <div className="mb-4 pb-3 border-bottom">
                 <strong className="text-muted">No KK:</strong> <span className="fw-bold">{selectedFamily.noKK}</span> &nbsp;|&nbsp; 
                 <strong className="text-muted">Alamat:</strong> {selectedFamily.address}
              </div>

              {/* FORM TAMBAH/EDIT ANGGOTA DENGAN ID UNTUK AUTO-SCROLL */}
              <div id="form-tambah-anggota" className="bg-light p-4 rounded-3 border mb-4">
                <h6 className="fw-bold mb-3 text-primary">{isEditingMember ? 'Edit Data Warga' : 'Registrasi Anggota Baru'}</h6>
                <form onSubmit={handleSubmitMember}>
                  <div className="row g-3">
                    <div className="col-md-4"><label className="small fw-bold text-muted mb-1">Nama Lengkap</label><input className="dw-input" required value={memberForm.name} onChange={e => setMemberForm({...memberForm, name: e.target.value})} /></div>
                    <div className="col-md-4"><label className="small fw-bold text-muted mb-1">NIK</label><input className="dw-input" required value={memberForm.nik} onChange={e => setMemberForm({...memberForm, nik: e.target.value})} /></div>
                    <div className="col-md-4">
                        <label className="small fw-bold text-muted mb-1">Gender</label>
                        <select className="dw-input" value={memberForm.gender} onChange={e => setMemberForm({...memberForm, gender: e.target.value})}>
                            <option value="L">Laki-laki</option><option value="P">Perempuan</option>
                        </select>
                    </div>
                    <div className="col-md-3">
                      <label className="small fw-bold text-muted mb-1">Hubungan</label>
                      <select className="dw-input" value={memberForm.relationship} onChange={e => setMemberForm({...memberForm, relationship: e.target.value})}>
                        <option>Kepala Keluarga</option><option>Istri</option><option>Suami</option><option>Anak</option><option>Famili</option>
                      </select>
                    </div>
                    <div className="col-md-3"><label className="small fw-bold text-muted mb-1">Tgl Lahir</label><input type="date" className="dw-input" required value={memberForm.dateOfBirth} onChange={e => setMemberForm({...memberForm, dateOfBirth: e.target.value})} /></div>
                    <div className="col-md-3">
                      <label className="small fw-bold text-muted mb-1">No HP / WA</label>
                      <input className="dw-input" placeholder="08..." value={memberForm.phone} onChange={e => setMemberForm({...memberForm, phone: e.target.value})} />
                    </div>
                    <div className="col-md-3">
                      <label className="small fw-bold text-muted mb-1">Jaminan Kesehatan</label>
                      <select className="dw-input" value={memberForm.insurance} onChange={e => setMemberForm({...memberForm, insurance: e.target.value})}>
                        <option value="BPJS Mandiri">BPJS Mandiri</option>
                        <option value="BPJS dari Pekerjaan">BPJS dari Pekerjaan</option>
                        <option value="KIS">KIS</option>
                        <option value="Asuransi Swasta Lainnya">Asuransi Swasta Lainnya</option>
                        <option value="Tidak Ada">Tidak Ada</option>
                      </select>
                    </div>
                    <div className="col-12 mt-3 d-flex gap-2">
                      <button type="submit" className="btn-warga-primary px-4"><FaSave className="me-2"/> {isEditingMember ? 'UPDATE DATA' : 'SIMPAN ANGGOTA'}</button>
                      {isEditingMember && <button type="button" className="btn btn-outline-secondary px-4" onClick={resetMemberForm}><FaUndo className="me-2"/> BATAL</button>}
                    </div>
                  </div>
                </form>
              </div>

              {/* TABEL ANGGOTA KELUARGA */}
              <div className="table-responsive rounded-3 border">
                <table className="table table-hover mb-0 align-middle">
                  <thead className="bg-light text-secondary small text-uppercase">
                    <tr><th className="p-3">Nama</th><th>NIK</th><th>No. HP</th><th>Jaminan Kesehatan</th><th className="text-center">Usia</th><th className="text-center">Aksi</th></tr>
                  </thead>
                  <tbody>
                    {selectedFamily.members.map((m) => (
                      <tr key={m.id}>
                        <td className="p-3 text-primary fw-bold">
                          {m.name}<br/>
                          <span className="small text-muted mt-1 d-inline-block">{m.relationship}</span>
                        </td>
                        <td className="small text-muted">{m.nik}</td>
                        <td>
                          {m.phone ? (
                            <a href={`https://wa.me/${m.phone}`} target="_blank" rel="noreferrer" className="text-success fw-bold text-decoration-none" title="Chat WhatsApp">
                              <FaWhatsapp className="me-1 fs-5"/> {m.phone}
                            </a>
                          ) : <span className="text-muted small">-</span>}
                        </td>
                        <td className="fw-bold text-dark">{m.insurance || 'BPJS Mandiri'}</td>
                        <td className="text-center fw-bold">{calculateAge(m.dateOfBirth)} Thn</td>
                        <td className="text-center">
                          {/* TOMBOL DETAIL, EDIT, HAPUS DI AKSI */}
                          <button className="btn-action-circle text-info" title="Detail" onClick={() => setSelectedCitizenDetail(m)}><FaInfoCircle/></button>
                          <button className="btn-action-circle text-warning" title="Edit" onClick={() => handleEditMemberClick(m)}><FaEdit/></button>
                          <button className="btn-action-circle text-danger" title="Hapus" onClick={() => handleDeleteMember(m.id)}><FaTrash/></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: EDIT KK */}
      {showEditKKModal && (
        <div className="modal-overlay" onClick={() => setShowEditKKModal(false)}>
          <div className="modal-container modal-small" onClick={e => e.stopPropagation()}>
            <div className="modal-header-blue" style={{background:'#fbc531', color:'#000'}}>
              <h5 className="mb-0 fw-bold">Edit Data KK</h5>
              <FaTimes className="cursor-pointer" onClick={() => setShowEditKKModal(false)}/>
            </div>
            <div className="modal-body">
              <form onSubmit={handleUpdateKK} className="d-grid gap-3">
                <input className="dw-input" value={editKK.kepalaKeluarga} onChange={e => setEditKK({...editKK, kepalaKeluarga: e.target.value})} />
                <input className="dw-input" value={editKK.noKK} onChange={e => setEditKK({...editKK, noKK: e.target.value})} />
                <input className="dw-input" value={editKK.address} onChange={e => setEditKK({...editKK, address: e.target.value})} />
                <button type="submit" className="btn-warga-primary w-100" style={{background:'#fbc531', color:'#000'}}>UPDATE DATA</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataWarga;