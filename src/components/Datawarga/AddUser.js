import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { ADD_WARGA } from "../../graphql/userMutations";
import { GET_WARGA } from "../../graphql/userQueries";

const AddUser = () => {
    const [nik, setNik] = useState("");
    const [nama, setNama] = useState("");
    const [alamat, setAlamat] = useState("");
    const [status, setStatus] = useState("");
    const [tglMasuk, setTglMasuk] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const [addWarga, { loading, error }] = useMutation(ADD_WARGA, {
        refetchQueries: [{ query: GET_WARGA }],
        onCompleted: () => {
            setSuccessMsg("Data warga berhasil ditambahkan.");
            setTimeout(() => setSuccessMsg(""), 2500);
        },
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        await addWarga({ variables: { nik, nama, alamat, status, tglMasuk } });
        setNik("");
        setNama("");
        setAlamat("");
        setStatus("");
        setTglMasuk("");
    };

    return (
        <form className="dw-form" onSubmit={handleSubmit}>
            <div className="dw-form-group">
                <label>NIK</label>
                <input
                    type="text"
                    className="form-control"
                    value={nik}
                    onChange={(e) => setNik(e.target.value)}
                    required
                />
            </div>

            <div className="dw-form-group">
                <label>Nama Kepala Keluarga</label>
                <input
                    type="text"
                    className="form-control"
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    required
                />
            </div>

            <div className="dw-form-group">
                <label>Alamat Rumah</label>
                <input
                    type="text"
                    className="form-control"
                    value={alamat}
                    onChange={(e) => setAlamat(e.target.value)}
                    required
                />
            </div>

            <div className="dw-form-group">
                <label>Status Rumah</label>
                <input
                    type="text"
                    className="form-control"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    required
                />
            </div>

            <div className="dw-form-group">
                <label>Tanggal Masuk</label>
                <input
                    type="date"
                    className="form-control"
                    value={tglMasuk}
                    onChange={(e) => setTglMasuk(e.target.value)}
                    required
                />
            </div>

            <div className="dw-form-actions">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? "Menyimpan..." : "Simpan"}
                </button>
            </div>

            {successMsg && <p className="dw-success">{successMsg}</p>}
            {error && <p className="dw-error">Error: {error.message}</p>}
        </form>
    );
};

export default AddUser;