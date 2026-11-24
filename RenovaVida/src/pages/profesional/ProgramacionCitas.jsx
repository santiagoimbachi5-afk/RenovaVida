import { Fragment, useState } from "react";
import ModalConfirmar from "../../components/ModalConfirmar.jsx";
import Aviso from "../../components/Aviso.jsx";
import { descargarPDF } from "../../utils/exportar.js";
import "../../styles/citas.css";

/* ================= Datos fijos ================= */
const horas = [
  "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM",
];

const profesionales = [
  { id: 1, nombre: "Dr. Alejandro Ruiz", especialidad: "Psiquiatra" },
  { id: 2, nombre: "Dra. Belen Lopez", especialidad: "Toxicologo" },
  { id: 3, nombre: "Dr. Carlos Gomez", especialidad: "Neuropsicologo" },
  { id: 4, nombre: "Dra. Diana Sofia", especialidad: "Medico genereal" },
];

const consultorios = ["Consultorio 1", "Consultorio 2", "Consultorio 3A", "Consultorio Dental 1"];

const claseEstado = {
  "Confirmada": "ct-verde",
  "En curso": "ct-azul",
  "Realizada": "ct-gris",
  "No asistió": "ct-naranja",
  "Cancelada": "ct-rojo",
};

/* ================= Ayudas para las fechas ================= */
// Convierte una fecha en texto "2026-11-23"
function aISO(fecha) {
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const dia = String(fecha.getDate()).padStart(2, "0");
  return `${anio}-${mes}-${dia}`;
}

// Suma (o resta) días a una fecha en texto
function sumarDias(iso, dias) {
  const [anio, mes, dia] = iso.split("-").map(Number);
  return aISO(new Date(anio, mes - 1, dia + dias));
}

// "2026-11-23" -> "lunes, 23 de noviembre de 2026"
function bonita(iso) {
  const [anio, mes, dia] = iso.split("-").map(Number);
  return new Date(anio, mes - 1, dia).toLocaleDateString("es-CO", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const HOY = aISO(new Date());

/* ================= Citas de ejemplo (luego vendrán de la base de datos) ================= */
const citasIniciales = [
  { id: 1, fecha: HOY, hora: "9:00 AM", profesionalId: 1, paciente: "Juan Pérez", motivo: "Consulta ", consultorio: "Consultorio 1", estado: "Confirmada" },
  { id: 2, fecha: HOY, hora: "11:00 AM", profesionalId: 1, paciente: "María Gómez", motivo: "Consulta", consultorio: "Consultorio 1", estado: "Confirmada" },
  { id: 3, fecha: HOY, hora: "10:00 AM", profesionalId: 2, paciente: "Laura Rojas", motivo: " Sobredosis", consultorio: "Consultorio 2", estado: "En curso" },
  { id: 4, fecha: HOY, hora: "2:00 PM", profesionalId: 2, paciente: "Pedro Pérez", motivo: "Sobredosis", consultorio: "Consultorio 2", estado: "Confirmada" },
  { id: 5, fecha: HOY, hora: "10:00 AM", profesionalId: 3, paciente: "Carlos Díaz", motivo: "Reavilitacion", consultorio: "Consultorio  1", estado: "Confirmada" },
  { id: 6, fecha: HOY, hora: "4:00 PM", profesionalId: 3, paciente: "Elena Rodríguez", motivo: "Control", consultorio: "Consultorio  1", estado: "Confirmada" },
];

/* ================= Validación: ¿choca con otra cita? ================= */
// Devuelve un mensaje de error, o "" si no hay problema.
// "idIgnorar" sirve al reprogramar: la cita no choca consigo misma.
function buscarConflicto(citas, nueva, idIgnorar) {
  const mismaHora = citas.filter(
    (c) =>
      c.id !== idIgnorar &&
      c.estado !== "Cancelada" &&
      c.fecha === nueva.fecha &&
      c.hora === nueva.hora
  );

  if (mismaHora.some((c) => c.profesionalId === nueva.profesionalId)) {
    return "El profesional ya tiene una cita a esa hora.";
  }
  if (mismaHora.some((c) => c.consultorio === nueva.consultorio)) {
    return "Ese consultorio ya está ocupado a esa hora.";
  }
  if (
    mismaHora.some(
      (c) => c.paciente.trim().toLowerCase() === nueva.paciente.trim().toLowerCase()
    )
  ) {
    return "El paciente ya tiene otra cita a esa hora.";
  }
  return "";
}

/* ================= Formulario: nueva cita o reprogramar ================= */
function FormularioCita({ inicial, citas, onGuardar, onCancelar }) {
  const [datos, setDatos] = useState(inicial);
  const [error, setError] = useState("");

  const cambiar = (e) => {
    const { name, value } = e.target;
    setDatos({
      ...datos,
      [name]: name === "profesionalId" ? Number(value) : value,
    });
  };

  const guardar = (e) => {
    e.preventDefault();

    if (!datos.paciente.trim()) {
      setError("Escribe el nombre del paciente.");
      return;
    }
    if (!datos.motivo.trim()) {
      setError("Escribe el motivo de la cita.");
      return;
    }
    if (!datos.fecha) {
      setError("Elige una fecha.");
      return;
    }
    if (datos.fecha < HOY) {
      setError("No se pueden programar citas en fechas pasadas.");
      return;
    }

    const conflicto = buscarConflicto(citas, datos, datos.id);
    if (conflicto) {
      setError(conflicto);
      return;
    }

    onGuardar({
      ...datos,
      paciente: datos.paciente.trim(),
      motivo: datos.motivo.trim(),
    });
  };

  return (
    <div className="cf-fondo">
      <div className="cf-caja ct-ancha">
        <h3>{datos.id ? "Reprogramar cita" : "Nueva cita"}</h3>

        <form className="ct-form" onSubmit={guardar}>
          <label>
            Paciente
            <input
              name="paciente"
              value={datos.paciente}
              onChange={cambiar}
              placeholder="Nombre del paciente"
            />
          </label>

          <label>
            Motivo
            <input
              name="motivo"
              value={datos.motivo}
              onChange={cambiar}
              placeholder="Ej: Control              ..."
            />
          </label>

          <div className="ct-dos">
            <label>
              Fecha
              <input type="date" name="fecha" value={datos.fecha} onChange={cambiar} />
            </label>

            <label>
              Hora
              <select name="hora" value={datos.hora} onChange={cambiar}>
                {horas.map((h) => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="ct-dos">
            <label>
              Profesional
              <select name="profesionalId" value={datos.profesionalId} onChange={cambiar}>
                {profesionales.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombre} ({p.especialidad})
                  </option>
                ))}
              </select>
            </label>

            <label>
              Consultorio
              <select name="consultorio" value={datos.consultorio} onChange={cambiar}>
                {consultorios.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </label>
          </div>

          {error && <p className="ct-error">{error}</p>}

          <div className="ct-botones">
            <button type="button" className="ct-btn-claro" onClick={onCancelar}>
              Cancelar
            </button>
            <button type="submit" className="ct-btn">
              {datos.id ? "Guardar cambios" : "Crear cita"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ================= Detalle de una cita ================= */
function DetalleCita({ cita, profesional, onCerrar, onEstado, onReprogramar, onCancelar }) {
  const abierta = cita.estado === "Confirmada" || cita.estado === "En curso";

  return (
    <div className="cf-fondo" onClick={onCerrar}>
      <div className="cf-caja ct-ancha" onClick={(e) => e.stopPropagation()}>
        <div className="ct-detalle-top">
          <h3>Detalle de la cita</h3>
          <span className={`ct-etq ${claseEstado[cita.estado]}`}>{cita.estado}</span>
        </div>

        <dl className="ct-detalle">
          <div><dt>Paciente</dt><dd>{cita.paciente}</dd></div>
          <div><dt>Motivo</dt><dd>{cita.motivo}</dd></div>
          <div><dt>Fecha</dt><dd>{bonita(cita.fecha)}</dd></div>
          <div><dt>Hora</dt><dd>{cita.hora}</dd></div>
          <div><dt>Profesional</dt><dd>{profesional.nombre} ({profesional.especialidad})</dd></div>
          <div><dt>Consultorio</dt><dd>{cita.consultorio}</dd></div>
        </dl>

        <div className="ct-botones">
          {cita.estado === "Confirmada" && (
            <button className="ct-btn" onClick={() => onEstado(cita, "En curso", "Cita iniciada")}>
              Iniciar
            </button>
          )}

          {abierta && (
            <button
              className="ct-btn ct-btn-verde"
              onClick={() => onEstado(cita, "Realizada", "Cita marcada como realizada")}
            >
              Marcar realizada
            </button>
          )}

          {cita.estado === "Confirmada" && (
            <button
              className="ct-btn ct-btn-naranja"
              onClick={() => onEstado(cita, "No asistió", "Se registró que el paciente no asistió")}
            >
              No asistió
            </button>
          )}

          {(abierta || cita.estado === "No asistió") && (
            <button className="ct-btn-claro" onClick={() => onReprogramar(cita)}>
              Reprogramar
            </button>
          )}

          {abierta && (
            <button className="ct-btn ct-btn-rojo" onClick={() => onCancelar(cita)}>
              Cancelar cita
            </button>
          )}

          <button className="ct-btn-claro" onClick={onCerrar}>Cerrar</button>
        </div>
      </div>
    </div>
  );
}

/* ================= Pantalla principal ================= */
function ProgramacionCitas() {
  const [citas, setCitas] = useState(citasIniciales);
  const [fechaVista, setFechaVista] = useState(HOY);
  const [filtroEstado, setFiltroEstado] = useState("Todas");
  const [busquedaProf, setBusquedaProf] = useState("");

  const [formulario, setFormulario] = useState(null); // datos de la cita que se está creando o editando
  const [detalleId, setDetalleId] = useState(null); // id de la cita abierta en el detalle
  const [porCancelar, setPorCancelar] = useState(null); // cita que espera confirmación
  const [aviso, setAviso] = useState(null);

  const mostrarAviso = (texto, tipo = "exito") => {
    setAviso({ id: Date.now(), texto, tipo });
  };

  const nombreProf = (id) => {
    const p = profesionales.find((x) => x.id === id);
    return p ? p.nombre : "";
  };

  /* ---------- Acciones ---------- */
  // Abre el formulario para una cita nueva (con hora y profesional opcionales)
  const abrirNueva = (hora = "9:00 AM", profesionalId = profesionales[0].id) => {
    setFormulario({
      fecha: fechaVista,
      hora,
      profesionalId,
      paciente: "",
      motivo: "",
      consultorio: consultorios[0],
    });
  };

  const guardarCita = (datos) => {
    if (datos.id) {
      // Reprogramar: se actualiza y vuelve a quedar Confirmada
      setCitas(
        citas.map((c) => (c.id === datos.id ? { ...datos, estado: "Confirmada" } : c))
      );
      mostrarAviso("Cita reprogramada");
    } else {
      // Nueva
      setCitas([...citas, { ...datos, id: Date.now(), estado: "Confirmada" }]);
      mostrarAviso("Cita creada");
    }
    setFechaVista(datos.fecha); // para ver la cita que se acaba de guardar
    setFormulario(null);
    setDetalleId(null);
  };

  const cambiarEstado = (cita, nuevoEstado, mensaje) => {
    setCitas(citas.map((c) => (c.id === cita.id ? { ...c, estado: nuevoEstado } : c)));
    mostrarAviso(mensaje);
    setDetalleId(null);
  };

  const reprogramar = (cita) => {
    setFormulario({ ...cita });
    setDetalleId(null);
  };

  const confirmarCancelacion = () => {
    setCitas(
      citas.map((c) => (c.id === porCancelar.id ? { ...c, estado: "Cancelada" } : c))
    );
    mostrarAviso("Cita cancelada", "error");
    setPorCancelar(null);
    setDetalleId(null);
  };

  /* ---------- Datos calculados ---------- */
  // Citas del día que se está viendo (sin las canceladas)
  const citasDelDia = citas.filter(
    (c) => c.fecha === fechaVista && c.estado !== "Cancelada"
  );

  // Las que se dibujan en el calendario (según el filtro rápido)
  const citasVisibles =
    filtroEstado === "Todas"
      ? citasDelDia
      : citasDelDia.filter((c) => c.estado === filtroEstado);

  const canceladas = citas.filter(
    (c) => c.fecha === fechaVista && c.estado === "Cancelada"
  ).length;

  const cuenta = (estado) => citasDelDia.filter((c) => c.estado === estado).length;

  // Validación automática: busca choques entre las citas del día
  const conflictos = [];
  citasDelDia.forEach((a, i) => {
    citasDelDia.slice(i + 1).forEach((b) => {
      if (a.hora !== b.hora) return;
      if (a.profesionalId === b.profesionalId) {
        conflictos.push(`${a.hora}: ${nombreProf(a.profesionalId)} tiene dos citas`);
      } else if (a.consultorio === b.consultorio) {
        conflictos.push(`${a.hora}: ${a.consultorio} usado dos veces`);
      }
    });
  });

  const profesionalesFiltrados = profesionales.filter((p) =>
    `${p.nombre} ${p.especialidad}`.toLowerCase().includes(busquedaProf.toLowerCase())
  );

  const citaDetalle = citas.find((c) => c.id === detalleId);

  /* ---------- Exportar la agenda del día a PDF ---------- */
  const exportarAgenda = () => {
    if (citasDelDia.length === 0) {
      mostrarAviso("No hay citas para exportar este día", "info");
      return;
    }

    const filas = [...citasDelDia]
      .sort((a, b) => horas.indexOf(a.hora) - horas.indexOf(b.hora))
      .map((c) => [
        c.hora,
        nombreProf(c.profesionalId),
        c.paciente,
        c.motivo,
        c.consultorio,
        c.estado,
      ]);

    descargarPDF({
      titulo: `Agenda del ${bonita(fechaVista)}`,
      resumen: [["Total de citas", String(filas.length)]],
      columnas: ["Hora", "Profesional", "Paciente", "Motivo", "Consultorio", "Estado"],
      filas,
      archivo: `agenda-${fechaVista}`,
    });
  };

  return (
    <div className="ct">
      {/* ---------- Calendario ---------- */}
      <section className="ct-card">
        <div className="ct-top">
          <h3>GESTIÓN DE CITAS Y RECURSOS</h3>
          <div className="ct-acciones">
            <button className="ct-btn-claro" onClick={exportarAgenda}>⬇ Exportar PDF</button>
            <button className="ct-btn" onClick={() => abrirNueva()}>＋ Nueva Cita</button>
          </div>
        </div>

        <div className="ct-fecha-barra">
          <button className="ct-btn-claro" onClick={() => setFechaVista(sumarDias(fechaVista, -1))}>‹</button>
          <button className="ct-btn-claro" onClick={() => setFechaVista(HOY)}>Hoy</button>
          <button className="ct-btn-claro" onClick={() => setFechaVista(sumarDias(fechaVista, 1))}>›</button>
          <input
            type="date"
            value={fechaVista}
            onChange={(e) => e.target.value && setFechaVista(e.target.value)}
          />
          <span className="ct-fecha-texto">{bonita(fechaVista)}</span>
        </div>

        <div className="ct-leyenda">
          <span><i className="ct-punto ct-verde"></i>Confirmada</span>
          <span><i className="ct-punto ct-azul"></i>En curso</span>
          <span><i className="ct-punto ct-gris"></i>Realizada</span>
          <span><i className="ct-punto ct-naranja"></i>No asistió</span>
        </div>

        <div className="ct-grilla-caja">
          <div className="ct-grilla">
            {/* Encabezados */}
            <div></div>
            {profesionales.map((p) => (
              <div className="ct-cabecera" key={p.id}>
                <b>{p.nombre}</b>
                <small>{p.especialidad}</small>
              </div>
            ))}
            <div className="ct-cabecera">
              <b>Recursos</b>
              <small>Consultorios en uso</small>
            </div>

            {/* Una fila por cada hora */}
            {horas.map((hora) => {
              const usados = citasDelDia
                .filter((c) => c.hora === hora)
                .map((c) => c.consultorio);

              return (
                <Fragment key={hora}>
                  <div className="ct-hora">{hora}</div>

                  {profesionales.map((p) => {
                    const cita = citasVisibles.find(
                      (c) => c.profesionalId === p.id && c.hora === hora
                    );

                    if (cita) {
                      return (
                        <button
                          key={p.id}
                          className={`ct-celda ct-cita ${claseEstado[cita.estado]}`}
                          onClick={() => setDetalleId(cita.id)}
                        >
                          <b>{cita.paciente}</b>
                          <small>{cita.motivo}</small>
                        </button>
                      );
                    }

                    return (
                      <button
                        key={p.id}
                        className="ct-celda ct-vacia"
                        title="Crear cita aquí"
                        onClick={() => abrirNueva(hora, p.id)}
                      >
                        ＋
                      </button>
                    );
                  })}

                  <div className="ct-celda ct-recurso">
                    {usados.map((u, i) => (
                      <span key={i}>{u}</span>
                    ))}
                  </div>
                </Fragment>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------- Columna derecha ---------- */}
      <aside className="ct-lateral">
        <article className="ct-card">
          <h3>Resumen del día</h3>
          <div className="ct-fila"><span>Confirmadas</span><span className="ct-etq ct-verde">{cuenta("Confirmada")}</span></div>
          <div className="ct-fila"><span>En curso</span><span className="ct-etq ct-azul">{cuenta("En curso")}</span></div>
          <div className="ct-fila"><span>Realizadas</span><span className="ct-etq ct-gris">{cuenta("Realizada")}</span></div>
          <div className="ct-fila"><span>No asistieron</span><span className="ct-etq ct-naranja">{cuenta("No asistió")}</span></div>
          <div className="ct-fila"><span>Canceladas</span><span className="ct-etq ct-rojo">{canceladas}</span></div>
        </article>

        <article className="ct-card">
          <h3>Profesionales & especialidades</h3>
          <input
            className="ct-buscar"
            placeholder="🔍 Buscar profesional..."
            value={busquedaProf}
            onChange={(e) => setBusquedaProf(e.target.value)}
          />
          {profesionalesFiltrados.map((p) => (
            <div className="ct-fila" key={p.id}>
              <div>
                <b>{p.nombre}</b>
                <small>{p.especialidad}</small>
              </div>
              <span className="ct-etq ct-verde">
                {citasDelDia.filter((c) => c.profesionalId === p.id).length} citas
              </span>
            </div>
          ))}
          {profesionalesFiltrados.length === 0 && <p>No hay profesionales que coincidan.</p>}
        </article>

        <article className="ct-card">
          <h3>Recursos físicos</h3>
          {consultorios.map((c) => {
            const n = citasDelDia.filter((x) => x.consultorio === c).length;
            return (
              <div className="ct-fila" key={c}>
                <span>{c}</span>
                <span className={n > 0 ? "ct-etq ct-azul" : "ct-etq ct-gris"}>
                  {n > 0 ? `${n} citas` : "Libre"}
                </span>
              </div>
            );
          })}
        </article>

        <article className="ct-card">
          <h3>Validación automática</h3>
          {conflictos.length === 0 ? (
            <p className="ct-ok">✔ Sin conflictos detectados</p>
          ) : (
            conflictos.map((c, i) => (
              <p className="ct-alerta" key={i}>⚠ {c}</p>
            ))
          )}
        </article>

        <article className="ct-card">
          <button className="ct-btn ct-ancho" onClick={() => abrirNueva()}>
            Nueva Cita
          </button>
          <p>Filtro rápido por estado:</p>
          <select
            className="ct-select"
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
          >
            <option>Todas</option>
            <option>Confirmada</option>
            <option>En curso</option>
            <option>Realizada</option>
            <option>No asistió</option>
          </select>
        </article>
      </aside>

      {/* ---------- Ventanas ---------- */}
      {formulario && (
        <FormularioCita
          inicial={formulario}
          citas={citas}
          onGuardar={guardarCita}
          onCancelar={() => setFormulario(null)}
        />
      )}

      {citaDetalle && (
        <DetalleCita
          cita={citaDetalle}
          profesional={profesionales.find((p) => p.id === citaDetalle.profesionalId)}
          onCerrar={() => setDetalleId(null)}
          onEstado={cambiarEstado}
          onReprogramar={reprogramar}
          onCancelar={(cita) => setPorCancelar(cita)}
        />
      )}

      <ModalConfirmar
        abierto={porCancelar !== null}
        titulo="¿Cancelar esta cita?"
        mensaje={
          porCancelar
            ? `Cita de ${porCancelar.paciente} a las ${porCancelar.hora}.`
            : ""
        }
        advertencia="La cita dejará de aparecer en el calendario y el horario quedará libre."
        textoConfirmar="Sí, cancelar cita"
        onConfirmar={confirmarCancelacion}
        onCancelar={() => setPorCancelar(null)}
      />

      {aviso && (
        <Aviso
          key={aviso.id}
          mensaje={aviso.texto}
          tipo={aviso.tipo}
          onCerrar={() => setAviso(null)}
        />
      )}
    </div>
  );
}

export default ProgramacionCitas;