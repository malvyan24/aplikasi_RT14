import React from "react";
import "./Kegiatanlingkungan.css";  // Gaya khusus untuk halaman kegiatan lingkungan

function KegiatanLingkungan() {
  return (
    <div className="kegiatan-container">
      <h1>Kegiatan Lingkungan</h1>
      <p>
        Di halaman ini, kami akan menampilkan berbagai kegiatan yang terkait
        dengan lingkungan di RT 14. Halaman ini berfungsi untuk memberikan
        informasi tentang aktivitas yang mendukung keberlanjutan dan kebersihan
        lingkungan.
      </p>

      {/* Anda bisa menambahkan lebih banyak konten di sini sesuai kebutuhan */}
      <div className="kegiatan-card">
        <h2>Kegiatan Terbaru</h2>
        <img src="/image/kegiatan1.png" alt="Kegiatan 1" className="kegiatan-img" />
        <p>
          Kegiatan terbaru yang dilakukan oleh masyarakat RT 14 untuk menjaga
          kebersihan lingkungan.
        </p>
      </div>
    </div>
  );
}

export default KegiatanLingkungan;
