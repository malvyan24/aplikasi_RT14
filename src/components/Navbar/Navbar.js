import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa"; // Pastikan install: npm install react-icons
import "./Navbar.css";

// Terima props onLogout dari App.js
export default function Navbar({ onLogout }) {
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
          
          {/* Opsi Logout untuk Mobile Menu */}
          <button 
            className="sirt-nav__link" 
            onClick={onLogout}
            style={{ 
                background: 'transparent', 
                border: 'none', 
                color: '#ef4444', 
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%',
                display: 'none' // Disembunyikan di desktop (diatur via CSS media query jika mau)
            }}
          >
            Keluar
          </button>
        </nav>

        <div className="sirt-nav__profile">
          <img
            src="/image/LogoSiRT.png"
            alt="avatar"
            className="sirt-nav__avatar"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
          <span className="sirt-nav__name">Admin RT</span>

          {/* TOMBOL LOGOUT DESKTOP */}
          <button 
            onClick={onLogout} 
            title="Keluar Aplikasi"
            style={{
                marginLeft: '15px',
                background: '#fee2e2',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 12px',
                color: '#ef4444',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '13px'
            }}
          >
            <FaSignOutAlt /> Keluar
          </button>

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