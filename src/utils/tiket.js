// Utilitas tiket (dipakai Detail Event & Tiket Saya).
// Tiket disimpan di localStorage dengan key "tickets" berupa array objek:
// {
//   kode, eventId, eventNama, tanggal, jamMulai, jamSelesai, venue, kota, poster,
//   nama, email, noHp, instansi, statusCheckIn (false), dibuatPada (ISO string)
// }

export const KUNCI_TIKET = "tickets";

export function ambilSemuaTiket() {
  try {
    const data = JSON.parse(localStorage.getItem(KUNCI_TIKET) || "[]");
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export function simpanTiket(tiket) {
  const semua = ambilSemuaTiket();
  semua.push(tiket);
  localStorage.setItem(KUNCI_TIKET, JSON.stringify(semua));
}

// Sisa kuota = kuota - peserta bawaan data JSON - tiket baru di localStorage
export function hitungSisaKuota(event, semuaTiket = ambilSemuaTiket()) {
  const tiketBaru = semuaTiket.filter((t) => t.eventId === event.id).length;
  return Math.max(event.kuota - event.terdaftar - tiketBaru, 0);
}

export function sudahTerdaftar(eventId, email, semuaTiket = ambilSemuaTiket()) {
  const e = String(email).trim().toLowerCase();
  return semuaTiket.some(
    (t) => t.eventId === eventId && String(t.email).trim().toLowerCase() === e
  );
}

// Event dianggap lewat jika waktu selesainya sudah terlampaui
export function eventSudahLewat(event, sekarang = new Date()) {
  const selesai = new Date(`${event.tanggal}T${event.jamSelesai || "23:59"}:00`);
  return selesai < sekarang;
}

export function buatKodeTiket(eventId, semuaTiket = ambilSemuaTiket()) {
  const huruf = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let kode;
  do {
    let acak = "";
    for (let i = 0; i < 6; i++) {
      acak += huruf[Math.floor(Math.random() * huruf.length)];
    }
    kode = `EVG-${String(eventId).padStart(3, "0")}-${acak}`;
  } while (semuaTiket.some((t) => t.kode === kode));
  return kode;
}

// ---- Validasi ----
export const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// diawali 08, hanya angka, total 10-13 digit
export const REGEX_HP = /^08\d{8,11}$/;

export function validasiPendaftaran({ nama, email, noHp, setuju }) {
  const err = {};
  if (!nama.trim()) err.nama = "Nama lengkap wajib diisi";
  else if (nama.trim().length < 3) err.nama = "Nama minimal 3 huruf";

  if (!email.trim()) err.email = "Email wajib diisi";
  else if (!REGEX_EMAIL.test(email.trim())) err.email = "Format email tidak valid";

  if (!noHp.trim()) err.noHp = "Nomor HP wajib diisi";
  else if (!/^\d+$/.test(noHp.trim())) err.noHp = "Nomor HP hanya boleh berisi angka";
  else if (!REGEX_HP.test(noHp.trim()))
    err.noHp = "Nomor HP harus 10–13 digit dan diawali 08";

  if (!setuju) err.setuju = "Kamu harus menyetujui syarat dan ketentuan";
  return err;
}
