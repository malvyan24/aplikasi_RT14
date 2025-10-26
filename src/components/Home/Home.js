import { Link } from "react-router-dom";
import { useState } from "react";
import "./Home.css";

// Ikon bawaan (bisa diganti gambar lokal kalau mau)
import { Users, FileText, Leaf, Recycle, HeartPlus } from "lucide-react";
import { BiHealth } from "react-icons/bi";

/**
 * Jika mau pakai gambar daripada ikon:
 * - taruh gambar di /public/assets/icon-*.png
 * - ubah item FEATURES: ganti Icon: Users -> img: "/assets/icon-datawarga.png"
 */
const FEATURES = [
  { to: "/datawarga", title: "Data Warga", Icon: Users, img: null },
  { to: "/kesehatan", title: "kesehatan", Icon: HeartPlus, img: null },
  { to: "/kegiatan", title: "Kegiatan Lingkungan", Icon: Leaf, img: null },
  { to: "/bank-sampah", title: "Bank Sampah", Icon: Recycle, img: null },
];

// Komponen gambar dengan fallback hide jika file tidak ada
function HeroImage({ src, alt = "" }) {
  const [hide, setHide] = useState(false);
  if (hide || !src) return null;
  return (
    <img src={src} alt={alt} loading="eager" onError={() => setHide(true)} />
  );
}

export default function Home() {
  return (
    <section className="home">
      {/* Banner */}
      <div
        className="home__hero"
        role="img"
        aria-label="Aplikasi Pengelolaan Data RT 14"
      >
        <div className="home__hero-inner">
          <h1 className="home__title">
            Aplikasi Pengelolaan Data
            <br />
            Penduduk Rukun Tetangga 14
          </h1>

          <div className="home__hero-illustration">
            {/* Taruh file di /public/assets/hero.png; jika belum ada, bagian ini otomatis tersembunyi */}
            <HeroImage src="/image/LogoSiRT.png" />
          </div>
        </div>
      </div>

      {/* Grid fitur */}
      <ul className="home__grid" id="content">
        {FEATURES.map((f) => (
          <li key={f.to} className="home__grid-item">
            <Link to={f.to} className="feature-card" aria-label={f.title}>
              <div className="feature-card__thumb">
                {f.img ? (
                  <img src={f.img} alt="" loading="lazy" />
                ) : f.Icon ? (
                  <f.Icon className="feature-card__icon" aria-hidden="true" />
                ) : null}
              </div>
              <div className="feature-card__label">{f.title}</div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
