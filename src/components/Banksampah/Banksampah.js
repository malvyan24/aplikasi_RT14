import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";

// Import Logic GraphQL
import {
  GET_WARGA,
  GET_ALL_CITIZENS,
  GET_SAMPAH_STATS,
} from "../../graphql/userQueries";
// Pastikan UPDATE_FAMILY_WASTE dan DELETE_TABUNGAN sudah ada di sampahMutations.js kamu
import {
  ADD_SETORAN,
  WITHDRAW_FUND,
  UPDATE_FAMILY_WASTE,
  DELETE_TABUNGAN,
} from "../../graphql/sampahMutations";

// Import Library Tambahan
import Select from "react-select";
import { toast } from "react-toastify";
import { QRCodeCanvas } from "qrcode.react";
import { FaEdit, FaTrash, FaMoneyBillWave } from "react-icons/fa"; // Install: npm install react-icons

// DAFTAR HARGA
const PRICE_LIST = {
  Plastik: 3000,
  "Kertas/Kardus": 2000,
  "Logam/Besi": 5000,
  Kaca: 1000,
};

const BankSampah = () => {
  // --- STATE UTAMA ---
  const [selectedCitizen, setSelectedCitizen] = useState(null);
  const [berat, setBerat] = useState("");
  const [kategori, setKategori] = useState("Plastik");

  // --- STATE MODAL ---
  // Modal Withdraw
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawFamily, setWithdrawFamily] = useState(null);
  const [withdrawAmount, setWithdrawAmount] = useState("");

  // Modal QR Code
  const [qrModalFamily, setQrModalFamily] = useState(null);

  // Modal Edit (Revisi Berat)
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFamily, setEditFamily] = useState(null);
  const [editWeight, setEditWeight] = useState("");

  // Modal Delete (Reset Data)
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteFamily, setDeleteFamily] = useState(null);

  // --- GRAPHQL QUERY ---
  const { data: dataWarga, refetch: refetchWarga } = useQuery(GET_WARGA);
  const { data: dataCitizens } = useQuery(GET_ALL_CITIZENS);
  const { data: dataStats, refetch: refetchStats } = useQuery(GET_SAMPAH_STATS);

  // --- GRAPHQL MUTATION ---
  const [addSetoran] = useMutation(ADD_SETORAN, {
    onCompleted: () => {
      toast.success("✅ Saldo berhasil ditambahkan!");
      refetchWarga();
      refetchStats();
      setBerat("");
      setSelectedCitizen(null);
    },
    onError: (err) => toast.error(err.message),
  });

  const [withdrawFund] = useMutation(WITHDRAW_FUND, {
    onCompleted: () => {
      toast.success("✅ Pencairan dana sukses!");
      refetchWarga();
      refetchStats();
      setShowWithdrawModal(false);
      setWithdrawAmount("");
    },
    onError: (err) => toast.error(err.message),
  });

  const [updateFamilyWaste] = useMutation(UPDATE_FAMILY_WASTE, {
    onCompleted: () => {
      toast.info("✏️ Data berat sampah berhasil direvisi.");
      refetchWarga();
      refetchStats();
      setShowEditModal(false);
    },
    onError: (err) => toast.error(err.message),
  });

  const [deleteTabungan] = useMutation(DELETE_TABUNGAN, {
    onCompleted: () => {
      toast.error("🗑️ Data tabungan berhasil di-reset (0).");
      refetchWarga();
      refetchStats();
      setShowDeleteModal(false);
    },
    onError: (err) => toast.error(err.message),
  });

  // --- HANDLERS ---
  const handleSimpan = (e) => {
    e.preventDefault();
    if (!selectedCitizen || !berat)
      return toast.warning("⚠️ Data belum lengkap!");
    addSetoran({
      variables: {
        citizenId: selectedCitizen.value,
        berat: parseFloat(berat),
        kategori,
      },
    });
  };

  const handleWithdraw = () => {
    if (!withdrawFamily || !withdrawAmount) return;
    withdrawFund({
      variables: {
        familyId: withdrawFamily.id,
        amount: parseFloat(withdrawAmount),
      },
    });
  };

  const handleEditSubmit = () => {
    if (!editFamily || editWeight === "") return;
    updateFamilyWaste({
      variables: {
        familyId: editFamily.id,
        totalTabungan: parseFloat(editWeight),
      },
    });
  };

  const handleDeleteSubmit = () => {
    if (!deleteFamily) return;
    deleteTabungan({ variables: { familyId: deleteFamily.id } });
  };

  // Helper
  const downloadQR = () => {
    const canvas = document.getElementById("qr-code-large");
    if (canvas) {
      const pngUrl = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `QR-${qrModalFamily.kepalaKeluarga}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  const formatRupiah = (number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(number);

  const citizenOptions =
    dataCitizens?.citizens.map((c) => ({
      value: c.id,
      label: `${c.name} (KK: ${c.family?.kepalaKeluarga || "-"})`,
    })) || [];

  // --- STYLES OBJECT (CSS IN JS) ---
  const styles = {
    container: {
      padding: "30px",
      backgroundColor: "#f4f7fe",
      minHeight: "100vh",
      fontFamily: "sans-serif",
    },
    headerTitle: {
      fontSize: "24px",
      fontWeight: "bold",
      color: "#2b3674",
      marginBottom: "20px",
    },

    statsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: "20px",
      marginBottom: "30px",
    },
    card: {
      borderRadius: "15px",
      padding: "20px",
      color: "white",
      display: "flex",
      flexDirection: "column",
      boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    },
    cardGreen: { backgroundColor: "#05CD99" },
    cardBlue: { backgroundColor: "#4318FF" },
    cardPurple: { backgroundColor: "#7551FF" },

    mainLayout: {
      display: "grid",
      gridTemplateColumns: "350px 1fr",
      gap: "30px",
      alignItems: "start",
    },

    formCard: {
      backgroundColor: "white",
      borderRadius: "20px",
      padding: "25px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
    },
    sectionTitle: {
      fontSize: "18px",
      fontWeight: "bold",
      color: "#2b3674",
      marginBottom: "20px",
      borderBottom: "1px solid #eee",
      paddingBottom: "10px",
    },
    label: {
      display: "block",
      fontSize: "14px",
      color: "#8F9BBA",
      marginBottom: "8px",
      fontWeight: "500",
    },
    input: {
      width: "100%",
      padding: "12px",
      borderRadius: "10px",
      border: "1px solid #e0e5f2",
      fontSize: "14px",
      outline: "none",
    },
    btnSimpan: {
      width: "100%",
      padding: "12px",
      backgroundColor: "#05CD99",
      color: "white",
      border: "none",
      borderRadius: "10px",
      fontWeight: "bold",
      cursor: "pointer",
      marginTop: "10px",
    },

    tableCard: {
      backgroundColor: "white",
      borderRadius: "20px",
      padding: "25px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
      overflowX: "auto",
    },
    table: { width: "100%", borderCollapse: "collapse" },
    th: {
      textAlign: "left",
      padding: "15px",
      borderBottom: "1px solid #eee",
      color: "#a3aed0",
      fontSize: "12px",
      textTransform: "uppercase",
    },
    td: {
      padding: "15px",
      borderBottom: "1px solid #f5f5f5",
      color: "#2b3674",
      fontSize: "14px",
      fontWeight: "600",
    },

    // ACTION BUTTONS
    actionGroup: { display: "flex", gap: "8px", justifyContent: "center" },
    btnIcon: {
      width: "32px",
      height: "32px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "8px",
      border: "none",
      cursor: "pointer",
      color: "white",
    },
    btnWithdraw: { backgroundColor: "#FFA800" }, // Orange (Tarik)
    btnEdit: { backgroundColor: "#4318FF" }, // Biru (Edit)
    btnDelete: { backgroundColor: "#FF5630" }, // Merah (Hapus)

    qrBox: {
      width: "40px",
      height: "40px",
      padding: "2px",
      border: "1px solid #eee",
      borderRadius: "5px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      transition: "0.2s",
    },

    // MODAL
    modalOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
    },
    modalContent: {
      backgroundColor: "white",
      padding: "30px",
      borderRadius: "20px",
      width: "400px",
      boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
      position: "relative",
    },
    modalActions: {
      display: "flex",
      justifyContent: "flex-end",
      gap: "10px",
      marginTop: "20px",
    },
    btnCancel: {
      padding: "10px 20px",
      border: "1px solid #ccc",
      borderRadius: "8px",
      background: "transparent",
      cursor: "pointer",
    },
    btnConfirm: {
      padding: "10px 20px",
      color: "white",
      border: "none",
      borderRadius: "8px",
      fontWeight: "bold",
      cursor: "pointer",
    },
    btnDownload: {
      width: "100%",
      padding: "10px",
      backgroundColor: "#4318FF",
      color: "white",
      border: "none",
      borderRadius: "8px",
      fontWeight: "bold",
      cursor: "pointer",
      marginTop: "15px",
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.headerTitle}>🏦 Bank Sampah & Keuangan RT</h1>

      {/* --- DASHBOARD STATS --- */}
      <div style={styles.statsGrid}>
        <div style={{ ...styles.card, ...styles.cardGreen }}>
          <span style={{ opacity: 0.8, fontSize: "14px" }}>
            Total Sampah Terkumpul
          </span>
          <span style={{ fontSize: "32px", fontWeight: "bold" }}>
            {dataStats?.sampahStats?.totalBerat || 0} Kg
          </span>
        </div>
        <div style={{ ...styles.card, ...styles.cardBlue }}>
          <span style={{ opacity: 0.8, fontSize: "14px" }}>
            Total Uang Warga
          </span>
          <span style={{ fontSize: "32px", fontWeight: "bold" }}>
            {formatRupiah(dataStats?.sampahStats?.totalUang || 0)}
          </span>
        </div>
        <div style={{ ...styles.card, ...styles.cardPurple }}>
          <span style={{ opacity: 0.8, fontSize: "14px" }}>
            KK Berpartisipasi
          </span>
          <span style={{ fontSize: "32px", fontWeight: "bold" }}>
            {dataStats?.sampahStats?.totalKKAktif || 0} KK
          </span>
        </div>
      </div>

      <div style={styles.mainLayout}>
        {/* --- FORM INPUT --- */}
        <div style={styles.formCard}>
          <h2 style={styles.sectionTitle}>📥 Input Setoran Baru</h2>
          <form onSubmit={handleSimpan}>
            <div style={{ marginBottom: "15px" }}>
              <label style={styles.label}>Cari Warga</label>
              <Select
                options={citizenOptions}
                value={selectedCitizen}
                onChange={setSelectedCitizen}
                placeholder="Ketik nama warga..."
              />
            </div>
            <div style={{ display: "flex", gap: "15px", marginBottom: "15px" }}>
              <div style={{ flex: 1 }}>
                <label style={styles.label}>Berat (Kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={berat}
                  onChange={(e) => setBerat(e.target.value)}
                  style={styles.input}
                  placeholder="0.0"
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={styles.label}>Kategori</label>
                <select
                  value={kategori}
                  onChange={(e) => setKategori(e.target.value)}
                  style={styles.input}
                >
                  <option value="Plastik">Plastik (Rp 3rb)</option>
                  <option value="Kertas/Kardus">Kertas (Rp 2rb)</option>
                  <option value="Logam/Besi">Logam (Rp 5rb)</option>
                  <option value="Kaca">Kaca (Rp 1rb)</option>
                </select>
              </div>
            </div>
            {berat && (
              <div
                style={{
                  backgroundColor: "#e6fffa",
                  padding: "10px",
                  borderRadius: "8px",
                  color: "#047857",
                  marginBottom: "15px",
                  fontSize: "13px",
                  fontWeight: "bold",
                }}
              >
                💰 Estimasi: {formatRupiah(berat * PRICE_LIST[kategori])}
              </div>
            )}
            <button type="submit" style={styles.btnSimpan}>
              + Simpan & Tambah Saldo
            </button>
          </form>
        </div>

        {/* --- TABEL REKAPITULASI --- */}
        <div style={styles.tableCard}>
          <h2 style={styles.sectionTitle}>📊 Rekapitulasi Saldo Keluarga</h2>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Kepala Keluarga</th>
                <th style={styles.th}>QR Code</th>
                <th style={{ ...styles.th, textAlign: "center" }}>
                  Total Berat
                </th>
                <th style={{ ...styles.th, textAlign: "right" }}>Saldo (Rp)</th>
                <th style={{ ...styles.th, textAlign: "center" }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {dataWarga?.families.map((family) => (
                <tr key={family.id}>
                  <td style={styles.td}>
                    <div>{family.kepalaKeluarga}</div>
                    <div style={{ fontSize: "11px", color: "#a3aed0" }}>
                      {family.noKK}
                    </div>
                  </td>
                  <td style={styles.td}>
                    <div
                      style={styles.qrBox}
                      onClick={() => setQrModalFamily(family)}
                      title="Klik untuk Download"
                    >
                      <QRCodeCanvas value={family.qrCode || "-"} size={32} />
                    </div>
                  </td>
                  <td style={{ ...styles.td, textAlign: "center" }}>
                    {family.totalTabungan || 0} Kg
                  </td>
                  <td
                    style={{
                      ...styles.td,
                      textAlign: "right",
                      color: "#05CD99",
                    }}
                  >
                    {formatRupiah(family.balance || 0)}
                  </td>
                  <td style={styles.td}>
                    <div style={styles.actionGroup}>
                      {/* Tombol Edit */}
                      <button
                        style={{ ...styles.btnIcon, ...styles.btnEdit }}
                        title="Edit Berat Sampah"
                        onClick={() => {
                          setEditFamily(family);
                          setEditWeight(family.totalTabungan || 0);
                          setShowEditModal(true);
                        }}
                      >
                        <FaEdit />
                      </button>

                      {/* Tombol Withdraw */}
                      <button
                        style={{ ...styles.btnIcon, ...styles.btnWithdraw }}
                        title="Tarik Tunai"
                        onClick={() => {
                          setWithdrawFamily(family);
                          setShowWithdrawModal(true);
                        }}
                      >
                        <FaMoneyBillWave />
                      </button>

                      {/* Tombol Delete */}
                      <button
                        style={{ ...styles.btnIcon, ...styles.btnDelete }}
                        title="Reset Data (Hapus)"
                        onClick={() => {
                          setDeleteFamily(family);
                          setShowDeleteModal(true);
                        }}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL 1: EDIT BERAT --- */}
      {showEditModal && editFamily && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                marginBottom: "15px",
              }}
            >
              ✏️ Edit Total Berat
            </h3>
            <p style={{ marginBottom: "15px", color: "#666" }}>
              Ubah total berat sampah untuk keluarga{" "}
              <b>{editFamily.kepalaKeluarga}</b>.
            </p>
            <label style={styles.label}>Total Berat Baru (Kg)</label>
            <input
              type="number"
              step="0.1"
              style={{ ...styles.input, fontSize: "18px", fontWeight: "bold" }}
              value={editWeight}
              onChange={(e) => setEditWeight(e.target.value)}
            />
            <div style={styles.modalActions}>
              <button
                onClick={() => setShowEditModal(false)}
                style={styles.btnCancel}
              >
                Batal
              </button>
              <button
                onClick={handleEditSubmit}
                style={{ ...styles.btnConfirm, backgroundColor: "#4318FF" }}
              >
                Simpan Revisi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 2: WITHDRAW --- */}
      {showWithdrawModal && withdrawFamily && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                marginBottom: "15px",
              }}
            >
              💸 Pencairan Dana
            </h3>
            <div
              style={{
                backgroundColor: "#f4f7fe",
                padding: "15px",
                borderRadius: "10px",
                marginBottom: "20px",
              }}
            >
              <p style={{ margin: "5px 0", fontSize: "14px" }}>
                Keluarga: <b>{withdrawFamily.kepalaKeluarga}</b>
              </p>
              <p style={{ margin: "5px 0", fontSize: "14px" }}>
                Saldo Tersedia:{" "}
                <b style={{ color: "#05CD99" }}>
                  {formatRupiah(withdrawFamily.balance || 0)}
                </b>
              </p>
            </div>
            <label style={styles.label}>Nominal Penarikan (Rp)</label>
            <input
              type="number"
              style={{ ...styles.input, fontSize: "18px", fontWeight: "bold" }}
              placeholder="Contoh: 50000"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
            />
            <div style={styles.modalActions}>
              <button
                onClick={() => setShowWithdrawModal(false)}
                style={styles.btnCancel}
              >
                Batal
              </button>
              <button
                onClick={handleWithdraw}
                style={{ ...styles.btnConfirm, backgroundColor: "#FFA800" }}
              >
                Konfirmasi Tarik
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 3: DELETE / RESET --- */}
      {showDeleteModal && deleteFamily && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                marginBottom: "15px",
                color: "#FF5630",
              }}
            >
              🗑️ Reset Data Sampah?
            </h3>
            <p style={{ marginBottom: "15px", color: "#666" }}>
              Anda yakin ingin mereset data sampah dan saldo untuk keluarga{" "}
              <b>{deleteFamily.kepalaKeluarga}</b> menjadi 0?
              <br />
              <br />
              <span style={{ color: "red", fontSize: "12px" }}>
                *Tindakan ini tidak bisa dibatalkan.
              </span>
            </p>
            <div style={styles.modalActions}>
              <button
                onClick={() => setShowDeleteModal(false)}
                style={styles.btnCancel}
              >
                Batal
              </button>
              <button
                onClick={handleDeleteSubmit}
                style={{ ...styles.btnConfirm, backgroundColor: "#FF5630" }}
              >
                Ya, Reset Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 4: QR CODE --- */}
      {qrModalFamily && (
        <div style={styles.modalOverlay} onClick={() => setQrModalFamily(null)}>
          <div
            style={{ ...styles.modalContent, textAlign: "center" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                marginBottom: "5px",
              }}
            >
              Kartu Digital Sampah
            </h3>
            <p style={{ color: "#8F9BBA", marginBottom: "20px" }}>
              {qrModalFamily.kepalaKeluarga} ({qrModalFamily.noKK})
            </p>
            <div
              style={{
                border: "2px dashed #e0e5f2",
                padding: "20px",
                borderRadius: "15px",
                display: "inline-block",
              }}
            >
              <QRCodeCanvas
                id="qr-code-large"
                value={qrModalFamily.qrCode || "-"}
                size={250}
                level={"H"}
                includeMargin={true}
              />
            </div>
            <button onClick={downloadQR} style={styles.btnDownload}>
              📥 Download QR Code
            </button>
            <button
              onClick={() => setQrModalFamily(null)}
              style={{
                marginTop: "10px",
                background: "transparent",
                border: "none",
                color: "#8F9BBA",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BankSampah;
