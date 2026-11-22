import "../styles/ordenar.css";

function ThOrdenable({ campo, orden, onOrdenar, children }) {
  const activo = orden.campo === campo;
  const flecha = !activo ? "↕" : orden.direccion === "asc" ? "▲" : "▼";

  return (
    <th className="ord-th" onClick={() => onOrdenar(campo)}>
      {children}
      <span className={activo ? "ord-flecha ord-activa" : "ord-flecha"}>
        {flecha}
      </span>
    </th>
  );
}

export default ThOrdenable;