import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Beranda from "./components/Beranda";
import DetailEvent from "./components/DetailEvent";
import TiketSaya from "./components/TiketSaya";

import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import { ruteKelolaEvent } from "./routes/ruteKelolaEvent";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Halaman login */}
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

        {/* Detail event */}
        <Route
          path="/event/:id"
          element={
            <ProtectedRoute allowedRole="peserta">
              <DetailEvent />
            </ProtectedRoute>
          }
        />

        {/* Halaman Tiket Saya - Anggota D */}
        <Route
          path="/tiket-saya"
          element={
            <ProtectedRoute allowedRole="peserta">
              <TiketSaya />
            </ProtectedRoute>
          }
        />

        {/* Halaman penyelenggara - Anggota E (Kelola Event, Tambah, Edit) */}
        {ruteKelolaEvent()}

        {/* Halaman tidak ditemukan */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Route>
    </Routes>
  );
}

export default App;