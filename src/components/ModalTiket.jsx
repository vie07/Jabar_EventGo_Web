import { useEffect, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { formatTanggal } from "../utils/format";

function ModalTiket({ tiket, onTutup, onBatalkan }) {
  const tombolTutup = useRef(null);

  useEffect(() => {
    document.body.classList.add("modal-open");
    tombolTutup.current?.focus();

    const saatTombol = (e) => {
      if (e.key === "Escape") {
        onTutup();
      }
    };

    document.addEventListener("keydown", saatTombol);

    return () => {
      document.body.classList.remove("modal-open");
      document.removeEventListener("keydown", saatTombol);
    };
  }, [onTutup]);

  return (
    <>
      <div
        className="modal-backdrop fade show"
        onClick={onTutup}
      />

      <div
        className="modal fade show d-block"
        tabIndex="-1"
        role="dialog"
        aria-modal="true"
        aria-labelledby="judul-modal-tiket"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">

            {/* Header Modal */}
            <div className="modal-header">
              <h2
                id="judul-modal-tiket"
                className="modal-title fs-5"
              >
                Detail Tiket
              </h2>

              <button
                ref={tombolTutup}
                type="button"
                className="btn-close"
                aria-label="Tutup"
                onClick={onTutup}
              />
            </div>

            {/* Isi Modal */}
            <div className="modal-body text-center">
              <h5>{tiket.eventNama}</h5>

              {/* QR Code */}
              <div className="qr-tiket">
                <QRCodeSVG
                  value={tiket.kode}
                  size={180}
                  title={`QR Code tiket ${tiket.kode}`}
                />
              </div>

              <p className="tiket-kode-besar">
                {tiket.kode}
              </p>

              {/* Status Tiket */}
              <span
                className={`badge ${
                  tiket.statusCheckIn
                    ? "text-bg-success"
                    : "text-bg-primary"
                }`}
              >
                {tiket.statusCheckIn
                  ? "Sudah check-in"
                  : "Aktif"}
              </span>

              {/* Informasi Tiket */}
              <dl className="tiket-detail text-start mt-4">
                <dt>Tanggal</dt>
                <dd>{formatTanggal(tiket.tanggal)}</dd>

                <dt>Waktu</dt>
                <dd>
                  {tiket.jamMulai} - {tiket.jamSelesai} WIB
                </dd>

                <dt>Lokasi</dt>
                <dd>
                  {tiket.venue}, {tiket.kota}
                </dd>

                <dt>Nama peserta</dt>
                <dd>{tiket.nama}</dd>

                <dt>Email</dt>
                <dd>{tiket.email}</dd>
              </dl>
            </div>

            {/* Footer Modal */}
            <div className="modal-footer">
              {!tiket.statusCheckIn && (
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => onBatalkan(tiket.kode)}
                >
                  Batalkan Tiket
                </button>
              )}

              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={onTutup}
              >
                Tutup
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default ModalTiket;