import { Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import KelolaEvent from "../components/KelolaEvent";
import FormEvent from "../components/FormEvent";
import PesertaEvent from "../components/PesertaEvent";

// Dipasang di App.jsx dengan memanggil ruteKelolaEvent() di dalam <Routes>
export function ruteKelolaEvent() {
  return (
    <>
      {/* Kelola Event - halaman pertama penyelenggara setelah login */}
      <Route
        path="/kelola-event"
        element={
          <ProtectedRoute allowedRole="penyelenggara">
            <KelolaEvent />
          </ProtectedRoute>
        }
      />

      {/* Form Tambah Event */}
      <Route
        path="/kelola-event/tambah"
        element={
          <ProtectedRoute allowedRole="penyelenggara">
            <FormEvent />
          </ProtectedRoute>
        }
      />

      {/* Form Edit Event */}
      <Route
        path="/kelola-event/edit/:id"
        element={
          <ProtectedRoute allowedRole="penyelenggara">
            <FormEvent />
          </ProtectedRoute>
        }
      />

      {/* Peserta - SEMENTARA, nanti diganti halaman Peserta & Check-in */}
      <Route
        path="/peserta"
        element={
          <ProtectedRoute allowedRole="penyelenggara">
            <PesertaEvent />
          </ProtectedRoute>
        }
      />
    </>
  );
}
