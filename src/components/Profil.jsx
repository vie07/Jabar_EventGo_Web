import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/profil.css';

function Profil() {
  const navigate = useNavigate();

  const [user, setUser] = useState({ name: '', email: '', role: '' });
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // ambil data user aktif dari localStorage
  useEffect(() => {
    const activeUser = JSON.parse(localStorage.getItem('user'));
    if (!activeUser) {
      navigate('/login');
      return;
    }
    setUser(activeUser);
    setFormData({
      name: activeUser.name || '',
      email: activeUser.email || ''
    });
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // submit Form Edit Profil 
  const handleUpdate = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validasi Nama min 3 huruf
    if (formData.name.trim().length < 3) {
      setError('Nama lengkap minimal 3 huruf!');
      return;
    }

    // Validasi format email 
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Format email tidak valid!');
      return;
    }

    // Update sesi aktif
    const updatedUser = {
      ...user,
      name: formData.name.trim(),
      email: formData.email.trim()
    };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);

    // Update daftar registeredUsers jika akun ada di dalamnya
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const userIndex = registeredUsers.findIndex((u) => u.email === user.email);
    if (userIndex !== -1) {
      registeredUsers[userIndex].namaLengkap = updatedUser.name;
      registeredUsers[userIndex].email = updatedUser.email;
      localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
    }

    setSuccess('Profil berhasil diperbarui!');
  };

  // Tombol Logout dan redirect ke /login
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Inisial avatar
  const initial = user.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <div className="profile-page-wrapper">
      <div className="profile-card">
        {/* Header Profil */}
        <div className="text-center mb-4">
          <div className="profile-avatar-circle shadow-sm">
            {initial}
          </div>
          <h3 className="fw-bold mb-1" style={{ color: '#1B3B6F' }}>
            {user.name || 'Pengguna'}
          </h3>
          <p className="text-muted small mb-2">{user.email}</p>
          <span className={`profile-header-badge ${user.role || 'peserta'}`}>
            Peran: {user.role || 'Peserta'}
          </span>
        </div>

        {/* Ringkasan Akun */}
        <div className="profile-info-box">
          <div className="row g-3">
            <div className="col-12 col-md-4">
              <span className="profile-info-label">Peran Akun</span>
              <div className="profile-info-value text-capitalize">{user.role || 'Peserta'}</div>
            </div>
            <div className="col-12 col-md-4">
              <span className="profile-info-label">Nama Terdaftar</span>
              <div className="profile-info-value text-truncate">{user.name}</div>
            </div>
            <div className="col-12 col-md-4">
              <span className="profile-info-label">Email Terdaftar</span>
              <div className="profile-info-value text-truncate">{user.email}</div>
            </div>
          </div>
        </div>

        {/* Notifikasi Alert */}
        {error && <div className="alert alert-danger py-2 mb-3" style={{ fontSize: '0.875rem' }}>{error}</div>}
        {success && <div className="alert alert-success py-2 mb-3" style={{ fontSize: '0.875rem' }}>{success}</div>}

        {/* Form Edit Profil */}
        <form onSubmit={handleUpdate}>
          <h5 className="fw-bold mb-3" style={{ color: '#1E293B', fontSize: '1.1rem' }}>
            Edit Data Diri
          </h5>

          <div className="mb-3">
            <label className="form-label-custom">Nama Lengkap</label>
            <input
              type="text"
              name="name"
              className="form-control-custom"
              value={formData.name}
              onChange={handleChange}
              placeholder="Masukkan nama lengkap (min. 3 huruf)"
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label-custom">Alamat Email</label>
            <input
              type="email"
              name="email"
              className="form-control-custom"
              value={formData.email}
              onChange={handleChange}
              placeholder="nama@email.com"
              required
            />
          </div>

          <div className="d-flex flex-column gap-2">
            <button type="submit" className="btn-teal-primary w-100">
              Simpan Perubahan
            </button>
            <button type="button" onClick={handleLogout} className="btn-logout-custom w-100">
              Keluar (Logout)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Profil;