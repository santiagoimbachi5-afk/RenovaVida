import { useState } from "react";
import ThOrdenable from "../../components/ThOrdenable.jsx";
import { useOrdenar } from "../../hooks/useOrdenar.js";
import "../../styles/solicitudes.css";

/* ================= Datos (luego los cambias por los de tu base de datos) ================= */
const estadoSolicitudes = [
  { nombre: "En progreso", valor: 55, color: "#3f86c9" },
  { nombre: "Pendiente", valor: 25, color: "#7fb2e0" },
  { nombre: "Cerrado", valor: 20, color: "#8fd19e" },
];

const clasificacion = [
  { nombre: "Urgente", valor: 18, color: "#d33a35" },
  { nombre: "Normal", valor: 16, color: "#5b9bd5" },
  { nombre: "Informativa", valor: 8, color: "#8fd19e" },
  { nombre: "Verde", valor: 14, color: "#b6e0bd" },
];

const meses = ["Men", "Mar", "May", "Abri", "Mov", "Desa"];

const series = [
  { nombre: "Urgencias", color: "#12305c", relleno: "#9db9d6", suave: true, leyenda: true, valores: [3, 15, 5, 18, 7, 20] },
  { nombre: "General", color: "#3aa655", relleno: null, suave: true, leyenda: true, valores: [3, 2.5, 10, 8, 7.5, 12] },
  { nombre: "Otros", color: "#d33a35", relleno: "#f2b8b8", suave: false, leyenda: false, valores: [1, 10, 9, 10, 10.5, 12.5] },
];

const solicitudes = [
  { id: "SOL-1001", tipo: "Certificado médico", prioridad: "urgente", estado: "Pendiente", tiempo: 80, responsable: "Secretaría" },
  { id: "SOL-1002", tipo: "Soporte Técnico", prioridad: "normal", estado: "En progreso", tiempo: 40, responsable: "IT/Soporte" },
  { id: "SOL-1003", tipo: "Información General", prioridad: "informativa", estado: "Pendiente", tiempo: 70, responsable: "Atención Paciente" },
  { id: "SOL-1004", tipo: "Entrega Documentos", prioridad: "urgente", estado: "Pendiente", tiempo: 50, responsable: "Archivo" },
];

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

/* ================= ORDEN: cómo comparar cada columna ================= */
// Para ordenar por prioridad, "Urgente" tiene que ir primero.
// Si se ordenara por letras, quedaría al final.
const pesoPrioridad = { urgente: 1, normal: 2, informativa: 3 };

function valorOrden(solicitud, campo) {
  if (campo === "prioridad") return pesoPrioridad[solicitud.prioridad];
  return solicitud[campo];
}

/* ================= Torta: se dibuja con conic-gradient ================= */
let acumulado = 0;
const trozos = estadoSolicitudes.map((e) => {
  const inicio = acumulado;
  acumulado += e.valor;
  const medio = ((inicio + e.valor / 2) / 100) * 2 * Math.PI;
  return {
    ...e,
    inicio,
    fin: acumulado,
    x: 50 + 30 * Math.sin(medio),
    y: 50 - 30 * Math.cos(medio),
  };
});
const gradiente = `conic-gradient(${trozos
  .map((t) => `${t.color} ${t.inicio}% ${t.fin}%`)
  .join(", ")})`;

/* ================= Barras ================= */
const MAX_BARRAS = 20;
const marcasBarras = [20, 15, 10, 5, 0];

/* ================= Líneas: se dibujan con SVG ================= */
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

function SolicitudesUsuarios() {
  const [busqueda, setBusqueda] = useState("");

  // 1) Primero se filtra con el buscador
  const filtradas = solicitudes.filter((s) =>
    `${s.id} ${s.tipo} ${s.responsable}`
      .toLowerCase()
      .includes(busqueda.toLowerCase())
  );

  // 2) Luego se ordena lo que quedó después del filtro
  const { ordenados, orden, cambiarOrden } = useOrdenar(filtradas, valorOrden);

  return (
    <div className="sol">
      {/* ---------- Resumen y botones ---------- */}
      <div className="sol-top">
        <div className="sol-resumen">
          <span>Solicitudes Pendientes: <b>45</b></span>
          <span>Solicitudes Críticas: <b className="sol-rojo">3 (Rojo)</b></span>
          <span>Solicitudes Nuevas Hoy: <b>10</b></span>
        </div>
        <div className="sol-botones">
          <button className="sol-btn">＋ Nueva Solicitud</button>
          <button className="sol-btn">⚙ Configurar Reglas</button>
        </div>
      </div>

      {/* ---------- Fila 1: indicadores ---------- */}
      <section className="sol-fila">
        <article className="sol-card">
          <h3>Solicitudes estado</h3>
          <p className="sol-grande">Total Activas 45 <span className="sol-sube">▲</span></p>
          <p className="sol-nota">+5 (hoy)</p>
        </article>

        <article className="sol-card sol-card-icono">
          <div>
            <h3>Solicitudes tipo</h3>
            <p className="sol-grande">Certificados 12</p>
          </div>
          <IconoCertificado />
        </article>

        <article className="sol-card sol-card-icono">
          <div>
            <h3>Responsables activos</h3>
            <p className="sol-grande">5 (equipos)</p>
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
              {trozos.map((t) => (
                <span key={t.nombre} style={{ left: `${t.x}%`, top: `${t.y}%` }}>
                  {t.valor}%
                </span>
              ))}
            </div>
            <div className="sol-leyenda-v">
              {estadoSolicitudes.map((e) => (
                <span key={e.nombre}>
                  <i style={{ background: e.color }}></i>
                  {e.nombre}
                </span>
              ))}
            </div>
          </div>
        </article>

        {/* Barras */}
        <article className="sol-card">
          <h3>Clasificación automática <small>(última semana)</small></h3>
          <div className="sol-barras">
            <div className="sol-barras-eje">
              {marcasBarras.map((n) => <span key={n}>{n}</span>)}
            </div>
            <div className="sol-barras-cuerpo">
              <div className="sol-barras-area">
                {clasificacion.map((c) => (
                  <div className="sol-barra-col" key={c.nombre}>
                    <div
                      className="sol-barra-v"
                      style={{ height: `${(c.valor / MAX_BARRAS) * 100}%`, background: c.color }}
                    ></div>
                  </div>
                ))}
              </div>
              <div className="sol-barras-etiquetas">
                {clasificacion.map((c) => <span key={c.nombre}>{c.nombre}</span>)}
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
          <input
            type="text"
            className="sol-buscar"
            placeholder="🔍 Buscar solicitudes o filtrar por tipo"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <table className="sol-tabla">
          <thead>
            <tr>
              <ThOrdenable campo="id" orden={orden} onOrdenar={cambiarOrden}>Solicitud ID</ThOrdenable>
              <ThOrdenable campo="tipo" orden={orden} onOrdenar={cambiarOrden}>Tipo Solicitud</ThOrdenable>
              <ThOrdenable campo="prioridad" orden={orden} onOrdenar={cambiarOrden}>Prioridad (Auto)</ThOrdenable>
              <ThOrdenable campo="estado" orden={orden} onOrdenar={cambiarOrden}>Estado</ThOrdenable>
              <ThOrdenable campo="tiempo" orden={orden} onOrdenar={cambiarOrden}>Tiempo Transcurrido</ThOrdenable>
              <ThOrdenable campo="responsable" orden={orden} onOrdenar={cambiarOrden}>Responsable (Equipo)</ThOrdenable>
            </tr>
          </thead>

          <tbody>
            {ordenados.map((s) => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td>{s.tipo}</td>
                <td>
                  <span className={`sol-prioridad sol-${s.prioridad}`}>
                    {textoPrioridad[s.prioridad]}
                  </span>
                </td>
                <td>
                  <span className={`sol-estado ${claseEstado[s.estado]}`}>{s.estado}</span>
                </td>
                <td>
                  <div className="sol-tiempo">
                    <div className="sol-barra"><div style={{ width: `${s.tiempo}%` }}></div></div>
                    <span>{s.tiempo}%</span>
                  </div>
                </td>
                <td>{s.responsable}</td>
              </tr>
            ))}

            {ordenados.length === 0 && (
              <tr>
                <td colSpan="6" className="sol-vacio">No hay solicitudes que coincidan.</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default SolicitudesUsuarios;