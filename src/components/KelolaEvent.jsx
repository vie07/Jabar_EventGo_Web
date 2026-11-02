import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import KartuKelolaEvent from "./KartuKelolaEvent";
import Loading from "./Loading";
import ErrorMessage from "./ErrorMessage";
import EmptyState from "./EmptyState";
import { ambilSemuaTiket, KUNCI_TIKET } from "../utils/tiket";
import { formatTanggal } from "../utils/format";
import {
  ambilUser,
  muatSemuaEvent,
  milikPenyelenggara,
  hitungTerisi,
  hapusEvent,
  JALUR_PESERTA,
} from "../utils/kelolaEvent";
import "../styles/kelola.css";

// Halaman Kelola Event: ringkasan + daftar event milik penyelenggara.
function KelolaEvent() {
  const navigate = useNavigate();
  const user = ambilUser();

  const [daftarEvent, setDaftarEvent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const muatEvent = () => {
    setLoading(true);
    setError("");
    muatSemuaEvent()
      .then((data) => {
        setDaftarEvent(data.filter((e) => milikPenyelenggara(e, user?.email)));
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

  function hapus(event) {
    const terisi = hitungTerisi(event);
    const peringatan =
      terisi > 0 ? `\n${terisi} peserta sudah terdaftar, tiket mereka ikut dihapus.` : "";
    if (window.confirm(`Hapus event "${event.nama}"?${peringatan}`)) {
      hapusEvent(event.id);
      setDaftarEvent(daftarEvent.filter((ev) => ev.id !== event.id));
    }
  }

  function lihatPeserta(event) {
    navigate(`${JALUR_PESERTA}?event=${event.id}`, { state: { eventId: event.id } });
  }

  // Ringkasan
  const semuaTiket = ambilSemuaTiket();
  const totalPendaftar = daftarEvent.reduce((total, ev) => total + hitungTerisi(ev, semuaTiket), 0);
  const hariIni = new Date().toLocaleDateString("sv-SE"); // YYYY-MM-DD
  const terdekat = daftarEvent
    .filter((ev) => ev.tanggal >= hariIni)
    .sort((a, b) => a.tanggal.localeCompare(b.tanggal))[0];

  return (
    <div className="container py-4 kelola-event">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
        <h1 className="judul-kelola">Kelola Event</h1>
        <Link to="/kelola-event/tambah" className="btn btn-primary">
          + Tambah Event
        </Link>
      </div>

      {loading && <Loading pesan="Memuat event..." />}
      {error && <ErrorMessage pesan={error} onCobaLagi={muatEvent} />}

      {!loading && !error && (
        <>
          <section className="row g-3 mb-4" aria-label="Ringkasan event">
            <div className="col-md-4">
              <div className="card p-3 ringkasan">
                <small className="teks-redup">Jumlah event</small>
                <div className="fs-2 fw-bold">{daftarEvent.length}</div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card p-3 ringkasan">
                <small className="teks-redup">Total pendaftar</small>
                <div className="fs-2 fw-bold">{totalPendaftar}</div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card p-3 ringkasan">
                <small className="teks-redup">Event terdekat</small>
                <div className="fs-5 fw-bold">{terdekat ? terdekat.nama : "-"}</div>
                {terdekat && <small>{formatTanggal(terdekat.tanggal)}</small>}
              </div>
            </div>
          </section>

          {daftarEvent.length === 0 ? (
            <div className="text-center py-5">
              <EmptyState pesan="Belum ada event. Yuk buat event pertamamu!" />
              <Link to="/kelola-event/tambah" className="btn btn-primary">
                Buat Event
              </Link>
            </div>
          ) : (
            <section className="row g-4" aria-label="Daftar event saya">
              {daftarEvent.map((ev) => (
                <div className="col-12 col-md-6 col-lg-4" key={ev.id}>
                  <KartuKelolaEvent
                    event={ev}
                    terisi={hitungTerisi(ev, semuaTiket)}
                    onEdit={() => navigate(`/kelola-event/edit/${ev.id}`)}
                    onHapus={hapus}
                    onLihatPeserta={lihatPeserta}
                  />
                </div>
              ))}
            </section>
          )}
        </>
      )}
    </div>
  );
}

export default KelolaEvent;
