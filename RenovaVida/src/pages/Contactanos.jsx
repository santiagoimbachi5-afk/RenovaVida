import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Contactanos.css";

function Contactanos() {
  const [datos, setDatos] = useState({
    nombre: "",
    correo: "",
    telefono: "",
    motivo: "",
  });
  const [error, setError] = useState("");
  const [enviado, setEnviado] = useState(false);

  const cambiar = (e) => {
    setDatos({ ...datos, [e.target.name]: e.target.value });
  };

  const enviar = (e) => {
    e.preventDefault();
    setError("");
    setEnviado(false);

    if (!datos.nombre || !datos.correo || !datos.motivo) {
      setError("Completa tu nombre, tu correo y el motivo de consulta");
      return;
    }

    // Aquí irá el fetch al backend más adelante
    console.log("Mensaje de contacto:", datos);

    setEnviado(true);
    setDatos({ nombre: "", correo: "", telefono: "", motivo: "" });
  };

  return (
    <div className="contacto-pagina">
      <main className="contacto-main">
        <h1 className="contacto-titulo">
          Renova<span>Vida</span>
        </h1>

        <form className="contacto-form" onSubmit={enviar}>
          <h2>Contactanos</h2>

          <input
            type="text"
            name="nombre"
            placeholder="Nombre Completo"
            value={datos.nombre}
            onChange={cambiar}
          />
          <input
            type="email"
            name="correo"
            placeholder="Correo electronico"
            value={datos.correo}
            onChange={cambiar}
          />
          <input
            type="tel"
            name="telefono"
            placeholder="Telefono"
            value={datos.telefono}
            onChange={cambiar}
          />
          <textarea
            name="motivo"
            placeholder="Motivo de consulta..."
            value={datos.motivo}
            onChange={cambiar}
          />

          {error && <p className="contacto-error">{error}</p>}
          {enviado && (
            <p className="contacto-exito">¡Mensaje enviado! Te responderemos pronto.</p>
          )}

          <button type="submit" className="contacto-boton">
            Enviar
          </button>
        </form>

        <Link to="/politica-de-privacidad" className="contacto-politica">
          Política de Privacidad
        </Link>
      </main>
    </div>
  );
}

export default Contactanos;