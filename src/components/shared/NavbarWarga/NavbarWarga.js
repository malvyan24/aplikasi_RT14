import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
// 👇 Sekarang kita import CSS khusus Warga yang baru saja dibuat
import './NavbarWarga.css'; 

const NavbarWarga = ({ onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Logika Dark Mode
  const [theme, setTheme] = useState(localStorage.getItem('wargaTheme') || 'light');
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('wargaTheme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
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
        </div>

        {/* === PROFIL & LOGOUT === */}
        <div className="warga-nav__profile">
          <button 
            onClick={toggleTheme} 
            className="warga-nav__theme-btn" 
            style={{ background: 'transparent', border: 'none', fontSize: '20px', cursor: 'pointer', marginRight: '10px' }}
            title={theme === 'light' ? "Ganti Mode Gelap" : "Ganti Mode Terang"}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
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