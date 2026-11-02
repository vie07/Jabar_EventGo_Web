import { Link, NavLink, useNavigate } from "react-router-dom";
import "../styles/layout.css";

function Navbar({ user }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-eventgo">
      <div className="container">
        <Link className="navbar-brand" to="/">
          Jabar <span>EventGo</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarMenu"
          aria-controls="navbarMenu"
          aria-expanded="false"
          aria-label="Buka navigasi"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarMenu">
          <ul className="navbar-nav ms-auto align-items-lg-center">
            {user?.role === "peserta" && (
              <>
                <li className="nav-item">
                  <NavLink
                    to="/"
                    end
                    className={({ isActive }) =>
                      `nav-link ${isActive ? "active" : ""}`
                    }
                  >
                    Temukan Event
                  </NavLink>
                </li>

                <li className="nav-item">
                  <NavLink
                    to="/tiket-saya"
                    className={({ isActive }) =>
                      `nav-link ${isActive ? "active" : ""}`
                    }
                  >
                    Tiket Saya
                  </NavLink>
                </li>
              </>
            )}

            {user?.role === "penyelenggara" && (
              <li className="nav-item">
                <span className="nav-link">
                  Penyelenggara
                </span>
              </li>
            )}

            {user ? (
              <li className="nav-item ms-lg-3">
                <button
                  type="button"
                  className="btn btn-logout"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            ) : (
              <li className="nav-item">
                <Link to="/login" className="btn btn-login">
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;