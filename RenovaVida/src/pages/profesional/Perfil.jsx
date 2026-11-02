const profesionales = [
  { id: 1, nombre: "Dr. Carlos Ruiz", especialidad: "Cardiología", estado: "Activado" },
  { id: 2, nombre: "Dr. Carlos Ruiz", especialidad: "Cardiología", estado: "Activado" },
  { id: 3, nombre: "Dr. Carlos Ruiz", especialidad: "Cardiología", estado: "Activado" },
  { id: 4, nombre: "Dr. Carlos Ruiz", especialidad: "Cardiología", estado: "Activado" },
];

const servicios = [
  { id: 1, servicio: "C.General", profesional: "Dr.Carlos", fecha: "01-Oct-2026", paciente: "Jose Gregorio" },
  { id: 2, servicio: "C.General", profesional: "Dr.Perez", fecha: "20-Oct-2026", paciente: "Elena Gomez" },
  { id: 3, servicio: "C.General", profesional: "Dra.Juana", fecha: "22-Oct-2026", paciente: "Laura Iplales" },
  { id: 4, servicio: "C.General", profesional: "Dr.Castillo", fecha: "22-Sep-2026", paciente: "Jose Gregorio" },
];

function Perfil() {
  return (
    <div className="perfil">
      {/* ---------- Tarjetas de arriba ---------- */}
      <section className="tarjetas">
        <article className="tarjeta">
          <h3>RenovaVida</h3>
          <small>Atención y prevención</small>
          <p><b>Dirección:</b></p>
          <p><b>Teléfono:</b></p>
          <p><b>Correo:</b></p>
          <p><b>Horario:</b> Lun - Sab 7:00 AM - 9:00 PM</p>
        </article>

        <article className="tarjeta">
          <h3>Especialidades: 4</h3>
          <p>Medicina General, pediatría, Urgencias</p>
        </article>

        <div className="tarjetas-numeros">
          <article className="tarjeta tarjeta-numero">
            <span>Profesionales</span>
            <strong>25</strong>
            <span>Activos</span>
          </article>

          <article className="tarjeta tarjeta-numero">
            <span>Pacientes Registrados</span>
            <strong>320</strong>
          </article>

          <article className="tarjeta tarjeta-numero">
            <span>Servicios Prestados</span>
            <strong>1,200</strong>
          </article>
        </div>
      </section>

      {/* ---------- Listas de abajo ---------- */}
      <section className="listas">
        <article className="tarjeta">
          <h3>PROFESIONALES ACTIVOS</h3>

          <div className="filtros">
            <input type="text" placeholder="Buscar Profesionales" />
            <button>Especialidad</button>
          </div>

          {profesionales.map((p) => (
            <div className="profesional" key={p.id}>
              <div className="foto"></div>
              <div className="profesional-datos">
                <b>{p.nombre}</b>
                <small>{p.especialidad}</small>
              </div>
              <span>{p.especialidad}</span>
              <span className="estado">{p.estado}</span>
              <span>...</span>
            </div>
          ))}

          <a href="#" className="ver-mas">Ver todos los profesionales</a>
        </article>

        <article className="tarjeta">
          <h3>HISTORIAL DE SERVICIOS PRESTADOS</h3>

          <div className="filtros">
            <button>Recent Actividad : Oct 20,2026 - Oct 20,2026</button>
            <button>Especialidad</button>
          </div>

          <table>
            <thead>
              <tr>
                <th>Servicio</th>
                <th>Profesional</th>
                <th>Fecha</th>
                <th>Paciente</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {servicios.map((s) => (
                <tr key={s.id}>
                  <td>{s.servicio}</td>
                  <td>{s.profesional}</td>
                  <td>{s.fecha}</td>
                  <td>{s.paciente}</td>
                  <td>✏️ 🗑️</td>
                </tr>
              ))}
            </tbody>
          </table>

          <a href="#" className="ver-mas">Ver historial Completo</a>
        </article>
      </section>
    </div>
  );
}


export default Perfil;