import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { pasos } from "../data/pasosIntereses.js";
import Icono from "../components/intereses/Icono.jsx";
import "../styles/intereses.css";

/* ================= Ayudas ================= */
// Todas las opciones de un paso, sea de tarjetas o de grupos
function opcionesDe(paso) {
  if (paso.tipo === "resumen") return [];
  if (paso.tipo === "grupos") {
    return paso.grupos.flatMap((g) => g.opciones);
  }
  return paso.opciones;
}

// Para mostrar el nombre de cada opción elegida en la pantalla final
function etiquetaDe(id) {
  // Los gustos escritos por la persona se guardan como "otro|grupo|texto"
  if (id.startsWith("otro|")) return id.split("|")[2];

  for (const paso of pasos) {
    const opcion = opcionesDe(paso).find((o) => o.id === id);
    if (opcion) return opcion.etiqueta;
  }
  return id;
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

/* ================= Lado derecho según el tipo de paso ================= */
// Tipo "tarjetas": cuadrícula de tarjetas con ícono
function PanelTarjetas({ paso, elegidas, alternar }) {
  return (
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
  );
}

// Tipo "grupos": etiquetas agrupadas por tema
const MAX_OTROS = 3; // cuántos gustos propios puede agregar por grupo

function GrupoEtiquetas({ grupo, elegidas, alternar }) {
  const [escribiendo, setEscribiendo] = useState(false);
  const [texto, setTexto] = useState("");

  const prefijo = `otro|${grupo.id}|`;
  const propias = elegidas.filter((id) => id.startsWith(prefijo));

  const cerrar = () => {
    setTexto("");
    setEscribiendo(false);
  };

  const agregar = () => {
    const limpio = texto.replace(/\|/g, "").trim().slice(0, 25);

    if (limpio) {
      const existente = grupo.opciones.find(
        (o) => o.etiqueta.toLowerCase() === limpio.toLowerCase()
      );
      const id = `${prefijo}${limpio}`;
      const repetido = propias.some((p) => p.toLowerCase() === id.toLowerCase());

      if (existente) {
        // Si escribe algo que ya está en la lista, se marca esa opción
        if (!elegidas.includes(existente.id)) alternar(existente.id);
      } else if (!repetido) {
        alternar(id);
      }
    }
    cerrar();
  };

  const teclas = (e) => {
    if (e.key === "Enter") agregar();
    if (e.key === "Escape") cerrar();
  };

  return (
    <div className="int-grupo">
      <h3 className="int-grupo-titulo">
        <Icono nombre={grupo.icono} tam={20} />
        {grupo.titulo}
      </h3>

      <div className="int-etiquetas">
        {grupo.opciones.map((o) => {
          const marcada = elegidas.includes(o.id);

          return (
            <button
              key={o.id}
              className={marcada ? "int-etq int-etq-sel" : "int-etq"}
              onClick={() => alternar(o.id)}
              aria-pressed={marcada}
            >
              {o.etiqueta}
            </button>
          );
        })}

        {/* Gustos escritos por la persona: se quitan con un clic */}
        {propias.map((id) => (
          <button
            key={id}
            className="int-etq int-etq-sel"
            onClick={() => alternar(id)}
            title="Quitar"
            aria-pressed="true"
          >
            {id.split("|")[2]} ✕
          </button>
        ))}

        {grupo.permiteOtro &&
          propias.length < MAX_OTROS &&
          (escribiendo ? (
            <span className="int-otro-caja">
              <input
                className="int-etq-input"
                autoFocus
                maxLength={25}
                placeholder="Escribe aquí"
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                onKeyDown={teclas}
              />
              <button className="int-otro-ok" onClick={agregar}>Agregar</button>
              <button className="int-otro-x" onClick={cerrar} title="Cancelar">✕</button>
            </span>
          ) : (
            <button className="int-etq int-etq-otro" onClick={() => setEscribiendo(true)}>
              + Otro
            </button>
          ))}
      </div>
    </div>
  );
}

// Tipo "grupos": etiquetas agrupadas por tema
function PanelGrupos({ paso, elegidas, alternar }) {
  return (
    <div className="int-grupos">
      {paso.grupos.map((g) => (
        <GrupoEtiquetas key={g.id} grupo={g} elegidas={elegidas} alternar={alternar} />
      ))}
    </div>
  );
}
// Tipo "tarjetas-grandes": tarjetas anchas con ícono, título y descripción
function PanelTarjetasGrandes({ paso, elegidas, alternar }) {
  return (
    <div className="int-grandes">
      {paso.opciones.map((o) => {
        const marcada = elegidas.includes(o.id);

        return (
          <button
            key={o.id}
            className={marcada ? "int-grande int-grande-sel" : "int-grande"}
            onClick={() => alternar(o.id)}
            aria-pressed={marcada}
          >
            {marcada && <i className="int-check">✓</i>}
            <span className="int-grande-titulo">
              <Icono nombre={o.icono} tam={22} />
              {o.etiqueta}
            </span>
            <span className="int-grande-desc">{o.descripcion}</span>
          </button>
        );
      })}
    </div>
  );
}
// Cómo se muestra cada paso en la revisión
// (los pasos con grupos usan el título y el ícono de cada grupo)
const RESUMEN_PASO = {
  categorias: { titulo: "Categorías", icono: "hobbies" },
  frases: { titulo: "Frases", icono: "frases" },
};

// Tipo "resumen": lista de lo elegido, con un enlace para editar cada paso
function PanelResumen({ respuestas, irA }) {
  const filas = [];

  pasos.forEach((p, i) => {
    if (p.tipo === "resumen") return;
    const delPaso = respuestas[p.id] || [];

    if (p.tipo === "grupos") {
      p.grupos.forEach((g) => {
        filas.push({
          clave: `${p.id}-${g.id}`,
          titulo: g.titulo,
          icono: g.icono,
          ids: delPaso.filter(
            (id) => g.opciones.some((o) => o.id === id) || id.startsWith(`otro|${g.id}|`)
          ),
          paso: i,
        });
      });
    } else {
      const info = RESUMEN_PASO[p.id] || { titulo: p.titulo, icono: "hobbies" };
      filas.push({ clave: p.id, titulo: info.titulo, icono: info.icono, ids: delPaso, paso: i });
    }
  });

  return (
    <div className="int-rev">
      {filas.map((f) => (
        <div className="int-rev-fila" key={f.clave}>
          <h3 className="int-rev-titulo">
            <Icono nombre={f.icono} tam={20} />
            {f.titulo}
          </h3>

          <div className="int-rev-chips">
            {f.ids.length > 0 ? (
              f.ids.map((id) => (
                <span className="int-rev-chip" key={id}>{etiquetaDe(id)}</span>
              ))
            ) : (
              <span className="int-rev-vacio">Sin elegir</span>
            )}
          </div>

          <button className="int-rev-editar" onClick={() => irA(f.paso)}>Editar</button>
        </div>
      ))}
    </div>
  );
}
/* ================= Pantalla principal ================= */
function Intereses() {
  const navigate = useNavigate();

  const [indice, setIndice] = useState(0); // en qué paso va
  const [respuestas, setRespuestas] = useState({}); // { categorias: ["musica"], musica_peliculas: [...] }
  const [terminado, setTerminado] = useState(false);
  const [volverAlResumen, setVolverAlResumen] = useState(false);

  const paso = pasos[indice];
  const elegidas = respuestas[paso.id] || [];
  const esUltimo = indice === pasos.length - 1;
  const puedeContinuar = elegidas.length >= paso.minimo;
  const porcentaje = ((indice + 1) / pasos.length) * 100;

  // Qué panel se dibuja a la derecha, según el tipo del paso
    const paneles = {
    tarjetas: PanelTarjetas,
    grupos: PanelGrupos,
    "tarjetas-grandes": PanelTarjetasGrandes,
    resumen: PanelResumen,
  };
  const Panel = paneles[paso.tipo];

  // Marca o desmarca una opción
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
    if (volverAlResumen) {
      // Venía de "Editar" en el resumen: regresa a la revisión
      setVolverAlResumen(false);
      setIndice(pasos.length - 1);
    } else if (esUltimo) {
      finalizar(actuales);
    } else {
      setIndice(indice + 1);
    }
  };

  // Salta a un paso desde el resumen
  const editar = (i) => {
    setVolverAlResumen(true);
    setIndice(i);
  };

  const continuar = () => avanzar(respuestas);

  const omitir = () => {
    const nuevas = { ...respuestas, [paso.id]: [] };
    setRespuestas(nuevas);
    avanzar(nuevas);
  };

  /* ---------- Pantalla final ---------- */
  if (terminado) {
    // Lo elegido, agrupado por paso (solo los pasos con respuestas)
    const resumen = pasos
      .map((p) => ({ titulo: p.titulo, ids: respuestas[p.id] || [] }))
      .filter((r) => r.ids.length > 0);

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
            {resumen.length > 0 ? (
              <div className="int-resumen">
                {resumen.map((r) => (
                  <div key={r.titulo}>
                    <h4>{r.titulo}</h4>
                    <div className="int-chips">
                      {r.ids.map((id) => (
                        <span className="int-chip" key={id}>{etiquetaDe(id)}</span>
                      ))}
                    </div>
                  </div>
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

          {/* Retoque 1: el contador no se muestra en la revisión */}
          {paso.tipo !== "resumen" && (
            <p className="int-contador">
              {paso.minimo > 0 ? `Elige al menos ${paso.minimo}` : "Elige las que quieras"}
              {" · "}Seleccionadas: {elegidas.length}
            </p>
          )}

          <div className="int-botones">
            {indice > 0 && (
              <button className="int-btn-claro" onClick={() => setIndice(indice - 1)}>
                Atrás
              </button>
            )}

            {/* Retoque 2: el texto del botón cambia según el caso */}
            <button className="int-btn" disabled={!puedeContinuar} onClick={continuar}>
              {volverAlResumen
               ? "Volver al resumen"
                : paso.textoBoton || (esUltimo ? "Finalizar" : "Continuar")}
            </button>

            {paso.omitible && (
              <button className="int-link" onClick={omitir}>Omitir por ahora</button>
            )}
          </div>
        </section>

        {/* Lado derecho */}
        <section className="int-der">
          {/* Retoque 3: el panel recibe también las respuestas y la función Editar */}
          <Panel paso={paso}
           elegidas={elegidas} 
           alternar={alternar} 
           respuestas={respuestas}
           irA={editar} />
        </section>
      </main>
    </div>
  );
}

export default Intereses;
