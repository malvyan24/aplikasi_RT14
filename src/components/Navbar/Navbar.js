import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    `sirt-nav__link ${isActive ? "sirt-nav__link--active" : ""}`;

  const closeMenu = () => setOpen(false);

  return (
    <header className="sirt-nav">
      <div className="sirt-nav__inner">
        <div className="sirt-nav__brand">
          <Link to="/" className="sirt-nav__logo" onClick={closeMenu}>
            <img
              src="/image/LogoSiRT.png"
              alt="SiRT"
              className="sirt-nav__logo-image"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
            <span>Sistem Informasi RT 14</span>
          </Link>
        </div>

        <nav className={`sirt-nav__menu ${open ? "is-open" : ""}`}>
          <NavLink to="/" className={linkClass} onClick={closeMenu}>
            Beranda
          </NavLink>
          <NavLink to="/datawarga" className={linkClass} onClick={closeMenu}>
            Data Warga
          </NavLink>
          <NavLink to="/kesehatan" className={linkClass} onClick={closeMenu}>
            Kesehatan
          </NavLink>
          <NavLink to="/lingkungan" className={linkClass} onClick={closeMenu}>
            Lingkungan
          </NavLink>
          <NavLink to="/banksampah" className={linkClass} onClick={closeMenu}>
            Bank Sampah
          </NavLink>
        </nav>

        <div className="sirt-nav__profile">
          <img
            src="/image/LogoSiRT.png"
            alt="avatar"
            className="sirt-nav__avatar"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
          <span className="sirt-nav__name">Admin RT</span>

          <button
            type="button"
            className="sirt-nav__toggle"
            aria-label="Toggle menu"
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
