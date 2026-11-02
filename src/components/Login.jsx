import React, { useState } from 'react';
import '../styles/auth.css';
import heroImg from '../assets/Jabar-EventGo-login.jpg'; 

function Login() {
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'register'
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // State Form Login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // State Form Registrasi
  const [regForm, setRegForm] = useState({
    namaLengkap: '',
    email: '',
    role: 'peserta', // 'peserta' or 'penyelenggara'
    password: '',
    konfirmasiPassword: ''
  });

  const handleRegChange = (e) => {
    setRegForm({
      ...regForm,
      [e.target.name]: e.target.value
    });
  };

  // Submit Handler: Login
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (loginPassword.length < 6) {
      setError('Password minimal 6 karakter!');
      return;
    }

    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const userMatch = registeredUsers.find(
      (u) => u.email === loginEmail && u.password === loginPassword
    );

    if (loginEmail === 'penyelenggara@jabar.go.id' && loginPassword === '123456') {
      const user = { name: 'Disparbud Jabar', email: loginEmail, role: 'penyelenggara' };
      localStorage.setItem('user', JSON.stringify(user));
      window.location.href = '/kelola-event';
    } else if (loginEmail === 'user@gmail.com' && loginPassword === '123456') {
      const user = { name: 'Warga Jabar', email: loginEmail, role: 'peserta' };
      localStorage.setItem('user', JSON.stringify(user));
      window.location.href = '/';
    } else if (userMatch) {
      const user = { name: userMatch.namaLengkap, email: userMatch.email, role: userMatch.role };
      localStorage.setItem('user', JSON.stringify(user));
      window.location.href = userMatch.role === 'penyelenggara' ? '/kelola-event' : '/';
    } else {
      setError('Email atau password salah');
    }
  };

  // Submit Handler: Registrasi
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (regForm.namaLengkap.trim().length < 3) {
      setError('Nama lengkap minimal 3 huruf!');
      return;
    }

    if (regForm.password.length < 6) {
      setError('Password minimal 6 karakter!');
      return;
    }

    if (regForm.password !== regForm.konfirmasiPassword) {
      setError('Konfirmasi password tidak cocok!');
      return;
    }

    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    if (users.some((u) => u.email === regForm.email) || regForm.email === 'user@gmail.com') {
      setError('Email sudah terdaftar!');
      return;
    }

    users.push(regForm);
    localStorage.setItem('registeredUsers', JSON.stringify(users));

    setSuccess('Registrasi berhasil! Silakan masuk ke akun Anda.');
    setActiveTab('login');
    setLoginEmail(regForm.email);
    setRegForm({
      namaLengkap: '',
      email: '',
      role: 'peserta',
      password: '',
      konfirmasiPassword: ''
    });
  };

  return (
    <div className="auth-page-container">
      <div className="auth-split-wrapper">
        
        {/* Card Kiri: Banner Poster */}
        <div className="auth-card-banner">
          <img src={heroImg} alt="Jabar EventGo Gedung Sate" />
        </div>

        {/* Card Kanan: Form Auth */}
        <div className="auth-card-form">
          {/* Navigasi Tab */}
          <div className="auth-nav-tabs">
            <button
              type="button"
              className={`auth-nav-btn ${activeTab === 'login' ? 'active' : ''}`}
              onClick={() => { setActiveTab('login'); setError(''); setSuccess(''); }}
            >
              Login
            </button>
            <button
              type="button"
              className={`auth-nav-btn ${activeTab === 'register' ? 'active' : ''}`}
              onClick={() => { setActiveTab('register'); setError(''); setSuccess(''); }}
            >
              Registrasi
            </button>
          </div>

          {error && <div className="alert alert-danger py-2 mb-3">{error}</div>}
          {success && <div className="alert alert-success py-2 mb-3">{success}</div>}

          {/* tab 1: form login */}
          {activeTab === 'login' ? (
            <div>
              <h2 className="auth-header-title">Masuk ke Akun Anda</h2>
              <p className="auth-header-desc">Silakan masuk untuk mengakses tiket dan mengelola event.</p>

              <form onSubmit={handleLoginSubmit}>
                <div className="form-field-group">
                  <label className="form-field-label">Email</label>
                  <input
                    type="email"
                    className="form-field-input"
                    placeholder="nama@email.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="form-field-group">
                  <label className="form-field-label">Kata Sandi</label>
                  <input
                    type="password"
                    className="form-field-input"
                    placeholder="Minimal 6 karakter"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="text-end mb-3">
                  <a href="#lupa-password" style={{ fontSize: '0.8rem', color: '#64748B', textDecoration: 'none' }}>
                    Lupa password?
                  </a>
                </div>

                <button type="submit" className="btn-submit-action">
                  Masuk
                </button>

                <div className="switch-tab-prompt">
                  Belum punya akun?
                  <span
                    className="switch-tab-link"
                    onClick={() => { setActiveTab('register'); setError(''); }}
                  >
                    Daftar gratis
                  </span>
                </div>
              </form>
            </div>
          ) : (
            /* tab 2: form registrasi */
            <div>
              <h2 className="auth-header-title">Daftar Akun Baru</h2>
              <p className="auth-header-desc">Bergabung untuk menemukan dan mengelola event Jawa Barat.</p>

              <form onSubmit={handleRegisterSubmit}>
                <div className="form-field-group">
                  <label className="form-field-label">Nama Lengkap</label>
                  <input
                    type="text"
                    name="namaLengkap"
                    className="form-field-input"
                    placeholder="Nama lengkap Anda"
                    value={regForm.namaLengkap}
                    onChange={handleRegChange}
                    required
                  />
                </div>

                <div className="form-field-group">
                  <label className="form-field-label">Alamat Email</label>
                  <input
                    type="email"
                    name="email"
                    className="form-field-input"
                    placeholder="nama@email.com"
                    value={regForm.email}
                    onChange={handleRegChange}
                    required
                  />
                </div>

                <div className="form-field-group">
                  <label className="form-field-label">Peran (Role)</label>
                  <select
                    name="role"
                    className="form-field-select"
                    value={regForm.role}
                    onChange={handleRegChange}
                    required
                  >
                    <option value="peserta">Peserta</option>
                    <option value="penyelenggara">Penyelenggara</option>
                  </select>
                </div>

                <div className="form-field-row form-field-group">
                  <div>
                    <label className="form-field-label">Password</label>
                    <input
                      type="password"
                      name="password"
                      className="form-field-input"
                      placeholder="Min. 6 karakter"
                      value={regForm.password}
                      onChange={handleRegChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="form-field-label">Konfirmasi</label>
                    <input
                      type="password"
                      name="konfirmasiPassword"
                      className="form-field-input"
                      placeholder="Ulangi password"
                      value={regForm.konfirmasiPassword}
                      onChange={handleRegChange}
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="btn-submit-action">
                  Daftar Sekarang
                </button>

                <div className="switch-tab-prompt">
                  Sudah punya akun?
                  <span
                    className="switch-tab-link"
                    onClick={() => { setActiveTab('login'); setError(''); }}
                  >
                    Masuk di sini
                  </span>
                </div>
              </form>
            </div>
          )}

          <div className="copyright-text">
            Dinas Komunikasi dan Informatika Provinsi Jawa Barat © 2027
          </div>
        </div>

      </div>
    </div>
  );
}

export default Login;