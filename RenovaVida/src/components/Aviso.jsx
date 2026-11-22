import { useEffect } from "react";
import "../styles/confirmacion.css";

function Aviso({ mensaje, tipo = "exito", onCerrar }) {
  // Se cierra solo a los 3 segundos
  useEffect(() => {
    const temporizador = setTimeout(onCerrar, 3000);
    return () => clearTimeout(temporizador);
  }, []);

  return (
    <div className={`cf-aviso cf-${tipo}`}>
      <span>{mensaje}</span>
      <button onClick={onCerrar}>✕</button>
    </div>
  );
}

export default Aviso;