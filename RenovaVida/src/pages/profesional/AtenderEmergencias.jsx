import { useState, useEffect } from "react";
import Aviso from "../../components/Aviso.jsx";
import { descargarPDF } from "../../utils/exportar.js";
import "../../styles/emergencias.css";
import "../../styles/emergencias-funciones.css";

/* ================= Reglas ================= */
const YO = "Dr. Ramírez"; // el profesional que tiene la sesión abierta
const LIMITE_ENTIDAD = 300; // 5 minutos sin respuesta: se escala a la entidad
const LIMITE_SECUNDARIA = 600; // 10 minutos: alerta secundaria al paciente y su contacto

const PESO = { alta: 1, media: 2, baja: 3 };
const TEXTO_PRIORIDAD = { alta: "ALTA", media: "MEDIA", baja: "BAJA" };
const CLASE_ESTADO = {
  "Nuevo": "ex-nuevo",
  "En atención": "ex-atencion",
  "Cerrado": "ex-cerrado",
};
const TEXTO_NIVEL = [
  "Esperando respuesta",
  "Se acerca el límite",
  "Escalada a la entidad",
  "Alerta secundaria enviada",
];

/* ================= Datos de ejemplo ================= */
const pacientesPrueba = [
  { nombre: "Camila Torres", telefono: "3101112233", contacto: { nombre: "Luz Torres (mamá)", telefono: "3104445566" } },
  { nombre: "Andrés Mora", telefono: "3112223344", contacto: { nombre: "Julián Mora (hermano)", telefono: "3115556677" } },
  { nombre: "Valentina Ruiz", telefono: "3123334455", contacto: { nombre: "Marta Ruiz (tía)", telefono: "3126667788" } },
];

const ubicacionesPrueba = ["Popayán, Centro", "Popayán, Norte", "Popayán, Sur", "Popayán, Occidente"];

const emergenciasIniciales = [
  {
    id: 1, idUnico: "RV-8F3K2Q", paciente: "María Gómez", ubicacion: "Sala 3",
    prioridad: "alta", estado: "En atención", profesional: "Dr. Ramírez",
    origen: "Botón de pánico", segundos: 95, creada: "08:10", actualizada: "08:12",
    telefono: "3001234567", contacto: { nombre: "Rosa Gómez (mamá)", telefono: "3009876543" },
    notas: [{ hora: "08:12", texto: "Caso tomado por Dr. Ramírez." }], derivada: false,
  },
  {
    id: 2, idUnico: "RV-4M9TD7", paciente: "Pedro Pérez", ubicacion: "Triage 1",
    prioridad: "media", estado: "Nuevo", profesional: "Sin asignar",
    origen: "Triage manual", segundos: 150, creada: "08:20", actualizada: "08:20",
    telefono: "3012223344", contacto: null, notas: [], derivada: false,
  },
  {
    id: 3, idUnico: "RV-7X2NB5", paciente: "Laura Rojas", ubicacion: "Triage 2",
    prioridad: "alta", estado: "Nuevo", profesional: "Sin asignar",
    origen: "Botón de pánico", segundos: 20, creada: "08:25", actualizada: "08:25",
    telefono: "3023334455", contacto: { nombre: "Carmen Rojas (abuela)", telefono: "3025556677" },
    notas: [], derivada: false,
  },
  {
    id: 4, idUnico: "RV-2Q8WC4", paciente: "Carlos Díaz", ubicacion: "Sala de espera",
    prioridad: "baja", estado: "Nuevo", profesional: "Sin asignar",
    origen: "Triage manual", segundos: 5, creada: "08:26", actualizada: "08:26",
    telefono: "", contacto: null, notas: [], derivada: false,
  },
];

const disponibles = [
  { id: 1, nombre: "Dr. Carlos Ruiz", detalle: "Cardiología" },
  { id: 2, nombre: "Dra. Ana López", detalle: "Pediatría" },
  { id: 3, nombre: "Dr. Pedro Pinto", detalle: "Medicina General" },
];

const recursos = [
  { nombre: "Camas", estado: "Disponible", clase: "verde" },
  { nombre: "Consultorios", estado: "Ocupado", clase: "rojo" },
  { nombre: "Equipos", estado: "Mantenimiento", clase: "gris" },
];

/* ================= Ayudas ================= */
function horaAhora() {
  return new Date().toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" });
}

// 125 segundos -> "02:05"
function fmt(seg) {
  const m = String(Math.floor(seg / 60)).padStart(2, "0");
  const s = String(seg % 60).padStart(2, "0");
  return `${m}:${s}`;
}

// 0: normal, 1: se acerca el límite, 2: escalada, 3: alerta secundaria
function nivelEspera(seg) {
  if (seg >= LIMITE_SECUNDARIA) return 3;
  if (seg >= LIMITE_ENTIDAD) return 2;
  if (seg >= 180) return 1;
  return 0;
}

// Crea un ID como RV-8F3K2Q (sin letras que se confunden, como O, I o 0)
function nuevoIdUnico() {
  const letras = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let id = "RV-";
  for (let i = 0; i < 6; i++) {
    id += letras[Math.floor(Math.random() * letras.length)];
  }
  return id;
}

function enlaceWhatsapp(telefono, mensaje) {
  return `https://wa.me/57${telefono}?text=${encodeURIComponent(mensaje)}`;
}

/* ================= Formulario: nueva emergencia manual ================= */
function FormularioEmergencia({ onGuardar, onCancelar }) {
  const [datos, setDatos] = useState({ paciente: "", ubicacion: "", prioridad: "media" });
  const [error, setError] = useState("");

  const cambiar = (e) => setDatos({ ...datos, [e.target.name]: e.target.value });

  const guardar = (e) => {
    e.preventDefault();
    if (!datos.paciente.trim()) {
      setError("Escribe el nombre del paciente.");
      return;
    }
    if (!datos.ubicacion.trim()) {
      setError("Escribe dónde está el paciente.");
      return;
    }
    onGuardar({
      paciente: datos.paciente.trim(),
      ubicacion: datos.ubicacion.trim(),
      prioridad: datos.prioridad,
    });
  };

  return (
    <div className="cf-fondo">
      <div className="cf-caja ex-ancha">
        <h3>Nueva emergencia</h3>

        <form className="ex-form" onSubmit={guardar}>
          <label>
            Paciente
            <input name="paciente" value={datos.paciente} onChange={cambiar} placeholder="Nombre del paciente" />
          </label>

          <label>
            Ubicación
            <input name="ubicacion" value={datos.ubicacion} onChange={cambiar} placeholder="Ej: Triage 1, Sala 3" />
          </label>

          <label>
            Prioridad
            <select name="prioridad" value={datos.prioridad} onChange={cambiar}>
              <option value="alta">Alta (rojo)</option>
              <option value="media">Media (amarillo)</option>
              <option value="baja">Baja (verde)</option>
            </select>
          </label>

          {error && <p className="ex-error">{error}</p>}

          <div className="ex-botones">
            <button type="button" className="ex-btn-claro" onClick={onCancelar}>Cancelar</button>
            <button type="submit" className="ex-btn">Registrar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ================= Detalle de una emergencia ================= */
function DetalleEmergencia({ e, onCerrar, onTomar, onNota, onCerrarCaso, onDerivar }) {
  const [nota, setNota] = useState("");
  const [error, setError] = useState("");

  const activa = e.estado !== "Cerrado";
  const nivel = nivelEspera(e.segundos);

  const guardarNota = () => {
    if (!nota.trim()) {
      setError("Escribe la nota antes de guardarla.");
      return;
    }
    onNota(e, nota.trim());
    setNota("");
    setError("");
  };

  const cerrarCaso = () => {
    if (nota.trim().length < 5) {
      setError("Para cerrar la emergencia escribe una nota de cierre (mínimo 5 letras).");
      return;
    }
    onCerrarCaso(e, nota.trim());
  };

  const mensajePaciente =
    "Hola, soy el profesional de RenovaVida. Recibimos tu alerta y estoy aquí para ayudarte. ¿Puedes responderme?";

  return (
    <div className="cf-fondo" onClick={onCerrar}>
      <div className="cf-caja ex-ancha" onClick={(ev) => ev.stopPropagation()}>
        <div className="ex-detalle-top">
          <h3>Emergencia {e.idUnico}</h3>
          <span className={`ex-estado ${CLASE_ESTADO[e.estado]}`}>{e.estado}</span>
        </div>

        <dl className="ex-detalle">
          <div><dt>Paciente</dt><dd>{e.paciente}</dd></div>
          <div><dt>ID único</dt><dd>{e.idUnico}</dd></div>
          <div><dt>Ubicación</dt><dd>{e.ubicacion}</dd></div>
          <div><dt>Prioridad</dt><dd>{TEXTO_PRIORIDAD[e.prioridad]}</dd></div>
          <div><dt>Origen</dt><dd>{e.origen}</dd></div>
          <div><dt>Profesional</dt><dd>{e.profesional}</dd></div>
          <div><dt>Creada</dt><dd>{e.creada}</dd></div>
          <div>
            <dt>Tiempo</dt>
            <dd>
              {e.estado === "Nuevo" ? (
                <span className={`ex-tiempo ex-t${nivel}`}>
                  ⏱ {fmt(e.segundos)} · {TEXTO_NIVEL[nivel]}
                </span>
              ) : (
                `Tiempo de respuesta: ${fmt(e.segundos)}`
              )}
            </dd>
          </div>
          {e.derivada && (
            <div><dt>Derivación</dt><dd>Derivada a la entidad de salud</dd></div>
          )}
        </dl>

        {/* Contacto */}
        {(e.telefono || e.contacto) && (
          <div className="ex-contactos">
            {e.telefono && (
              <>
                <a className="ex-link" href={`tel:${e.telefono}`}>📞 Llamar al paciente</a>
                <a
                  className="ex-link"
                  href={enlaceWhatsapp(e.telefono, mensajePaciente)}
                  target="_blank"
                  rel="noreferrer"
                >
                  💬 WhatsApp al paciente
                </a>
              </>
            )}
            {e.contacto && (
              <>
                <a className="ex-link" href={`tel:${e.contacto.telefono}`}>
                  📞 Llamar a {e.contacto.nombre}
                </a>
                <a
                  className="ex-link"
                  href={enlaceWhatsapp(
                    e.contacto.telefono,
                    `Hola, te escribimos de RenovaVida. ${e.paciente} activó una alerta y necesitamos comunicarnos con esa persona. ¿Puedes llamarla o avisarnos si está contigo?`
                  )}
                  target="_blank"
                  rel="noreferrer"
                >
                  💬 WhatsApp al contacto
                </a>
              </>
            )}
          </div>
        )}

        {/* Notas */}
        <h4 style={{ margin: "14px 0 4px", fontSize: 13 }}>Notas de atención</h4>
        {e.notas.length === 0 ? (
          <p className="ex-ayuda">Sin notas todavía.</p>
        ) : (
          <ul className="ex-notas">
            {e.notas.map((n, i) => (
              <li key={i}><b>{n.hora}</b> {n.texto}</li>
            ))}
          </ul>
        )}

        {activa && (
          <>
            <textarea
              className="ex-textarea"
              placeholder="Escribe una nota. Para cerrar la emergencia, esta nota será la de cierre."
              value={nota}
              onChange={(ev) => setNota(ev.target.value)}
            />
            {error && <p className="ex-error">{error}</p>}
            {e.estado === "Nuevo" && (
              <p className="ex-ayuda">Para cerrar la emergencia primero hay que tomar el caso.</p>
            )}
          </>
        )}

        <div className="ex-botones">
          {e.estado === "Nuevo" && (
            <button className="ex-btn" onClick={() => onTomar(e)}>Tomar caso</button>
          )}
          {activa && (
            <button className="ex-btn-claro" onClick={guardarNota}>Guardar nota</button>
          )}
          {activa && (
            <button className="ex-btn ex-naranja" disabled={e.derivada} onClick={() => onDerivar(e)}>
              {e.derivada ? "Ya derivada" : "Derivar a entidad"}
            </button>
          )}
          {e.estado === "En atención" && (
            <button className="ex-btn ex-verde" onClick={cerrarCaso}>Cerrar emergencia</button>
          )}
          <button className="ex-btn-claro" onClick={onCerrar}>Cerrar ventana</button>
        </div>
      </div>
    </div>
  );
}

/* ================= Pantalla principal ================= */
function AtenderEmergencias() {
  const [emergencias, setEmergencias] = useState(emergenciasIniciales);
  const [eventos, setEventos] = useState([
    { id: 1, texto: "Sistema listo: esperando alertas" },
  ]);
  const [filtro, setFiltro] = useState("Activas");
  const [seleccionId, setSeleccionId] = useState(null);
  const [detalleId, setDetalleId] = useState(null);
  const [verFormulario, setVerFormulario] = useState(false);
  const [aviso, setAviso] = useState(null);
  const [demo, setDemo] = useState(false);

  /* ---------- Reloj: cada segundo suma tiempo a las emergencias nuevas ---------- */
  useEffect(() => {
    const paso = demo ? 30 : 1; // en modo demo el tiempo corre 30 veces más rápido
    const reloj = setInterval(() => {
      setEmergencias((prev) =>
        prev.map((e) =>
          e.estado === "Nuevo" ? { ...e, segundos: e.segundos + paso } : e
        )
      );
    }, 1000);
    return () => clearInterval(reloj);
  }, [demo]);

  /* ---------- Ayudas ---------- */
  const mostrarAviso = (texto, tipo = "exito") => {
    setAviso({ id: Date.now(), texto, tipo });
  };

  const agregarEvento = (texto) => {
    setEventos((prev) =>
      [{ id: Date.now() + Math.random(), texto }, ...prev].slice(0, 6)
    );
  };

  // "cambios" puede ser un objeto o una función que recibe la emergencia actual
  const actualizar = (id, cambios) => {
    setEmergencias((prev) =>
      prev.map((e) =>
        e.id === id
          ? {
              ...e,
              ...(typeof cambios === "function" ? cambios(e) : cambios),
              actualizada: horaAhora(),
            }
          : e
      )
    );
  };

  /* ---------- Acciones ---------- */
  const simularPanico = () => {
    const paciente = pacientesPrueba[Math.floor(Math.random() * pacientesPrueba.length)];
    const ubicacion = ubicacionesPrueba[Math.floor(Math.random() * ubicacionesPrueba.length)];
    const idUnico = nuevoIdUnico();

    setEmergencias((prev) => [
      ...prev,
      {
        id: Date.now(),
        idUnico,
        paciente: paciente.nombre,
        ubicacion,
        prioridad: "alta",
        estado: "Nuevo",
        profesional: "Sin asignar",
        origen: "Botón de pánico",
        segundos: 0,
        creada: horaAhora(),
        actualizada: horaAhora(),
        telefono: paciente.telefono,
        contacto: paciente.contacto,
        notas: [],
        derivada: false,
      },
    ]);

    setFiltro("Activas");
    mostrarAviso(`🚨 Nueva alerta de pánico: ${idUnico}`, "error");
    agregarEvento(`Alerta de pánico recibida: ${idUnico}`);
  };

  const crearManual = (datos) => {
    const idUnico = nuevoIdUnico();

    setEmergencias((prev) => [
      ...prev,
      {
        id: Date.now(),
        idUnico,
        paciente: datos.paciente,
        ubicacion: datos.ubicacion,
        prioridad: datos.prioridad,
        estado: "Nuevo",
        profesional: "Sin asignar",
        origen: "Triage manual",
        segundos: 0,
        creada: horaAhora(),
        actualizada: horaAhora(),
        telefono: "",
        contacto: null,
        notas: [],
        derivada: false,
      },
    ]);

    setFiltro("Activas");
    setVerFormulario(false);
    mostrarAviso("Emergencia registrada");
    agregarEvento(`Emergencia registrada manualmente: ${idUnico}`);
  };

  const tomarCaso = (e) => {
    actualizar(e.id, (x) => ({
      estado: "En atención",
      profesional: YO,
      notas: [...x.notas, { hora: horaAhora(), texto: `Caso tomado por ${YO}.` }],
    }));
    mostrarAviso(`Caso ${e.idUnico} tomado`);
    agregarEvento(`${e.idUnico} tomado por ${YO} (respuesta en ${fmt(e.segundos)})`);
  };

  const agregarNota = (e, texto) => {
    actualizar(e.id, (x) => ({
      notas: [...x.notas, { hora: horaAhora(), texto }],
    }));
    mostrarAviso("Nota guardada");
  };

  const cerrarCaso = (e, texto) => {
    actualizar(e.id, (x) => ({
      estado: "Cerrado",
      notas: [...x.notas, { hora: horaAhora(), texto: `Cierre: ${texto}` }],
    }));
    mostrarAviso(`Emergencia ${e.idUnico} cerrada`);
    agregarEvento(`${e.idUnico} cerrada`);
    setDetalleId(null);
  };

  const derivar = (e) => {
    actualizar(e.id, (x) => ({
      derivada: true,
      notas: [...x.notas, { hora: horaAhora(), texto: "Derivada a la entidad de salud." }],
    }));
    mostrarAviso("Caso derivado a la entidad", "info");
    agregarEvento(`${e.idUnico} derivada a la entidad de salud`);
  };

  const seleccionada = emergencias.find((x) => x.id === seleccionId);

  const asignar = (prof) => {
    if (!seleccionada) {
      mostrarAviso("Selecciona primero una emergencia de la lista", "info");
      return;
    }
    if (seleccionada.estado === "Cerrado") {
      mostrarAviso("Esa emergencia ya está cerrada", "info");
      return;
    }
    actualizar(seleccionada.id, (x) => ({
      estado: "En atención",
      profesional: prof.nombre,
      notas: [...x.notas, { hora: horaAhora(), texto: `Asignada a ${prof.nombre}.` }],
    }));
    mostrarAviso(`Asignada a ${prof.nombre}`);
    agregarEvento(`${seleccionada.idUnico} asignada a ${prof.nombre}`);
  };

  /* ---------- Datos calculados ---------- */
  const activas = emergencias.filter((e) => e.estado !== "Cerrado");
  const altas = activas.filter((e) => e.prioridad === "alta").length;
  const medias = activas.filter((e) => e.prioridad === "media").length;
  const bajas = activas.filter((e) => e.prioridad === "baja").length;

  // Lista según el filtro, con las más urgentes primero
  const visibles = emergencias
    .filter((e) => {
      if (filtro === "Activas") return e.estado !== "Cerrado";
      if (filtro === "Nuevas") return e.estado === "Nuevo";
      if (filtro === "En atención") return e.estado === "En atención";
      if (filtro === "Cerradas") return e.estado === "Cerrado";
      return true;
    })
    .sort((a, b) => PESO[a.prioridad] - PESO[b.prioridad] || a.id - b.id);

  // Alertas automáticas por tiempo sin respuesta
  const alertasTiempo = emergencias
    .filter((e) => e.estado === "Nuevo" && e.segundos >= LIMITE_ENTIDAD)
    .map((e) =>
      e.segundos >= LIMITE_SECUNDARIA
        ? `${e.idUnico}: sin respuesta en 10 min. Alerta secundaria al paciente y a su contacto de respaldo.`
        : `${e.idUnico}: sin respuesta en 5 min. Escalada a la entidad.`
    );

  const detalle = emergencias.find((e) => e.id === detalleId);

  /* ---------- Exportar PDF ---------- */
  const exportarPDF = () => {
    if (visibles.length === 0) {
      mostrarAviso("No hay emergencias para exportar", "info");
      return;
    }
    descargarPDF({
      titulo: `Emergencias (${filtro})`,
      resumen: [
        ["Emergencias activas", String(activas.length)],
        ["Alta prioridad", String(altas)],
      ],
      columnas: ["ID único", "Paciente", "Ubicación", "Estado", "Prioridad", "Profesional", "Origen"],
      filas: visibles.map((e) => [
        e.idUnico, e.paciente, e.ubicacion, e.estado,
        TEXTO_PRIORIDAD[e.prioridad], e.profesional, e.origen,
      ]),
      archivo: "emergencias-renovavida",
    });
  };

  return (
    <div className="em">
      {/* ---------- Columna principal ---------- */}
      <section className="tarjeta em-principal">
        <div className="em-top">
          <h3>GESTIÓN DE EMERGENCIAS Y TRIAGE</h3>
          <div className="ex-acciones">
            <button className="ex-btn-claro" onClick={exportarPDF}>⬇ Exportar PDF</button>
            <button className="ex-btn-pan" onClick={simularPanico}>🚨 Simular alerta de pánico</button>
            <button className="em-btn-rojo" onClick={() => setVerFormulario(true)}>
              + Nueva Emergencia
            </button>
          </div>
        </div>

        <h4 className="em-subtitulo">RESUMEN DE ALERTAS EN TIEMPO REAL</h4>
        <div className="em-resumen">
          <div className="em-caja em-total">
            <span>EMERGENCIAS ACTIVAS</span>
            <strong>{activas.length}</strong>
          </div>
          <div className="em-caja em-caja-alta">
            <span>ALTA PRIORIDAD (ROJO)</span>
            <strong>{altas}</strong>
          </div>
          <div className="em-caja em-caja-media">
            <span>PRIORIDAD MEDIA (AMARILLO)</span>
            <strong>{medias}</strong>
          </div>
          <div className="em-caja em-caja-baja">
            <span>PRIORIDAD BAJA (VERDE)</span>
            <strong>{bajas}</strong>
          </div>
        </div>

        <div className="ex-barra">
          <label>
            Mostrar:{" "}
            <select value={filtro} onChange={(e) => setFiltro(e.target.value)}>
              <option>Activas</option>
              <option>Nuevas</option>
              <option>En atención</option>
              <option>Cerradas</option>
              <option>Todas</option>
            </select>
          </label>

          <label className="ex-demo">
            <input
              type="checkbox"
              checked={demo}
              onChange={(e) => setDemo(e.target.checked)}
            />
            Modo demo (el tiempo corre 30 veces más rápido)
          </label>
        </div>

        <div className="em-lista-top">
          <h4 className="em-subtitulo">LISTA DE EMERGENCIAS</h4>
          <small>Haz clic en una fila para seleccionarla</small>
        </div>

        <div className="em-lista">
          {visibles.map((e, i) => {
            const nivel = nivelEspera(e.segundos);

            return (
              <div
                key={e.id}
                className={`em-fila em-borde-${e.prioridad} ${
                  seleccionId === e.id ? "ex-seleccionada" : ""
                }`}
                onClick={() => setSeleccionId(e.id)}
              >
                <span className="em-num">{i + 1}</span>

                <div className="em-dato">
                  <small>PACIENTE:</small>
                  <b>{e.paciente}</b>
                  <span className="ex-id">{e.idUnico}</span>
                </div>

                <div className="em-dato">
                  <small>UBICACIÓN:</small>
                  <b>{e.ubicacion}</b>
                </div>

                <div className="em-dato">
                  <small>ESTADO:</small>
                  <span className={`ex-estado ${CLASE_ESTADO[e.estado]}`}>{e.estado}</span>
                  {e.estado === "Nuevo" && (
                    <span className={`ex-tiempo ex-t${nivel}`}>
                      ⏱ {fmt(e.segundos)} · {TEXTO_NIVEL[nivel]}
                    </span>
                  )}
                  {e.estado !== "Nuevo" && (
                    <span className="ex-tiempo ex-resp">Respuesta en {fmt(e.segundos)}</span>
                  )}
                </div>

                <div className="em-dato">
                  <small>PRIORIDAD:</small>
                  <span className={`em-prioridad em-${e.prioridad}`}>
                    {TEXTO_PRIORIDAD[e.prioridad]}
                  </span>
                </div>

                <div className="em-dato">
                  <small>PROFESIONAL:</small>
                  <b>{e.profesional}</b>
                  {e.derivada && <span className="ex-derivada">Derivada</span>}
                </div>

                <div className="em-dato">
                  <small>ORIGEN:</small>
                  <b>{e.origen}</b>
                </div>

                <div className="em-accion">
                  <small>Actualizada: {e.actualizada}</small>
                  <div className="ex-acc-botones">
                    {e.estado === "Nuevo" && (
                      <button
                        className="ex-btn"
                        onClick={(ev) => {
                          ev.stopPropagation();
                          tomarCaso(e);
                        }}
                      >
                        Tomar caso
                      </button>
                    )}
                    <button
                      className="ex-btn-claro"
                      onClick={(ev) => {
                        ev.stopPropagation();
                        setDetalleId(e.id);
                      }}
                    >
                      {e.estado === "Cerrado" ? "Ver caso" : "Abrir caso"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {visibles.length === 0 && (
            <p className="ex-vacio">No hay emergencias en esta vista.</p>
          )}
        </div>
      </section>

      {/* ---------- Columna derecha ---------- */}
      <aside className="em-lateral">
        <article className="tarjeta">
          <h3>PROFESIONALES DE EMERGENCIA DISPONIBLES</h3>
          <p className="ex-nota-lateral">
            {seleccionada
              ? `Seleccionada: ${seleccionada.idUnico} (${seleccionada.paciente})`
              : "Selecciona una emergencia y pulsa Asignar."}
          </p>

          {disponibles.map((d) => (
            <div className="em-disponible" key={d.id}>
              <div className="foto"></div>
              <div className="profesional-datos">
                <b>{d.nombre}</b>
                <small>{d.detalle}</small>
              </div>
              <button className="btn-oscuro" onClick={() => asignar(d)}>Asignar</button>
            </div>
          ))}
        </article>

        <article className="tarjeta">
          <h3>VALIDACIÓN DE RECURSOS</h3>
          <div className="em-cabecera-mini">
            <span>Servicio</span>
            <span>Estados</span>
          </div>
          {recursos.map((r) => (
            <div className="recurso" key={r.nombre}>
              <span>{r.nombre}</span>
              <span className={`etiqueta ${r.clase}`}>{r.estado}</span>
            </div>
          ))}
        </article>

        <article className="tarjeta">
          <h3>NOTIFICACIONES DE SISTEMA</h3>

          {alertasTiempo.map((texto, i) => (
            <p className="em-notif" key={`t${i}`}>
              <i className="em-punto-rojo"></i> {texto}
            </p>
          ))}

          {eventos.map((ev) => (
            <p className="em-notif" key={ev.id}>
              <i className="ex-punto-azul"></i> {ev.texto}
            </p>
          ))}
        </article>
      </aside>

      {/* ---------- Ventanas ---------- */}
      {verFormulario && (
        <FormularioEmergencia
          onGuardar={crearManual}
          onCancelar={() => setVerFormulario(false)}
        />
      )}

      {detalle && (
        <DetalleEmergencia
          key={detalle.id}
          e={detalle}
          onCerrar={() => setDetalleId(null)}
          onTomar={tomarCaso}
          onNota={agregarNota}
          onCerrarCaso={cerrarCaso}
          onDerivar={derivar}
        />
      )}

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

export default AtenderEmergencias;