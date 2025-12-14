import { Link } from "react-router-dom";
import { useState } from "react";
import "./Home.css";

import { Users, HeartPlus, Leaf, Recycle } from "lucide-react";

const FEATURES = [
  { to: "/datawarga", title: "Data Warga", Icon: Users, iconClass: "icon-blue" },
  { to: "/kesehatan", title: "Kesehatan", Icon: HeartPlus, iconClass: "icon-pink" },
  { to: "/lingkungan", title: "Kegiatan Lingkungan", Icon: Leaf, iconClass: "icon-green" },
  { to: "/banksampah", title: "Bank Sampah", Icon: Recycle, iconClass: "icon-yellow" },
];

function HeroImage({ src, alt = "" }) {
  const [hide, setHide] = useState(false);
  if (!src || hide) return null;

  return (
    <img
      src={src}
      alt={alt}
      loading="eager"
      decoding="async"
      onError={() => setHide(true)}
    />
  );
}

export default function Home() {
  return (
    <section className="home" aria-labelledby="home-title">
      {/* HERO / BANNER */}
      <header className="home__hero">
        <div className="home__hero-inner">
          <h1 id="home-title" className="home__title">
            Aplikasi Pengelolaan Data
            <br />
            Penduduk Rukun Tetangga 14
          </h1>

          <div className="home__hero-illustration" aria-hidden="true">
            {/* taruh file di public/image/LogoSiRT.png */}
            <HeroImage src="/image/LogoSiRT.png" alt="" />
          </div>
        </div>
      </header>

      {/* GRID FITUR */}
      <ul className="home__grid" id="content">
        {FEATURES.map(({ to, title, Icon, iconClass }) => (
          <li key={to} className="home__grid-item">
            <Link to={to} className="feature-card" aria-label={title}>
              <div className="feature-card__thumb">
                <Icon className={`feature-card__icon ${iconClass}`} aria-hidden="true" />
              </div>
              <div className="feature-card__label">{title}</div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
