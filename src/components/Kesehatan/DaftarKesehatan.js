import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_ALL_HEALTH_RECORDS } from "../../graphql/healthQueries";
import {
  DELETE_HEALTH_RECORD,
  UPDATE_HEALTH_RECORD,
} from "../../graphql/healthMutations";
import { FaTrash, FaEdit, FaSave, FaTimes } from "react-icons/fa";

const DaftarKesehatan = ({ searchTerm }) => {
  const [editRecord, setEditRecord] = useState(null);
  const { data, loading } = useQuery(GET_ALL_HEALTH_RECORDS, {
    pollInterval: 3000,
  });

  const [deleteRecord] = useMutation(DELETE_HEALTH_RECORD, {
    refetchQueries: [{ query: GET_ALL_HEALTH_RECORDS }],
  });

  const [updateRecord] = useMutation(UPDATE_HEALTH_RECORD, {
    refetchQueries: [{ query: GET_ALL_HEALTH_RECORDS }],
    onCompleted: () => {
      alert("Data Berhasil Diperbarui!");
      setEditRecord(null);
    },
  });

  if (loading)
    return <div className="p-4 text-center">Menyinkronkan data...</div>;

  const filteredData =
    data?.getAllHealthRecords?.filter((h) =>
      h.citizen?.name.toLowerCase().includes(searchTerm.toLowerCase()),
    ) || [];

  return (
    <div className="table-responsive bg-white rounded-4 shadow-sm border overflow-hidden">
      <table className="table table-hover mb-0 align-middle">
        <thead className="table-pink">
          <tr>
            <th className="ps-4 py-3">NAMA WARGA</th>
            <th className="text-center">TANGGAL</th>
            <th className="text-center">GOL</th>
            <th className="text-center">KONDISI</th>
            <th>KETERANGAN</th>
            <th className="text-center">AKSI</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((h) => (
            <tr key={h.id}>
              <td className="ps-4">
                <div className="fw-bold">{h.citizen?.name}</div>
                <small className="text-muted">{h.citizen?.nik}</small>
              </td>
              <td className="text-center small">
                {new Date(parseInt(h.createdAt)).toLocaleDateString("id-ID")}
              </td>
              <td className="text-center fw-bold">{h.bloodType}</td>
              <td className="text-center">
                <span
                  className={`badge-pill ${h.healthStatus === "DARURAT" ? "b-darurat" : h.healthStatus === "PANTAUAN" ? "b-pantau" : "b-sehat"}`}
                >
                  {h.healthStatus}
                </span>
              </td>
              <td className="small">{h.notes || "-"}</td>
              <td className="text-center">
                <button
                  className="btn btn-sm btn-outline-warning me-2 border-0"
                  onClick={() => setEditRecord(h)}
                >
                  <FaEdit />
                </button>
                <button
                  className="btn btn-sm btn-outline-danger border-0"
                  onClick={() =>
                    window.confirm("Hapus riwayat ini?") &&
                    deleteRecord({ variables: { id: h.id } })
                  }
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MODAL EDIT RIWAYAT */}
      {editRecord && (
        <div
          className="modal show d-block p-4"
          style={{
            backgroundColor: "rgba(0,0,0,0.6)",
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 1060,
          }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="modal-header bg-primary text-white py-3 border-0">
                <h5 className="mb-0 fw-bold">
                  <FaEdit className="me-2" /> Edit Riwayat Pemeriksaan
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setEditRecord(null)}
                ></button>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  updateRecord({
                    variables: {
                      id: editRecord.id,
                      healthStatus: editRecord.healthStatus,
                      bloodType: editRecord.bloodType,
                      notes: editRecord.notes,
                    },
                  });
                }}
              >
                <div className="modal-body p-4 bg-white">
                  <p className="small text-muted mb-3">
                    Mengedit data untuk:{" "}
                    <strong>{editRecord.citizen?.name}</strong>
                  </p>
                  <div className="mb-3">
                    <label className="small fw-bold text-muted mb-2">
                      Kondisi
                    </label>
                    <select
                      className="form-select"
                      value={editRecord.healthStatus}
                      onChange={(e) =>
                        setEditRecord({
                          ...editRecord,
                          healthStatus: e.target.value,
                        })
                      }
                    >
                      <option value="SEHAT">SEHAT</option>
                      <option value="PANTAUAN">PANTAUAN</option>
                      <option value="DARURAT">DARURAT</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="small fw-bold text-muted mb-2">
                      Gol. Darah
                    </label>
                    <select
                      className="form-select"
                      value={editRecord.bloodType}
                      onChange={(e) =>
                        setEditRecord({
                          ...editRecord,
                          bloodType: e.target.value,
                        })
                      }
                    >
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="AB">AB</option>
                      <option value="O">O</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="small fw-bold text-muted mb-2">
                      Keterangan
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={editRecord.notes}
                      onChange={(e) =>
                        setEditRecord({ ...editRecord, notes: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="modal-footer d-flex justify-content-between p-3 border-0">
                  <button
                    type="button"
                    className="btn btn-secondary px-4 fw-bold rounded-3"
                    onClick={() => setEditRecord(null)}
                  >
                    <FaTimes className="me-2" />
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary px-4 fw-bold shadow-sm rounded-3"
                  >
                    <FaSave className="me-2" />
                    Update Riwayat
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DaftarKesehatan;
