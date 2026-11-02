// Data event untuk Kelola Event (Anggota E).
//
// Event bawaan dibaca dari public/data/events.json (fetch), event buatan
// penyelenggara disimpan di localStorage:
//   "events"        -> event baru / event bawaan yang sudah diedit (id sama)
//   "eventsDihapus" -> id event yang dihapus
// Bentuk event sama dengan events.json:
// { id, nama, kategori, tanggal, kota, poster, kuota, terdaftar,
//   deskripsi, jamMulai, jamSelesai, venue, alamat, penyelenggara }
// "penyelenggara" = email pembuat. Event di JSON tidak punya field ini,
// jadi dianggap milik akun penyelenggara bawaan (OWNER_BAWAAN).

import { ambilSemuaTiket, KUNCI_TIKET } from "./tiket";

const KUNCI_EVENT = "events";
const KUNCI_DIHAPUS = "eventsDihapus";
export const OWNER_BAWAAN = "penyelenggara@jabar.go.id";
export const POSTER_BAWAAN = "/images/desain.jpg";

// Disamakan dengan dropdown filter di Beranda.jsx
export const kategoriList = ["Seminar", "Musik", "Olahraga", "Budaya"];
export const kotaList = [
  "Kota Bandung",
  "Kota Bogor",
  "Kota Bekasi",
  "Kabupaten Pangandaran",
];

// Halaman Peserta & Check-in (Anggota F). Ubah di sini jika path-nya berbeda.
export const JALUR_PESERTA = "/peserta";

function baca(kunci) {
  try {
    const data = JSON.parse(localStorage.getItem(kunci) || "[]");
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export function ambilUser() {
  try {
    return JSON.parse(localStorage.getItem("user")) || null;
  } catch {
    return null;
  }
}

async function ambilEventBawaan() {
  const res = await fetch("/data/events.json");
  if (!res.ok) throw new Error("Gagal memuat data event");
  return res.json();
}

// Semua event (bawaan + lokal) tanpa yang dihapus
export async function muatSemuaEvent() {
  const bawaan = await ambilEventBawaan();
  const lokal = baca(KUNCI_EVENT);
  const dihapus = baca(KUNCI_DIHAPUS);
  const idLokal = lokal.map((e) => e.id);

  return [...bawaan.filter((e) => !idLokal.includes(e.id)), ...lokal].filter(
    (e) => !dihapus.includes(e.id)
  );
}

export function milikPenyelenggara(event, email) {
  const pemilik = event.penyelenggara || OWNER_BAWAAN;
  return pemilik.toLowerCase() === String(email || "").toLowerCase();
}

// Kuota terisi = peserta bawaan (terdaftar) + tiket baru di localStorage
export function hitungTerisi(event, semuaTiket = ambilSemuaTiket()) {
  return (event.terdaftar || 0) + semuaTiket.filter((t) => t.eventId === event.id).length;
}

// Tambah (eventLama = null) atau ubah event. Mengembalikan event yang tersimpan.
export async function simpanEvent(data, eventLama, email) {
  const lokal = baca(KUNCI_EVENT);

  if (eventLama) {
    const baru = { ...eventLama, ...data };
    localStorage.setItem(
      KUNCI_EVENT,
      JSON.stringify([...lokal.filter((e) => e.id !== eventLama.id), baru])
    );
    return baru;
  }

  const bawaan = await ambilEventBawaan();
  const semuaId = [0, ...bawaan.map((e) => e.id), ...lokal.map((e) => e.id), ...baca(KUNCI_DIHAPUS)];
  const baru = {
    ...data,
    id: Math.max(...semuaId) + 1, // id lama tidak dipakai ulang
    terdaftar: 0,
    penyelenggara: email,
  };
  localStorage.setItem(KUNCI_EVENT, JSON.stringify([...lokal, baru]));
  return baru;
}

// Hapus event beserta tiket pesertanya
export function hapusEvent(id) {
  localStorage.setItem(KUNCI_EVENT, JSON.stringify(baca(KUNCI_EVENT).filter((e) => e.id !== id)));
  localStorage.setItem(KUNCI_DIHAPUS, JSON.stringify([...baca(KUNCI_DIHAPUS), id]));
  localStorage.setItem(
    KUNCI_TIKET,
    JSON.stringify(ambilSemuaTiket().filter((t) => t.eventId !== id))
  );
}

// Daftar peserta satu event = peserta bawaan (public/data/pesertaBawaan.json,
// sebanyak event.terdaftar) + tiket yang dibuat lewat aplikasi (localStorage).
// Jumlahnya selalu sama dengan kuota terisi di kartu (hitungTerisi).
export async function muatPesertaEvent(event) {
  let bawaan = [];
  if ((event.terdaftar || 0) > 0) {
    const res = await fetch("/data/pesertaBawaan.json");
    if (!res.ok) throw new Error("Gagal memuat data peserta");
    const semua = await res.json();
    bawaan = semua.filter((p) => p.eventId === event.id).slice(0, event.terdaftar);
  }
  const baru = ambilSemuaTiket().filter((t) => t.eventId === event.id);
  return [...bawaan, ...baru];
}
