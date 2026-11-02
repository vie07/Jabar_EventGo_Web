import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../styles/layout.css';
import logoEventGo from '../assets/Logo2.png';

function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkUser = () => {
      const savedUser = JSON.parse(localStorage.getItem('user'));
      setUser(savedUser);
    };

    checkUser();
    window.addEventListener('storage', checkUser);
    return () => window.removeEventListener('storage', checkUser);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const isPenyelenggara = user && user.role === 'penyelenggara';
  const targetHome = isPenyelenggara ? '/kelola-event' : '/';

  // Handler untuk refresh halaman penuh
  const handleBrandClick = (e) => {
    e.preventDefault();
    // Jika sedang di halaman utama, langsung reload; jika di halaman lain, arahkan lalu reload
    window.location.href = targetHome;
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark shadow-sm sticky-top" style={{ backgroundColor: '#1B3B6F' }}>
      <div className="container py-1">
        {/* Brand / Logo & Teks: Menggunakan <a> dan onClick agar me-refresh halaman */}
        <a 
          href={targetHome}
          onClick={handleBrandClick}
          className="navbar-brand fw-bold d-flex align-items-center gap-2" 
          style={{ textDecoration: 'none', cursor: 'pointer' }}
        >
          <img 
            src={logoEventGo} 
            alt="Logo Jabar EventGo" 
            style={{ 
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: '#FFFFFF',
              padding: '3px',
              objectFit: 'contain'
            }} 
          />
          <span style={{ fontSize: '1.25rem', letterSpacing: '-0.3px', color: '#FFFFFF' }}>
            Jabar <span style={{ color: '#E5A93C' }}>EventGo</span>
          </span>
        </a>

        {/* Toggle Mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menu Navigasi Sesuai Role */}
        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {isPenyelenggara ? (
              <>
                <li className="nav-item">
                  <Link 
                    className={`nav-link ${location.pathname === '/kelola-event' ? 'active text-warning fw-semibold' : ''}`} 
                    to="/kelola-event"
                  >
                    Kelola Event
                  </Link>
                </li>
                <li className="nav-item">
                  <Link 
                    className={`nav-link ${location.pathname === '/peserta' ? 'active text-warning fw-semibold' : ''}`} 
                    to="/peserta"
                  >
                    Peserta & Check-in
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link 
                    className={`nav-link ${location.pathname === '/' ? 'active text-warning fw-semibold' : ''}`} 
                    to="/"
                  >
                    Beranda
                  </Link>
                </li>
                {user && (
                  <li className="nav-item">
                    <Link 
                      className={`nav-link ${location.pathname === '/tiket-saya' ? 'active text-warning fw-semibold' : ''}`} 
                      to="/tiket-saya"
                    >
                      Tiket Saya
                    </Link>
                  </li>
                )}
              </>
            )}
          </ul>

          {/* Area Kanan: Tombol Login / Logout & Pintasan Profil */}
          <div className="d-flex align-items-center gap-2 mt-2 mt-lg-0">
            {user ? (
              <>
                <button
                  onClick={handleLogout}
                  className="btn btn-sm btn-outline-light px-3 py-1 rounded-pill"
                  style={{ fontSize: '0.85rem' }}
                >
                  Logout
                </button>

                <Link
                  to="/profil"
                  className="btn btn-sm d-flex align-items-center gap-2 px-3 py-1 rounded-pill text-decoration-none shadow-sm"
                  style={{
                    backgroundColor: location.pathname === '/profil' ? '#E5A93C' : '#0E8388',
                    color: '#FFFFFF',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    border: 'none',
                    transition: 'all 0.2s ease'
                  }}
                  title="Lihat & Edit Profil"
                >
                  <svg width="15" height="15" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                    <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
                  </svg>
                  <span>Profil</span>
                  <span className="badge bg-white text-dark rounded-pill ms-1" style={{ fontSize: '0.7rem' }}>
                    {isPenyelenggara ? 'Penyelenggara' : 'Peserta'}
                  </span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="btn btn-sm btn-outline-light px-3 py-1 rounded-pill"
                  style={{ fontSize: '0.85rem' }}
                >
                  Login
                </Link>

                <Link
                  to="/profil"
                  className="btn btn-sm text-white px-3 py-1 rounded-pill d-flex align-items-center gap-1"
                  style={{ backgroundColor: '#0E8388', fontSize: '0.85rem', fontWeight: 600 }}
                  title="Profil Akun"
                >
                  <svg width="15" height="15" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                    <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
                  </svg>
                  <span>Profil</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;