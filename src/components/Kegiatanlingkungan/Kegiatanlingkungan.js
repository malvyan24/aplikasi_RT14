import React from "react";
import "./Kegiatanlingkungan.css";

const KegiatanLingkungan = () => {
  return (
    <div className="kgl-wrapper">
      {/* ===== HERO / BAGIAN ATAS ===== */}
      <section className="kgl-hero">
        {/* Kolom kiri: judul & deskripsi */}
        <div className="kgl-hero-left">
          <p className="kgl-badge">Program Keamanan Lingkungan</p>
          <h1 className="kgl-title">Siskamling RT 14</h1>
          <p className="kgl-text">
            Siskamling (Sistem Keamanan Lingkungan) RT 14 adalah kegiatan ronda
            malam yang dilakukan secara bergiliran oleh warga untuk menjaga
            keamanan, ketertiban, dan kenyamanan lingkungan.
          </p>
          <p className="kgl-text">
            Dengan adanya Siskamling, diharapkan lingkungan RT 14 tetap aman
            dari tindak kejahatan serta meningkatkan rasa kebersamaan antar
            warga.
          </p>

          <div className="kgl-tags">
            <span className="kgl-tag">Ronda Malam</span>
            <span className="kgl-tag">Keamanan Warga</span>
            <span className="kgl-tag">Gotong Royong</span>
          </div>
        </div>

        {/* Kolom kanan: ringkasan kegiatan */}
        <div className="kgl-hero-right">
          <div className="kgl-hero-card">
            <div className="kgl-hero-icon">🌙</div>
            <h3>Ringkasan Kegiatan</h3>
            <ul>
              <li>Ronda malam rutin 3x dalam seminggu</li>
              <li>Petugas bergiliran per blok rumah</li>
              <li>Koordinasi dengan Ketua RT 14</li>
            </ul>
            <div className="kgl-hero-note">
              Pos ronda berlokasi di dekat gerbang utama RT 14.
            </div>
          </div>
        </div>
      </section>

      {/* ===== BAGIAN BAWAH: JADWAL + ATURAN + KONTAK ===== */}
      <section className="kgl-content">
        {/* Jadwal ronda */}
        <div className="kgl-card">
          <div className="kgl-card-header">
            <div>
              <h2>Jadwal Ronda Malam</h2>
              <p className="kgl-card-subtitle">
                Contoh jadwal yang dapat disesuaikan dengan kebutuhan RT 14.
              </p>
            </div>
            <span className="kgl-card-pill">Periode Mingguan</span>
          </div>

          <div className="kgl-table-wrapper">
            <table className="kgl-table">
              <thead>
                <tr>
                  <th>Hari</th>
                  <th>Waktu</th>
                  <th>Petugas</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Senin</td>
                  <td>22.00 – 04.00</td>
                  <td>Warga Blok A &amp; Blok B</td>
                </tr>
                <tr>
                  <td>Rabu</td>
                  <td>22.00 – 04.00</td>
                  <td>Warga Blok C &amp; Blok D</td>
                </tr>
                <tr>
                  <td>Jumat</td>
                  <td>22.00 – 04.00</td>
                  <td>Warga Blok E &amp; Blok F</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Aturan & Kontak dalam 2 kolom */}
        <div className="kgl-grid-2">
          {/* Aturan */}
          <div className="kgl-card">
            <h2>Aturan Pelaksanaan Siskamling</h2>
            <p className="kgl-card-subtitle">
              Agar kegiatan berjalan tertib dan nyaman, mohon diperhatikan
              beberapa poin berikut:
            </p>
            <ul className="kgl-list">
              <li>
                Petugas ronda hadir tepat waktu sesuai jadwal yang ditentukan.
              </li>
              <li>Melakukan patroli keliling lingkungan secara berkala.</li>
              <li>
                Melaporkan segera kepada Ketua RT bila terjadi hal yang
                mencurigakan.
              </li>
              <li>
                Menjaga sikap sopan santun dan tidak membuat kebisingan
                berlebihan.
              </li>
              <li>
                Menggunakan perlengkapan seperti senter, peluit, dan rompi jika
                tersedia.
              </li>
            </ul>
          </div>

          {/* Kontak */}
          <div className="kgl-card kgl-card-highlight">
            <h2>Kontak Penanggung Jawab</h2>
            <p className="kgl-card-subtitle">
              Hubungi pengurus berikut bila membutuhkan informasi terkait jadwal
              atau pergantian petugas ronda:
            </p>

            <div className="kgl-contact">
              <div className="kgl-contact-item">
                <span className="kgl-contact-label">Ketua RT 14</span>
                <span className="kgl-contact-value">08xx‑xxxx‑xxxx</span>
              </div>
              <div className="kgl-contact-item">
                <span className="kgl-contact-label">Koordinator Siskamling</span>
                <span className="kgl-contact-value">08xx‑xxxx‑xxxx</span>
              </div>
            </div>

            <div className="kgl-contact-note">
              Jika berhalangan hadir saat jadwal ronda, warga diharapkan mencari
              pengganti dan menginformasikan kepada koordinator maksimal H‑1.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default KegiatanLingkungan;