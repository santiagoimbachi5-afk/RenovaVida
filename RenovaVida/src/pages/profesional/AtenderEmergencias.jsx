import "../../styles/emergencias.css";

const emergencias = [
  {
    id: 1, paciente: "María Gómez", ubicacion: "Sala 3",
    estado: "Atendiendo", progreso: 40, etapa: "En atención",
    prioridad: "alta", profesional: "Dr. Ramírez",
    recursos: "Consultorio 1, Kit Emergencia A",
  },
  {
    id: 2, paciente: "Pedro Pérez", ubicacion: "Cualificación Triage 1",
    estado: "Triage en curso", progreso: null, etapa: null,
    prioridad: "media", profesional: "Enf. Ana Sosa",
    recursos: "Consultorio 2",
  },
  {
    id: 3, paciente: "Laura Rojas", ubicacion: "Cualificación Triage 2",
    estado: "Triage en curso", progreso: null, etapa: null,
    prioridad: "alta", profesional: "Enf. Ana Sosa",
    recursos: "Sala de observación",
  },
  {
    id: 4, paciente: "Carlos Díaz", ubicacion: "Sala de espera",
    estado: "En espera", progreso: null, etapa: null,
    prioridad: "baja", profesional: "Por asignar",
    recursos: "Pendiente",
  },
];

const disponibles = [
  { id: 1, nombre: "Dr. Carlos Ruiz", especialidad: "Cardiología" },
  { id: 2, nombre: "Dr. Ana López", especialidad: "Ana Sosa" },
  { id: 3, nombre: "Dr. Pedro Pinto", especialidad: "Medicina General" },
];

const recursos = [
  { nombre: "Camas", estado: "Disponible", clase: "verde" },
  { nombre: "Consultorios", estado: "Ocupado", clase: "rojo" },
  { nombre: "Equipos", estado: "Mantenimiento", clase: "gris" },
];

const notificaciones = [
  "Alerta: Paciente 145 - Paro detectado - Ver detalles",
  "Alerta: Paciente 145 - Paro detectado - Ver detalles",
  "Alerta: Paciente 145 - Paro detectado - Ver detalles",
];

const textoPrioridad = { alta: "ALTA", media: "MEDIA", baja: "BAJA" };

function AtenderEmergencias() {
  // Los contadores se calculan solos a partir de la lista
  const total = emergencias.length;
  const altas = emergencias.filter((e) => e.prioridad === "alta").length;
  const medias = emergencias.filter((e) => e.prioridad === "media").length;
  const bajas = emergencias.filter((e) => e.prioridad === "baja").length;

  return (
    <div className="em">
      {/* ---------- Columna principal ---------- */}
      <section className="tarjeta em-principal">
        <div className="em-top">
          <h3>GESTIÓN DE EMERGENCIAS Y TRIAGE</h3>
          <button className="em-btn-rojo">+ Nueva Emergencia</button>
        </div>

        <h4 className="em-subtitulo">RESUMEN DE ALERTAS EN TIEMPO REAL</h4>
        <div className="em-resumen">
          <div className="em-caja em-total">
            <span>EMERGENCIAS ACTIVAS</span>
            <strong>{total}</strong>
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

        <div className="em-lista-top">
          <h4 className="em-subtitulo">LISTA DE EMERGENCIAS ACTIVAS</h4>
          <small>Última actualización: 2 mins ago</small>
        </div>

        <div className="em-lista">
          {emergencias.map((e) => (
            <div className={`em-fila em-borde-${e.prioridad}`} key={e.id}>
              <span className="em-num">{e.id}</span>

              <div className="em-dato">
                <small>PACIENTE:</small>
                <b>{e.paciente}</b>
              </div>

              <div className="em-dato">
                <small>UBICACIÓN:</small>
                <b>{e.ubicacion}</b>
              </div>

              <div className="em-dato">
                <small>ESTADO:</small>
                <b>{e.estado}</b>
                {e.progreso && (
                  <div className="em-barra">
                    <div style={{ width: `${e.progreso}%` }}></div>
                  </div>
                )}
                {e.etapa && <span className="em-etapa">{e.etapa}</span>}
              </div>

              <div className="em-dato">
                <small>PRIORIDAD:</small>
                <span className={`em-prioridad em-${e.prioridad}`}>
                  {textoPrioridad[e.prioridad]}
                </span>
              </div>

              <div className="em-dato">
                <small>PROFESIONAL:</small>
                <b>{e.profesional}</b>
              </div>

              <div className="em-dato">
                <small>RECURSOS:</small>
                <b>{e.recursos}</b>
              </div>

              <div className="em-accion">
                <small>Última actualización: 2 mins ago</small>
                <button className="btn-oscuro">Actualizar Estado</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Columna derecha ---------- */}
      <aside className="em-lateral">
        <article className="tarjeta">
          <h3>PROFESIONALES DE EMERGENCIA DISPONIBLES</h3>
          <small className="em-ordenado">Sorteando por proximidad ⌄</small>

          <div className="em-cabecera-mini">
            <span>Proximidad y disponibilidad</span>
            <span>Instante</span>
          </div>

          {disponibles.map((d) => (
            <div className="em-disponible" key={d.id}>
              <div className="foto"></div>
              <div className="profesional-datos">
                <b>{d.nombre}</b>
                <small>{d.especialidad}</small>
              </div>
              <button className="btn-oscuro">Asignar</button>
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
          {notificaciones.map((n, i) => (
            <p className="em-notif" key={i}>
              <i className="em-punto-rojo"></i> {n}
            </p>
          ))}
        </article>
      </aside>
    </div>
  );
}

export default AtenderEmergencias;