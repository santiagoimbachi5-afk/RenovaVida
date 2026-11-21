import "../../styles/Reportes.css";
import { descargarPDF, descargarCSV } from "../../utils/exportar.js";

/* ================= Datos (luego los cambias por los de tu base de datos) ================= */
const estadoPacientes = [
  { nombre: "Activos", valor: 50, color: "#3f86c9" },
  { nombre: "En tratamiento", valor: 30, color: "#5b9bd5" },
  { nombre: "Alta", valor: 20, color: "#8fd19e" },
];

const usoServicios = [
  { nombre: "Odontología", valor: 22.5, color: "#12305c" },
  { nombre: "Cardiología", valor: 17.5, color: "#5b9bd5" },
  { nombre: "Pediatría", valor: 12.5, color: "#8fd19e" },
  { nombre: "Urgencias", valor: 5, color: "#d33a35" },
];

const meses = ["Men", "Mar", "May", "Abri", "Mov", "Desa"];

const series = [
  { nombre: "Urgencias", color: "#12305c", relleno: "#9db9d6", suave: true, leyenda: true, valores: [3, 15, 5, 18, 7, 20] },
  { nombre: "General", color: "#3aa655", relleno: null, suave: true, leyenda: true, valores: [3, 2.5, 10, 8, 7.5, 12] },
  { nombre: "Otros", color: "#d33a35", relleno: "#f2b8b8", suave: false, leyenda: false, valores: [1, 10, 9, 10, 10.5, 12.5] },
];

const planes = [
  { id: 1, paciente: "Juan Pérez", especialidad: "Odontología", avance: 80, estado: "En progreso" },
  { id: 2, paciente: "María Gómez", especialidad: "Cardiología", avance: 95, estado: "Casi completo" },
  { id: 3, paciente: "Carlos Ruiz", especialidad: "Pediatría", avance: 60, estado: "En progreso" },
];

/* ================= Torta: se dibuja con conic-gradient ================= */
let acumulado = 0;
const trozos = estadoPacientes.map((e) => {
  const inicio = acumulado;
  acumulado += e.valor;
  const medio = ((inicio + e.valor / 2) / 100) * 2 * Math.PI;
  return {
    ...e,
    inicio,
    fin: acumulado,
    x: 50 + 30 * Math.sin(medio), // posición del texto dentro del trozo
    y: 50 - 30 * Math.cos(medio),
  };
});
const gradiente = `conic-gradient(${trozos
  .map((t) => `${t.color} ${t.inicio}% ${t.fin}%`)
  .join(", ")})`;

/* ================= Barras ================= */
const MAX_BARRAS = 25;
const marcasBarras = [25, 20, 15, 10, 5, 0];

/* ================= Líneas: se dibujan con SVG ================= */
const W = 320, H = 190, ML = 28, MR = 12, MT = 10, MB = 24, MAXY = 20;
const x = (i) => ML + (i * (W - ML - MR)) / (meses.length - 1);
const y = (v) => MT + (H - MT - MB) * (1 - v / MAXY);

// Línea con curvas suaves
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

// Línea con tramos rectos
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

function IconoArchivo() {
  return (
    <svg width="14" height="16" viewBox="0 0 14 16" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M2 1h6l4 4v10H2z" />
      <path d="M8 1v4h4" />
    </svg>
  );
}

const columnasPlanes = ["Paciente", "Especialidad", "Avance", "Estado"];

const filasPlanes = planes.map((p) => [
  p.paciente,
  p.especialidad,
  `${p.avance}%`,
  p.estado,
]);

function exportarPDF() {
  descargarPDF({
    titulo: "Reportes generados y analítica",
    resumen: [
      ["Citas de la semana", "120 (+10)"],
      ["Emergencias atendidas", "15 (+3)"],
      ["Cumplimiento de tratamientos", "80%"],
    ],
    columnas: columnasPlanes,
    filas: filasPlanes,
    archivo: "reporte-renovavida",
  });
}

function exportarExcel() {
  descargarCSV({
    columnas: columnasPlanes,
    filas: filasPlanes,
    archivo: "reporte-renovavida",
  });
}

function ReportesGenerados() {
  return (
    <div className="rep">
      {/* ---------- Título y botones ---------- */}
      <div className="rep-top">
        <h2>REPORTES GENERADOS Y ANALÍTICA</h2>
        <div className="rep-botones">
          
          <button className="rep-btn" onClick={exportarPDF}><IconoArchivo /> Exportar PDF</button>
          <button className="rep-btn" onClick={exportarExcel}><IconoArchivo /> Exportar Excel</button>

        </div>
      </div>

      {/* ---------- Fila 1: indicadores ---------- */}
      <section className="rep-fila">
        <article className="rep-card">
          <h3>Reporte semanal</h3>
          <p className="rep-grande">120 Citas <span className="rep-sube">▲ +10</span></p>
          <p className="rep-nota">+10 (vs. previous week)</p>
        </article>

        <article className="rep-card">
          <h3>Emergencias atendidas</h3>
          <p className="rep-grande">15 Emergencias <span className="rep-sube">▲ +3</span></p>
          <p className="rep-nota">+3</p>
        </article>

        <article className="rep-card">
          <h3>Cumplimiento de tratamientos</h3>
          <div className="rep-cumplimiento">
            <p className="rep-grande">80%</p>
            <div className="rep-barra"><div style={{ width: "80%" }}></div></div>
          </div>
          <p className="rep-nota">15% higher than target</p>
        </article>
      </section>

      {/* ---------- Fila 2: gráficas ---------- */}
      <section className="rep-fila">
        {/* Torta */}
        <article className="rep-card">
          <h3>Estado de pacientes</h3>
          <div className="rep-torta-fila">
            <div className="rep-torta" style={{ background: gradiente }}>
              {trozos.map((t) => (
                <span key={t.nombre} style={{ left: `${t.x}%`, top: `${t.y}%` }}>
                  {t.valor}%
                </span>
              ))}
            </div>
            <div className="rep-leyenda-v">
              {estadoPacientes.map((e) => (
                <span key={e.nombre}>
                  <i style={{ background: e.color }}></i>
                  {e.nombre}
                </span>
              ))}
            </div>
          </div>
        </article>

        {/* Barras */}
        <article className="rep-card">
          <h3>Uso de servicios por especialidad</h3>
          <div className="rep-barras">
            <div className="rep-barras-eje">
              {marcasBarras.map((n) => <span key={n}>{n}</span>)}
            </div>
            <div className="rep-barras-cuerpo">
              <div className="rep-barras-area">
                {usoServicios.map((s) => (
                  <div className="rep-barra-col" key={s.nombre}>
                    <div
                      className="rep-barra-v"
                      style={{ height: `${(s.valor / MAX_BARRAS) * 100}%`, background: s.color }}
                    ></div>
                  </div>
                ))}
              </div>
              <div className="rep-barras-etiquetas">
                {usoServicios.map((s) => <span key={s.nombre}>{s.nombre}</span>)}
              </div>
            </div>
          </div>
        </article>

        {/* Líneas */}
        <article className="rep-card">
          <h3>Alertas atendidas en el tiempo</h3>
          <div className="rep-leyenda-h">
            {series.filter((s) => s.leyenda).map((s) => (
              <span key={s.nombre}>
                <i className="rep-linea-ico" style={{ background: s.color }}></i>
                {s.nombre}
              </span>
            ))}
          </div>

          <svg viewBox={`0 0 ${W} ${H}`} className="rep-linea-svg">
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

      {/* ---------- Tabla ---------- */}
      <section className="rep-card">
        <h3>Planes de tratamiento activos</h3>
        <table className="rep-tabla">
          <thead>
            <tr>
              <th>Paciente</th>
              <th>Especialidad</th>
              <th>Avance</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {planes.map((p) => (
              <tr key={p.id}>
                <td>{p.paciente}</td>
                <td>{p.especialidad}</td>
                <td>
                  <div className="rep-avance">
                    <div className="rep-barra"><div style={{ width: `${p.avance}%` }}></div></div>
                    <span>{p.avance}%</span>
                  </div>
                </td>
                <td><span className="rep-estado">{p.estado}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default ReportesGenerados;