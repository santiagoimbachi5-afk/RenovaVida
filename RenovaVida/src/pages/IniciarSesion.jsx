import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/IniciarSesion.css";

function IniciarSesion() {
  const navigate = useNavigate();

  const [datos, setDatos] = useState({
    correo: "",
    contrasena: "",
    novedades: false,
  });
  const [error, setError] = useState("");

  const cambiar = (e) => {
    const { name, value, type, checked } = e.target;
    setDatos({
      ...datos,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const entrar = (e) => {
    e.preventDefault();
    setError("");

    if (!datos.correo || !datos.contrasena) {
      setError("Escribe tu correo y tu contraseña");
      return;
    }

    // Aquí irá el fetch al backend más adelante
    console.log("Datos de inicio de sesión:", datos);

    navigate("/");
  };

  return (
    <div className="sesion-pagina">
      <main className="sesion-main">
        <h1 className="sesion-titulo">
          Renova<span>Vida</span>
        </h1>

        <form className="sesion-form" onSubmit={entrar}>
          <h2>Iniciar Sesión</h2>

          <input
            type="email"
            name="correo"
            placeholder="Correo Electrónico"
            value={datos.correo}
            onChange={cambiar}
          />
          <input
            type="password"
            name="contrasena"
            placeholder="Contraseña"
            value={datos.contrasena}
            onChange={cambiar}
          />

          <label className="sesion-check">
            <input
              type="checkbox"
              name="novedades"
              checked={datos.novedades}
              onChange={cambiar}
            />
            Envíame novedades y ofertas por correo electrónico
          </label>

          <Link to="/registro" className="sesion-registro">
            Regístrate
          </Link>

          {error && <p className="sesion-error">{error}</p>}

          <button type="submit" className="sesion-boton">
            Entrar
          </button>
        </form>

        <Link to="/politica-de-privacidad" className="sesion-politica">
          Política de Privacidad
        </Link>
      </main>
    </div>
  );
}

export default IniciarSesion;