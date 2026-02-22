import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";

// Import Logic GraphQL
import {
  GET_WARGA,
  GET_ALL_CITIZENS,
  GET_SAMPAH_STATS,
} from "../../graphql/userQueries";
import {
  ADD_SETORAN,
  WITHDRAW_FUND,
  UPDATE_FAMILY_WASTE,
  DELETE_TABUNGAN,
} from "../../graphql/sampahMutations";

// Import Library
import Select from "react-select";
import { toast } from "react-toastify";
import { FaEdit, FaTrash, FaMoneyBillWave, FaSearch, FaRecycle, FaUsers, FaWallet } from "react-icons/fa";

// IMPORT FILE CSS EKSTERNAL
import "./Banksampah.css";

// DAFTAR HARGA BARU
const PRICE_LIST = {
  "Campuran": 1000,
  "Botol Bersih": 3000,
  "Kardus": 1500,
  "Besi": 2000,
};

const BankSampah = () => {
  // --- STATE UTAMA ---
  const [selectedCitizen, setSelectedCitizen] = useState(null);
  const [berat, setBerat] = useState("");
  const [kategori, setKategori] = useState("Campuran");

  // --- STATE PENCARIAN ---
  const [searchTerm, setSearchTerm] = useState("");

  // --- STATE MODAL ---
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawFamily, setWithdrawFamily] = useState(null);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFamily, setEditFamily] = useState(null);
  const [editWeight, setEditWeight] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteFamily, setDeleteFamily] = useState(null);

  // --- GRAPHQL ---
  const { data: dataWarga, refetch: refetchWarga } = useQuery(GET_WARGA);
  const { data: dataCitizens } = useQuery(GET_ALL_CITIZENS);
  const { data: dataStats, refetch: refetchStats } = useQuery(GET_SAMPAH_STATS);

  // --- LOGIKA FILTER PENCARIAN ---
  const filteredFamilies = dataWarga?.families.filter((family) => {
    const term = searchTerm.toLowerCase();
    return (
      family.kepalaKeluarga.toLowerCase().includes(term) ||
      family.noKK.includes(term)
    );
  }) || [];

  // --- MUTATIONS ---
  const [addSetoran] = useMutation(ADD_SETORAN, {
    onCompleted: () => {
      toast.success("✅ Saldo berhasil ditambahkan!");
      refetchWarga(); refetchStats();
      setBerat(""); setSelectedCitizen(null);
    },
    onError: (err) => toast.error(err.message),
  });

  const [withdrawFund] = useMutation(WITHDRAW_FUND, {
    onCompleted: () => {
      toast.success("✅ Pencairan dana sukses!");
      refetchWarga(); refetchStats();
      setShowWithdrawModal(false); setWithdrawAmount("");
    },
    onError: (err) => toast.error(err.message),
  });

  const [updateFamilyWaste] = useMutation(UPDATE_FAMILY_WASTE, {
    onCompleted: () => {
      toast.info("✏️ Data berat sampah berhasil direvisi.");
      refetchWarga(); refetchStats(); setShowEditModal(false);
    },
    onError: (err) => toast.error(err.message),
  });

  const [deleteTabungan] = useMutation(DELETE_TABUNGAN, {
    onCompleted: () => {
      toast.error("🗑️ Data tabungan berhasil di-reset (0).");
      refetchWarga(); refetchStats(); setShowDeleteModal(false);
    },
    onError: (err) => toast.error(err.message),
  });

  // --- HANDLERS ---
  const handleSimpan = (e) => {
    e.preventDefault();
    if (!selectedCitizen || !berat) return toast.warning("⚠️ Data belum lengkap!");
    
    const hargaSatuan = PRICE_LIST[kategori] || 0;

    addSetoran({
      variables: {
        citizenId: selectedCitizen.value,
        weight: parseFloat(berat),
        trashType: kategori,
        pricePerKg: parseFloat(hargaSatuan)
      },
    });
  };

  const handleWithdraw = () => {
    if (!withdrawFamily || !withdrawAmount) return;
    withdrawFund({ variables: { familyId: withdrawFamily.id, amount: parseFloat(withdrawAmount) } });
  };

  const handleEditSubmit = () => {
    if (!editFamily || editWeight === "") return;
    updateFamilyWaste({ variables: { familyId: editFamily.id, totalTabungan: parseFloat(editWeight) } });
  };

  const handleDeleteSubmit = () => {
    if (!deleteFamily) return;
    deleteTabungan({ variables: { familyId: deleteFamily.id } });
  };

  const formatRupiah = (number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(number);

  const citizenOptions = dataCitizens?.citizens.map((c) => ({
    value: c.id,
    label: `${c.name} (KK: ${c.family?.kepalaKeluarga || "-"})`,
  })) || [];

  return (
    <div className="bs-app-container">
      {/* HEADER */}
      <div className="bs-main-header">
        <div className="logo-box"><FaRecycle /></div>
        <div className="header-text text-start">
          <h1>Bank Sampah & Keuangan RT</h1>
          <p>Kelola setoran sampah, tabungan, dan pencairan dana warga.</p>
        </div>
      </div>

      {/* STATS */}
      <div className="top-stats-row">
        <div className="card-stat card-green">
          <div className="stat-content text-start">
            <p>Total Sampah Terkumpul</p>
            <h2>{dataStats?.sampahStats?.totalBerat?.toFixed(1) || 0} Kg</h2>
          </div>
          <FaRecycle className="stat-icon-bg" />
        </div>
        <div className="card-stat card-blue">
          <div className="stat-content text-start">
            <p>Total Uang Warga</p>
            <h2>{formatRupiah(dataStats?.sampahStats?.totalUang || 0)}</h2>
          </div>
          <FaWallet className="stat-icon-bg" />
        </div>
        <div className="card-stat card-purple">
          <div className="stat-content text-start">
            <p>KK Berpartisipasi</p>
            <h2>{dataStats?.sampahStats?.totalKKAktif || 0} KK</h2>
          </div>
          <FaUsers className="stat-icon-bg" />
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="bs-layout-grid">
        
        {/* KIRI: FORM INPUT */}
        <div className="form-card-premium text-start">
          <div className="section-title-wrapper">
            <h3 className="section-title">📥 Input Setoran Baru</h3>
          </div>
          
          <form onSubmit={handleSimpan}>
            <div className="form-group">
              <label>Cari Warga</label>
              <Select
                options={citizenOptions}
                value={selectedCitizen}
                onChange={setSelectedCitizen}
                placeholder="Ketik nama warga..."
              />
            </div>
            
            <div style={{ display: "flex", gap: "15px" }}>
              <div className="form-group" style={{flex:1}}>
                <label>Berat (Kg)</label>
                <input
                  type="number" step="0.1"
                  value={berat}
                  onChange={(e) => setBerat(e.target.value)}
                  className="form-input-field"
                  placeholder="0.0"
                />
              </div>
              <div className="form-group" style={{flex:1}}>
                <label>Kategori</label>
                <select
                  value={kategori}
                  onChange={(e) => setKategori(e.target.value)}
                  className="form-select-field"
                >
                  {Object.keys(PRICE_LIST).map(key => (
                    <option key={key} value={key}>{key}</option>
                  ))}
                </select>
              </div>
            </div>

            {berat && (
              <div style={{ backgroundColor: "#e6fffa", padding: "10px", borderRadius: "8px", color: "#047857", marginBottom: "15px", fontSize: "13px", fontWeight: "bold" }}>
                💰 Estimasi: {formatRupiah(berat * PRICE_LIST[kategori])}
              </div>
            )}

            <button type="submit" className="btn-save-main">+ Simpan & Tambah Saldo</button>
          </form>
        </div>

        {/* KANAN: TABEL (SUDAH DIHAPUS KOLOM QR) */}
        <div className="table-container-premium text-start">
          <div className="table-header-flex">
            <div>
              <h3 className="section-title">📊 Rekapitulasi Saldo</h3>
              <p style={{margin:0, fontSize:'13px', color:'#94a3b8'}}>Data saldo terkini seluruh keluarga</p>
            </div>
            <div className="search-box-wrapper">
              <FaSearch className="search-icon-pos" />
              <input 
                type="text" 
                className="search-input-modern" 
                placeholder="Cari Kepala Keluarga..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div style={{overflowX: 'auto'}}>
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Kepala Keluarga</th>
                  <th className="text-center">Berat Total</th>
                  <th className="text-end">Saldo (Rp)</th>
                  <th className="text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredFamilies.length > 0 ? (
                  filteredFamilies.map((family) => (
                    <tr key={family.id}>
                      <td>
                        <div style={{fontWeight:'bold'}}>{family.kepalaKeluarga}</div>
                        <div style={{fontSize:'12px', color:'#94a3b8'}}>{family.noKK}</div>
                      </td>
                      <td className="text-center" style={{fontWeight:'bold', color:'#3b82f6'}}>
                        {family.totalTabungan || 0} Kg
                      </td>
                      <td className="text-end" style={{fontWeight:'bold', color:'#10b981'}}>
                        {formatRupiah(family.balance || 0)}
                      </td>
                      <td>
                        <div className="action-cells">
                          <button className="btn-icon bg-edit" title="Edit" onClick={() => { setEditFamily(family); setEditWeight(family.totalTabungan || 0); setShowEditModal(true); }}>
                            <FaEdit />
                          </button>
                          <button className="btn-icon bg-withdraw" title="Tarik Tunai" onClick={() => { setWithdrawFamily(family); setShowWithdrawModal(true); }}>
                            <FaMoneyBillWave />
                          </button>
                          <button className="btn-icon bg-delete" title="Reset" onClick={() => { setDeleteFamily(family); setShowDeleteModal(true); }}>
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center" style={{padding:'40px', color:'#94a3b8'}}>
                      Data tidak ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL EDIT */}
      {showEditModal && (
        <div className="modal-overlay" style={modalStyles.overlay}>
          <div className="modal-content" style={modalStyles.content}>
            <h3>✏️ Edit Berat</h3>
            <p>Koreksi berat untuk <b>{editFamily?.kepalaKeluarga}</b></p>
            <input type="number" step="0.1" value={editWeight} onChange={(e) => setEditWeight(e.target.value)} className="form-input-field" style={{marginBottom:'20px'}} />
            <div style={{display:'flex', justifyContent:'flex-end', gap:'10px'}}>
              <button onClick={() => setShowEditModal(false)} style={modalStyles.btnCancel}>Batal</button>
              <button onClick={handleEditSubmit} style={modalStyles.btnConfirm}>Simpan</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL WITHDRAW */}
      {showWithdrawModal && (
        <div className="modal-overlay" style={modalStyles.overlay}>
          <div className="modal-content" style={modalStyles.content}>
            <h3>💸 Tarik Tunai</h3>
            <p>Saldo Tersedia: <b>{formatRupiah(withdrawFamily?.balance || 0)}</b></p>
            <input type="number" placeholder="Nominal Rp..." value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)} className="form-input-field" style={{marginBottom:'20px'}} />
            <div style={{display:'flex', justifyContent:'flex-end', gap:'10px'}}>
              <button onClick={() => setShowWithdrawModal(false)} style={modalStyles.btnCancel}>Batal</button>
              <button onClick={handleWithdraw} style={{...modalStyles.btnConfirm, background:'#f59e0b'}}>Cairkan</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DELETE */}
      {showDeleteModal && (
        <div className="modal-overlay" style={modalStyles.overlay}>
          <div className="modal-content" style={modalStyles.content}>
            <h3 style={{color:'#ef4444'}}>🗑️ Reset Data?</h3>
            <p>Yakin reset data <b>{deleteFamily?.kepalaKeluarga}</b> jadi 0?</p>
            <div style={{display:'flex', justifyContent:'flex-end', gap:'10px', marginTop:'20px'}}>
              <button onClick={() => setShowDeleteModal(false)} style={modalStyles.btnCancel}>Batal</button>
              <button onClick={handleDeleteSubmit} style={{...modalStyles.btnConfirm, background:'#ef4444'}}>Ya, Reset</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

const modalStyles = {
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  content: { background: 'white', padding: '30px', borderRadius: '20px', width: '400px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' },
  btnCancel: { padding: '10px 20px', border: '1px solid #e2e8f0', background: 'transparent', borderRadius: '8px', cursor: 'pointer' },
  btnConfirm: { padding: '10px 20px', border: 'none', background: '#3b82f6', color: 'white', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }
};

export default BankSampah;