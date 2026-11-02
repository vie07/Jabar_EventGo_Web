import { formatTanggal } from "../utils/format";

// Kartu satu event di halaman Kelola Event. Data & fungsi lewat props.
function KartuKelolaEvent({ event, terisi, onEdit, onHapus, onLihatPeserta }) {
  const { nama, kategori, tanggal, kota, kuota, poster } = event;
  const persen = Math.min(100, Math.round((terisi / kuota) * 100));

  // Warna bar: aman (teal), menipis (warning), penuh (danger)
  const warna = terisi >= kuota ? "bar-penuh" : persen >= 80 ? "bar-menipis" : "bar-aman";

  return (
    <article className="card h-100 kartu-kelola">
      {poster && <img src={poster} className="card-img-top" alt={`Poster ${nama}`} />}
      <div className="card-body">
        <div className="mb-2 d-flex gap-2">
          <span className="badge label-kategori">{kategori}</span>
          <span className="badge label-gratis">Gratis</span>
        </div>
        <h3 className="h5 card-title">{nama}</h3>
        <p className="mb-1">📅 {formatTanggal(tanggal)}</p>
        <p className="mb-3">📍 {kota}</p>

        <p className="mb-1">
          Kuota terisi: <strong>{terisi}/{kuota}</strong>
          {terisi >= kuota && <span className="teks-penuh"> · Penuh</span>}
        </p>
        <div
          className="progress"
          role="progressbar"
          aria-label={`Kuota terisi ${nama}`}
          aria-valuenow={persen}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div className={`progress-bar ${warna}`} style={{ width: `${persen}%` }}></div>
        </div>
      </div>
      <div className="card-footer d-flex flex-wrap gap-2">
        <button className="btn btn-sm btn-outline-primary" onClick={() => onLihatPeserta(event)}>
          Lihat Peserta
        </button>
        <button className="btn btn-sm btn-outline-navy" onClick={() => onEdit(event)}>
          Edit
        </button>
        <button className="btn btn-sm btn-outline-danger" onClick={() => onHapus(event)}>
          Hapus
        </button>
      </div>
    </article>
  );
}

export default KartuKelolaEvent;
