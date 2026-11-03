const horas = [
  "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM",
];

// tipo: libre | verde | azul | rojo
const columnas = [
  {
    nombre: "Dr. Carlos Ruiz", detalle: "Cardiología",
    celdas: [
      { tipo: "libre" }, { tipo: "libre" },
      { tipo: "verde", texto: "9:00 AM" },
      { tipo: "verde", texto: "11:30 AM" },
      { tipo: "azul", texto: "Consulta" },
      { tipo: "azul", texto: "1:00 PM" },
      { tipo: "libre" }, { tipo: "libre" },
      { tipo: "verde", texto: "4:00 PM" },
      { tipo: "libre" },
    ],
  },
  {
    nombre: "Dra. Ana López", detalle: "Pediatría",
    celdas: [
      { tipo: "libre" }, { tipo: "libre" },
      { tipo: "azul", texto: "10:00 AM Pediatría" },
      { tipo: "libre" },
      { tipo: "azul", texto: "11:30 Pediatría" },
      { tipo: "libre" },
      { tipo: "azul", texto: "2:00 PM Pediatría" },
      { tipo: "libre" },
      { tipo: "verde", texto: "4:00 PM" },
      { tipo: "libre" },
    ],
  },
  {
    nombre: "Dr. Luis Gómez", detalle: "Odontología",
    celdas: [
      { tipo: "libre" }, { tipo: "libre" },
      {
        tipo: "verde",
        texto: "10:00 AM",
        info: {
          paciente: "JUAN PÉREZ",
          especialidad: "ODONTOLOGÍA",
          hora: "10:00 AM - 11:00 AM",
          profesional: "DR. RAMÍREZ (Auto-Asignado)",
          consultorio: "DENTAL 1",
          equipo: "KIT ODONTOLÓGICO BÁSICO",
        },
      },
      { tipo: "libre" }, { tipo: "libre" },
      { tipo: "rojo", texto: "Conflicto" },
      { tipo: "rojo", texto: "2:00 PM Conflicto" },
      { tipo: "libre" },
      { tipo: "azul", texto: "5:00 PM" },
      { tipo: "libre" },
    ],
  },
  {
    nombre: "Recursos", detalle: "Consultorio 3A",
    celdas: [
      { tipo: "libre" },
      { tipo: "libre", texto: "Consultorio 2B" },
      { tipo: "verde", texto: "Consultorio Dental 1" },
      { tipo: "libre" }, { tipo: "libre" },
      { tipo: "rojo", texto: "Mantenimiento" },
      { tipo: "azul", texto: "Equipo Ecografía 1" },
      { tipo: "libre" }, { tipo: "libre" }, { tipo: "libre" },
    ],
  },
];

const recursos = [
  { nombre: "Consultorios 3A", estado: "Disponible", clase: "verde" },
  { nombre: "Equipos", estado: "Ocupado", clase: "rojo" },
  { nombre: "Consultorio Dental 1", estado: "Mantenimiento", clase: "gris" },
];

function ProgramacionCitas() {
  return (
    <div className="citas">
      {/* ---------- Calendario ---------- */}
      <section className="tarjeta calendario">
        <div className="calendario-top">
          <h3>GESTIÓN DE CITAS Y RECURSOS</h3>
          <div className="calendario-acciones">
            <button className="btn-claro">Especialidad</button>
            <button className="btn-oscuro">+ Nueva Cita</button>
          </div>
        </div>

        <div className="leyenda">
          <span><i className="punto libre"></i> Libre</span>
          <span><i className="punto verde"></i> Confirmada</span>
          <span><i className="punto azul"></i> En curso</span>
          <span><i className="punto rojo"></i> Conflicto</span>
        </div>

        <div className="grilla">
          {/* Fila de encabezados */}
          <div className="grilla-cabecera"></div>
          {columnas.map((col) => (
            <div className="grilla-cabecera" key={col.nombre}>
              <b>{col.nombre}</b>
              <small>{col.detalle}</small>
            </div>
          ))}

          {/* Una fila por cada hora */}
          {horas.map((hora, i) => (
            <div className="grilla-fila" key={hora}>
              <div className="grilla-hora">{hora}</div>
              {columnas.map((col) => {
                const celda = col.celdas[i];
                return (
                  <div className={`celda ${celda.tipo}`} key={col.nombre}>
                    {celda.texto}

                    {celda.info && (
                      <div className="detalle-cita">
                        <p><b>PACIENTE:</b> {celda.info.paciente}</p>
                        <p><b>ESPECIALIDAD:</b> {celda.info.especialidad}</p>
                        <p>{celda.info.hora}</p>
                        <p><b>PROFESIONAL:</b> {celda.info.profesional}</p>
                        <p><b>CONSULTORIO:</b> {celda.info.consultorio}</p>
                        <p><b>EQUIPO:</b> {celda.info.equipo}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Columna derecha ---------- */}
      <aside className="citas-lateral">
        <article className="tarjeta">
          <h3>PROFESIONALES & ESPECIALIDADES</h3>
          <div className="filtros">
            <input type="text" placeholder="Buscar profesion..." />
            <button>Filtro</button>
          </div>
          <div className="profesional">
            <div className="foto"></div>
            <div className="profesional-datos">
              <b>Dr. Carlos Ruiz</b>
              <small>Cardiología</small>
            </div>
            <span></span>
            <span className="estado">Activado</span>
            <span>...</span>
          </div>
        </article>

        <article className="tarjeta">
          <h3>RECURSOS FÍSICOS</h3>
          {recursos.map((r) => (
            <div className="recurso" key={r.nombre}>
              <span>{r.nombre}</span>
              <span className={`etiqueta ${r.clase}`}>{r.estado}</span>
            </div>
          ))}
        </article>

        <article className="tarjeta">
          <h3>VALIDACIÓN AUTOMÁTICA</h3>
          <p>🔴 Conflicto Consultorio: 1 detectable en 14:00</p>
          <p>🟠 Conflicto Consultorio: 1 detectable en 14:00</p>
        </article>

        <article className="tarjeta">
          <button className="btn-oscuro ancho">Nueva Cita</button>
          <p>Filtro rápido:</p>
          <div className="filtros">
            <select><option>Disponible</option></select>
            <select><option>Ocupado</option></select>
          </div>
        </article>
      </aside>
    </div>
  );
}

export default ProgramacionCitas;