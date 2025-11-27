// src/components/Banksampah/DataSampah.js
import React from "react";

const DataSampah = () => {
    return (
        <div>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Jenis Sampah</th>
                        <th>Berat (kg)</th>
                        <th>Tanggal</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Contoh Sampah</td>
                        <td>25</td>
                        <td>2025-01-01</td>
                    </tr>
                    {/* Tambahkan baris data lain di sini */}
                </tbody>
            </table>
        </div>
    );
};

export default DataSampah;