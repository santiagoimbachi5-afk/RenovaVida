import { useState } from "react";

// datos: la lista que quieres ordenar
// obtenerValor: (opcional) cómo sacar el valor a comparar de cada fila
export function useOrdenar(datos, obtenerValor = (item, campo) => item[campo]) {
  const [orden, setOrden] = useState({ campo: null, direccion: "asc" });

  const cambiarOrden = (campo) => {
    setOrden((actual) => {
      if (actual.campo !== campo) return { campo, direccion: "asc" };
      if (actual.direccion === "asc") return { campo, direccion: "desc" };
      return { campo: null, direccion: "asc" }; // tercer clic: quita el orden
    });
  };

  const ordenados = [...datos];

  if (orden.campo) {
    ordenados.sort((a, b) => {
      const va = obtenerValor(a, orden.campo);
      const vb = obtenerValor(b, orden.campo);

      let resultado;
      if (typeof va === "number" && typeof vb === "number") {
        resultado = va - vb;
      } else {
        resultado = String(va).localeCompare(String(vb), "es", {
          numeric: true,
          sensitivity: "base",
        });
      }

      return orden.direccion === "asc" ? resultado : -resultado;
    });
  }

  return { ordenados, orden, cambiarOrden };
}