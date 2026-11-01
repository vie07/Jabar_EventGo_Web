function ErrorMessage(props) {
  return (
    <div className="pesan">
      <p className="pesan-error">{props.pesan}</p>
      <button className="btn btn-outline-danger" onClick={props.onCobaLagi}>
        Coba lagi
      </button>
    </div>
  );
}

export default ErrorMessage;
