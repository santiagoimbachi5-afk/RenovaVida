import { useState } from "react";
import ModalConfirmar from "../../components/ModalConfirmar.jsx";
import Aviso from "../../components/Aviso.jsx";
import ThOrdenable from "../../components/ThOrdenable.jsx"; // NUEVO
import { useOrdenar } from "../../hooks/useOrdenar.js"; // NUEVO
import "../../styles/planes.css";

/* ================= Datos (luego los cambias por los de tu base de datos) ================= */
const planesIniciales = [
  { id: 1, paciente: "Elena Rodríguez", idPaciente: "207020", profesional: "Dr. Luis Gómez", especialidad: "Odontología", tipo: "Ortodoncia Correctiva", inicio: "01/05/2026", estado: "Activo" },
  { id: 2, paciente: "Elena Rodríguez", idPaciente: "207020", profesional: "Dr. Luis Gómez", especialidad: "Odontología", tipo: "Fisioterapia", inicio: "15/03/2026", estado: "Activo" },
  { id: 3, paciente: "Elena Rodríguez", idPaciente: "207023", profesional: "Dr. Luis Gómez", especialidad: "Odontología", tipo: "Cardiología", inicio: "10/07/2026", estado: "Suspendido" },
  { id: 4, paciente: "Darins Ceines", idPaciente: "1310026", profesional: "Dr. Luis Gómez", especialidad: "Odontología", tipo: "Cardiología", inicio: "20/06/2026", estado: "Completado" },
  { id: 5, paciente: "Elena Rodríguez", idPaciente: "207023", profesional: "Dr. Luis Gómez", especialidad: "Odontología", tipo: "Cardiología", inicio: "01/05/2026", estado: "Activo" },
  { id: 6, paciente: "Elena Rodríguez", idPaciente: "207027", profesional: "Dr. Luis Gómez", especialidad: "Odontología", tipo: "Cardiología", inicio: "02/02/2026", estado: "Suspendido" },
  { id: 7, paciente: "Darins Ceines", idPaciente: "1310026", profesional: "Dr. Luis Gómez", especialidad: "Odontología", tipo: "Cardiología", inicio: "01/05/2026", estado: "Completado" },
];

const claseEstado = {
  Activo: "pl-activo",
  Suspendido: "pl-suspendido",
  Completado: "pl-completado",
};

/* Qué dice la ventana y el aviso en cada acción */
const acciones = {
  Suspender: {
    nuevoEstado: "Suspendido",
    titulo: "¿Suspender este plan?",
    botonConfirmar: "Sí, suspender",
    advertencia: "",
    aviso: "Plan suspendido",
  },
  Terminar: {
    nuevoEstado: "Completado",
    titulo: "¿Terminar este plan?",
    botonConfirmar: "Sí, terminar",
    advertencia: "Un plan completado ya no se puede suspender ni terminar de nuevo.",
    aviso: "Plan completado",
  },
};

/* NUEVO: cómo comparar cada columna. La fecha "01/05/2026" se convierte
   en el número 20260501 para que se ordene bien por fecha, no por letras */
function valorOrden(plan, campo) {
  if (campo === "inicio") {
    const [dia, mes, anio] = plan.inicio.split("/");
    return Number(`${anio}${mes}${dia}`);
  }
  return plan[campo];
}

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
  const [pendiente, setPendiente] = useState(null); // { plan, accion }
  const [aviso, setAviso] = useState(null); // { id, texto }

  // Cambia el estado de un plan (y deja igual los demás)
  const cambiarEstado = (id, nuevoEstado) => {
    setPlanes(
      planes.map((p) => (p.id === id ? { ...p, estado: nuevoEstado } : p))
    );
  };

  const mostrarAviso = (texto) => {
    setAviso({ id: Date.now(), texto });
  };

  const pedirConfirmacion = (plan, accion) => {
    setPendiente({ plan, accion });
  };

  const confirmar = () => {
    const { plan, accion } = pendiente;
    const config = acciones[accion];

    cambiarEstado(plan.id, config.nuevoEstado);
    mostrarAviso(config.aviso);
    setPendiente(null);
  };

  const reactivar = (plan) => {
    cambiarEstado(plan.id, "Activo");
    mostrarAviso("Plan reactivado");
  };

  // Primero se filtra con el buscador...
  const filtrados = planes.filter((p) =>
    `${p.paciente} ${p.idPaciente} ${p.profesional} ${p.especialidad} ${p.tipo} ${p.estado}`
      .toLowerCase()
      .includes(busqueda.toLowerCase())
  );

  /* NUEVO: ...y luego se ordena lo que quedó */
  const { ordenados, orden, cambiarOrden } = useOrdenar(filtrados, valorOrden);

  const configPendiente = pendiente ? acciones[pendiente.accion] : null;

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
                {/* NUEVO: encabezados que se pueden ordenar */}
                <ThOrdenable campo="paciente" orden={orden} onOrdenar={cambiarOrden}>
                  Paciente
                </ThOrdenable>
                <ThOrdenable campo="profesional" orden={orden} onOrdenar={cambiarOrden}>
                  Profesional
                </ThOrdenable>
                <ThOrdenable campo="tipo" orden={orden} onOrdenar={cambiarOrden}>
                  Tipo de Plan
                </ThOrdenable>
                <ThOrdenable campo="inicio" orden={orden} onOrdenar={cambiarOrden}>
                  Inicio
                </ThOrdenable>
                <ThOrdenable campo="estado" orden={orden} onOrdenar={cambiarOrden}>
                  Estado
                </ThOrdenable>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {/* NUEVO: ahora se recorre "ordenados" en vez de "filtrados" */}
              {ordenados.map((p) => (
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
                      <div className="pl-foto pl-foto-prof">
                        {iniciales(p.profesional.replace("Dr. ", ""))}
                      </div>
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
                          onClick={() => reactivar(p)}
                        >
                          <span>▶</span>Reactivar
                        </button>
                      ) : (
                        <button
                          className="pl-accion pl-amarillo"
                          disabled={p.estado === "Completado"}
                          onClick={() => pedirConfirmacion(p, "Suspender")}
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
                        onClick={() => pedirConfirmacion(p, "Terminar")}
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

              {ordenados.length === 0 && (
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

      {/* Ventana de confirmación */}
      <ModalConfirmar
        abierto={pendiente !== null}
        titulo={configPendiente ? configPendiente.titulo : ""}
        mensaje={
          pendiente
            ? `Plan de ${pendiente.plan.tipo} de ${pendiente.plan.paciente}.`
            : ""
        }
        advertencia={configPendiente ? configPendiente.advertencia : ""}
        textoConfirmar={configPendiente ? configPendiente.botonConfirmar : ""}
        onConfirmar={confirmar}
        onCancelar={() => setPendiente(null)}
      />

      {/* Aviso corto */}
      {aviso && (
        <Aviso
          key={aviso.id}
          mensaje={aviso.texto}
          onCerrar={() => setAviso(null)}
        />
      )}
    </div>
  );
}

export default PlanesTratamiento;