import { Outlet } from "react-router-dom";
import SidebarProfesional from "../components/SidebarProfesional.jsx";
import HeaderPanel from "../components/HeaderPanel.jsx";
import "../styles/profesional.css";

function LayoutProfesional() {
  return (
    <div className="panel">
      <SidebarProfesional />
      <main className="panel-contenido">
        <HeaderPanel />
        <Outlet />
      </main>
    </div>
  );
}

export default LayoutProfesional;