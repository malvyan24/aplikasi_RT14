import React from 'react';
import './Kegiatanlingkungan.css';

function KegiatanLingkungan() {
  return (
    <div className="kegiatan-container">
      <h1>Kegiatan Lingkungan</h1>
      <p>
        Di halaman ini, kami akan menampilkan berbagai kegiatan yang terkait dengan
        lingkungan di RT 14. Halaman ini berfungsi untuk memberikan informasi tentang
        aktivitas yang mendukung keberlanjutan dan kebersihan lingkungan.
      </p>

      <div className="kegiatan-card-container">
        <h2>Kegiatan Terbaru</h2>
        <div className="kegiatan-card">
          <img src="/image/kegiatan1.png" alt="Kegiatan 1" />
          <div className="kegiatan-info">
            <h3>Kegiatan 1</h3>
            <p>
              Kegiatan terbaru yang dilakukan oleh masyarakat RT 14 untuk menjaga
              kebersihan lingkungan.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default KegiatanLingkungan;
