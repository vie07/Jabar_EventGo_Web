import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * @param {ReactNode} children - Halaman tujuan
 * @param {string} allowedRole - Role yang diizinkan ('peserta' or 'penyelenggara')
 */
function ProtectedRoute({ children, allowedRole }) {
  const user = JSON.parse(localStorage.getItem('user'));

  // jika belum login sama sekali, redirect ke /login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // jika role tidak sesuai hak akses halaman
  if (allowedRole && user.role !== allowedRole) {
    // Peserta diarahkan ke Beranda, Penyelenggara ke Kelola Event
    const redirectPath = user.role === 'penyelenggara' ? '/kelola-event' : '/';
    return <Navigate to={redirectPath} replace />;
  }

  // izin valid
  return children;
}

export default ProtectedRoute;