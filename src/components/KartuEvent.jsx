function KartuEvent(props) {
  const event = props.event;
  const sisa = event.kuota - event.terdaftar;

  return (
    <article className="kartu">
      <img src={event.poster} alt={event.nama} />
      <div className="kartu-isi">
        <div className="kartu-label">
          <span className="badge label-kategori">{event.kategori}</span>
          <span className="badge label-gratis">Gratis</span>
        </div>
        <h2>{event.nama}</h2>
        <p>
          {event.tanggal} · {event.kota}
        </p>
        {sisa > 0 ? (
          <p>Sisa kuota: {sisa}</p>
        ) : (
          <p className="habis">Kuota habis</p>
        )}
        <button className="btn tombol-detail">Lihat Detail</button>
      </div>
    </article>
  );
}

export default KartuEvent;
