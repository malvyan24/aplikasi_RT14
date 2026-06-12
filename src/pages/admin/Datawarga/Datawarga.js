import React, { useState, useRef } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import * as XLSX from 'xlsx';
import { GET_WARGA, GET_ALL_CITIZENS } from '../../../graphql/userQueries';
import { CREATE_FAMILY, UPDATE_FAMILY, DELETE_FAMILY, ADD_CITIZEN, UPDATE_CITIZEN, DELETE_CITIZEN, PROCESS_SCAN_ALL } from '../../../graphql/userMutations';
import { FaEye, FaEdit, FaTrash, FaUserPlus, FaUsers, FaIdCard, FaSearch, FaTimes, FaSave, FaFileExcel, FaUpload, FaCamera } from 'react-icons/fa';
import './Datawarga.css';

const DataWarga = () => {
  // --- 1. STATE MANAGEMENT ---
  const [searchTerm, setSearchTerm] = useState('');
  const [searchWarga, setSearchWarga] = useState(''); 
  const [searchKK, setSearchKK] = useState(''); 
  
  const fileInputRef = useRef(null);
  const scanInputRef = useRef(null); 

  // State Modals Utama
  const [showAddKKModal, setShowAddKKModal] = useState(false);
  const [editFamily, setEditFamily] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null); 
  const [selectedCitizenDetail, setSelectedCitizenDetail] = useState(null); 
  const [editCitizen, setEditCitizen] = useState(null);

  // 👇 PERBAIKAN: Penambahan State Modal Semua KK dan Warga yang Sempat Hilang 👇
  const [showAllKKModal, setShowAllKKModal] = useState(false);
  const [showAllWargaModal, setShowAllWargaModal] = useState(false);

  // State Formulir (Sudah Termasuk Email)
  const [newKK, setNewKK] = useState({ kepalaKeluarga: '', noKK: '', address: '', ownershipStatus: 'OWNED' });
  const [memberForm, setMemberForm] = useState({ 
    name: "", nik: "", gender: "L", religion: "Islam", 
    placeOfBirth: "", dateOfBirth: "", profession: "Wiraswasta", 
    relationship: "KEPALA KELUARGA", phone: "", email: "", insurance: "Tidak Ada" 
  });

  // --- 2. GRAPHQL QUERIES & MUTATIONS ---
  const { data, loading, error, refetch } = useQuery(GET_WARGA, { fetchPolicy: "network-only" });

  const [processScanAll, { loading: scanLoading }] = useMutation(PROCESS_SCAN_ALL);

  // LOGIKA SCAN KK/KTP
  const handleScanKKKTP = async (file) => {
    if (!file) return;
    
    alert("Mengirim dokumen ke sistem AI... Mohon tunggu sebentar.");

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64 = reader.result;
      try {
        const { data: res } = await processScanAll({ variables: { imageBase64: base64 } });
        if (res.processScanAll.success) {
          alert(`Berhasil! Keluarga ${res.processScanAll.family.kepalaKeluarga} dan seluruh anggotanya telah terdaftar.`);
          refetch(); 
        } else {
          alert("Sistem Gagal Memproses: " + res.processScanAll.message);
        }
      } catch (err) { alert("Gagal memproses gambar/PDF: " + err.message); }
    };
  };

  const [createFamily] = useMutation(CREATE_FAMILY, {
    onCompleted: () => { 
      alert('KK Baru Berhasil Didaftarkan!'); 
      setShowAddKKModal(false); 
      setNewKK({ kepalaKeluarga: '', noKK: '', address: '', ownershipStatus: 'OWNED' }); 
      refetch(); 
    },
    onError: (err) => console.log('Gagal Mendaftar KK: ' + err.message)
  });

  const [updateFamily] = useMutation(UPDATE_FAMILY, {
    onCompleted: () => { alert('Data KK Berhasil Diperbarui!'); setEditFamily(null); refetch(); },
    onError: (err) => alert('Gagal Update KK: ' + err.message)
  });

  const [deleteFamily] = useMutation(DELETE_FAMILY, {
    onCompleted: () => { alert('Keluarga Berhasil Dihapus!'); refetch(); },
    onError: (err) => alert('Gagal Hapus Keluarga: ' + err.message)
  });

  const [addCitizen] = useMutation(ADD_CITIZEN, {
    refetchQueries: [{ query: GET_WARGA }, { query: GET_ALL_CITIZENS }],
    onCompleted: () => { 
      alert('Anggota Baru Berhasil Ditambahkan!'); 
      // Reset form termasuk email
      setMemberForm({ name: "", nik: "", gender: "L", religion: "Islam", placeOfBirth: "", dateOfBirth: "", profession: "Wiraswasta", relationship: "ANAK", phone: "", email: "", insurance: "Tidak Ada" });
    },
    onError: (err) => alert('Gagal Tambah Anggota: ' + err.message)
  });

  const [updateCitizen] = useMutation(UPDATE_CITIZEN, {
    onCompleted: () => { alert('Data Anggota Berhasil Diperbarui!'); setEditCitizen(null); refetch(); },
    onError: (err) => alert('Gagal Update Anggota: ' + err.message)
  });

  const [deleteCitizen] = useMutation(DELETE_CITIZEN, {
    onCompleted: () => { alert('Warga Berhasil Dihapus.'); refetch(); },
    onError: (err) => alert('Gagal Hapus Warga: ' + err.message)
  });

  // Helper: format tanggal ke yyyy-MM-dd untuk input date
  const toDateInput = (val) => {
    if (!val) return '';
    const isTimestamp = /^-?\d+$/.test(String(val));
    const d = new Date(isTimestamp ? Number(val) : val);
    if (isNaN(d.getTime())) return '';
    return d.toISOString().split('T')[0];
  };

  // --- 3. FUNGSI HELPER ---
  const formatTanggal = (val) => {
    if (!val) return "-";
    const isTimestamp = /^-?\d+$/.test(String(val));
    const d = new Date(isTimestamp ? Number(val) : val);
    if (isNaN(d.getTime())) return val; 

    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    
    return `${day}/${month}/${year}`;
  };

  const handleExportExcel = () => {
    if (!data?.families) return alert('Belum ada data untuk diexport!');
    const flatData = [];
    data.families.forEach(fam => {
      if (fam.members && fam.members.length > 0) {
        fam.members.forEach(member => {
          flatData.push({ 
            'No. KK': fam.noKK, 'Kepala Keluarga': fam.kepalaKeluarga, 'Alamat': fam.address, 'Status Rumah': fam.ownershipStatus,
            'Nama Anggota': member.name, 'NIK': member.nik, 'Hubungan': member.relationship,
            'Tempat Lahir': member.placeOfBirth, 'Tanggal Lahir': formatTanggal(member.dateOfBirth), 'Umur': member.age,
            'No. HP': member.phone, 'Email': member.email || "-", 'Asuransi': member.insurance
          });
        });
      } else {
        flatData.push({ 'No. KK': fam.noKK, 'Kepala Keluarga': fam.kepalaKeluarga, 'Alamat': fam.address, 'Status Rumah': fam.ownershipStatus, 'Nama Anggota': '-', 'NIK': '-', 'Hubungan': '-' });
      }
    });
    const worksheet = XLSX.utils.json_to_sheet(flatData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data Warga RT 14");
    XLSX.writeFile(workbook, `Laporan_Warga_RT14.xlsx`);
  };

  const handleImportExcel = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const excelData = XLSX.utils.sheet_to_json(ws);

      alert(`Memproses ${excelData.length} baris data... Mohon tunggu sebentar.`);
      
      try {
        for (const row of excelData) {
          const rowNoKK = String(row['NO KK'] || row['noKK'] || row['No KK'] || '');
          const rowKepala = row['KEPALA KELUARGA'] || row['kepalaKeluarga'] || row['Kepala Keluarga'] || '';
          const rowAddress = row['ALAMAT'] || row['alamat'] || row['Alamat'] || '-';
          const rowStatus = row['STATUS'] || row['status'] || row['Status Rumah'] || 'OWNED';

          if (rowNoKK && rowKepala) {
            await createFamily({ variables: { noKK: rowNoKK, kepalaKeluarga: rowKepala, address: rowAddress, ownershipStatus: rowStatus } });
          }
        }
        alert('Data Excel berhasil diimport!');
        refetch();
      } catch (err) {
        console.error(err);
      }
      e.target.value = ""; 
    };
    reader.readAsBinaryString(file);
  };

  const sortedFamilies = [...(data?.families || [])].sort((a, b) => {
    if (a.id < b.id) return 1;
    if (a.id > b.id) return -1;
    return 0;
  });

  const filteredFamilies = sortedFamilies.filter(f => 
    f.kepalaKeluarga.toLowerCase().includes(searchTerm.toLowerCase()) || f.noKK.includes(searchTerm)
  );

  const latest10Families = filteredFamilies.slice(0, 10);
  const totalKeluarga = sortedFamilies.length;
  const totalOrang = sortedFamilies.reduce((acc, curr) => acc + curr.members.length, 0);
  const allCitizensFlat = sortedFamilies.flatMap(f => f.members.map(m => ({ ...m, namaKK: f.kepalaKeluarga, noKK: f.noKK })));
  
  const filteredWarga = allCitizensFlat.filter(m => 
    m.name.toLowerCase().includes(searchWarga.toLowerCase()) || 
    m.nik.includes(searchWarga)
  );

  const filteredAllKK = sortedFamilies.filter(f => 
    f.kepalaKeluarga.toLowerCase().includes(searchKK.toLowerCase()) || 
    f.noKK.includes(searchKK)
  );

  if (loading) return <div className="p-5 text-center fw-bold text-primary">Memuat Data RT 14...</div>;
  if (error) return <div className="alert alert-danger m-5">Error Sistem: {error.message}</div>;

  return (
    <div className="dw-page" style={{ padding: '32px', backgroundColor: '#f8faff', minHeight: '100vh' }}>
      
      {/* CARD STATISTIK */}
      <div className="row mb-4 d-flex" style={{ margin: '0 -12px' }}>
        <div className="col-md-6 mb-3" style={{ padding: '0 12px' }}>
          <div 
            className="warga-card p-4 text-white position-relative rounded-4 shadow-sm border-0" 
            onClick={() => setShowAllKKModal(true)}
            style={{ background: 'linear-gradient(135deg, #3182ce, #63b3ed)', minHeight: '160px', display: 'flex', flexDirection: 'column', justifyContent: 'center', cursor: 'pointer', transition: 'transform 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <h2 className="fw-bold" style={{ fontSize: '2.5rem' }}>{totalKeluarga} Keluarga</h2>
            <p className="opacity-75 mb-0" style={{ fontSize: '1.1rem' }}>Total KK Terdaftar (Klik untuk melihat Semua KK)</p>
            <FaIdCard style={{ position:'absolute', right:24, bottom:24, fontSize:'5rem', opacity:0.12 }}/>
          </div>
        </div>
        <div className="col-md-6 mb-3" style={{ padding: '0 12px' }}>
          <div 
            className="warga-card p-4 text-white position-relative rounded-4 shadow-sm border-0" 
            onClick={() => setShowAllWargaModal(true)}
            style={{ background: 'linear-gradient(135deg, #38a169, #68d391)', minHeight: '160px', display: 'flex', flexDirection: 'column', justifyContent: 'center', cursor: 'pointer', transition: 'transform 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <h2 className="fw-bold" style={{ fontSize: '2.5rem' }}>{totalOrang} Orang</h2>
            <p className="opacity-75 mb-0" style={{ fontSize: '1.1rem' }}>Total Warga (Klik untuk melihat Semua Warga)</p>
            <FaUsers style={{ position:'absolute', right:24, bottom:24, fontSize:'5rem', opacity:0.12 }}/>
          </div>
        </div>
      </div>

      {/* SEARCH BAR UTAMA & TOMBOL */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div className="p-2 bg-white border rounded-3 shadow-sm d-flex align-items-center flex-grow-1" style={{ maxWidth: '500px' }}>
          <FaSearch className="text-muted mx-2" />
          <input type="text" className="form-control border-0 bg-transparent shadow-none" placeholder="Cari Kepala Keluarga / No. KK..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
        
        <div className="d-flex gap-2">
          <input type="file" hidden ref={scanInputRef} accept="image/*, application/pdf" onChange={(e) => handleScanKKKTP(e.target.files[0])} />
          
          <button className="btn text-white fw-bold px-4 py-2 rounded-3 shadow-sm d-flex align-items-center" onClick={() => scanInputRef.current.click()} style={{ backgroundColor: '#6366f1', border: 'none' }}>
            <FaCamera className="me-2"/> {scanLoading ? 'SCANNING...' : 'SCAN KK/KTP/PDF'}
          </button>

          <input type="file" accept=".xlsx, .xls" ref={fileInputRef} onChange={handleImportExcel} style={{ display: 'none' }} />
          <button className="btn text-white fw-bold px-4 py-2 rounded-3 shadow-sm d-flex align-items-center" onClick={() => fileInputRef.current.click()} style={{ backgroundColor: '#f59e0b', border: 'none' }} title="Import Data KK dari Excel">
            <FaUpload className="me-2"/> IMPORT EXCEL
          </button>

          <button className="btn text-white fw-bold px-4 py-2 rounded-3 shadow-sm d-flex align-items-center" onClick={handleExportExcel} style={{ backgroundColor: '#10B981', border: 'none' }}>
            <FaFileExcel className="me-2"/> EXPORT EXCEL
          </button>
          
          <button className="btn text-white fw-bold px-4 py-2 rounded-3 shadow-sm d-flex align-items-center" onClick={() => setShowAddKKModal(true)} style={{ backgroundColor: '#ef4444', border: 'none' }}>
            <FaUserPlus className="me-2"/> TAMBAH KK
          </button>
        </div>
      </div>

      {/* TABEL KELUARGA UTAMA */}
      <div className="table-responsive bg-white rounded-3 shadow-sm border mb-4">
        <div className="bg-light p-3 border-bottom d-flex justify-content-between align-items-center">
            <h6 className="fw-bold text-muted mb-0">Menampilkan {latest10Families.length} Data KK Terbaru</h6>
        </div>
        <table className="table table-hover mb-0 align-middle">
          <thead className="bg-light">
            <tr>
              <th className="ps-4 py-3 small text-uppercase fw-bold text-muted">NO KK</th>
              <th className="py-3 small text-uppercase fw-bold text-muted">KEPALA KELUARGA</th>
              <th className="py-3 small text-uppercase fw-bold text-muted">ALAMAT</th>
              <th className="py-3 small text-uppercase fw-bold text-muted text-center">STATUS</th>
              <th className="text-center py-3 small text-uppercase fw-bold text-muted">AKSI</th>
            </tr>
          </thead>
          <tbody>
            {latest10Families.map((f) => (
              <tr key={f.id} className="border-bottom">
                <td className="fw-bold ps-4 text-secondary">{f.noKK}</td>
                <td className="fw-bold text-primary">{f.kepalaKeluarga}</td>
                <td className="text-muted small">{f.address}</td>
                <td className="text-center">
                  <span className={`fw-bold small ${f.ownershipStatus === 'RENT' ? 'text-warning' : f.ownershipStatus === 'OFFICIAL' ? 'text-secondary' : 'text-success'}`}>
                    {f.ownershipStatus || "OWNED"}
                  </span>
                </td>
                <td className="text-center">
                  <div className="d-flex gap-2 justify-content-center">
                    <button className="btn btn-outline-primary btn-sm rounded-circle p-2 d-flex align-items-center justify-content-center" style={{width:'32px', height:'32px'}} onClick={() => setSelectedUser(f)} title="Lihat Daftar Warga"><FaEye /></button>
                    <button className="btn btn-outline-warning btn-sm rounded-circle p-2 d-flex align-items-center justify-content-center" style={{width:'32px', height:'32px'}} onClick={() => setEditFamily(f)} title="Edit Keluarga"><FaEdit /></button>
                    <button className="btn btn-outline-danger btn-sm rounded-circle p-2 d-flex align-items-center justify-content-center" style={{width:'32px', height:'32px'}} onClick={() => window.confirm("Hapus seluruh keluarga ini?") && deleteFamily({ variables: { id: f.id } })} title="Hapus Keluarga"><FaTrash /></button>
                  </div>
                </td>
              </tr>
            ))}
            {latest10Families.length === 0 && (
              <tr><td colSpan="5" className="text-center py-4 text-muted">Belum ada data KK.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ================= MODALS SECTION ================= */}

      {/* 1. MODAL TAMBAH KK */}
      {showAddKKModal && (
        <div className="modal show d-block p-4" style={{ backgroundColor: 'rgba(0,0,0,0.7)', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1060 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header text-white py-3 border-0 d-flex justify-content-between align-items-center" style={{ backgroundColor: '#2d3748' }}>
                <h5 className="fw-bold mb-0"><FaUserPlus className="me-2"/> Tambah Kartu Keluarga</h5>
                <FaTimes className="cursor-pointer fs-5" onClick={() => setShowAddKKModal(false)} />
              </div>
              <form onSubmit={e => { e.preventDefault(); createFamily({ variables: { noKK: String(newKK.noKK), kepalaKeluarga: newKK.kepalaKeluarga, address: newKK.address, ownershipStatus: newKK.ownershipStatus } }); }}>
                <div className="modal-body p-4 bg-white">
                  <div className="mb-3"><label className="small fw-bold text-muted mb-2">Nomor KK</label><input type="number" className="form-control" value={newKK.noKK} onChange={e => setNewKK({...newKK, noKK: e.target.value})} required /></div>
                  <div className="mb-3"><label className="small fw-bold text-muted mb-2">Nama Kepala Keluarga</label><input type="text" className="form-control" value={newKK.kepalaKeluarga} onChange={e => setNewKK({...newKK, kepalaKeluarga: e.target.value})} required /></div>
                  <div className="mb-3"><label className="small fw-bold text-muted mb-2">Alamat Rumah</label><input type="text" className="form-control" value={newKK.address} onChange={e => setNewKK({...newKK, address: e.target.value})} required /></div>
                  <div className="mb-3"><label className="small fw-bold text-muted mb-2">Status Rumah</label>
                    <select className="form-select" value={newKK.ownershipStatus} onChange={e => setNewKK({...newKK, ownershipStatus: e.target.value})}>
                      <option value="OWNED">Milik Sendiri (OWNED)</option><option value="RENT">Kontrak/Sewa (RENT)</option><option value="OFFICIAL">Dinas (OFFICIAL)</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer p-3 bg-light rounded-bottom-4 border-0">
                  <button type="submit" className="btn btn-primary w-100 fw-bold shadow-sm rounded-3">SIMPAN KELUARGA BARU</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 2. MODAL EDIT KK */}
      {editFamily && (
        <div className="modal show d-block p-4" style={{ backgroundColor: 'rgba(0,0,0,0.7)', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1060 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header bg-warning text-white py-3 border-0 d-flex justify-content-between align-items-center">
                <h5 className="fw-bold mb-0 text-dark"><FaEdit className="me-2"/> Edit Data Keluarga</h5>
                <FaTimes className="text-dark fs-5 cursor-pointer" onClick={() => setEditFamily(null)} />
              </div>
              <form onSubmit={e => {
                e.preventDefault();
                updateFamily({ variables: { id: editFamily.id, noKK: String(editFamily.noKK), kepalaKeluarga: editFamily.kepalaKeluarga, address: editFamily.address, ownershipStatus: editFamily.ownershipStatus }});
              }}>
                <div className="modal-body p-4 bg-white">
                  <div className="mb-3"><label className="small fw-bold text-muted mb-2">Nomor KK</label><input type="text" className="form-control" value={editFamily.noKK} onChange={e => setEditFamily({...editFamily, noKK: e.target.value})} required /></div>
                  <div className="mb-3"><label className="small fw-bold text-muted mb-2">Kepala Keluarga</label><input type="text" className="form-control" value={editFamily.kepalaKeluarga} onChange={e => setEditFamily({...editFamily, kepalaKeluarga: e.target.value})} required /></div>
                  <div className="mb-3"><label className="small fw-bold text-muted mb-2">Alamat Rumah</label><input type="text" className="form-control" value={editFamily.address} onChange={e => setEditFamily({...editFamily, address: e.target.value})} required /></div>
                  <div className="mb-3"><label className="small fw-bold text-muted mb-2">Status Rumah</label>
                    <select className="form-select" value={editFamily.ownershipStatus} onChange={e => setEditFamily({...editFamily, ownershipStatus: e.target.value})}>
                      <option value="OWNED">Milik Sendiri</option><option value="RENT">Kontrak/Sewa</option><option value="OFFICIAL">Dinas</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer p-3 bg-light rounded-bottom-4 border-0">
                  <button type="submit" className="btn btn-warning text-dark w-100 fw-bold shadow-sm rounded-3"><FaSave className="me-2"/>UPDATE DATA</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 3. MODAL DAFTAR ANGGOTA (WARGA) DALAM 1 KK */}
      {selectedUser && (
        <div className="modal show d-block p-4" style={{ backgroundColor: 'rgba(15, 23, 42, 0.85)', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1050, overflowY: 'auto' }}>
          <div className="modal-dialog modal-xl modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="modal-header bg-primary text-white border-0 py-3 d-flex justify-content-between align-items-center">
                <h5 className="fw-bold mb-0"><FaUsers className="me-2"/> Daftar Anggota: {selectedUser.kepalaKeluarga}</h5>
                <FaTimes className="text-white fs-5 cursor-pointer" onClick={() => setSelectedUser(null)} />
              </div>
              <div className="modal-body p-4 bg-light">
                <div className="bg-white p-4 rounded-4 mb-4 shadow-sm border border-primary border-opacity-10">
                  <h6 className="fw-bold text-primary mb-3"><FaUserPlus className="me-2"/>Registrasi Anggota Baru</h6>
                  <form onSubmit={e => { 
                    e.preventDefault(); 
                    addCitizen({ variables: { ...memberForm, familyId: selectedUser.id, address: selectedUser.address, nik: String(memberForm.nik) } }); 
                  }}>
                    <div className="row g-3 align-items-end">
                      {/* Baris 1: 4 Field */}
                      <div className="col-md-3"><label className="small fw-bold text-muted mb-1">Nama Lengkap</label><input type="text" className="form-control border-2" required value={memberForm.name} onChange={e => setMemberForm({...memberForm, name: e.target.value})} /></div>
                      <div className="col-md-3"><label className="small fw-bold text-muted mb-1">NIK (16 Digit)</label><input type="number" className="form-control border-2" required value={memberForm.nik} onChange={e => setMemberForm({...memberForm, nik: e.target.value})} /></div>
                      <div className="col-md-3"><label className="small fw-bold text-muted mb-1">Tempat Lahir</label><input type="text" className="form-control border-2" required value={memberForm.placeOfBirth} onChange={e => setMemberForm({...memberForm, placeOfBirth: e.target.value})} /></div>
                      <div className="col-md-3"><label className="small fw-bold text-muted mb-1">Tanggal Lahir</label><input type="date" className="form-control border-2" required value={memberForm.dateOfBirth} onChange={e => setMemberForm({...memberForm, dateOfBirth: e.target.value})} /></div>
                      
                      {/* Baris 2: 6 Field */}
                      <div className="col-md-2"><label className="small fw-bold text-muted mb-1">Hubungan</label>
                        <select className="form-select border-2 fw-bold" value={memberForm.relationship} onChange={e => setMemberForm({...memberForm, relationship: e.target.value})}>
                          <option value="KEPALA KELUARGA">SUAMI / KK</option><option value="ISTRI">ISTRI</option><option value="ANAK">ANAK</option><option value="FAMILI LAIN">FAMILI LAIN</option>
                        </select>
                      </div>
                      <div className="col-md-2"><label className="small fw-bold text-muted mb-1">Gender</label>
                        <select className="form-select border-2 fw-bold" value={memberForm.gender} onChange={e => setMemberForm({...memberForm, gender: e.target.value})}>
                          <option value="L">Laki-Laki</option><option value="P">Perempuan</option>
                        </select>
                      </div>
                      <div className="col-md-2"><label className="small fw-bold text-muted mb-1">Agama</label>
                        <select className="form-select border-2 fw-bold" value={memberForm.religion} onChange={e => setMemberForm({...memberForm, religion: e.target.value})}>
                          <option value="Islam">Islam</option><option value="Kristen">Kristen</option><option value="Katolik">Katolik</option><option value="Hindu">Hindu</option><option value="Budha">Budha</option>
                        </select>
                      </div>
                      <div className="col-md-2"><label className="small fw-bold text-muted mb-1">No. HP</label><input type="text" className="form-control border-2" placeholder="08..." value={memberForm.phone} onChange={e => setMemberForm({...memberForm, phone: e.target.value})} /></div>
                      
                      {/* --- TAMBAHAN INPUT EMAIL --- */}
                      <div className="col-md-2"><label className="small fw-bold text-muted mb-1">Email</label><input type="email" className="form-control border-2" placeholder="opsional@mail.com" value={memberForm.email} onChange={e => setMemberForm({...memberForm, email: e.target.value})} /></div>
                      
                      <div className="col-md-2"><label className="small fw-bold text-muted mb-1">Jaminan Kesehatan</label>
                        <select className="form-select border-2 fw-bold" value={memberForm.insurance} onChange={e => setMemberForm({...memberForm, insurance: e.target.value})}>
                          <option value="Tidak Ada">Tidak Ada</option><option value="BPJS Mandiri">BPJS Mandiri</option><option value="BPJS dari Pekerjaan">BPJS dari Pekerjaan</option><option value="KIS">KIS</option><option value="Asuransi Swasta">Asuransi Swasta</option>
                        </select>
                      </div>
                      <div className="col-12 mt-4"><button type="submit" className="btn btn-primary w-100 fw-bold py-2 shadow-sm rounded-3">SIMPAN ANGGOTA BARU</button></div>
                    </div>
                  </form>
                </div>

                <div className="table-responsive bg-white rounded-4 border shadow-sm">
                  <table className="table mb-0 small table-striped align-middle">
                    <thead className="bg-light">
                      <tr>
                        <th className="ps-4 py-3 text-uppercase text-muted">Nama Lengkap</th>
                        <th className="text-uppercase text-muted">NIK</th>
                        <th className="text-uppercase text-muted">Hubungan</th>
                        <th className="text-center text-uppercase text-muted">Umur</th>
                        <th className="text-center text-uppercase text-muted">Profil & Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data?.families.find(f => f.id === selectedUser.id)?.members?.map(m => (
                        <tr key={m.id}>
                          <td className="ps-4 fw-bold text-primary">{m.name}</td>
                          <td className="text-muted fw-medium">{m.nik}</td>
                          <td>
                            <span className={`fw-bold small ${(m.relationship || "").toUpperCase().includes("KEPALA") || (m.relationship || "").toUpperCase().includes("SUAMI") ? "text-primary" : (m.relationship || "").toUpperCase().includes("ISTRI") ? "text-danger" : "text-info"}`}>
                              {m.relationship}
                            </span>
                          </td>
                          <td className="text-center fw-bold text-success">{m.age || 0} Thn</td>
                          <td className="text-center">
                            <button className="btn btn-sm btn-outline-info rounded-pill px-3 border-2 fw-bold me-2" onClick={() => setSelectedCitizenDetail(m)} title="Lihat Biodata Lengkap"><FaIdCard className="me-1"/> Profil</button>
                            <button className="btn btn-sm btn-outline-warning rounded-pill px-3 border-2 fw-bold me-2" onClick={() => setEditCitizen({...m, dateOfBirth: toDateInput(m.dateOfBirth)})} title="Edit Anggota"><FaEdit className="me-1"/> Edit</button>
                            <button className="btn btn-sm text-danger" onClick={() => window.confirm("Hapus warga?") && deleteCitizen({ variables: { id: m.id } })} title="Hapus Anggota"><FaTrash /></button>
                          </td>
                        </tr>
                      )) || <tr><td colSpan="5" className="text-center py-4 text-muted">Belum ada anggota terdaftar.</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL EDIT ANGGOTA */}
      {editCitizen && (
        <div className="modal show d-block p-4" style={{ backgroundColor: 'rgba(0,0,0,0.85)', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1100, overflowY: 'auto' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="modal-header bg-warning text-dark border-0 py-3 d-flex justify-content-between align-items-center">
                <h5 className="fw-bold mb-0"><FaEdit className="me-2"/> Edit Data Anggota</h5>
                <FaTimes className="text-dark fs-5 cursor-pointer" onClick={() => setEditCitizen(null)} />
              </div>
              <form onSubmit={e => {
                e.preventDefault();
                updateCitizen({ variables: {
                  id: editCitizen.id,
                  name: editCitizen.name,
                  nik: String(editCitizen.nik),
                  gender: editCitizen.gender,
                  relationship: editCitizen.relationship,
                  dateOfBirth: editCitizen.dateOfBirth,
                  phone: editCitizen.phone,
                  insurance: editCitizen.insurance
                }});
              }}>
                <div className="modal-body p-4 bg-white">
                  <div className="row g-3">
                    <div className="col-12"><label className="small fw-bold text-muted mb-1">Nama Lengkap</label><input type="text" className="form-control border-2" value={editCitizen.name} onChange={e => setEditCitizen({...editCitizen, name: e.target.value})} required /></div>
                    <div className="col-6"><label className="small fw-bold text-muted mb-1">NIK</label><input type="text" className="form-control border-2" value={editCitizen.nik} onChange={e => setEditCitizen({...editCitizen, nik: e.target.value})} required /></div>
                    <div className="col-6"><label className="small fw-bold text-muted mb-1">Tanggal Lahir</label><input type="date" className="form-control border-2" value={editCitizen.dateOfBirth || ''} onChange={e => setEditCitizen({...editCitizen, dateOfBirth: e.target.value})} required /></div>
                    <div className="col-6"><label className="small fw-bold text-muted mb-1">Gender</label>
                      <select className="form-select border-2" value={editCitizen.gender} onChange={e => setEditCitizen({...editCitizen, gender: e.target.value})}>
                        <option value="L">Laki-Laki</option><option value="P">Perempuan</option>
                      </select>
                    </div>
                    <div className="col-6"><label className="small fw-bold text-muted mb-1">Hubungan</label>
                      <select className="form-select border-2" value={editCitizen.relationship} onChange={e => setEditCitizen({...editCitizen, relationship: e.target.value})}>
                        <option value="KEPALA KELUARGA">SUAMI / KK</option><option value="ISTRI">ISTRI</option><option value="ANAK">ANAK</option><option value="FAMILI LAIN">FAMILI LAIN</option>
                      </select>
                    </div>
                    <div className="col-6"><label className="small fw-bold text-muted mb-1">No. HP</label><input type="text" className="form-control border-2" value={editCitizen.phone || ''} onChange={e => setEditCitizen({...editCitizen, phone: e.target.value})} /></div>
                    <div className="col-6"><label className="small fw-bold text-muted mb-1">Asuransi</label>
                      <select className="form-select border-2" value={editCitizen.insurance || 'Tidak Ada'} onChange={e => setEditCitizen({...editCitizen, insurance: e.target.value})}>
                        <option value="Tidak Ada">Tidak Ada</option><option value="BPJS Mandiri">BPJS Mandiri</option><option value="BPJS dari Pekerjaan">BPJS dari Pekerjaan</option><option value="KIS">KIS</option><option value="Asuransi Swasta">Asuransi Swasta</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="modal-footer p-3 bg-light rounded-bottom-4 border-0">
                  <button type="submit" className="btn btn-warning text-dark w-100 fw-bold shadow-sm rounded-3"><FaSave className="me-2"/>UPDATE DATA ANGGOTA</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 4. MODAL BIODATA PRIBADI WARGA */}
      {selectedCitizenDetail && (
        <div className="modal show d-block p-4" style={{ backgroundColor: 'rgba(0,0,0,0.9)', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1100 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="modal-header bg-success text-white border-0 py-3 d-flex justify-content-between align-items-center">
                <h5 className="fw-bold mb-0"><FaIdCard className="me-2"/> Biodata Pribadi Warga</h5>
                <FaTimes className="text-white fs-5 cursor-pointer" onClick={() => setSelectedCitizenDetail(null)} />
              </div>
              <div className="modal-body p-4 bg-white">
                <div className="row g-3">
                  <div className="col-12 text-center mb-3">
                    <div className="bg-success bg-opacity-10 text-success rounded-circle d-inline-flex align-items-center justify-content-center shadow-sm" style={{width: '80px', height: '80px', fontSize: '35px', fontWeight: 'bold'}}>{selectedCitizenDetail.name.charAt(0).toUpperCase()}</div>
                    <h4 className="fw-bold mt-3 text-dark mb-1">{selectedCitizenDetail.name}</h4>
                    <h6 className={`fw-bold mt-2 ${(selectedCitizenDetail.relationship || "").toUpperCase().includes("KEPALA") || (selectedCitizenDetail.relationship || "").toUpperCase().includes("SUAMI") ? "text-primary" : (selectedCitizenDetail.relationship || "").toUpperCase().includes("ISTRI") ? "text-danger" : "text-info"}`}>{selectedCitizenDetail.relationship}</h6>
                  </div>
                  
                  {/* --- TAMPILAN EMAIL --- */}
                  <div className="col-4"><div className="p-3 bg-light rounded-3 h-100 border border-secondary border-opacity-25"><p className="text-muted small mb-1">NIK</p><h6 className="fw-bold text-dark mb-0">{selectedCitizenDetail.nik}</h6></div></div>
                  <div className="col-4"><div className="p-3 bg-light rounded-3 h-100 border border-secondary border-opacity-25"><p className="text-muted small mb-1">No. HP</p><h6 className="fw-bold text-primary mb-0">{selectedCitizenDetail.phone || "-"}</h6></div></div>
                  <div className="col-4"><div className="p-3 bg-light rounded-3 h-100 border border-secondary border-opacity-25"><p className="text-muted small mb-1">Email</p><h6 className="fw-bold text-primary mb-0">{selectedCitizenDetail.email || "-"}</h6></div></div>
                  
                  <div className="col-6 mt-4"><p className="text-muted small mb-1 border-bottom pb-1">Tempat, Tanggal Lahir</p><h6 className="fw-bold text-dark">{selectedCitizenDetail.placeOfBirth || "-"}, <br/> {formatTanggal(selectedCitizenDetail.dateOfBirth)}</h6></div>
                  <div className="col-6 mt-4"><p className="text-muted small mb-1 border-bottom pb-1">Umur Saat Ini</p><h6 className="fw-bold text-success fs-5">{selectedCitizenDetail.age || 0} Tahun</h6></div>
                  <div className="col-6 mt-3"><p className="text-muted small mb-1 border-bottom pb-1">Jenis Kelamin</p><h6 className="fw-bold text-dark">{selectedCitizenDetail.gender === 'L' ? 'Laki-Laki' : 'Perempuan'}</h6></div>
                  <div className="col-6 mt-3"><p className="text-muted small mb-1 border-bottom pb-1">Agama</p><h6 className="fw-bold text-dark">{selectedCitizenDetail.religion}</h6></div>
                  <div className="col-6 mt-3"><p className="text-muted small mb-1 border-bottom pb-1">Profesi</p><h6 className="fw-bold text-dark">{selectedCitizenDetail.profession || "-"}</h6></div>
                  <div className="col-6 mt-3"><p className="text-muted small mb-1 border-bottom pb-1">Asuransi</p><h6 className="fw-bold text-dark">{selectedCitizenDetail.insurance || "-"}</h6></div>
                </div>
              </div>
              <div className="modal-footer bg-light border-0"><button className="btn btn-secondary w-100 fw-bold rounded-3 shadow-sm py-2" onClick={() => setSelectedCitizenDetail(null)}>TUTUP PROFIL</button></div>
            </div>
          </div>
        </div>
      )}

      {/* 5. MODAL DAFTAR SELURUH KK */}
      {showAllKKModal && (
        <div className="modal show d-block p-4" style={{ backgroundColor: 'rgba(0,0,0,0.85)', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1050, overflowY: 'auto' }}>
          <div className="modal-dialog modal-xl modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="modal-header bg-primary text-white border-0 py-3 d-flex justify-content-between align-items-center">
                <h5 className="fw-bold mb-0"><FaIdCard className="me-2"/> Daftar Seluruh Kartu Keluarga (KK)</h5>
                <FaTimes className="text-white fs-5 cursor-pointer" onClick={() => { setShowAllKKModal(false); setSearchKK(''); }} />
              </div>
              <div className="modal-body p-4 bg-light">
                <div className="mb-4"><div className="p-2 bg-white border rounded-3 shadow-sm d-flex align-items-center" style={{ maxWidth: '400px' }}><FaSearch className="text-muted mx-2" /><input type="text" className="form-control border-0 bg-transparent shadow-none" placeholder="Cari No KK..." value={searchKK} onChange={e => setSearchKK(e.target.value)} /></div></div>
                <div className="table-responsive bg-white rounded-4 border shadow-sm">
                  <table className="table mb-0 small table-striped align-middle">
                    <thead className="bg-light"><tr><th className="ps-4 py-3">No KK</th><th>Kepala Keluarga</th><th>Alamat</th><th>Status</th><th>Jumlah</th></tr></thead>
                    <tbody>{filteredAllKK.map(f => (<tr key={f.id}><td className="ps-4 fw-bold text-secondary">{f.noKK}</td><td className="fw-bold text-primary">{f.kepalaKeluarga}</td><td className="text-muted">{f.address}</td><td>{f.ownershipStatus}</td><td className="text-center">{f.members?.length} Orang</td></tr>))}</tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. MODAL DAFTAR SELURUH WARGA */}
      {showAllWargaModal && (
        <div className="modal show d-block p-4" style={{ backgroundColor: 'rgba(0,0,0,0.85)', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1050, overflowY: 'auto' }}>
          <div className="modal-dialog modal-xl modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="modal-header bg-success text-white border-0 py-3 d-flex justify-content-between align-items-center">
                <h5 className="fw-bold mb-0"><FaUsers className="me-2"/> Daftar Seluruh Warga RT 14</h5>
                <FaTimes className="text-white fs-5 cursor-pointer" onClick={() => { setShowAllWargaModal(false); setSearchWarga(''); }} />
              </div>
              <div className="modal-body p-4 bg-light">
                <div className="mb-4"><div className="p-2 bg-white border rounded-3 shadow-sm d-flex align-items-center" style={{ maxWidth: '400px' }}><FaSearch className="text-muted mx-2" /><input type="text" className="form-control border-0 bg-transparent shadow-none" placeholder="Cari Nama Warga..." value={searchWarga} onChange={e => setSearchWarga(e.target.value)} /></div></div>
                <div className="table-responsive bg-white rounded-4 border shadow-sm">
                  <table className="table mb-0 small table-striped align-middle">
                    <thead className="bg-light"><tr><th className="ps-4">Nama</th><th>NIK</th><th>Nama KK</th><th>Umur</th><th>Aksi</th></tr></thead>
                    <tbody>{filteredWarga.map((m, idx) => (<tr key={idx}><td className="ps-4 fw-bold text-primary">{m.name}</td><td>{m.nik}</td><td>{m.namaKK}</td><td className="text-center">{m.age} Thn</td><td className="text-center"><button className="btn btn-sm btn-outline-info rounded-pill px-3 border-2 fw-bold" onClick={() => setSelectedCitizenDetail(m)}><FaIdCard className="me-1"/> Profil</button></td></tr>))}</tbody>
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

export default DataWarga;