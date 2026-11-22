import "../styles/paginacion.css";

// Con muchas páginas muestra: 1 ... 4 5 6 ... 25
function obtenerNumeros(actual, total) {
  const numeros = [];
  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || Math.abs(i - actual) <= 1) {
      numeros.push(i);
    } else if (numeros[numeros.length - 1] !== "...") {
      numeros.push("...");
    }
  }
  return numeros;
}

function Paginacion({ paginaActual, totalPaginas, desde, hasta, total, onCambiar }) {
  if (total === 0) return null;

  return (
    <div className="pag">
      <span className="pag-info">
        Mostrando {desde}–{hasta} de {total}
      </span>

      <div className="pag-botones">
        <button
          className="pag-btn"
          disabled={paginaActual === 1}
          onClick={() => onCambiar(paginaActual - 1)}
        >
          ‹ Anterior
        </button>

        {obtenerNumeros(paginaActual, totalPaginas).map((n, i) =>
          n === "..." ? (
            <span className="pag-puntos" key={`p${i}`}>…</span>
          ) : (
            <button
              key={n}
              className={n === paginaActual ? "pag-btn pag-actual" : "pag-btn"}
              onClick={() => onCambiar(n)}
            >
              {n}
            </button>
          )
        )}

        <button
          className="pag-btn"
          disabled={paginaActual === totalPaginas}
          onClick={() => onCambiar(paginaActual + 1)}
        >
          Siguiente ›
        </button>
      </div>
    </div>
  );
}

export default Paginacion;