import { useNavigate } from "react-router-dom";
import "../styles/headerpanel.css";

function HeaderPanel() {
  const navigate = useNavigate();

  return (
    <header className="header-panel">
      <h1>PANEL INSTITUCIONAL</h1>
      <div className="header-usuario">
        <span>👤</span>
        <div>
          <small>Admin</small>
          <p>Jose Martin</p>
        </div>
        <button className="hp-salir-simple" onClick={() => navigate("/")}>
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}

export default HeaderPanel;