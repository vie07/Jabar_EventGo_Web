import { useState, useEffect } from "react";
import KartuEvent from "./KartuEvent";
import Loading from "./Loading";
import ErrorMessage from "./ErrorMessage";
import EmptyState from "./EmptyState";
import "../styles/beranda.css";

const daftarKategori = ["Seminar", "Musik", "Olahraga", "Budaya"];
const daftarKota = [
  "Kota Bandung",
  "Kota Bogor",
  "Kota Bekasi",
  "Kabupaten Pangandaran",
];

function Beranda() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [cari, setCari] = useState("");
  const [kategori, setKategori] = useState("");
  const [kota, setKota] = useState("");
  const [tanggal, setTanggal] = useState("");

  const muatEvent = () => {
    setLoading(true);
    setError("");
    fetch("/data/events.json")
      .then((res) => {
        if (!res.ok) throw new Error("Gagal memuat data event");
        return res.json();
      })
      .then((data) => {
        setEvents(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Gagal memuat data event");
        setLoading(false);
      });
  };

  useEffect(() => {
    muatEvent();
  }, []);

  const hasil = events.filter((event) => {
    const cocokNama = event.nama.toLowerCase().includes(cari.toLowerCase());
    const cocokKategori = kategori === "" || event.kategori === kategori;
    const cocokKota = kota === "" || event.kota === kota;
    const cocokTanggal = tanggal === "" || event.tanggal === tanggal;
    return cocokNama && cocokKategori && cocokKota && cocokTanggal;
  });

  return (
    <main className="container py-4">
      <h1>Temukan Event di Jawa Barat</h1>

      <div className="filter">
        <input
          id="cari"
          type="text"
          className="form-control form-control-lg"
          placeholder="Cari nama event..."
          aria-label="Cari nama event"
          value={cari}
          onChange={(e) => setCari(e.target.value)}
        />

        <select
          id="kategori"
          className="form-select form-select-lg"
          aria-label="Filter kategori"
          value={kategori}
          onChange={(e) => setKategori(e.target.value)}
        >
          <option value="">Semua kategori</option>
          {daftarKategori.map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </select>

        <select
          id="kota"
          className="form-select form-select-lg"
          aria-label="Filter kota"
          value={kota}
          onChange={(e) => setKota(e.target.value)}
        >
          <option value="">Semua kota</option>
          {daftarKota.map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </select>

        <input
          id="tanggal"
          type="date"
          className="form-control form-control-lg"
          aria-label="Filter tanggal"
          value={tanggal}
          onChange={(e) => setTanggal(e.target.value)}
        />
      </div>

      {loading && <Loading pesan="Memuat event..." />}
      {error && <ErrorMessage pesan={error} onCobaLagi={muatEvent} />}
      {!loading && !error && hasil.length === 0 && (
        <EmptyState pesan="Event tidak ditemukan" />
      )}

      <section className="grid-event">
        {hasil.map((event) => (
          <KartuEvent key={event.id} event={event} />
        ))}
      </section>
    </main>
  );
}

export default Beranda;
