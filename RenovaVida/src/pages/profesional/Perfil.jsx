import { useState } from "react";
import ThOrdenable from "../../components/ThOrdenable.jsx";
import { useOrdenar } from "../../hooks/useOrdenar.js";
import "../../styles/perfil.css";

/* ================= Datos (luego los cambias por los de tu base de datos) ================= */
const institucion = {
  nombre: "RenovaVida",
  lema: "Atención y prevención",
  direccion: "Popayán, Cauca",
  telefono: "3212342343",
  correo: "renovavida@gmail.com",
  horario: "Lun - Sab 7:00 AM - 9:00 PM",
};

const especialidades = ["Psquiatra", "Medico Toxicologo", "Medicina general", "Neuropsicologo"];

const profesionales = [
  { id: 1, nombre: "Dr. Alejandro Ruiz", especialidad: "Psquiatra", estado: "Activado" },
  { id: 2, nombre: "Dra. Belen López", especialidad: "Toxicologo", estado: "Activado" },
  { id: 3, nombre: "Dr. Carlos Gómez", especialidad: "Neuropsicologo", estado: "Activado" },
  { id: 4, nombre: "Dra. Diana Sosa", especialidad: "Medico general ", estado: "Activado" },
];

const serviciosIniciales = [
  { id: 1, servicio: "C. General", especialidad: "Medicina General", profesional: "Dr. Carlos", fecha: "01-Oct-2026", paciente: "José Gregorio" },
  { id: 2, servicio: "Pediatría", especialidad: "Pediatría", profesional: "Dr. Pérez", fecha: "20-Oct-2026", paciente: "Elena Gómez" },
  { id: 3, servicio: "Urgencias", especialidad: "Urgencias", profesional: "Dra. Juana", fecha: "22-Oct-2026", paciente: "Laura Iplales" },
  { id: 4, servicio: "C. General", especialidad: "Medicina General", profesional: "Dr. Castillo", fecha: "22-Sep-2026", paciente: "José Gregorio" },
];

const coloresAvatar = ["#4a7fc1", "#3aa655", "#c98a3c", "#8a6bbf"];

/* ================= ORDEN: cómo comparar cada columna ================= */
// Las fechas vienen como "22-Oct-2026". Se convierten en un número
// (por ejemplo 20261022) para que se ordenen por fecha y no por letras.
const MESES = {
  Ene: 1, Feb: 2, Mar: 3, Abr: 4, May: 5, Jun: 6,
  Jul: 7, Ago: 8, Sep: 9, Oct: 10, Nov: 11, Dic: 12,
};

function valorOrden(servicio, campo) {
  if (campo === "fecha") {
    const [dia, mes, anio] = servicio.fecha.split("-");
    return Number(anio) * 10000 + MESES[mes] * 100 + Number(dia);
  }
  return servicio[campo];
}

/* ================= Íconos (SVG) ================= */
const iconos = {
  hospital: (
    <>
      <path d="M3 21V7l9-4 9 4v14" />
      <path d="M9 21v-5h6v5" />
      <path d="M12 8v4M10 10h4" />
    </>
  ),
  corazon: (
    <path d="M12 21s-7-4.5-9-9a5 5 0 0 1 9-3 5 5 0 0 1 9 3c-2 4.5-9 9-9 9z" />
  ),
  profesional: (
    <>
      <circle cx="9" cy="8" r="4" />
      <path d="M2 21c0-4 3-7 7-7s7 3 7 7" />
      <path d="M19 8v6M16 11h6" />
    </>
  ),
  pacientes: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2 20c0-3.5 3-6 7-6s7 2.5 7 6" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M17 14c3 0 5 2 5 5" />
    </>
  ),
  servicios: (
    <>
      <rect x="5" y="4" width="14" height="17" rx="2" />
      <path d="M9 4h6v3H9z" />
      <path d="M9 14l2 2 4-4" />
    </>
  ),
  buscar: (
    <>
      <circle cx="11" cy="11" r="6" />
      <path d="M20 20l-4.5-4.5" />
    </>
  ),
  editar: (
    <>
      <path d="M4 20h4L19 9l-4-4L4 16z" />
      <path d="M13.5 6.5l4 4" />
    </>
  ),
  eliminar: (
    <>
      <path d="M4 7h16" />
      <path d="M9 7V4h6v3" />
      <path d="M6 7l1 13h10l1-13" />
    </>
  ),
  calendario: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </>
  ),
};

function Icono({ nombre, tam = 22 }) {
  return (
    <svg
      width={tam}
      height={tam}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {iconos[nombre]}
    </svg>
  );
}

// "Dr. Carlos Ruiz" -> "CR"
function iniciales(nombre) {
  return nombre
    .replace(/^(Dr\.|Dra\.)\s*/, "")
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("");
}

function Perfil() {
  const [busqueda, setBusqueda] = useState("");
  const [espProf, setEspProf] = useState("");
  const [espServ, setEspServ] = useState("");
  const [servicios, setServicios] = useState(serviciosIniciales);

  const profFiltrados = profesionales.filter(
    (p) =>
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) &&
      (espProf === "" || p.especialidad === espProf)
  );

  // 1) Primero se filtra el historial por especialidad
  const servFiltrados = servicios.filter(
    (s) => espServ === "" || s.especialidad === espServ
  );

  // 2) Luego se ordena lo que quedó después del filtro
  const { ordenados, orden, cambiarOrden } = useOrdenar(servFiltrados, valorOrden);

  const eliminarServicio = (id) => {
    if (window.confirm("¿Eliminar este servicio del historial?")) {
      setServicios(servicios.filter((s) => s.id !== id));
    }
  };

  return (
    <div className="pf">
      {/* ---------- Tarjetas de arriba ---------- */}
      <section className="pf-tarjetas">
        {/* Datos de la institución */}
        <article className="pf-card pf-institucion">
          <div className="pf-inst-cabecera">
            <div className="pf-logo"><Icono nombre="hospital" tam={30} /></div>
            <div>
              <h3>{institucion.nombre}</h3>
              <small>{institucion.lema}</small>
            </div>
          </div>
          <dl className="pf-datos">
            <div><dt>Dirección:</dt><dd>{institucion.direccion}</dd></div>
            <div><dt>Teléfono:</dt><dd>{institucion.telefono}</dd></div>
            <div><dt>Correo:</dt><dd>{institucion.correo}</dd></div>
            <div><dt>Horario:</dt><dd>{institucion.horario}</dd></div>
          </dl>
        </article>

        {/* Especialidades */}
        <article className="pf-card pf-especialidades">
          <div className="pf-icono-caja"><Icono nombre="corazon" tam={26} /></div>
          <div>
            <h3>Especialidades: {especialidades.length}</h3>
            <p>{especialidades.join(", ")}</p>
          </div>
        </article>

        {/* Números */}
        <div className="pf-derecha">
          <article className="pf-card pf-stat pf-ancha">
            <div className="pf-icono-caja"><Icono nombre="profesional" tam={26} /></div>
            <div>
              <span className="pf-stat-titulo">Profesionales</span>
              <strong>10</strong>
            </div>
            <span className="pf-stat-extra">Activos</span>
          </article>

          <article className="pf-card pf-stat">
            <div className="pf-icono-caja"><Icono nombre="pacientes" tam={24} /></div>
            <div>
              <span className="pf-stat-titulo">Pacientes Registrados</span>
              <strong>100</strong>
            </div>
          </article>

          <article className="pf-card pf-stat">
            <div className="pf-icono-caja"><Icono nombre="servicios" tam={24} /></div>
            <div>
              <span className="pf-stat-titulo">Servicios Prestados</span>
              <strong>565</strong>
            </div>
          </article>
        </div>
      </section>

      {/* ---------- Listas de abajo ---------- */}
      <section className="pf-listas">
        {/* Profesionales activos */}
        <article className="pf-card">
          <h3 className="pf-titulo">PROFESIONALES ACTIVOS</h3>

          <div className="pf-filtros">
            <div className="pf-buscador">
              <Icono nombre="buscar" tam={16} />
              <input
                type="text"
                placeholder="Buscar Profesionales"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
            <select value={espProf} onChange={(e) => setEspProf(e.target.value)}>
              <option value="">Especialidad</option>
              {especialidades.map((e) => (
                <option key={e} value={e}>{e}</option>
              ))}
            </select>
          </div>

          <div className="pf-prof-lista">
            {profFiltrados.map((p, i) => (
              <div className="pf-prof" key={p.id}>
                <div
                  className="pf-avatar"
                  style={{ background: coloresAvatar[i % coloresAvatar.length] }}
                >
                  {iniciales(p.nombre)}
                </div>
                <div className="pf-prof-datos">
                  <b>{p.nombre}</b>
                  <small>{p.especialidad}</small>
                </div>
                <span className="pf-estado">{p.estado}</span>
                <span className="pf-mas">···</span>
              </div>
            ))}

            {profFiltrados.length === 0 && (
              <p className="pf-vacio">No hay profesionales que coincidan.</p>
            )}
          </div>

          <button className="pf-ver-mas">Ver todos los profesionales</button>
        </article>

        {/* Historial de servicios */}
        <article className="pf-card">
          <h3 className="pf-titulo">HISTORIAL DE SERVICIOS PRESTADOS</h3>

          <div className="pf-filtros">
            <div className="pf-fecha">
              <Icono nombre="calendario" tam={16} />
              Reciente: Oct 20, 2026 - Oct 20, 2026
            </div>
            <select value={espServ} onChange={(e) => setEspServ(e.target.value)}>
              <option value="">Especialidad</option>
              {especialidades.map((e) => (
                <option key={e} value={e}>{e}</option>
              ))}
            </select>
          </div>

          <div className="pf-tabla-caja">
            <table className="pf-tabla">
              <thead>
                <tr>
                  <ThOrdenable campo="servicio" orden={orden} onOrdenar={cambiarOrden}>Servicio</ThOrdenable>
                  <ThOrdenable campo="profesional" orden={orden} onOrdenar={cambiarOrden}>Profesional</ThOrdenable>
                  <ThOrdenable campo="fecha" orden={orden} onOrdenar={cambiarOrden}>Fecha</ThOrdenable>
                  <ThOrdenable campo="paciente" orden={orden} onOrdenar={cambiarOrden}>Paciente</ThOrdenable>
                  <th>Acción</th>
                </tr>
              </thead>

              <tbody>
                {ordenados.map((s) => (
                  <tr key={s.id}>
                    <td>{s.servicio}</td>
                    <td>{s.profesional}</td>
                    <td>{s.fecha}</td>
                    <td>{s.paciente}</td>
                    <td>
                      <div className="pf-acciones">
                        <button className="pf-btn-icono" title="Editar">
                          <Icono nombre="editar" tam={16} />
                        </button>
                        <button
                          className="pf-btn-icono pf-rojo"
                          title="Eliminar"
                          onClick={() => eliminarServicio(s.id)}
                        >
                          <Icono nombre="eliminar" tam={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {ordenados.length === 0 && (
                  <tr>
                    <td colSpan="5" className="pf-vacio">No hay servicios que coincidan.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <button className="pf-ver-mas">Ver historial completo</button>
        </article>
      </section>
    </div>
  );
}

export default Perfil;