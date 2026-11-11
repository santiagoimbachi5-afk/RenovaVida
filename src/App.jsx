import { Fragment, useState } from "react";
import "./App.css";
import "./Emergencias.css";
import "./Solicitudes.css";
import "./Planes.css";
import "./Tema.css";

function App() {
  const [opcion, setOpcion] = useState("perfil");
  const [mensaje, setMensaje] = useState("");
  const [emergencias, setEmergencias] = useState([
    {
      id: 1,
      paciente: "María Fernanda López",
      documento: "1.023.456.789",
      motivo: "Dificultad respiratoria",
      fecha: "28/10/2026 · 11:42",
      estado: "Pendiente",
      detalles: "La paciente reporta dificultad para respirar y solicita atención prioritaria.",
    },
    {
      id: 2,
      paciente: "Carlos Andrés Ramírez",
      documento: "79.456.123",
      motivo: "Dolor torácico",
      fecha: "28/10/2026 · 11:18",
      estado: "En proceso",
      detalles: "Dolor en el pecho iniciado hace aproximadamente 20 minutos.",
    },
    {
      id: 3,
      paciente: "Luisa Fernanda Gómez",
      documento: "1.098.765.432",
      motivo: "Caída y lesión",
      fecha: "28/10/2026 · 10:56",
      estado: "Pendiente",
      detalles: "Caída en el hogar con posible lesión en una extremidad.",
    },
    {
      id: 4,
      paciente: "Jorge Eliécer Torres",
      documento: "16.789.456",
      motivo: "Reacción alérgica",
      fecha: "28/10/2026 · 10:30",
      estado: "Atendido",
      detalles: "Reacción alérgica atendida por el equipo de salud.",
    },
  ]);
  const [emergenciaDetalle, setEmergenciaDetalle] = useState(null);
  const [cita, setCita] = useState({
    paciente: "", telefono: "", fecha: "", servicio: "", motivo: ""
  });
  const [solicitudes, setSolicitudes] = useState([
    {
      id: 1,
      tipo: "Agendamiento de cita",
      prioridad: "Alta",
      usuario: "Ana María Pérez · 1.032.456.789",
      contacto: "ana.perez@email.com · 300 456 7890",
      descripcion: "Solicita una cita prioritaria con medicina general por malestar persistente.",
      estado: "Pendiente",
    },
    {
      id: 2,
      tipo: "Certificado médico",
      prioridad: "Media",
      usuario: "Diego Fernando Ruiz · 79.456.123",
      contacto: "diego.ruiz@email.com",
      descripcion: "Requiere copia digital de su certificado de atención del mes de octubre.",
      estado: "En proceso",
    },
    {
      id: 3,
      tipo: "Reclamo de servicio",
      prioridad: "Alta",
      usuario: "Laura Camila Rojas · 1.098.765.432",
      contacto: "310 765 4321",
      descripcion: "Informa demoras para recibir respuesta sobre la autorización de un tratamiento.",
      estado: "Pendiente",
    },
    {
      id: 4,
      tipo: "Actualización de datos",
      prioridad: "Baja",
      usuario: "Jorge Iván Mora · 16.789.456",
      contacto: "jorge.mora@email.com",
      descripcion: "Solicita actualizar su número telefónico de contacto.",
      estado: "Resuelto",
    },
  ]);

  function cambiarOpcion(nombre) {
    setOpcion(nombre);
    setMensaje("");
  }

  function generarCita(e) {
    e.preventDefault();
    setMensaje("Cita creada correctamente. Código: CITA-001. Se notificará al paciente.");
  }

  function cambiarEstadoEmergencia(id) {
    setEmergencias((actuales) =>
      actuales.map((emergencia) => {
        if (emergencia.id !== id) return emergencia;

        return {
          ...emergencia,
          estado: emergencia.estado === "Pendiente" ? "En proceso" : "Atendido",
        };
      }),
    );
  }

  function cambiarEstadoSolicitud(id) {
    setSolicitudes((actuales) =>
      actuales.map((solicitud) => {
        if (solicitud.id !== id) return solicitud;

        return {
          ...solicitud,
          estado: solicitud.estado === "Pendiente" ? "En proceso" : "Resuelto",
        };
      }),
    );
  }

  function planAccion(accion) {
    setMensaje(`Solicitud de ${accion} registrada correctamente.`);
  }

  const menu = [
    ["perfil", "◉", "Perfil de usuario"],
    ["reportes", "▣", "Generar reportes"],
    ["citas", "▦", "Programar citas"],
    ["emergencias", "!", "Atender emergencias"],
    ["solicitudes", "✉", "Solicitudes de usuario"],
    ["planes", "✓", "Planes de tratamiento"],
  ];

  return (
    <main className="pagina">
      <aside className="menu">
        <header className="marca">
          <section className="logo">RV</section>
          <section>
            <h1>RenovaVida</h1>
            <p>Gestión de salud</p>
          </section>
        </header>

        <section className="entidad">
          <span className="estado"></span>
          <section>
            <strong>Entidad de Salud</strong>
            <small>Panel administrativo</small>
          </section>
        </section>

        <nav className="navegacion" aria-label="Menú principal">
          <p className="titulo-menu">MENÚ PRINCIPAL</p>
          {menu.map(([id, icono, texto]) => (
            <button
              key={id}
              className={opcion === id ? "menu-activo" : ""}
              onClick={() => cambiarOpcion(id)}
            >
              <span className="icono">{icono}</span>
              {texto}
            </button>
          ))}
        </nav>

        <footer className="menu-footer">
          <button className="cerrar" onClick={() => setMensaje("Sesión cerrada correctamente.")}>
            ↩ Cerrar sesión
          </button>
        </footer>
      </aside>

      <section className="contenido">
        <header className="barra-superior">
          <section>
            <span className="ruta">RenovaVida / Entidades de Salud</span>
            <h2>
              {opcion === "perfil" && "Perfil de usuario"}
              {opcion === "reportes" && "Generar reportes"}
              {opcion === "citas" && "Programar citas"}
              {opcion === "emergencias" && "Atender emergencias"}
              {opcion === "inicio" && "Inicio de sesión"}
              {opcion === "solicitudes" && "Solicitudes de usuario"}
              {opcion === "planes" && "Planes de tratamiento"}
            </h2>
          </section>
          <section className="usuario">
            <span className="avatar">ES</span>
            <section>
              <strong>Entidad Salud</strong>
              <small>Administrador</small>
            </section>
          </section>
        </header>

        {opcion === "perfil" && (
          <>
            <section className="bienvenida">
              <section>
                <span className="etiqueta">PANEL DE SALUD</span>
                <h3>Bienvenido a RenovaVida</h3>
                <p>Administra información, citas, solicitudes y planes de atención desde un solo lugar.</p>
              </section>
              <section className="bienvenida-icono">♥</section>
            </section>

            <section className="estadisticas">
              <article className="tarjeta">
                <span className="tarjeta-icono azul">◉</span>
                <section><small>Usuarios activos</small><strong>128</strong><em>+12% este mes</em></section>
              </article>
              <article className="tarjeta">
                <span className="tarjeta-icono verde">▦</span>
                <section><small>Citas programadas</small><strong>24</strong><em>8 para hoy</em></section>
              </article>
              <article className="tarjeta">
                <span className="tarjeta-icono naranja">!</span>
                <section><small>Solicitudes pendientes</small><strong>07</strong><em>Requieren atención</em></section>
              </article>
            </section>

            <section className="panel-grid">
              <article className="panel">
                <header className="panel-header"><section><span className="mini-etiqueta">ENTRADA</span><h3>Consultar perfil</h3></section><span>◉</span></header>
                <p>Consulta los datos de afiliación y estado del usuario.</p>
                <label>Identificador del usuario</label>
                <input type="text" placeholder="ID o número de afiliación" />
                <button className="accion" onClick={() => setMensaje("Perfil encontrado correctamente.")}>Consultar perfil</button>
              </article>

              <article className="panel perfil-card">
                <header className="panel-header"><section><span className="mini-etiqueta">SALIDA</span><h3>Información encontrada</h3></section><span>✓</span></header>
                <section className="datos">
                  <p><span>EPS</span><strong>Nueva EPS</strong></p>
                  <p><span>Estado</span><strong className="activo">Activo</strong></p>
                  <p><span>Régimen</span><strong>Subsidiado</strong></p>
                  <p><span>Afiliación</span><strong>10/02/2026</strong></p>
                  <p><span>Contacto</span><strong>contacto@eps.com</strong></p>
                </section>
              </article>
            </section>
          </>
        )}

        {opcion === "reportes" && (
          <section className="panel grande">
            <span className="mini-etiqueta">GESTIÓN DE INFORMACIÓN</span>
            <h3>Generar reportes</h3>
            <p>Seleccione el reporte que necesita consultar o descargar.</p>
            <section className="opciones-reporte">
              {["Reporte clínico", "Reporte de alertas", "Reporte de asistencia", "Tratamientos y adherencia", "Reporte estadístico"].map((r) => (
                <button key={r} className="reporte-opcion" onClick={() => setMensaje(`${r} seleccionado.`)}>
                  <span>▣</span>{r}<b>›</b>
                </button>
              ))}
            </section>
            <button className="accion" onClick={() => setMensaje("Reporte generado correctamente.")}>Generar reporte</button>
            <button className="accion secundario" onClick={() => setMensaje("Reporte preparado para descargar en PDF o Excel.")}>Descargar</button>
            {mensaje && <section className="resultado">{mensaje}</section>}
          </section>
        )}

        {opcion === "citas" && (
          <section className="panel grande">
            <span className="mini-etiqueta">PROGRAMACIÓN</span>
            <h3>Programar cita o sesión</h3>
            <p>Complete la información para registrar una nueva atención.</p>
            <form className="formulario" onSubmit={generarCita}>
              <label>ID del paciente<input value={cita.paciente} onChange={e => setCita({...cita, paciente:e.target.value})} placeholder="Ej. PAC-001" required /></label>
              <label>Teléfono o correo<input value={cita.telefono} onChange={e => setCita({...cita, telefono:e.target.value})} placeholder="Contacto" required /></label>
              <label>Fecha y hora<input type="datetime-local" value={cita.fecha} onChange={e => setCita({...cita, fecha:e.target.value})} required /></label>
              <label>Servicio<select value={cita.servicio} onChange={e => setCita({...cita, servicio:e.target.value})} required><option value="">Seleccione</option><option>Psicología</option><option>Medicina</option><option>Trabajo social</option></select></label>
              <label className="campo-completo">Motivo<textarea value={cita.motivo} onChange={e => setCita({...cita, motivo:e.target.value})} placeholder="Escriba el motivo de la atención"></textarea></label>
              <button className="accion" type="submit">Confirmar cita</button>
            </form>
            {mensaje && <section className="resultado">{mensaje}</section>}
          </section>
        )}

        {opcion === "emergencias" && (
          <section className="panel emergencias-dashboard">
            <header className="emergencias-encabezado">
              <section>
                <span className="mini-etiqueta rojo">ATENCIÓN PRIORITARIA</span>
                <h3>Emergencias recibidas</h3>
                <p>Revisa las alertas de pacientes y actualiza su estado de atención.</p>
              </section>
              <span className="emergencias-total" aria-label={`${emergencias.filter(({ estado }) => estado !== "Atendido").length} emergencias activas`}>
                <strong>{emergencias.filter(({ estado }) => estado !== "Atendido").length}</strong>
                activas
              </span>
            </header>

            <section className="tabla-emergencias-contenedor">
              <table className="tabla-emergencias">
                <thead>
                  <tr>
                    <th>Paciente</th>
                    <th>Documento</th>
                    <th>Tipo de emergencia</th>
                    <th>Fecha y hora</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {emergencias.map((emergencia) => (
                    <Fragment key={emergencia.id}>
                      <tr>
                        <td data-label="Paciente"><strong>{emergencia.paciente}</strong></td>
                        <td data-label="Documento">{emergencia.documento}</td>
                        <td data-label="Tipo de emergencia">{emergencia.motivo}</td>
                        <td data-label="Fecha y hora">{emergencia.fecha}</td>
                        <td data-label="Estado">
                          <span className={`estado-emergencia estado-${emergencia.estado.toLowerCase().replace(" ", "-")}`}>
                            {emergencia.estado}
                          </span>
                        </td>
                        <td data-label="Acciones">
                          <section className="acciones-emergencia">
                            <button
                              className="boton-detalles"
                              onClick={() => setEmergenciaDetalle(emergenciaDetalle === emergencia.id ? null : emergencia.id)}
                              aria-expanded={emergenciaDetalle === emergencia.id}
                            >
                              {emergenciaDetalle === emergencia.id ? "Ocultar" : "Ver detalles"}
                            </button>
                            {emergencia.estado !== "Atendido" && (
                              <button
                                className={`boton-atender ${emergencia.estado === "En proceso" ? "boton-finalizar" : ""}`}
                                onClick={() => cambiarEstadoEmergencia(emergencia.id)}
                              >
                                {emergencia.estado === "Pendiente" ? "Atender" : "Finalizar"}
                              </button>
                            )}
                          </section>
                        </td>
                      </tr>
                      {emergenciaDetalle === emergencia.id && (
                        <tr className="fila-detalle">
                          <td colSpan="6"><strong>Detalle de la alerta:</strong> {emergencia.detalles}</td>
                        </tr>
                      )}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </section>
          </section>
        )}

        {opcion === "inicio" && (
          <section className="login-panel">
            <section className="login-marca"><span>RV</span><h3>RenovaVida</h3><p>Acceso para entidades de salud</p></section>
            <form onSubmit={e => {e.preventDefault(); setMensaje("Inicio de sesión correcto. Bienvenido a RenovaVida.");}}>
              <label>Correo, documento o afiliación<input placeholder="Ingrese su identificador" required /></label>
              <label>Contraseña<input type="password" placeholder="Ingrese su contraseña" required /></label>
              <button className="accion" type="submit">Iniciar sesión</button>
            </form>
            {mensaje && <section className="resultado">{mensaje}</section>}
          </section>
        )}

        {opcion === "solicitudes" && (
          <section className="panel solicitudes-dashboard">
            <header className="solicitudes-encabezado">
              <section>
                <span className="mini-etiqueta">ATENCIÓN AL USUARIO</span>
                <h3>Bandeja de solicitudes</h3>
                <p>Consulta y gestiona las solicitudes recibidas de los usuarios.</p>
              </section>
              <span className="solicitudes-total">
                <strong>{solicitudes.filter(({ estado }) => estado !== "Resuelto").length}</strong>
                por atender
              </span>
            </header>

            <section className="tabla-solicitudes-contenedor">
              <table className="tabla-solicitudes">
                <thead>
                  <tr>
                    <th>Solicitud</th>
                    <th>Prioridad</th>
                    <th>Usuario y contacto</th>
                    <th>Descripción</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {solicitudes.map((solicitud) => (
                    <tr key={solicitud.id}>
                      <td data-label="Solicitud"><strong>{solicitud.tipo}</strong></td>
                      <td data-label="Prioridad">
                        <span className={`prioridad-solicitud prioridad-${solicitud.prioridad.toLowerCase()}`}>
                          {solicitud.prioridad}
                        </span>
                      </td>
                      <td data-label="Usuario y contacto">
                        <strong>{solicitud.usuario}</strong>
                        <small>{solicitud.contacto}</small>
                      </td>
                      <td data-label="Descripción" className="descripcion-solicitud">{solicitud.descripcion}</td>
                      <td data-label="Estado">
                        <span className={`estado-solicitud estado-solicitud-${solicitud.estado.toLowerCase().replace(" ", "-")}`}>
                          {solicitud.estado}
                        </span>
                      </td>
                      <td data-label="Acciones">
                        {solicitud.estado !== "Resuelto" && (
                          <button
                            className={`accion-solicitud ${solicitud.estado === "En proceso" ? "accion-resolver" : ""}`}
                            onClick={() => cambiarEstadoSolicitud(solicitud.id)}
                          >
                            {solicitud.estado === "Pendiente" ? "Atender" : "Marcar resuelto"}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </section>
        )}

        {opcion === "planes" && (
          <section className="panel grande">
            <span className="mini-etiqueta">SEGUIMIENTO</span>
            <h3>Gestión de plan de tratamiento</h3>
            <p>Consulte el avance y gestione las acciones disponibles.</p>
            <article className="plan">
              <header><section><span className="avatar paciente">ER</span><section><h4>Elena Rodríguez</h4><small>Plan de tratamiento · Activo</small></section></section><span className="plan-estado plan-estado-activo">Activo</span></header>
              <section className="acciones-plan">
                <button onClick={() => planAccion("modificación")}>Modificar</button>
                <button onClick={() => planAccion("suspensión")}>Suspender</button>
                <button onClick={() => planAccion("finalización")}>Finalizar</button>
                <button onClick={() => planAccion("reemplazo")}>Reemplazar</button>
              </section>
            </article>
            {mensaje && <section className="resultado">{mensaje}</section>}
          </section>
        )}

        <footer className="pie">RenovaVida · Plataforma de gestión para entidades de salud · 2026</footer>
      </section>
    </main>
  );
}

export default App;
