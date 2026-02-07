import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_WARGA, GET_ALL_CITIZENS } from "../../graphql/userQueries";
import {
  DELETE_WARGA,
  ADD_CITIZEN,
  DELETE_CITIZEN,
} from "../../graphql/userMutations";
import {
  FaEye,
  FaTrash,
  FaUserPlus,
  FaUsers,
  FaInfoCircle,
  FaClipboardList,
  FaSearch,
} from "react-icons/fa";

const UserList = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [memberForm, setMemberForm] = useState({
    name: "",
    nik: "",
    gender: "L",
    religion: "Islam",
    placeOfBirth: "",
    dateOfBirth: "",
    profession: "-",
  });

  const { loading, error, data } = useQuery(GET_WARGA, { pollInterval: 5000 });
  const [deleteWarga] = useMutation(DELETE_WARGA, {
    refetchQueries: [{ query: GET_WARGA }, { query: GET_ALL_CITIZENS }],
  });

  const [addCitizen] = useMutation(ADD_CITIZEN, {
    refetchQueries: [{ query: GET_WARGA }, { query: GET_ALL_CITIZENS }],
    onCompleted: () => {
      alert("Data warga berhasil disimpan!");
      setMemberForm({
        name: "",
        nik: "",
        gender: "L",
        religion: "Islam",
        placeOfBirth: "",
        dateOfBirth: "",
        profession: "-",
      });
    },
  });

  const [deleteCitizen] = useMutation(DELETE_CITIZEN, {
    refetchQueries: [{ query: GET_WARGA }, { query: GET_ALL_CITIZENS }],
  });

  if (loading)
    return (
      <div className="p-5 text-center text-muted">Memuat data warga...</div>
    );
  if (error)
    return (
      <div className="alert alert-danger m-3">
        Terjadi kesalahan: {error.message}
      </div>
    );

  const filteredFamilies = data?.families.filter((item) =>
    item.kepalaKeluarga.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="user-list-wrapper">
      <div className="search-container p-3 bg-white border-bottom no-print">
        <div className="position-relative">
          <span className="position-absolute top-50 start-0 translate-middle-y ps-3 text-muted">
            <FaSearch />
          </span>
          <input
            type="text"
            className="form-control ps-5"
            placeholder="Cari nama kepala keluarga..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ borderRadius: "10px", border: "1px solid #e2e8f0" }}
          />
        </div>
      </div>

      <div className="table-responsive">
        <table className="dw-table">
          <thead>
            <tr>
              <th>No KK (NIK)</th>
              <th>Kepala Keluarga</th>
              <th>Alamat</th>
              <th>Status</th>
              <th className="text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredFamilies.length > 0 ? (
              filteredFamilies.map((item) => (
                <tr key={item.id}>
                  <td>
                    <strong>{item.noKK}</strong>
                  </td>
                  <td>{item.kepalaKeluarga}</td>
                  <td>{item.address || "-"}</td>
                  <td>
                    <span
                      className={`badge ${item.ownershipStatus === "OWNED" ? "bg-success" : "bg-warning"}`}
                    >
                      {item.ownershipStatus}
                    </span>
                  </td>
                  <td>
                    {/* PERBAIKAN: Tambah gap-2 agar tombol tidak dempet */}
                    <div className="d-flex gap-2 justify-content-center">
                      <button
                        className="btn btn-primary btn-sm px-3"
                        onClick={() => setSelectedUser(item)}
                      >
                        <FaEye /> Lihat
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm px-2"
                        onClick={() =>
                          window.confirm("Hapus data keluarga?") &&
                          deleteWarga({ variables: { id: item.id } })
                        }
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-5">
                  Data tidak ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL (TETAP RAPI & ANTI TERPOTONG) */}
      {selectedUser && (
        <div
          className="modal show d-block"
          style={{
            backgroundColor: "rgba(0,0,0,0.7)",
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 9999,
          }}
        >
          <div
            className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable"
            style={{ maxWidth: "850px" }}
          >
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header bg-primary text-white py-3">
                <h5 className="modal-title fw-bold">
                  <FaUsers className="me-2" /> Keluarga:{" "}
                  {selectedUser.kepalaKeluarga}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setSelectedUser(null)}
                ></button>
              </div>
              <div className="modal-body p-4 bg-light">
                <div className="alert bg-white border shadow-sm d-flex align-items-center mb-4 py-2 px-3">
                  <FaInfoCircle className="text-primary me-3" size={20} />
                  <div>
                    <span className="small text-uppercase fw-bold text-muted d-block">
                      Alamat Tinggal
                    </span>
                    <span className="text-dark fw-semibold">
                      {selectedUser.address}
                    </span>
                  </div>
                </div>

                <div className="card border-0 shadow-sm mb-4">
                  <div className="card-header bg-white py-2 border-0">
                    <h6 className="mb-0 fw-bold text-primary">
                      <FaUserPlus className="me-2" /> Tambah Anggota
                    </h6>
                  </div>
                  <div className="card-body pt-0">
                    <form
                      className="dw-form"
                      onSubmit={(e) => {
                        e.preventDefault();
                        addCitizen({
                          variables: {
                            ...memberForm,
                            familyId: selectedUser.id,
                            address: selectedUser.address,
                          },
                        });
                      }}
                    >
                      <div className="dw-form-group">
                        <label>Nama Lengkap</label>
                        <input
                          type="text"
                          required
                          value={memberForm.name}
                          onChange={(e) =>
                            setMemberForm({
                              ...memberForm,
                              name: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="dw-form-group">
                        <label>NIK</label>
                        <input
                          type="number"
                          required
                          value={memberForm.nik}
                          onChange={(e) =>
                            setMemberForm({
                              ...memberForm,
                              nik: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="dw-form-group">
                        <label>Tempat Lahir</label>
                        <input
                          type="text"
                          required
                          value={memberForm.placeOfBirth}
                          onChange={(e) =>
                            setMemberForm({
                              ...memberForm,
                              placeOfBirth: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="dw-form-group">
                        <label>Tgl Lahir</label>
                        <input
                          type="date"
                          required
                          value={memberForm.dateOfBirth}
                          onChange={(e) =>
                            setMemberForm({
                              ...memberForm,
                              dateOfBirth: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="dw-form-group">
                        <label>Agama</label>
                        <select
                          value={memberForm.religion}
                          onChange={(e) =>
                            setMemberForm({
                              ...memberForm,
                              religion: e.target.value,
                            })
                          }
                        >
                          <option value="Islam">Islam</option>
                          <option value="Kristen">Kristen</option>
                        </select>
                      </div>
                      <div className="dw-form-group">
                        <label>Gender</label>
                        <select
                          value={memberForm.gender}
                          onChange={(e) =>
                            setMemberForm({
                              ...memberForm,
                              gender: e.target.value,
                            })
                          }
                        >
                          <option value="L">Laki-laki (L)</option>
                          <option value="P">Perempuan (P)</option>
                        </select>
                      </div>
                      <div className="dw-form-actions">
                        <button
                          type="submit"
                          className="btn btn-primary w-100 mt-2"
                        >
                          Simpan Anggota
                        </button>
                      </div>
                    </form>
                  </div>
                </div>

                <h6 className="fw-bold text-dark mb-3">
                  <FaClipboardList className="me-2 text-primary" /> Daftar
                  Anggota
                </h6>
                <div className="table-responsive bg-white rounded border shadow-sm">
                  <table className="dw-table mb-0 small">
                    <thead className="table-light">
                      <tr>
                        <th className="ps-3">Nama</th>
                        <th>NIK</th>
                        <th>L/P</th>
                        <th className="text-center">Hapus</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.families
                        .find((f) => f.id === selectedUser.id)
                        ?.members?.map((m) => (
                          <tr key={m.id}>
                            <td className="ps-3 fw-bold text-primary">
                              {m.name}
                            </td>
                            <td>{m.nik}</td>
                            <td>{m.gender}</td>
                            <td className="text-center">
                              <button
                                className="btn btn-sm text-danger p-0"
                                onClick={() =>
                                  window.confirm("Hapus?") &&
                                  deleteCitizen({ variables: { id: m.id } })
                                }
                              >
                                <FaTrash size={14} />
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
        </div>
      )}
    </div>
  );
};

export default UserList;
