import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Beranda from './components/Beranda';
import DetailEvent from './components/DetailEvent';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Halaman peserta */}
      <Route
        path="/"
        element={
          <ProtectedRoute allowedRole="peserta">
            <Beranda />
          </ProtectedRoute>
        }
      />
      <Route
        path="/event/:id"
        element={
          <ProtectedRoute allowedRole="peserta">
            <DetailEvent />
          </ProtectedRoute>
        }
      />

      {/* TODO anggota lain: /tiket-saya, /profil, /kelola-event, /peserta */}

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
