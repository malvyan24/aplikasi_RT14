import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import "./Navbar.css";

const AVATAR = "/image/logoSiRT.png";

const NAV_ITEMS = [
  { to: "/", label: "Beranda" },
  { to: "/datawarga", label: "Data Warga" },
  { to: "/kesehatan", label: "Kesehatan" },
  { to: "/lingkungan", label: "Lingkungan" },
  { to: "/Banksampah", label: "Banksampah" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    // kombinasikan class lamamu + class bootstrap navbar
    <header className="nav navbar navbar-expand-lg navbar-light">
      <div className="container nav__inner">
        {/* Kiri: Logo / Judul */}
        <div className="nav__brand">
          <Link to="/" className="nav__logo navbar-brand" aria-label="Beranda">
            <img
              src={AVATAR}
              alt="Logo RT 14"
              className="nav__logo-image d-inline-block align-text-top"
            />
            <span className="ms-1">Sistem Informasi RT 14</span>
          </Link>
        </div>

        {/* Tombol hamburger Bootstrap */}
        <button
          className="navbar-toggler nav__toggle"
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="navbar-toggler-icon" />
        </button>

        {/* Tengah + kanan: menu + profile */}
        <div className={"collapse navbar-collapse" + (open ? " show" : "")}>
          {/* Tengah: menu utama */}
          <nav className="navbar-nav mx-auto nav__menu" aria-label="Main">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  "nav-link nav__link" + (isActive ? " nav__link--active" : "")
                }
                onClick={() => setOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Kanan: Profil */}
          <div className="d-flex align-items-center nav__profile">
            <img
              src={AVATAR}
              alt=""
              className="nav__avatar"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
            <span className="nav__name">Admin RT</span>
          </div>
        </div>
      </div>
    </header>
  );
}
