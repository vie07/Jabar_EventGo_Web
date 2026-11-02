import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Loading from "./Loading";
import ErrorMessage from "./ErrorMessage";
import EmptyState from "./EmptyState";
import { formatTanggal } from "../utils/format";
import {
  ambilUser,
  muatSemuaEvent,
  muatPesertaEvent,
  milikPenyelenggara,
  hitungTerisi,
  prosesCheckIn,
} from "../utils/kelolaEvent";
import "../styles/kelola.css";

// SEMENTARA (dibuat Anggota E agar tombol "Lihat Peserta" punya tujuan).
// Hanya menampilkan tabel peserta (data bawaan: public/data/pesertaBawaan.json). Form check-in menjadi bagian Anggota F:
// saat halaman F jadi, ganti rute "/peserta" di routes/ruteKelolaEvent.jsx
// dengan komponen F, lalu file ini boleh dihapus.
function PesertaEvent() {
  const lokasi = useLocation();
  const user = ambilUser();

  // Event terpilih: dari ?event=ID atau dari state tombol Lihat Peserta
  const idAwal =
    new URLSearchParams(lokasi.search).get("event") || lokasi.state?.eventId || "";

  const [events, setEvents] = useState([]);
  const [idPilih, setIdPilih] = useState(String(idAwal));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  //state untuk checkin aing
  const [kodeTiket, setKodeTiket] = useState("");
  const [pesanCheckIn, setPesanCheckIn] = useState("");
  const [jenisPesan, setJenisPesan] = useState("");
  const [loadingCheckIn, setLoadingCheckIn] = useState(false);

  //proses data checkin
  const handleCheckIn = async (e) => {
    e.preventDefault();

    if (!event) {
      setPesanCheckIn("Silakan pilih event terlebih dahulu");
      setJenisPesan("danger");
      return;
    }

    setLoadingCheckIn(true);
    setPesanCheckIn("");

    try {
      const hasil = await prosesCheckIn(event.id, kodeTiket);

      setPesanCheckIn(hasil.pesan);
      setJenisPesan(hasil.berhasil ? "success" : "danger");

      if (hasil.berhasil) {
        const dataPeserta = await muatPesertaEvent(event);
        setPeserta(dataPeserta);
        setKodeTiket("");
      }
    } catch (error) {
      setPesanCheckIn("Gagal memproses check-in");
      setJenisPesan("danger");
    } finally {
      setLoadingCheckIn(false);
    }
  };

  const muatEvent = () => {
    setLoading(true);
    setError("");
    muatSemuaEvent()
      .then((data) => {
        setEvents(data.filter((e) => milikPenyelenggara(e, user?.email)));
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

  const event = events.find((e) => String(e.id) === idPilih);
  const [peserta, setPeserta] = useState([]);
  const [errorPeserta, setErrorPeserta] = useState("");

  useEffect(() => {
    setErrorPeserta("");
    if (!event) {
      setPeserta([]);
      return;
    }
    muatPesertaEvent(event)
      .then(setPeserta)
      .catch(() => setErrorPeserta("Gagal memuat data peserta"));
  }, [event]);

  return (
    <div className="container py-4 kelola-event">
      <Link to="/kelola-event" className="link-kembali-kelola">← Kembali</Link>
      <h1 className="judul-kelola mb-3">Peserta Event</h1>

      {loading && <Loading pesan="Memuat event..." />}
      {error && <ErrorMessage pesan={error} onCobaLagi={muatEvent} />}

      {!loading && !error && (
        <>
          <label htmlFor="pilih-event" className="form-label fw-bold">Pilih event</label>
          <select
            id="pilih-event"
            className="form-select mb-3"
            value={idPilih}
            onChange={(e) => setIdPilih(e.target.value)}
          >
            <option value="">-- Pilih event --</option>
            {events.map((e) => (
              <option key={e.id} value={e.id}>{e.nama}</option>
            ))}
          </select>

          {event && (
            <>
              <p className="teks-redup">
                {formatTanggal(event.tanggal)} · {event.venue}, {event.kota}
              </p>

              <p className="fw-bold">
                {hitungTerisi(event)}/{event.kuota} kuota terisi
              </p>

              <div className="card p-3 mb-4">
                <h5 className="fw-bold">Check-in Peserta</h5>
                <p className="text-muted">
                  Masukkan kode tiket peserta untuk melakukan check-in.
                </p>

                <form onSubmit={handleCheckIn}>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Contoh: EVG-001-96RAFH"
                      value={kodeTiket}
                      onChange={(e) => setKodeTiket(e.target.value)}
                      required
                    />

                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loadingCheckIn}
                    >
                      {loadingCheckIn ? "Memproses..." : "Check-in"}
                    </button>
                  </div>
                </form>

                {pesanCheckIn && (
                  <div className={`alert alert-${jenisPesan} mt-3 mb-0`}>
                    {pesanCheckIn}
                  </div>
                )}
              </div>

              {errorPeserta && <p className="pesan-error">{errorPeserta}</p>}

              {!errorPeserta && peserta.length === 0 ? (
                <EmptyState pesan="Belum ada peserta yang mendaftar" />
              ) : (
                <div className="table-responsive">
                  <table className="table table-striped align-middle">
                    <thead>
                      <tr>
                        <th>No</th>
                        <th>Nama</th>
                        <th>Email</th>
                        <th>No. HP</th>
                        <th>Kode tiket</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {peserta.map((t, i) => (
                        <tr key={t.kode}>
                          <td>{i + 1}</td>
                          <td>{t.nama}</td>
                          <td>{t.email}</td>
                          <td>{t.noHp}</td>
                          <td>{t.kode}</td>
                          <td>
                            <span
                              className={`badge ${t.statusCheckIn
                                  ? "text-bg-success"
                                  : "text-bg-warning"
                                }`}
                            >
                              {t.statusCheckIn ? "Sudah Check-in" : "Belum Check-in"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

export default PesertaEvent;
