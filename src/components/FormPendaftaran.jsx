import { useState } from "react";
import { Link } from "react-router-dom";
import {
  validasiPendaftaran,
  ambilSemuaTiket,
  simpanTiket,
  hitungSisaKuota,
  sudahTerdaftar,
  eventSudahLewat,
  buatKodeTiket,
} from "../utils/tiket";

function ambilUser() {
  try {
    return JSON.parse(localStorage.getItem("user")) || {};
  } catch {
    return {};
  }
}

function FormPendaftaran({ event, sisaKuota, onBerhasil }) {
  const user = ambilUser();
  const [form, setForm] = useState({
    nama: user.name || "",
    email: user.email || "",
    noHp: "",
    instansi: "",
    setuju: false,
  });
  const [errors, setErrors] = useState({});
  const [pesan, setPesan] = useState(null); 
  const [tiketBaru, setTiketBaru] = useState(null);

  const kuotaHabis = sisaKuota <= 0;

  const ubah = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
    setErrors((er) => ({ ...er, [name]: undefined }));
  };

  const kirim = (e) => {
    e.preventDefault();
    setPesan(null);
    const semuaTiket = ambilSemuaTiket();

    // 1. Pengecekan kuota, duplikasi, dan tanggal event
    if (hitungSisaKuota(event, semuaTiket) <= 0) {
      setPesan({ tipe: "danger", teks: "Kuota event sudah penuh" });
      return;
    }
    if (sudahTerdaftar(event.id, form.email, semuaTiket)) {
      setPesan({ tipe: "warning", teks: "Kamu sudah terdaftar di event ini" });
      return;
    }
    if (eventSudahLewat(event)) {
      setPesan({
        tipe: "danger",
        teks: "Event sudah lewat, pendaftaran ditolak",
      });
      return;
    }

    // 2. Validasi form
    const err = validasiPendaftaran(form);
    setErrors(err);
    if (Object.keys(err).length > 0) return;

    // 3. Buat tiket
    const tiket = {
      kode: buatKodeTiket(event.id, semuaTiket),
      eventId: event.id,
      eventNama: event.nama,
      tanggal: event.tanggal,
      jamMulai: event.jamMulai,
      jamSelesai: event.jamSelesai,
      venue: event.venue,
      kota: event.kota,
      poster: event.poster,
      nama: form.nama.trim(),
      email: form.email.trim(),
      noHp: form.noHp.trim(),
      instansi: form.instansi.trim(),
      statusCheckIn: false,
      dibuatPada: new Date().toISOString(),
    };
    simpanTiket(tiket);
    setTiketBaru(tiket);
    setPesan({
      tipe: "success",
      teks: `Pendaftaran berhasil! Kode tiket kamu: ${tiket.kode}`,
    });
    onBerhasil();
  };

  const selesai = Boolean(tiketBaru);

  // Tamu (belum login) hanya boleh melihat event, tidak boleh mendaftar
  if (!user.email || user.role !== "peserta") {
    return (
      <section className="form-daftar" aria-labelledby="judul-daftar">
        <h2 id="judul-daftar">Daftar Event</h2>
        <div className="alert alert-warning" role="status">
          Kamu perlu masuk terlebih dahulu untuk mendaftar event ini.
        </div>
        <Link
          to="/login"
          className="btn btn-primary w-100"
          onClick={() =>
            sessionStorage.setItem("redirectSetelahLogin", `/event/${event.id}`)
          }
        >
          Masuk / Daftar Akun
        </Link>
      </section>
    );
  }

  return (
    <section className="form-daftar" aria-labelledby="judul-daftar">
      <h2 id="judul-daftar">Daftar Event</h2>

      {kuotaHabis && !selesai && (
        <div className="alert alert-danger" role="alert">
          Kuota event sudah penuh
        </div>
      )}

      {pesan && (
        <div className={`alert alert-${pesan.tipe}`} role="alert">
          {pesan.teks}
        </div>
      )}

      {selesai && (
        <Link to="/tiket-saya" className="btn btn-primary w-100 mb-3">
          Lihat Tiket
        </Link>
      )}

      <form onSubmit={kirim} noValidate>
        <div className="mb-3">
          <label htmlFor="nama" className="form-label">
            Nama lengkap <span aria-hidden="true">*</span>
          </label>
          <input
            id="nama"
            name="nama"
            type="text"
            className={`form-control ${errors.nama ? "is-invalid" : ""}`}
            value={form.nama}
            onChange={ubah}
            autoComplete="name"
            aria-required="true"
            aria-invalid={Boolean(errors.nama)}
            aria-describedby={errors.nama ? "err-nama" : undefined}
            disabled={selesai}
          />
          {errors.nama && (
            <div id="err-nama" className="invalid-feedback">
              {errors.nama}
            </div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email <span aria-hidden="true">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className={`form-control ${errors.email ? "is-invalid" : ""}`}
            value={form.email}
            onChange={ubah}
            autoComplete="email"
            aria-required="true"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "err-email" : undefined}
            disabled={selesai}
          />
          {errors.email && (
            <div id="err-email" className="invalid-feedback">
              {errors.email}
            </div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="noHp" className="form-label">
            Nomor HP <span aria-hidden="true">*</span>
          </label>
          <input
            id="noHp"
            name="noHp"
            type="tel"
            inputMode="numeric"
            placeholder="08xxxxxxxxxx"
            className={`form-control ${errors.noHp ? "is-invalid" : ""}`}
            value={form.noHp}
            onChange={ubah}
            autoComplete="tel"
            aria-required="true"
            aria-invalid={Boolean(errors.noHp)}
            aria-describedby={errors.noHp ? "err-noHp" : "bantuan-noHp"}
            disabled={selesai}
          />
          <div id="bantuan-noHp" className="form-text">
            Hanya angka, 10–13 digit, diawali 08.
          </div>
          {errors.noHp && (
            <div id="err-noHp" className="invalid-feedback">
              {errors.noHp}
            </div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="instansi" className="form-label">
            Asal instansi / komunitas <span className="text-muted">(opsional)</span>
          </label>
          <input
            id="instansi"
            name="instansi"
            type="text"
            className="form-control"
            value={form.instansi}
            onChange={ubah}
            autoComplete="organization"
            disabled={selesai}
          />
        </div>

        <div className="form-check mb-3">
          <input
            id="setuju"
            name="setuju"
            type="checkbox"
            className={`form-check-input ${errors.setuju ? "is-invalid" : ""}`}
            checked={form.setuju}
            onChange={ubah}
            aria-required="true"
            aria-invalid={Boolean(errors.setuju)}
            aria-describedby={errors.setuju ? "err-setuju" : undefined}
            disabled={selesai}
          />
          <label htmlFor="setuju" className="form-check-label">
            Saya menyetujui data saya digunakan untuk keperluan pendaftaran event
            ini. <span aria-hidden="true">*</span>
          </label>
          {errors.setuju && (
            <div id="err-setuju" className="invalid-feedback d-block">
              {errors.setuju}
            </div>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={kuotaHabis || selesai}
        >
          Daftar Sekarang
        </button>
      </form>
    </section>
  );
}

export default FormPendaftaran;
