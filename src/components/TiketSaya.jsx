import { useState } from "react";
import { Link } from "react-router-dom";
import EmptyState from "./EmptyState";
import ModalTiket from "./ModalTiket";
import { ambilSemuaTiket } from "../utils/tiket";
import { formatTanggal } from "../utils/format";
import "../styles/tiket.css";

// Mengambil data peserta yang sedang login
function ambilUser() {
  try {
    return JSON.parse(localStorage.getItem("user")) || null;
  } catch {
    return null;
  }
}

function TiketSaya() {
  const user = ambilUser();

  // Mengambil tiket berdasarkan email peserta
  const [tiketSaya, setTiketSaya] = useState(() => {
    return ambilSemuaTiket()
      .filter(
        (t) =>
          String(t.email || "").trim().toLowerCase() ===
          String(user?.email || "").trim().toLowerCase()
      )
      .sort((a, b) =>
        String(b.dibuatPada || "").localeCompare(
          String(a.dibuatPada || "")
        )
      );
  });

  // Menyimpan tiket yang sedang dibuka
  const [terpilih, setTerpilih] = useState(null);

  // Fungsi membatalkan tiket
  function batalkanTiket(kode) {
    const yakin = window.confirm(
      "Apakah kamu yakin ingin membatalkan tiket ini?"
    );

    if (!yakin) return;

    // Ambil semua tiket dari localStorage
    const semuaTiket = ambilSemuaTiket();

    // Cari tiket yang akan dibatalkan
    const tiketDibatalkan = semuaTiket.find(
      (t) => t.kode === kode
    );

    // Pastikan tiket memang milik peserta yang login
    if (
      !tiketDibatalkan ||
      String(tiketDibatalkan.email || "").trim().toLowerCase() !==
        String(user?.email || "").trim().toLowerCase()
    ) {
      alert("Tiket tidak ditemukan atau bukan milik akun kamu.");
      return;
    }

    // Tiket yang sudah check-in tidak dapat dibatalkan
    if (tiketDibatalkan.statusCheckIn) {
      alert("Tiket yang sudah check-in tidak dapat dibatalkan.");
      return;
    }

    // Hapus tiket yang dipilih
    const tiketTerbaru = semuaTiket.filter(
      (t) => t.kode !== kode
    );

    // Simpan kembali tiket ke localStorage
    localStorage.setItem(
      "tickets",
      JSON.stringify(tiketTerbaru)
    );

    // Perbarui tampilan daftar tiket
    setTiketSaya((sebelumnya) =>
      sebelumnya.filter((t) => t.kode !== kode)
    );

    // Tutup modal
    setTerpilih(null);

    alert(
      "Tiket berhasil dibatalkan. Kuota event telah dikembalikan."
    );
  }

  return (
    <main className="container py-4 tiket-saya">
      {/* Judul halaman */}
      <h1 className="judul-tiket">Tiket Saya</h1>

      {/* Kondisi jika belum memiliki tiket */}
      {tiketSaya.length === 0 ? (
        <div className="tiket-kosong text-center">
          <div className="ikon-tiket-kosong">🎟️</div>

          <EmptyState pesan="Kamu belum punya tiket" />

          <p>
            Kamu belum melakukan pendaftaran event.
            Yuk, temukan event menarik di Jawa Barat
            dan daftarkan dirimu sekarang!
          </p>

          <Link to="/" className="btn btn-primary">
            Cari Event
          </Link>
        </div>
      ) : (
        /* Daftar tiket peserta */
        <section>
          <p className="text-muted">
            Berikut daftar tiket event yang sudah kamu daftarkan.
          </p>

          <ul className="list-unstyled tiket-daftar">
            {tiketSaya.map((t) => (
              <li key={t.kode}>
                <button
                  type="button"
                  className="tiket-kartu"
                  onClick={() => setTerpilih(t)}
                  aria-label={`Lihat detail tiket ${t.eventNama}`}
                >
                  <span className="tiket-info">
                    <span className="tiket-nama">
                      {t.eventNama}
                    </span>

                    <span className="tiket-meta">
                      {formatTanggal(t.tanggal)} · {t.kota}
                    </span>

                    <span className="tiket-kode">
                      {t.kode}
                    </span>
                  </span>

                  <span
                    className={`badge ${
                      t.statusCheckIn
                        ? "text-bg-success"
                        : "text-bg-primary"
                    }`}
                  >
                    {t.statusCheckIn
                      ? "Sudah check-in"
                      : "Aktif"}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Modal detail dan QR Code tiket */}
      {terpilih && (
        <ModalTiket
          tiket={terpilih}
          onTutup={() => setTerpilih(null)}
          onBatalkan={batalkanTiket}
        />
      )}
    </main>
  );
}

export default TiketSaya;