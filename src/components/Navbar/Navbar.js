import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import "./Navbar.css";


const AVATAR = "/assets/avatar.png";

const NAV_ITEMS = [
  { to: "/", label: "Beranda" },
  { to: "/datawarga", label: "Data Warga" },
  { to: "/kesehatan", label: "Kesehatan" },
  { to: "/kegiatan", label: "Lingkungan" },
  { to: "/Banksampah", label: "Bank Sampah" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="nav">
      <div className="nav__inner">
        {/* Kiri: Logo / Judul singkat */}
        <div className="nav__brand">
          <Link to="/" className="nav__logo" aria-label="Beranda">
            <span className="nav__dot" />
            Aplikasi RT 14
          </Link>
        </div>

        {/* Tengah: Menu utama */}
        <nav className={`nav__menu ${open ? "is-open" : ""}`} aria-label="Main">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                "nav__link" + (isActive ? " nav__link--active" : "")
              }
              onClick={() => setOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Kanan: Profil */}
        <div className="nav__profile">
          <img
            src={AVATAR}
            alt=""
            className="nav__avatar"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
          <span className="nav__name">Admin RT</span>

          {/* Tombol hamburger (mobile) */}
          <button
            className="nav__toggle"
            aria-label="Buka menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  );
}
