import { Navigate } from 'react-router-dom';

/**
 * Halaman yang boleh dilihat tamu (belum login) dan peserta.
 * Penyelenggara diarahkan ke halamannya sendiri (Kelola Event).
 */
function PublikRoute({ children }) {
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem('user'));
  } catch {
    user = null;
  }

  if (user && user.role === 'penyelenggara') {
    return <Navigate to="/kelola-event" replace />;
  }

  return children;
}

export default PublikRoute;
