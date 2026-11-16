import { useState } from "react";
import "../../styles/Planes.css";

/* ================= Datos (luego los cambias por los de tu base de datos) ================= */
const planesIniciales = [
  { id: 1, paciente: "Elena Rodríguez", idPaciente: "207020", profesional: "Dr. Luis Gómez", especialidad: "Odontología", tipo: "Ortodoncia Correctiva", inicio: "01/05/2026", estado: "Activo" },
  { id: 2, paciente: "Elena Rodríguez", idPaciente: "207020", profesional: "Dr. Luis Gómez", especialidad: "Odontología", tipo: "Fisioterapia", inicio: "01/05/2026", estado: "Activo" },
  { id: 3, paciente: "Elena Rodríguez", idPaciente: "207023", profesional: "Dr. Luis Gómez", especialidad: "Odontología", tipo: "Cardiología", inicio: "01/05/2026", estado: "Suspendido" },
  { id: 4, paciente: "Darins Ceines", idPaciente: "1310026", profesional: "Dr. Luis Gómez", especialidad: "Odontología", tipo: "Cardiología", inicio: "01/05/2026", estado: "Completado" },
  { id: 5, paciente: "Elena Rodríguez", idPaciente: "207023", profesional: "Dr. Luis Gómez", especialidad: "Odontología", tipo: "Cardiología", inicio: "01/05/2026", estado: "Activo" },
  { id: 6, paciente: "Elena Rodríguez", idPaciente: "207027", profesional: "Dr. Luis Gómez", especialidad: "Odontología", tipo: "Cardiología", inicio: "01/05/2026", estado: "Suspendido" },
  { id: 7, paciente: "Darins Ceines", idPaciente: "1310026", profesional: "Dr. Luis Gómez", especialidad: "Odontología", tipo: "Cardiología", inicio: "01/05/2026", estado: "Completado" },
];

const claseEstado = {
  Activo: "pl-activo",
  Suspendido: "pl-suspendido",
  Completado: "pl-completado",
};

// Saca las iniciales de un nombre: "Elena Rodríguez" -> "ER"
function iniciales(nombre) {
  return nombre
    .split(" ")
    .slice(0, 2)
    .map((palabra) => palabra[0])
    .join("");
}

function PlanesTratamiento() {
  const [planes, setPlanes] = useState(planesIniciales);
  const [busqueda, setBusqueda] = useState("");
  const [verAviso, setVerAviso] = useState(true);

  // Cambia el estado de un plan (y deja igual los demás)
  const cambiarEstado = (id, nuevoEstado) => {
    setPlanes(
      planes.map((p) => (p.id === id ? { ...p, estado: nuevoEstado } : p))
    );
  };

  // Muestra solo los planes que coinciden con lo que se escribió
  const filtrados = planes.filter((p) =>
    `${p.paciente} ${p.idPaciente} ${p.profesional} ${p.especialidad} ${p.tipo} ${p.estado}`
      .toLowerCase()
      .includes(busqueda.toLowerCase())
  );

  return (
    <div className="pl">
      {/* ---------- Tarjetas de arriba ---------- */}
      <section className="pl-tarjetas">
        <article className="pl-card">
          <h3>Planes activos</h3>
          <p className="pl-grande">
            125 <small>12 suspendidos</small> <span className="pl-sube">▲</span>
          </p>
        </article>

        <article className="pl-card">
          <h3>Planes por tipo</h3>
          <p className="pl-grande">
            95 Dentales <span className="pl-diente">🦷</span>{" "}
            <span className="pl-sube">▲</span>
          </p>
        </article>

        <article className="pl-card">
          <h3>Planes completados</h3>
          <p className="pl-grande">
            30 <small>este mes</small> <span className="pl-sube">▲</span>
          </p>
        </article>

        {verAviso && (
          <article className="pl-aviso">
            <span className="pl-campana">🔔</span>
            <div>
              <p>Historias clínicas actualizadas automáticamente.</p>
              <small>Última actualización: 12/10/2026</small>
            </div>
            <button className="pl-cerrar" onClick={() => setVerAviso(false)}>
              ✕
            </button>
          </article>
        )}
      </section>

      {/* ---------- Lista ---------- */}
      <section className="pl-lista">
        <div className="pl-lista-top">
          <h2>
            LISTA DE PLANES ACTIVOS <span className="pl-etiqueta">125 planes</span>
          </h2>
          <button className="pl-btn-nuevo">＋ Nuevo Plan</button>
        </div>

        <div className="pl-buscar-fila">
          <input
            type="text"
            className="pl-buscar"
            placeholder="🔍 Buscar paciente o profesional / Filtrar por especialidad"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <span className="pl-etiqueta">125 planes</span>
        </div>

        <div className="pl-tabla-caja">
          <table className="pl-tabla">
            <thead>
              <tr>
                <th>Paciente</th>
                <th>Profesional</th>
                <th>Tipo de Plan</th>
                <th>Inicio</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {filtrados.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div className="pl-persona">
                      <div className="pl-foto">{iniciales(p.paciente)}</div>
                      <div>
                        <b>{p.paciente}</b>
                        <small>ID: {p.idPaciente}</small>
                      </div>
                    </div>
                  </td>

                  <td>
                    <div className="pl-persona">
                      <div className="pl-foto pl-foto-prof">{iniciales(p.profesional.replace("Dr. ", ""))}</div>
                      <div>
                        <b>{p.profesional}</b>
                        <small>{p.especialidad}</small>
                      </div>
                    </div>
                  </td>

                  <td>{p.tipo}</td>
                  <td>{p.inicio}</td>

                  <td>
                    <span className={`pl-estado ${claseEstado[p.estado]}`}>{p.estado}</span>
                    <small className="pl-actualizacion">Última actualización: 12/10/2026</small>
                  </td>

                  <td>
                    <div className="pl-acciones">
                      <button className="pl-menu">☰ ⌄</button>

                      {p.estado === "Suspendido" ? (
                        <button
                          className="pl-accion pl-amarillo"
                          onClick={() => cambiarEstado(p.id, "Activo")}
                        >
                          <span>▶</span>Reactivar
                        </button>
                      ) : (
                        <button
                          className="pl-accion pl-amarillo"
                          disabled={p.estado === "Completado"}
                          onClick={() => cambiarEstado(p.id, "Suspendido")}
                        >
                          <span>!</span>Suspender
                        </button>
                      )}

                      <button className="pl-accion pl-gris">
                        <span>✎</span>Modificar
                      </button>

                      <button
                        className="pl-accion pl-verde"
                        disabled={p.estado === "Completado"}
                        onClick={() => cambiarEstado(p.id, "Completado")}
                      >
                        <span>✓</span>Terminar
                      </button>

                      <button className="pl-accion pl-gris">
                        <span>⇄</span>Reemplazar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filtrados.length === 0 && (
                <tr>
                  <td colSpan="6" className="pl-vacio">
                    No hay planes que coincidan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default PlanesTratamiento;