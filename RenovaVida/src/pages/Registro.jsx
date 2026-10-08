import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Registro.css";

function Registro() {
  const navigate = useNavigate();

  const [datos, setDatos] = useState({
    correo: "",
    contrasena: "",
    confirmar: "",
    genero: "",
    telefono: "",
    nacimiento: "",
  });
  const [error, setError] = useState("");

  // Una sola función para todos los campos, usa el atributo name
  const cambiar = (e) => {
    setDatos({ ...datos, [e.target.name]: e.target.value });
  };

  const registrar = (e) => {
    e.preventDefault();
    setError("");

    if (datos.contrasena.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    if (datos.contrasena !== datos.confirmar) {
      setError("Las contraseñas no coinciden");
      return;
    }

    // Aquí irá el fetch al backend más adelante
    console.log("Datos a enviar:", datos);

    navigate("/iniciar-sesion");
  };

  return (
    <div className="registro-pagina">
      <main className="registro-main">
        <h1 className="registro-titulo">
          Renova<span>Vida</span>
        </h1>

        <form className="registro-form" onSubmit={registrar}>
          <h2>Regístrate con nosotros</h2>

          <input
            type="email"
            name="correo"
            placeholder="Correo Electrónico"
            value={datos.correo}
            onChange={cambiar}
            required
          />
          <input
            type="password"
            name="contrasena"
            placeholder="Contraseña"
            value={datos.contrasena}
            onChange={cambiar}
            required
          />
          <input
            type="password"
            name="confirmar"
            placeholder="Vuelve a escribir la contraseña"
            value={datos.confirmar}
            onChange={cambiar}
            required
          />

          <select
            name="genero"
            value={datos.genero}
            onChange={cambiar}
            required
          >
            <option value="" disabled>Género</option>
            <option value="femenino">Femenino</option>
            <option value="masculino">Masculino</option>
            <option value="otro">Otro</option>
            <option value="prefiero-no-decir">Prefiero no decir</option>
          </select>

          <input
            type="tel"
            name="telefono"
            placeholder="Número de Contacto"
            value={datos.telefono}
            onChange={cambiar}
            required
          />

          <input
            type="text"
            name="nacimiento"
            placeholder="Fecha de Nacimiento"
            value={datos.nacimiento}
            onChange={cambiar}
            onFocus={(e) => (e.target.type = "date")}
            onBlur={(e) => {
              if (!e.target.value) e.target.type = "text";
            }}
            required
          />

          {error && <p className="registro-error">{error}</p>}

          <button type="submit" className="registro-boton">
            Registrarse
          </button>
        </form>
      </main>
    </div>
  );
}

export default Registro;