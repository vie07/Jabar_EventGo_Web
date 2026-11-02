import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Beranda from "./components/Beranda";
import DetailEvent from "./components/DetailEvent";
import TiketSaya from "./components/TiketSaya";

import ProtectedRoute from "./components/ProtectedRoute";
import PublikRoute from "./components/PublikRoute";
import Layout from "./components/Layout";
import { ruteKelolaEvent } from "./routes/ruteKelolaEvent";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Halaman login */}
        <Route path="/login" element={<Login />} />

        {/* Boleh dilihat tamu (tanpa login); mendaftar event tetap wajib login */}
        <Route
          path="/"
          element={
            <PublikRoute>
              <Beranda />
            </PublikRoute>
          }
        />
        <Route
          path="/event/:id"
          element={
            <PublikRoute>
              <DetailEvent />
            </PublikRoute>
          }
        />

        {/* Tiket Saya - Anggota D (wajib login sebagai peserta) */}
        <Route
          path="/tiket-saya"
          element={
            <ProtectedRoute allowedRole="peserta">
              <TiketSaya />
            </ProtectedRoute>
          }
        />

        {/* Kelola Event, Form Event, Peserta - penyelenggara */}
        {ruteKelolaEvent()}

        {/* Halaman tidak ditemukan */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
