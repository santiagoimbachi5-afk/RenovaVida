import { useState, useEffect } from "react";
import ThOrdenable from "../../components/ThOrdenable.jsx";
import Paginacion from "../../components/Paginacion.jsx";
import Aviso from "../../components/Aviso.jsx";
import { useOrdenar } from "../../hooks/useOrdenar.js";
import { usePaginacion } from "../../hooks/usePaginacion.js";
import { descargarPDF, descargarCSV } from "../../utils/exportar.js";
import "../../styles/solicitudes.css";
import "../../styles/solicitudes-funciones.css";

/* ================= Reglas ================= */
const EQUIPOS = ["Secretaría", "IT/Soporte", "Atención Paciente", "Archivo"];

// Tiempo límite de respuesta según la prioridad (en minutos)
const SLA = { urgente: 60, normal: 240, informativa: 480 };

const PESO = { urgente: 1, normal: 2, informativa: 3 };

const textoPrioridad = {
  urgente: "Urgente (Rojo)",
  normal: "Normal (Azul)",
  informativa: "Informativa (Verde)",
};

const claseEstado = {
  "Pendiente": "sol-pendiente",
  "En progreso": "sol-progreso",
  "Cerrado": "sol-cerrado",
};

// Cada tipo de solicitud recibe prioridad y responsable automáticamente
const reglasIniciales = {
  "Certificado médico": { prioridad: "urgente", responsable: "Secretaría" },
  "Soporte Técnico": { prioridad: "normal", responsable: "IT/Soporte" },
  "Información General": { prioridad: "informativa", responsable: "Atención Paciente" },
  "Entrega Documentos": { prioridad: "urgente", responsable: "Archivo" },
  "Cambio de cita": { prioridad: "normal", responsable: "Atención Paciente" },
  "Historia clínica": { prioridad: "normal", responsable: "Archivo" },
};

/* ================= Ayudas ================= */
function horaDe(ms) {
  return new Date(ms).toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" });
}

// Qué porcentaje del tiempo límite ha pasado (se detiene al cerrar)
function porcentajeTiempo(s, ahora) {
  const fin = s.cerradaEn !== null ? s.cerradaEn : ahora;
  const minutos = (fin - s.creada) / 60000;
  return Math.min(100, Math.max(0, Math.round((minutos / SLA[s.prioridad]) * 100)));
}

function claseTiempo(porcentaje) {
  if (porcentaje >= 80) return "so-alto";
  if (porcentaje >= 50) return "so-medio";
  return "";
}

/* ================= Solicitudes de ejemplo ================= */
const AHORA0 = Date.now();
const minAtras = (m) => AHORA0 - m * 60000;

const solicitudesIniciales = [
  { id: "SOL-1001", tipo: "Certificado médico", solicitante: "Elena Rodríguez", descripcion: "Necesita un certificado médico para presentarlo en su colegio.", prioridad: "urgente", estado: "Pendiente", creada: minAtras(48), cerradaEn: null, responsable: "Secretaría", respuestas: [] },
  { id: "SOL-1002", tipo: "Soporte Técnico", solicitante: "Carlos Díaz", descripcion: "No puede entrar a su cuenta desde el celular.", prioridad: "normal", estado: "En progreso", creada: minAtras(96), cerradaEn: null, responsable: "IT/Soporte", respuestas: [{ hora: horaDe(minAtras(80)), texto: "Estamos revisando el acceso de tu cuenta." }] },
  { id: "SOL-1003", tipo: "Información General", solicitante: "Laura Rojas", descripcion: "Pregunta por los horarios de atención de los sábados.", prioridad: "informativa", estado: "Pendiente", creada: minAtras(336), cerradaEn: null, responsable: "Atención Paciente", respuestas: [] },
  { id: "SOL-1004", tipo: "Entrega Documentos", solicitante: "Pedro Pérez", descripcion: "Quiere entregar los documentos de su acudiente.", prioridad: "urgente", estado: "Pendiente", creada: minAtras(30), cerradaEn: null, responsable: "Archivo", respuestas: [] },
  { id: "SOL-1005", tipo: "Certificado médico", solicitante: "María Gómez", descripcion: "Certificado de asistencia a su última cita.", prioridad: "urgente", estado: "En progreso", creada: minAtras(20), cerradaEn: null, responsable: "Secretaría", respuestas: [] },
  { id: "SOL-1006", tipo: "Cambio de cita", solicitante: "Darins Ceines", descripcion: "Pide mover su cita del jueves a otro día.", prioridad: "normal", estado: "Pendiente", creada: minAtras(60), cerradaEn: null, responsable: "Atención Paciente", respuestas: [] },
  { id: "SOL-1007", tipo: "Soporte Técnico", solicitante: "Elena Rodríguez", descripcion: "La aplicación se cerraba al abrir el calendario.", prioridad: "normal", estado: "Cerrado", creada: minAtras(300), cerradaEn: minAtras(300) + 70 * 60000, responsable: "IT/Soporte", respuestas: [{ hora: horaDe(minAtras(230)), texto: "Se corrigió el problema. Actualiza la aplicación." }] },
  { id: "SOL-1008", tipo: "Información General", solicitante: "Andrés Mora", descripcion: "Pregunta cómo registrar a un contacto de confianza.", prioridad: "informativa", estado: "Cerrado", creada: minAtras(400), cerradaEn: minAtras(400) + 90 * 60000, responsable: "Atención Paciente", respuestas: [{ hora: horaDe(minAtras(310)), texto: "Puedes hacerlo desde tu perfil, en la sección de contactos." }] },
  { id: "SOL-1009", tipo: "Historia clínica", solicitante: "Valentina Ruiz", descripcion: "Solicita una copia de su historia clínica.", prioridad: "normal", estado: "En progreso", creada: minAtras(200), cerradaEn: null, responsable: "Archivo", respuestas: [] },
  { id: "SOL-1010", tipo: "Certificado médico", solicitante: "Camila Torres", descripcion: "Certificado para un trámite de su universidad.", prioridad: "urgente", estado: "Pendiente", creada: minAtras(55), cerradaEn: null, responsable: "Secretaría", respuestas: [] },
];

/* ================= Gráfica de líneas (decorativa, igual que la maqueta) ================= */
const meses = ["Men", "Mar", "May", "Abri", "Mov", "Desa"];

const series = [
  { nombre: "Urgencias", color: "#12305c", relleno: "#9db9d6", suave: true, leyenda: true, valores: [3, 15, 5, 18, 7, 20] },
  { nombre: "General", color: "#3aa655", relleno: null, suave: true, leyenda: true, valores: [3, 2.5, 10, 8, 7.5, 12] },
  { nombre: "Otros", color: "#d33a35", relleno: "#f2b8b8", suave: false, leyenda: false, valores: [1, 10, 9, 10, 10.5, 12.5] },
];

const W = 320, H = 190, ML = 28, MR = 12, MT = 10, MB = 24, MAXY = 20;
const x = (i) => ML + (i * (W - ML - MR)) / (meses.length - 1);
const y = (v) => MT + (H - MT - MB) * (1 - v / MAXY);

function curva(valores) {
  const pts = valores.map((v, i) => [x(i), y(v)]);
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2[0]} ${p2[1]}`;
  }
  return d;
}

function recta(valores) {
  return valores.map((v, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(v)}`).join(" ");
}

function trazo(s) {
  return s.suave ? curva(s.valores) : recta(s.valores);
}

function area(s) {
  const ultimo = s.valores.length - 1;
  return `${trazo(s)} L ${x(ultimo)} ${y(0)} L ${x(0)} ${y(0)} Z`;
}

/* ================= Torta calculada con las solicitudes ================= */
function armarTorta(lista) {
  const total = lista.length;
  const definiciones = [
    { nombre: "En progreso", color: "#3f86c9" },
    { nombre: "Pendiente", color: "#7fb2e0" },
    { nombre: "Cerrado", color: "#8fd19e" },
  ];

  let acumulado = 0;
  const trozos = definiciones.map((d) => {
    const n = lista.filter((s) => s.estado === d.nombre).length;
    const fraccion = total === 0 ? 0 : (n / total) * 100;
    const inicio = acumulado;
    acumulado += fraccion;
    const medio = ((inicio + fraccion / 2) / 100) * 2 * Math.PI;
    return {
      ...d,
      n,
      porcentaje: Math.round(fraccion),
      inicio,
      fin: acumulado,
      x: 50 + 30 * Math.sin(medio),
      y: 50 - 30 * Math.cos(medio),
    };
  });

  const gradiente =
    total === 0
      ? "#e1e6ec"
      : `conic-gradient(${trozos
          .filter((t) => t.n > 0)
          .map((t) => `${t.color} ${t.inicio}% ${t.fin}%`)
          .join(", ")})`;

  return { trozos, gradiente };
}

/* ================= Íconos pequeños ================= */
function IconoCertificado() {
  return (
    <svg width="46" height="38" viewBox="0 0 46 38" fill="none" stroke="#12305c" strokeWidth="2">
      <rect x="2" y="2" width="42" height="28" rx="3" />
      <line x1="9" y1="10" x2="30" y2="10" />
      <line x1="9" y1="16" x2="24" y2="16" />
      <circle cx="35" cy="21" r="5" />
      <path d="M32 25l-2 9 5-3 5 3-2-9" />
    </svg>
  );
}

function IconoEquipo() {
  return (
    <svg width="46" height="38" viewBox="0 0 46 38" fill="#12305c">
      <circle cx="23" cy="10" r="7" />
      <path d="M9 34c0-8 6-13 14-13s14 5 14 13z" />
      <circle cx="8" cy="14" r="5" opacity="0.8" />
      <circle cx="38" cy="14" r="5" opacity="0.8" />
    </svg>
  );
}

/* ================= Formulario: nueva solicitud ================= */
function FormularioSolicitud({ reglas, onGuardar, onCancelar }) {
  const tipos = Object.keys(reglas);
  const [datos, setDatos] = useState({ solicitante: "", tipo: tipos[0], descripcion: "" });
  const [error, setError] = useState("");

  const cambiar = (e) => setDatos({ ...datos, [e.target.name]: e.target.value });

  const guardar = (e) => {
    e.preventDefault();
    if (!datos.solicitante.trim()) {
      setError("Escribe el nombre de quien hace la solicitud.");
      return;
    }
    if (datos.descripcion.trim().length < 5) {
      setError("Describe la solicitud (mínimo 5 letras).");
      return;
    }
    onGuardar({
      solicitante: datos.solicitante.trim(),
      tipo: datos.tipo,
      descripcion: datos.descripcion.trim(),
    });
  };

  const regla = reglas[datos.tipo];

  return (
    <div className="cf-fondo">
      <div className="cf-caja so-ancha">
        <h3>Nueva solicitud</h3>

        <form className="so-form" onSubmit={guardar}>
          <label>
            Solicitante
            <input name="solicitante" value={datos.solicitante} onChange={cambiar} placeholder="Nombre de la persona" />
          </label>

          <label>
            Tipo de solicitud
            <select name="tipo" value={datos.tipo} onChange={cambiar}>
              {tipos.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </label>

          <label>
            Descripción
            <textarea
              className="so-textarea"
              name="descripcion"
              value={datos.descripcion}
              onChange={cambiar}
              placeholder="¿Qué necesita la persona?"
            />
          </label>

          <p className="so-auto">
            Clasificación automática: <b>{textoPrioridad[regla.prioridad]}</b> · Responsable:{" "}
            <b>{regla.responsable}</b>
          </p>

          {error && <p className="so-error">{error}</p>}

          <div className="so-botones">
            <button type="button" className="so-btn-claro" onClick={onCancelar}>Cancelar</button>
            <button type="submit" className="so-btn">Crear solicitud</button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ================= Ventana: configurar reglas ================= */
function ModalReglas({ reglas, onGuardar, onCancelar }) {
  const [copia, setCopia] = useState(reglas);

  const cambiar = (tipo, campo, valor) => {
    setCopia({ ...copia, [tipo]: { ...copia[tipo], [campo]: valor } });
  };

  return (
    <div className="cf-fondo">
      <div className="cf-caja so-ancha">
        <h3>Reglas de clasificación automática</h3>
        <p className="so-ayuda">
          Cada tipo de solicitud recibe su prioridad y su responsable de forma automática. Los
          cambios se aplican a las solicitudes nuevas.
        </p>

        <table className="so-reglas">
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Prioridad</th>
              <th>Responsable</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(copia).map((tipo) => (
              <tr key={tipo}>
                <td>{tipo}</td>
                <td>
                  <select
                    value={copia[tipo].prioridad}
                    onChange={(e) => cambiar(tipo, "prioridad", e.target.value)}
                  >
                    <option value="urgente">Urgente (Rojo)</option>
                    <option value="normal">Normal (Azul)</option>
                    <option value="informativa">Informativa (Verde)</option>
                  </select>
                </td>
                <td>
                  <select
                    value={copia[tipo].responsable}
                    onChange={(e) => cambiar(tipo, "responsable", e.target.value)}
                  >
                    {EQUIPOS.map((eq) => (
                      <option key={eq} value={eq}>{eq}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="so-botones">
          <button className="so-btn-claro" onClick={onCancelar}>Cancelar</button>
          <button className="so-btn" onClick={() => onGuardar(copia)}>Guardar reglas</button>
        </div>
      </div>
    </div>
  );
}

/* ================= Detalle de una solicitud ================= */
function DetalleSolicitud({ s, ahora, onCerrar, onIniciar, onResponder, onCerrarSolicitud, onReabrir, onReasignar }) {
  const [texto, setTexto] = useState("");
  const [error, setError] = useState("");

  const activa = s.estado !== "Cerrado";
  const porcentaje = porcentajeTiempo(s, ahora);

  const enviar = () => {
    if (texto.trim().length < 3) {
      setError("Escribe la respuesta antes de enviarla.");
      return;
    }
    onResponder(s, texto.trim());
    setTexto("");
    setError("");
  };

  const cerrar = () => {
    if (texto.trim().length < 3 && s.respuestas.length === 0) {
      setError("Para cerrar la solicitud escribe una respuesta final.");
      return;
    }
    onCerrarSolicitud(s, texto.trim());
  };

  return (
    <div className="cf-fondo" onClick={onCerrar}>
      <div className="cf-caja so-ancha" onClick={(ev) => ev.stopPropagation()}>
        <div className="so-detalle-top">
          <h3>Solicitud {s.id}</h3>
          <span className={`sol-estado ${claseEstado[s.estado]}`}>{s.estado}</span>
        </div>

        <dl className="so-detalle">
          <div><dt>Solicitante</dt><dd>{s.solicitante}</dd></div>
          <div><dt>Tipo</dt><dd>{s.tipo}</dd></div>
          <div>
            <dt>Prioridad</dt>
            <dd><span className={`sol-prioridad sol-${s.prioridad}`}>{textoPrioridad[s.prioridad]}</span></dd>
          </div>
          <div>
            <dt>Responsable</dt>
            <dd>
              <select
                value={s.responsable}
                disabled={!activa}
                onChange={(e) => onReasignar(s, e.target.value)}
              >
                {EQUIPOS.map((eq) => (
                  <option key={eq} value={eq}>{eq}</option>
                ))}
              </select>
            </dd>
          </div>
          <div><dt>Creada</dt><dd>{horaDe(s.creada)}</dd></div>
          <div>
            <dt>Tiempo</dt>
            <dd>
              <div className={`sol-tiempo ${claseTiempo(porcentaje)}`}>
                <div className="sol-barra"><div style={{ width: `${porcentaje}%` }}></div></div>
                <span>{porcentaje}%</span>
              </div>
            </dd>
          </div>
          <div><dt>Descripción</dt><dd>{s.descripcion}</dd></div>
        </dl>

        <h4 style={{ margin: "14px 0 4px", fontSize: 13 }}>Respuestas</h4>
        {s.respuestas.length === 0 ? (
          <p className="so-ayuda">Todavía no hay respuestas.</p>
        ) : (
          <ul className="so-respuestas">
            {s.respuestas.map((r, i) => (
              <li key={i}><b>{r.hora}</b> {r.texto}</li>
            ))}
          </ul>
        )}

        {activa && (
          <>
            <textarea
              className="so-textarea"
              placeholder="Escribe una respuesta. Si cierras la solicitud, este texto será la respuesta final."
              value={texto}
              onChange={(ev) => setTexto(ev.target.value)}
            />
            {error && <p className="so-error">{error}</p>}
          </>
        )}

        <div className="so-botones">
          {s.estado === "Pendiente" && (
            <button className="so-btn" onClick={() => onIniciar(s)}>Iniciar atención</button>
          )}
          {activa && (
            <button className="so-btn-claro" onClick={enviar}>Enviar respuesta</button>
          )}
          {activa && (
            <button className="so-btn so-verde" onClick={cerrar}>Cerrar solicitud</button>
          )}
          {!activa && (
            <button className="so-btn so-naranja" onClick={() => onReabrir(s)}>Reabrir</button>
          )}
          <button className="so-btn-claro" onClick={onCerrar}>Cerrar ventana</button>
        </div>
      </div>
    </div>
  );
}

/* ================= Pantalla principal ================= */
function SolicitudesUsuarios() {
  const [solicitudes, setSolicitudes] = useState(solicitudesIniciales);
  const [reglas, setReglas] = useState(reglasIniciales);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("Todas");
  const [detalleId, setDetalleId] = useState(null);
  const [verFormulario, setVerFormulario] = useState(false);
  const [verReglas, setVerReglas] = useState(false);
  const [aviso, setAviso] = useState(null);
  const [demo, setDemo] = useState(false);
  const [ahora, setAhora] = useState(Date.now());

  /* ---------- Reloj: hace avanzar la barra de tiempo ---------- */
  useEffect(() => {
    const cada = demo ? 1000 : 15000; // cada cuánto se actualiza (milisegundos reales)
    const paso = demo ? 60000 : 15000; // cuánto tiempo "pasa" en cada actualización
    const reloj = setInterval(() => setAhora((a) => a + paso), cada);
    return () => clearInterval(reloj);
  }, [demo]);

  const mostrarAviso = (texto, tipo = "exito") => {
    setAviso({ id: Date.now(), texto, tipo });
  };

  // "cambios" puede ser un objeto o una función que recibe la solicitud actual
  const actualizar = (id, cambios) => {
    setSolicitudes((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, ...(typeof cambios === "function" ? cambios(s) : cambios) }
          : s
      )
    );
  };

  /* ---------- Acciones ---------- */
  const crearSolicitud = (datos) => {
    const numero =
      Math.max(1000, ...solicitudes.map((s) => Number(s.id.split("-")[1]))) + 1;
    const regla = reglas[datos.tipo];

    setSolicitudes([
      ...solicitudes,
      {
        id: `SOL-${numero}`,
        tipo: datos.tipo,
        solicitante: datos.solicitante,
        descripcion: datos.descripcion,
        prioridad: regla.prioridad,
        estado: "Pendiente",
        creada: ahora,
        cerradaEn: null,
        responsable: regla.responsable,
        respuestas: [],
      },
    ]);

    setBusqueda("");
    setFiltroEstado("Todas");
    setVerFormulario(false);
    mostrarAviso(`Solicitud SOL-${numero} creada y clasificada como ${datos.tipo}`);
  };

  const guardarReglas = (nuevas) => {
    setReglas(nuevas);
    setVerReglas(false);
    mostrarAviso("Reglas guardadas. Se aplican a las solicitudes nuevas");
  };

  const iniciar = (s) => {
    actualizar(s.id, { estado: "En progreso" });
    mostrarAviso(`${s.id} en progreso`);
  };

  const responder = (s, texto) => {
    actualizar(s.id, (x) => ({
      estado: x.estado === "Pendiente" ? "En progreso" : x.estado,
      respuestas: [...x.respuestas, { hora: horaDe(ahora), texto }],
    }));
    mostrarAviso("Respuesta enviada");
  };

  const cerrarSolicitud = (s, texto) => {
    actualizar(s.id, (x) => ({
      estado: "Cerrado",
      cerradaEn: ahora,
      respuestas: texto
        ? [...x.respuestas, { hora: horaDe(ahora), texto }]
        : x.respuestas,
    }));
    mostrarAviso(`${s.id} cerrada`);
    setDetalleId(null);
  };

  const reabrir = (s) => {
    actualizar(s.id, { estado: "Pendiente", cerradaEn: null });
    mostrarAviso(`${s.id} reabierta`, "info");
  };

  const reasignar = (s, equipo) => {
    actualizar(s.id, { responsable: equipo });
    mostrarAviso(`${s.id} asignada a ${equipo}`, "info");
  };

  /* ---------- Datos calculados ---------- */
  const activas = solicitudes.filter((s) => s.estado !== "Cerrado");
  const pendientes = solicitudes.filter((s) => s.estado === "Pendiente").length;
  const criticas = activas.filter((s) => s.prioridad === "urgente").length;
  const DIA = 24 * 60 * 60000;
  const nuevasHoy = solicitudes.filter((s) => ahora - s.creada < DIA).length;
  const activasHoy = activas.filter((s) => ahora - s.creada < DIA).length;
  const certificados = activas.filter((s) => s.tipo === "Certificado médico").length;
  const equiposActivos = new Set(activas.map((s) => s.responsable)).size;

  const { trozos, gradiente } = armarTorta(solicitudes);

  // Barras: cuántas solicitudes hay de cada prioridad
  const barras = [
    { nombre: "Urgente", clave: "urgente", color: "#d33a35" },
    { nombre: "Normal", clave: "normal", color: "#5b9bd5" },
    { nombre: "Informativa", clave: "informativa", color: "#8fd19e" },
  ].map((b) => ({ ...b, valor: solicitudes.filter((s) => s.prioridad === b.clave).length }));

  const maxBarras = Math.ceil(Math.max(4, ...barras.map((b) => b.valor)) / 4) * 4;
  const marcasBarras = [4, 3, 2, 1, 0].map((k) => (k * maxBarras) / 4);

  /* ---------- Bandeja: filtrar -> ordenar -> paginar ---------- */
  const filtradas = solicitudes.filter((s) => {
    const coincide = `${s.id} ${s.tipo} ${s.solicitante} ${s.responsable}`
      .toLowerCase()
      .includes(busqueda.toLowerCase());
    const estadoOk = filtroEstado === "Todas" || s.estado === filtroEstado;
    return coincide && estadoOk;
  });

  // Cómo comparar cada columna
  const valorOrden = (s, campo) => {
    if (campo === "prioridad") return PESO[s.prioridad];
    if (campo === "tiempo") return porcentajeTiempo(s, ahora);
    return s[campo];
  };

  const { ordenados, orden, cambiarOrden } = useOrdenar(filtradas, valorOrden);
  const pag = usePaginacion(ordenados, 5);

  const detalle = solicitudes.find((s) => s.id === detalleId);

  /* ---------- Exportar lo que se está viendo ---------- */
  const columnasExport = ["ID", "Tipo", "Solicitante", "Prioridad", "Estado", "Tiempo", "Responsable"];

  const filasExport = () =>
    ordenados.map((s) => [
      s.id,
      s.tipo,
      s.solicitante,
      textoPrioridad[s.prioridad],
      s.estado,
      `${porcentajeTiempo(s, ahora)}%`,
      s.responsable,
    ]);

  const exportarPDF = () => {
    if (ordenados.length === 0) {
      mostrarAviso("No hay solicitudes para exportar", "info");
      return;
    }
    descargarPDF({
      titulo: "Bandeja de solicitudes de usuarios",
      resumen: [
        ["Solicitudes activas", String(activas.length)],
        ["Críticas", String(criticas)],
      ],
      columnas: columnasExport,
      filas: filasExport(),
      archivo: "solicitudes-renovavida",
    });
  };

  const exportarExcel = () => {
    if (ordenados.length === 0) {
      mostrarAviso("No hay solicitudes para exportar", "info");
      return;
    }
    descargarCSV({
      columnas: columnasExport,
      filas: filasExport(),
      archivo: "solicitudes-renovavida",
    });
  };

  return (
    <div className="sol">
      {/* ---------- Resumen y botones ---------- */}
      <div className="sol-top">
        <div className="sol-resumen">
          <span>Solicitudes Pendientes: <b>{pendientes}</b></span>
          <span>Solicitudes Críticas: <b className="sol-rojo">{criticas} (Rojo)</b></span>
          <span>Solicitudes Nuevas Hoy: <b>{nuevasHoy}</b></span>
        </div>
        <div className="sol-botones">
          <button className="sol-btn" onClick={() => setVerFormulario(true)}>＋ Nueva Solicitud</button>
          <button className="sol-btn" onClick={() => setVerReglas(true)}>⚙ Configurar Reglas</button>
        </div>
      </div>

      {/* ---------- Fila 1: indicadores ---------- */}
      <section className="sol-fila">
        <article className="sol-card">
          <h3>Solicitudes estado</h3>
          <p className="sol-grande">Total Activas {activas.length} <span className="sol-sube">▲</span></p>
          <p className="sol-nota">+{activasHoy} (hoy)</p>
        </article>

        <article className="sol-card sol-card-icono">
          <div>
            <h3>Solicitudes tipo</h3>
            <p className="sol-grande">Certificados {certificados}</p>
          </div>
          <IconoCertificado />
        </article>

        <article className="sol-card sol-card-icono">
          <div>
            <h3>Responsables activos</h3>
            <p className="sol-grande">{equiposActivos} (equipos)</p>
          </div>
          <IconoEquipo />
        </article>
      </section>

      {/* ---------- Fila 2: gráficas ---------- */}
      <section className="sol-fila">
        {/* Torta */}
        <article className="sol-card">
          <h3>Estado de solicitudes</h3>
          <div className="sol-torta-fila">
            <div className="sol-torta" style={{ background: gradiente }}>
              {trozos
                .filter((t) => t.n > 0)
                .map((t) => (
                  <span key={t.nombre} style={{ left: `${t.x}%`, top: `${t.y}%` }}>
                    {t.porcentaje}%
                  </span>
                ))}
            </div>
            <div className="sol-leyenda-v">
              {trozos.map((t) => (
                <span key={t.nombre}>
                  <i style={{ background: t.color }}></i>
                  {t.nombre} ({t.n})
                </span>
              ))}
            </div>
          </div>
        </article>

        {/* Barras */}
        <article className="sol-card">
          <h3>Clasificación automática <small>(por prioridad)</small></h3>
          <div className="sol-barras">
            <div className="sol-barras-eje">
              {marcasBarras.map((n) => <span key={n}>{n}</span>)}
            </div>
            <div className="sol-barras-cuerpo">
              <div className="sol-barras-area">
                {barras.map((b) => (
                  <div className="sol-barra-col" key={b.nombre}>
                    <div
                      className="sol-barra-v"
                      style={{ height: `${(b.valor / maxBarras) * 100}%`, background: b.color }}
                    ></div>
                  </div>
                ))}
              </div>
              <div className="sol-barras-etiquetas">
                {barras.map((b) => <span key={b.nombre}>{b.nombre} ({b.valor})</span>)}
              </div>
            </div>
          </div>
        </article>

        {/* Líneas */}
        <article className="sol-card">
          <h3>Tiempo promedio de respuesta</h3>
          <div className="sol-leyenda-h">
            {series.filter((s) => s.leyenda).map((s) => (
              <span key={s.nombre}>
                <i className="sol-linea-ico" style={{ background: s.color }}></i>
                {s.nombre}
              </span>
            ))}
          </div>

          <svg viewBox={`0 0 ${W} ${H}`} className="sol-linea-svg">
            {[0, 5, 10, 15, 20].map((t) => (
              <g key={t}>
                <line x1={ML} x2={W - MR} y1={y(t)} y2={y(t)} stroke="#e6e6e6" />
                <text x={ML - 6} y={y(t) + 3} textAnchor="end" fontSize="9" fill="#444">{t}</text>
              </g>
            ))}

            {meses.map((m, i) => (
              <text key={m} x={x(i)} y={H - 6} textAnchor="middle" fontSize="9" fill="#444">{m}</text>
            ))}

            {series.map((s) => (
              <g key={s.nombre}>
                {s.relleno && <path d={area(s)} fill={s.relleno} opacity="0.45" />}
                <path d={trazo(s)} fill="none" stroke={s.color} strokeWidth="1.8" />
                {s.valores.map((v, i) => (
                  <circle key={i} cx={x(i)} cy={y(v)} r="2.8" fill={s.color} />
                ))}
              </g>
            ))}
          </svg>
        </article>
      </section>

      {/* ---------- Bandeja de solicitudes ---------- */}
      <section className="sol-card">
        <div className="sol-bandeja-top">
          <h3>Bandeja de solicitudes</h3>

          <div className="so-barra">
            <select
              value={filtroEstado}
              onChange={(e) => {
                setFiltroEstado(e.target.value);
                pag.irAPagina(1);
              }}
            >
              <option>Todas</option>
              <option>Pendiente</option>
              <option>En progreso</option>
              <option>Cerrado</option>
            </select>

            <input
              type="text"
              className="sol-buscar"
              placeholder="🔍 Buscar solicitudes o filtrar por tipo"
              value={busqueda}
              onChange={(e) => {
                setBusqueda(e.target.value);
                pag.irAPagina(1);
              }}
            />

            <button className="so-btn-claro" onClick={exportarPDF}>⬇ PDF</button>
            <button className="so-btn-claro" onClick={exportarExcel}>⬇ Excel</button>
          </div>
        </div>

        <label className="so-demo">
          <input type="checkbox" checked={demo} onChange={(e) => setDemo(e.target.checked)} />
          Modo demo (el tiempo corre 60 veces más rápido: 1 segundo = 1 minuto)
        </label>

        <div className="so-tabla-caja">
          <table className="sol-tabla">
            <thead>
              <tr>
                <ThOrdenable campo="id" orden={orden} onOrdenar={cambiarOrden}>Solicitud ID</ThOrdenable>
                <ThOrdenable campo="tipo" orden={orden} onOrdenar={cambiarOrden}>Tipo Solicitud</ThOrdenable>
                <ThOrdenable campo="solicitante" orden={orden} onOrdenar={cambiarOrden}>Solicitante</ThOrdenable>
                <ThOrdenable campo="prioridad" orden={orden} onOrdenar={cambiarOrden}>Prioridad (Auto)</ThOrdenable>
                <ThOrdenable campo="estado" orden={orden} onOrdenar={cambiarOrden}>Estado</ThOrdenable>
                <ThOrdenable campo="tiempo" orden={orden} onOrdenar={cambiarOrden}>Tiempo Transcurrido</ThOrdenable>
                <ThOrdenable campo="responsable" orden={orden} onOrdenar={cambiarOrden}>Responsable (Equipo)</ThOrdenable>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {pag.visibles.map((s) => {
                const porcentaje = porcentajeTiempo(s, ahora);

                return (
                  <tr key={s.id} className="so-click" onClick={() => setDetalleId(s.id)}>
                    <td>{s.id}</td>
                    <td>{s.tipo}</td>
                    <td className="so-solic">{s.solicitante}</td>
                    <td>
                      <span className={`sol-prioridad sol-${s.prioridad}`}>
                        {textoPrioridad[s.prioridad]}
                      </span>
                    </td>
                    <td>
                      <span className={`sol-estado ${claseEstado[s.estado]}`}>{s.estado}</span>
                    </td>
                    <td>
                      <div className={`sol-tiempo ${claseTiempo(porcentaje)}`}>
                        <div className="sol-barra"><div style={{ width: `${porcentaje}%` }}></div></div>
                        <span>{porcentaje}%</span>
                      </div>
                    </td>
                    <td>{s.responsable}</td>
                    <td>
                      <button
                        className="so-btn-claro"
                        onClick={(ev) => {
                          ev.stopPropagation();
                          setDetalleId(s.id);
                        }}
                      >
                        Abrir
                      </button>
                    </td>
                  </tr>
                );
              })}

              {ordenados.length === 0 && (
                <tr>
                  <td colSpan="8" className="so-vacio">No hay solicitudes que coincidan.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Paginacion
          paginaActual={pag.paginaActual}
          totalPaginas={pag.totalPaginas}
          desde={pag.desde}
          hasta={pag.hasta}
          total={pag.total}
          onCambiar={pag.irAPagina}
        />
      </section>

      {/* ---------- Ventanas ---------- */}
      {verFormulario && (
        <FormularioSolicitud
          reglas={reglas}
          onGuardar={crearSolicitud}
          onCancelar={() => setVerFormulario(false)}
        />
      )}

      {verReglas && (
        <ModalReglas
          reglas={reglas}
          onGuardar={guardarReglas}
          onCancelar={() => setVerReglas(false)}
        />
      )}

      {detalle && (
        <DetalleSolicitud
          key={detalle.id}
          s={detalle}
          ahora={ahora}
          onCerrar={() => setDetalleId(null)}
          onIniciar={iniciar}
          onResponder={responder}
          onCerrarSolicitud={cerrarSolicitud}
          onReabrir={reabrir}
          onReasignar={reasignar}
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

export default SolicitudesUsuarios;