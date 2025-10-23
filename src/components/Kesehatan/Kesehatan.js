import React, { useState } from 'react';
import './Kesehatan.css';

const Kesehatan = () => {
    const [nik, setNik] = useState('');
    const [noKK, setNoKK] = useState('');
    const [nama, setNama] = useState('');
    const [golonganDarah, setGolonganDarah] = useState('');
    const [tinggiBadan, setTinggiBadan] = useState('');
    const [beratBadan, setBeratBadan] = useState('');
    const [riwayatPenyakit, setRiwayatPenyakit] = useState('');
    const [apakahDisabilitas, setApakahDisabilitas] = useState('');
    const [tanggalPemeriksaan, setTanggalPemeriksaan] = useState('');
    const [dataKesehatan, setDataKesehatan] = useState([]);

    const handleAdd = () => {
        const newData = {
            nik,
            noKK,
            nama,
            golonganDarah,
            tinggiBadan,
            beratBadan,
            riwayatPenyakit,
            apakahDisabilitas,
            tanggalPemeriksaan
        };
        setDataKesehatan([...dataKesehatan, newData]);
        resetForm();
    };

    const resetForm = () => {
        setNik('');
        setNoKK('');
        setNama('');
        setGolonganDarah('');
        setTinggiBadan('');
        setBeratBadan('');
        setRiwayatPenyakit('');
        setApakahDisabilitas('');
        setTanggalPemeriksaan('');
    };

    return (
        <div className="kesehatan-container">
            <h2>FORM INPUT KESEHATAN WARGA</h2>
            <form onSubmit={(e) => e.preventDefault()} className="kesehatan-form">
                <input type="text" placeholder="NIK" value={nik} onChange={(e) => setNik(e.target.value)} />
                <input type="text" placeholder="No KK" value={noKK} onChange={(e) => setNoKK(e.target.value)} />
                <input type="text" placeholder="Nama" value={nama} onChange={(e) => setNama(e.target.value)} />
                <input type="text" placeholder="Golongan Darah" value={golonganDarah} onChange={(e) => setGolonganDarah(e.target.value)} />
                <input type="number" placeholder="Tinggi Badan (cm)" value={tinggiBadan} onChange={(e) => setTinggiBadan(e.target.value)} />
                <input type="number" placeholder="Berat Badan (kg)" value={beratBadan} onChange={(e) => setBeratBadan(e.target.value)} />
                <input type="text" placeholder="Riwayat Penyakit" value={riwayatPenyakit} onChange={(e) => setRiwayatPenyakit(e.target.value)} />
                <input type="text" placeholder="Apakah Disabilitas" value={apakahDisabilitas} onChange={(e) => setApakahDisabilitas(e.target.value)} />
                <input type="date" value={tanggalPemeriksaan} onChange={(e) => setTanggalPemeriksaan(e.target.value)} />
                <button onClick={handleAdd}>Tambah</button>
            </form>
            <table>
                <thead>
                    <tr>
                        <th>NIK</th>
                        <th>No KK</th>
                        <th>Nama</th>
                        <th>Gol Darah</th>
                        <th>Tinggi Badan (cm)</th>
                        <th>Berat Badan (kg)</th>
                        <th>Riwayat Penyakit</th>
                        <th>Apakah Disabilitas</th>
                        <th>Tanggal Pemeriksaan</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {dataKesehatan.map((data, index) => (
                        <tr key={index}>
                            <td>{data.nik}</td>
                            <td>{data.noKK}</td>
                            <td>{data.nama}</td>
                            <td>{data.golonganDarah}</td>
                            <td>{data.tinggiBadan}</td>
                            <td>{data.beratBadan}</td>
                            <td>{data.riwayatPenyakit}</td>
                            <td>{data.apakahDisabilitas}</td>
                            <td>{data.tanggalPemeriksaan}</td>
                            <td><button>Hapus</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Kesehatan;