import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
// 👇 Sekarang kita import CSS khusus Warga yang baru saja dibuat
import './NavbarWarga.css'; 

const NavbarWarga = ({ onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="warga-nav">
      <div className="warga-nav__inner">
        
        {/* === BRAND & LOGO === */}
        <div className="warga-nav__brand">
          <NavLink to="/" className="warga-nav__logo">
            <img src="/image/logoSiRT.png" alt="Logo SiRT" className="warga-nav__logo-image" />
            <span>Portal Warga</span>
          </NavLink>
        </div>

        {/* === MENU LINKS === */}
        <div className={`warga-nav__menu ${isMenuOpen ? 'is-open' : ''}`}>
          <NavLink 
            to="/" 
            className={({ isActive }) => isActive ? 'warga-nav__link warga-nav__link--active' : 'warga-nav__link'} 
            end
            onClick={() => setIsMenuOpen(false)}
          >
            Beranda
          </NavLink>
          
          <NavLink 
            to="/profilkeluarga" 
            className={({ isActive }) => isActive ? 'warga-nav__link warga-nav__link--active' : 'warga-nav__link'}
            onClick={() => setIsMenuOpen(false)}
          >
            Profil Keluarga
          </NavLink>
          
          <NavLink 
            to="/kesehatanwarga" 
            className={({ isActive }) => isActive ? 'warga-nav__link warga-nav__link--active' : 'warga-nav__link'}
            onClick={() => setIsMenuOpen(false)}
          >
            Data Kesehatan
          </NavLink>
          
          <NavLink 
            to="/tabungansampah" 
            className={({ isActive }) => isActive ? 'warga-nav__link warga-nav__link--active' : 'warga-nav__link'}
            onClick={() => setIsMenuOpen(false)}
          >
            Tabungan Sampah
          </NavLink>
        </div>

        {/* === PROFIL & LOGOUT === */}
        <div className="warga-nav__profile">
          <span className="warga-nav__name">Warga RT 14</span>
          
          <button className="logout-btn-warga" onClick={onLogout}>
            Keluar
          </button>

          <button className="warga-nav__toggle" onClick={toggleMenu}>
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

      </div>
    </nav>
  );
};

export default NavbarWarga;