import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { pasos } from "../data/pasosIntereses.js";
import Icono from "../components/intereses/Icono.jsx";
import "../styles/intereses.css";

// Para mostrar el nombre de cada opción elegida en la pantalla final
const todasLasOpciones = pasos.flatMap((p) => p.opciones);

function etiquetaDe(id) {
  const opcion = todasLasOpciones.find((o) => o.id === id);
  return opcion ? opcion.etiqueta : id;
}

function Encabezado() {
  return (
    <header className="int-top">
      <h2 className="int-marca">
        <span className="int-renova">Renova</span>
        <span className="int-vida">Vida</span>
      </h2>
      <Link to="/" className="int-salir">Salir</Link>
    </header>
  );
}

function Intereses() {
  const navigate = useNavigate();

  const [indice, setIndice] = useState(0); // en qué paso va
  const [respuestas, setRespuestas] = useState({}); // { categorias: ["musica", "cine"] }
  const [terminado, setTerminado] = useState(false);

  const paso = pasos[indice];
  const elegidas = respuestas[paso.id] || [];
  const esUltimo = indice === pasos.length - 1;
  const puedeContinuar = elegidas.length >= paso.minimo;
  const porcentaje = ((indice + 1) / pasos.length) * 100;

  // Marca o desmarca una tarjeta
  const alternar = (opcionId) => {
    const nuevas = elegidas.includes(opcionId)
      ? elegidas.filter((o) => o !== opcionId)
      : [...elegidas, opcionId];

    setRespuestas({ ...respuestas, [paso.id]: nuevas });
  };

  const finalizar = (todas) => {
    // Aquí irá el fetch al backend más adelante
    console.log("Intereses del registro:", todas);
    setTerminado(true);
  };

  const avanzar = (actuales) => {
    if (esUltimo) {
      finalizar(actuales);
    } else {
      setIndice(indice + 1);
    }
  };

  const continuar = () => avanzar(respuestas);

  const omitir = () => {
    const nuevas = { ...respuestas, [paso.id]: [] };
    setRespuestas(nuevas);
    avanzar(nuevas);
  };

  /* ---------- Pantalla final ---------- */
  if (terminado) {
    const todasElegidas = Object.values(respuestas).flat();

    return (
      <div className="int">
        <Encabezado />
        <main className="int-cuerpo">
          <section className="int-izq">
            <h1>¡Gracias por contarnos!</h1>
            <p>
              Ya tenemos una idea de lo que te gusta. Con esto vamos a darte una
              experiencia más cercana a ti. Puedes cambiar tus gustos cuando quieras.
            </p>
            <div className="int-botones">
              <button className="int-btn" onClick={() => navigate("/iniciar-sesion")}>
                Ir a iniciar sesión
              </button>
            </div>
          </section>

          <section className="int-der">
            {todasElegidas.length > 0 ? (
              <div className="int-chips">
                {todasElegidas.map((id) => (
                  <span className="int-chip" key={id}>{etiquetaDe(id)}</span>
                ))}
              </div>
            ) : (
              <p className="int-vacio">
                No elegiste ningún gusto por ahora. Podrás hacerlo más adelante desde tu perfil.
              </p>
            )}
          </section>
        </main>
      </div>
    );
  }

  /* ---------- Paso del asistente ---------- */
  return (
    <div className="int">
      <Encabezado />

      <main className="int-cuerpo">
        {/* Lado izquierdo: texto y botones */}
        <section className="int-izq">
          <div className="int-progreso">
            <small>Paso {indice + 1} de {pasos.length}</small>
            <div className="int-pista">
              <div className="int-relleno" style={{ width: `${porcentaje}%` }}></div>
            </div>
          </div>

          <h1>{paso.titulo}</h1>
          <p>{paso.descripcion}</p>
          <p className="int-contador">
            {paso.minimo > 0 ? `Elige al menos ${paso.minimo}` : "Elige las que quieras"}
            {" · "}Seleccionadas: {elegidas.length}
          </p>

          <div className="int-botones">
            <button className="int-btn" disabled={!puedeContinuar} onClick={continuar}>
              {esUltimo ? "Finalizar" : "Continuar"}
            </button>

            {paso.omitible && (
              <button className="int-link" onClick={omitir}>Omitir por ahora</button>
            )}
          </div>

          {indice > 0 && (
            <button className="int-atras" onClick={() => setIndice(indice - 1)}>
              ← Atrás
            </button>
          )}
        </section>

        {/* Lado derecho: tarjetas */}
        <section className="int-der">
          <div className="int-grilla">
            {paso.opciones.map((o) => {
              const marcada = elegidas.includes(o.id);

              return (
                <button
                  key={o.id}
                  className={marcada ? "int-tarjeta int-sel" : "int-tarjeta"}
                  onClick={() => alternar(o.id)}
                  aria-pressed={marcada}
                >
                  {marcada && <i className="int-check">✓</i>}
                  <Icono nombre={o.icono} />
                  <span>{o.etiqueta}</span>
                </button>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Intereses;