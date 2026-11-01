
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import "../styles/layout.css";

function ambilUser() {
  try {
    return JSON.parse(localStorage.getItem("user")) || null;
  } catch {
    return null;
  }
}

function Layout() {
  const user = ambilUser();

  return (
    <div className="layout">
      <Navbar user={user} />

      <main className="layout-main">
        <Outlet />
      </main>

      <footer className="layout-footer">
        <div className="container text-center">
          <small>
            © {new Date().getFullYear()} Jabar EventGo -
            Jelajahi Event Jawa Barat
          </small>
        </div>
      </footer>
    </div>
  );
}

export default Layout;