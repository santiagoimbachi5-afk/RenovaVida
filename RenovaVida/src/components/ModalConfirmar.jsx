import { useEffect } from "react";
import "../styles/confirmacion.css";

function ModalConfirmar({
  abierto,
  titulo,
  mensaje,
  advertencia,
  textoConfirmar = "Confirmar",
  onConfirmar,
  onCancelar,
}) {
  // Cierra con la tecla Escape
  useEffect(() => {
    if (!abierto) return;
    const alPresionar = (e) => {
      if (e.key === "Escape") onCancelar();
    };
    window.addEventListener("keydown", alPresionar);
    return () => window.removeEventListener("keydown", alPresionar);
  }, [abierto, onCancelar]);

  if (!abierto) return null;

  return (
    <div className="cf-fondo" onClick={onCancelar}>
      <div className="cf-caja" onClick={(e) => e.stopPropagation()}>
        <h3>{titulo}</h3>
        <p>{mensaje}</p>
        {advertencia && <p className="cf-advertencia">{advertencia}</p>}

        <div className="cf-botones">
          <button className="cf-cancelar" onClick={onCancelar}>
            Cancelar
          </button>
          <button className="cf-confirmar" onClick={onConfirmar}>
            {textoConfirmar}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalConfirmar;