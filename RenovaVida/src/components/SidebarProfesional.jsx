import { NavLink } from "react-router-dom";

const opciones = [
  { texto: "Perfil", ruta: "/profesional/perfil", icono: "👤" },
  { texto: "Programación de citas", ruta: "/profesional/citas", icono: "📅" },
  { texto: "Atender emergencias", ruta: "/profesional/emergencias", icono: "🚨" },
  { texto: "Reportes generados", ruta: "/profesional/reportes", icono: "📊" },
  { texto: "Solicitudes de usuarios", ruta: "/profesional/solicitudes", icono: "👥" },
  { texto: "Gestionar planes de tratamiento", ruta: "/profesional/planes", icono: "📝" },
];

function SidebarProfesional() {
  return (
    <aside className="sidebar">
    

      <div className="sidebar-logo">
         Renova<b>Vida</b>
         <small className="sidebar-rol">Profesional de Salud</small>
      </div>

      <nav className="sidebar-menu">
        {opciones.map((op) => (
          <NavLink
            key={op.ruta}
            to={op.ruta}
            className={({ isActive }) =>
              isActive ? "sidebar-link activo" : "sidebar-link"
            }
          >
            <span>{op.icono}</span>
            {op.texto}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default SidebarProfesional;