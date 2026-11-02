import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Loading from "./Loading";
import ErrorMessage from "./ErrorMessage";
import EmptyState from "./EmptyState";
import FormPendaftaran from "./FormPendaftaran";
import { hitungSisaKuota } from "../utils/tiket";
import "../styles/detail.css";

function formatTanggal(tanggal) {
  return new Date(`${tanggal}T00:00:00`).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function DetailEvent() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sisaKuota, setSisaKuota] = useState(0);

  const muatEvent = () => {
    setLoading(true);
    setError("");
    fetch("/data/events.json")
      .then((res) => {
        if (!res.ok) throw new Error("Gagal memuat data event");
        return res.json();
      })
      .then((data) => {
        const ditemukan = data.find((e) => String(e.id) === String(id));
        setEvent(ditemukan || null);
        if (ditemukan) setSisaKuota(hitungSisaKuota(ditemukan));
        setLoading(false);
      })
      .catch(() => {
        setError("Gagal memuat detail event");
        setLoading(false);
      });
  };

  useEffect(() => {
    muatEvent();
  }, [id]);

  const petaUrl = event
    ? `https://www.google.com/maps?q=${encodeURIComponent(
        `${event.venue}, ${event.alamat}`
      )}&output=embed`
    : "";

  return (
    <main className="container py-4 detail-event">
<Link to="/" className="btn btn-outline-primary btn-sm">
  ← Kembali ke Beranda
</Link>

      {loading && <Loading pesan="Memuat detail event..." />}
      {error && <ErrorMessage pesan={error} onCobaLagi={muatEvent} />}
      {!loading && !error && !event && (
        <EmptyState pesan="Event tidak ditemukan" />
      )}

      {event && (
        <div className="row g-4 mt-1">
          <article className="col-lg-7">
            <img
              className="detail-poster"
              src={event.poster}
              alt={`Poster ${event.nama}`}
            />

            <div className="detail-label">
              <span className="badge label-kategori">{event.kategori}</span>
              <span className="badge label-gratis">Gratis</span>
            </div>

            <h1 className="detail-judul">{event.nama}</h1>
            <p className="detail-deskripsi">{event.deskripsi}</p>

            <h2 className="detail-subjudul">Informasi Event</h2>
            <dl className="detail-info">
              <div>
                <dt>Tanggal</dt>
                <dd>
                  <time dateTime={event.tanggal}>{formatTanggal(event.tanggal)}</time>
                </dd>
              </div>
              <div>
                <dt>Waktu</dt>
                <dd>
                  {event.jamMulai} – {event.jamSelesai} WIB
                </dd>
              </div>
              <div>
                <dt>Venue</dt>
                <dd>{event.venue}</dd>
              </div>
              <div>
                <dt>Alamat</dt>
                <dd>
                  {event.alamat} ({event.kota})
                </dd>
              </div>
              <div>
                <dt>Sisa kuota</dt>
                <dd>
                  {sisaKuota > 0 ? (
                    `${sisaKuota} dari ${event.kuota} tiket`
                  ) : (
                    <span className="habis">Kuota habis</span>
                  )}
                </dd>
              </div>
            </dl>

            <h2 className="detail-subjudul">Lokasi</h2>
            <div className="detail-peta">
              <iframe
                title={`Peta lokasi ${event.venue}`}
                src={petaUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </article>

          <aside className="col-lg-5" aria-label="Pendaftaran event">
            <FormPendaftaran
              event={event}
              sisaKuota={sisaKuota}
              onBerhasil={() => setSisaKuota(hitungSisaKuota(event))}
            />
          </aside>
        </div>
      )}
    </main>
  );
}

export default DetailEvent;
