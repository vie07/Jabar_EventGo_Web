import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Loading from "./Loading";
import ErrorMessage from "./ErrorMessage";
import {
  ambilUser,
  hitungTerisi,
  kategoriList,
  kotaList,
  milikPenyelenggara,
  muatSemuaEvent,
  POSTER_BAWAAN,
  simpanEvent,
} from "../utils/kelolaEvent";
import "../styles/kelola.css";

// Form Tambah / Edit Event.
// Rute: /kelola-event/tambah (tambah) dan /kelola-event/edit/:id (edit)
const formKosong = {
  nama: "",
  deskripsi: "",
  kategori: "",
  tanggal: "",
  jamMulai: "",
  jamSelesai: "",
  kota: "",
  venue: "",
  alamat: "",
  kuota: "",
  poster: "",
};

// Aturan validasi sesuai tabel di dokumen pembagian tugas
function validasi(form, eventLama, terisi) {
  const err = {};
  const hariIni = new Date().toLocaleDateString("sv-SE");

  if (form.nama.trim().length < 5) err.nama = "Nama event wajib diisi, minimal 5 karakter.";
  if (form.deskripsi.trim().length < 20) err.deskripsi = "Deskripsi wajib diisi, minimal 20 karakter.";
  if (!form.kategori) err.kategori = "Pilih kategori.";
  if (!form.tanggal) err.tanggal = "Tanggal wajib diisi.";
  else if (form.tanggal < hariIni && form.tanggal !== eventLama?.tanggal)
    err.tanggal = "Tanggal tidak boleh yang sudah lewat.";
  if (!form.jamMulai) err.jamMulai = "Jam mulai wajib diisi.";
  if (!form.jamSelesai) err.jamSelesai = "Jam selesai wajib diisi.";
  else if (form.jamMulai && form.jamSelesai <= form.jamMulai)
    err.jamSelesai = "Jam selesai harus setelah jam mulai.";
  if (!form.kota) err.kota = "Pilih kota / kabupaten.";
  if (!form.venue.trim()) err.venue = "Nama venue wajib diisi.";
  if (!form.alamat.trim()) err.alamat = "Alamat wajib diisi.";
  if (!(Number(form.kuota) > 0)) err.kuota = "Kuota wajib diisi dengan angka lebih dari 0.";
  else if (Number(form.kuota) < terisi)
    err.kuota = `Kuota tidak boleh kurang dari jumlah pendaftar saat ini (${terisi}).`;

  return err;
}

// Satu baris field: label + input + pesan error
function Field({ id, label, error, wajib = true, children }) {
  return (
    <div className="mb-3">
      <label htmlFor={id} className="form-label">
        {label} {wajib && <span className="wajib" aria-hidden="true">*</span>}
      </label>
      {children}
      {error && (
        <div id={`${id}-error`} className="pesan-field">
          {error}
        </div>
      )}
    </div>
  );
}

function FormEvent() {
  const { id } = useParams();
  const modeEdit = id !== undefined;
  const navigate = useNavigate();
  const user = ambilUser();

  const [form, setForm] = useState(formKosong);
  const [eventLama, setEventLama] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(modeEdit);
  const [error, setError] = useState("");
  const [tidakAda, setTidakAda] = useState(false);
  const [galat, setGalat] = useState("");

  // Mode edit: ambil event lalu isi form
  const muatEvent = () => {
    setLoading(true);
    setError("");
    muatSemuaEvent()
      .then((semua) => {
        const ketemu = semua.find((e) => String(e.id) === String(id));
        if (ketemu && milikPenyelenggara(ketemu, user?.email)) {
          setEventLama(ketemu);
          setForm({ ...formKosong, ...ketemu, kuota: String(ketemu.kuota) });
        } else {
          setTidakAda(true);
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Gagal memuat data event");
        setLoading(false);
      });
  };

  useEffect(() => {
    if (modeEdit) muatEvent();
  }, [id]);

  function ubah(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // Poster dari file: dibaca jadi data URL (maks 500 KB agar muat di localStorage)
  function pilihFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setErrors({ ...errors, poster: "File harus berupa gambar." });
      return;
    }
    if (file.size > 500 * 1024) {
      setErrors({ ...errors, poster: "Ukuran file maksimal 500 KB." });
      return;
    }
    const pembaca = new FileReader();
    pembaca.onload = () => {
      setForm({ ...form, poster: pembaca.result });
      setErrors({ ...errors, poster: undefined });
    };
    pembaca.readAsDataURL(file);
  }

  async function kirim(e) {
    e.preventDefault();
    const terisi = eventLama ? hitungTerisi(eventLama) : 0;
    const hasil = validasi(form, eventLama, terisi);
    setErrors(hasil);
    if (Object.keys(hasil).length > 0) {
      document.getElementById(Object.keys(hasil)[0])?.focus();
      return;
    }

    try {
      await simpanEvent(
        {
          ...form,
          nama: form.nama.trim(),
          deskripsi: form.deskripsi.trim(),
          venue: form.venue.trim(),
          alamat: form.alamat.trim(),
          kuota: Number(form.kuota),
          poster: form.poster.trim() || POSTER_BAWAAN,
        },
        eventLama,
        user?.email
      );
      navigate("/kelola-event");
    } catch {
      setGalat("Event gagal disimpan. Coba lagi, atau gunakan poster yang lebih kecil.");
    }
  }

  // Props yang sama untuk semua input
  const prop = (nama) => ({
    id: nama,
    name: nama,
    value: form[nama],
    onChange: ubah,
    "aria-invalid": errors[nama] ? "true" : undefined,
    "aria-describedby": errors[nama] ? `${nama}-error` : undefined,
  });
  const kelas = (nama, dasar = "form-control") => dasar + (errors[nama] ? " is-invalid" : "");

  if (loading) return <div className="container py-4"><Loading pesan="Memuat event..." /></div>;
  if (error) return <div className="container py-4"><ErrorMessage pesan={error} onCobaLagi={muatEvent} /></div>;
  if (tidakAda)
    return (
      <div className="container py-4 text-center">
        <p className="pesan">Event tidak ditemukan atau bukan milik akun kamu.</p>
        <Link to="/kelola-event" className="btn btn-primary">Kembali ke Kelola Event</Link>
      </div>
    );

  return (
    <div className="container py-4 form-event">
      <Link to="/kelola-event" className="link-kembali-kelola">← Kembali</Link>
      <h1 className="judul-kelola mb-4">{modeEdit ? "Edit Event" : "Tambah Event"}</h1>

      {galat && <div className="alert alert-danger" role="alert">{galat}</div>}

      <form onSubmit={kirim} noValidate>
        <Field id="nama" label="Nama event" error={errors.nama}>
          <input type="text" className={kelas("nama")} {...prop("nama")} />
        </Field>

        <Field id="deskripsi" label="Deskripsi" error={errors.deskripsi}>
          <textarea rows="3" className={kelas("deskripsi")} {...prop("deskripsi")} />
        </Field>

        <div className="row">
          <div className="col-md-6">
            <Field id="kategori" label="Kategori" error={errors.kategori}>
              <select className={kelas("kategori", "form-select")} {...prop("kategori")}>
                <option value="">-- Pilih kategori --</option>
                {kategoriList.map((k) => (
                  <option key={k} value={k}>{k}</option>
                ))}
              </select>
            </Field>
          </div>
          <div className="col-md-6">
            <Field id="kuota" label="Kuota" error={errors.kuota}>
              <input type="number" min="1" className={kelas("kuota")} {...prop("kuota")} />
            </Field>
          </div>
        </div>

        <div className="row">
          <div className="col-md-4">
            <Field id="tanggal" label="Tanggal" error={errors.tanggal}>
              <input type="date" className={kelas("tanggal")} {...prop("tanggal")} />
            </Field>
          </div>
          <div className="col-6 col-md-4">
            <Field id="jamMulai" label="Jam mulai" error={errors.jamMulai}>
              <input type="time" className={kelas("jamMulai")} {...prop("jamMulai")} />
            </Field>
          </div>
          <div className="col-6 col-md-4">
            <Field id="jamSelesai" label="Jam selesai" error={errors.jamSelesai}>
              <input type="time" className={kelas("jamSelesai")} {...prop("jamSelesai")} />
            </Field>
          </div>
        </div>

        <Field id="kota" label="Kota / kabupaten" error={errors.kota}>
          <select className={kelas("kota", "form-select")} {...prop("kota")}>
            <option value="">-- Pilih kota --</option>
            {kotaList.map((k) => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>
        </Field>

        <Field id="venue" label="Nama venue" error={errors.venue}>
          <input type="text" className={kelas("venue")} {...prop("venue")} />
        </Field>

        <Field id="alamat" label="Alamat" error={errors.alamat}>
          <input type="text" className={kelas("alamat")} {...prop("alamat")} />
        </Field>

        <Field id="poster" label="Poster (opsional, URL gambar atau pilih file)" error={errors.poster} wajib={false}>
          <input
            type="text"
            className={kelas("poster")}
            placeholder="https://..."
            {...prop("poster")}
            value={form.poster.startsWith("data:") ? "(file gambar dipilih)" : form.poster}
            disabled={form.poster.startsWith("data:")}
          />
          <input
            type="file"
            accept="image/*"
            className="form-control mt-2"
            aria-label="Pilih file poster"
            onChange={pilihFile}
          />
          {form.poster.startsWith("data:") && (
            <button
              type="button"
              className="btn btn-link btn-sm p-0 mt-1"
              onClick={() => setForm({ ...form, poster: "" })}
            >
              Hapus file
            </button>
          )}
          {form.poster && !errors.poster && (
            <img src={form.poster} className="pratinjau-poster" alt="Pratinjau poster" />
          )}
        </Field>

        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary">Simpan</button>
          <Link to="/kelola-event" className="btn btn-outline-secondary">Batal</Link>
        </div>
      </form>
    </div>
  );
}

export default FormEvent;
