import React from "react";

const DaftarKesehatan = () => {
    const kesehatanData = [
        { nik: '1234567890123456', noKK: '1234567890', nama: 'Contoh Warga', golonganDarah: 'O', tinggiBadan: '170 cm', beratBadan: '70 kg', riwayatPenyakit: 'Tidak Ada', apakahDisabilitas: 'Tidak', tanggalPemeriksaan: '2023-10-01' },
        { nik: '1234567890123457', noKK: '1234567891', nama: 'Warga Contoh 2', golonganDarah: 'A', tinggiBadan: '160 cm', beratBadan: '60 kg', riwayatPenyakit: 'Ada', apakahDisabilitas: 'Ya', tanggalPemeriksaan: '2023-10-05' },
    ];

    return (
        <div>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>NIK</th>
                        <th>No KK</th>
                        <th>Nama</th>
                        <th>Golongan Darah</th>
                        <th>Tinggi Badan</th>
                        <th>Berat Badan</th>
                        <th>Riwayat Penyakit</th>
                        <th>Apakah Disabilitas</th>
                        <th>Tanggal Pemeriksaan</th>
                    </tr>
                </thead>
                <tbody>
                    {kesehatanData.map((data, index) => (
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
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DaftarKesehatan;