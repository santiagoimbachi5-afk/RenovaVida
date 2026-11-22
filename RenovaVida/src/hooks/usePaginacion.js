import { useState } from "react";

// datos: la lista completa (ya filtrada y ordenada)
// porPagina: cuántas filas se muestran en cada página
export function usePaginacion(datos, porPagina = 5) {
  const [pagina, setPagina] = useState(1);

  const total = datos.length;
  const totalPaginas = Math.max(1, Math.ceil(total / porPagina));

  // Si la lista se acorta (por un filtro o al eliminar), la página nunca se pasa del final
  const paginaActual = Math.min(pagina, totalPaginas);

  const inicio = (paginaActual - 1) * porPagina;
  const visibles = datos.slice(inicio, inicio + porPagina);

  const irAPagina = (n) => {
    setPagina(Math.min(Math.max(1, n), totalPaginas));
  };

  return {
    visibles,
    paginaActual,
    totalPaginas,
    total,
    desde: total === 0 ? 0 : inicio + 1,
    hasta: Math.min(inicio + porPagina, total),
    irAPagina,
  };
}