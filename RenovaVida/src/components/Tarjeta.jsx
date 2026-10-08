import '../styles/Tarjeta.css'

function Tarjeta({ titulo, texto, color }) {
  return (
    <article className={`tarjeta tarjeta--${color}`}>
      <h3>{titulo}</h3>
      <p>{texto}</p>
    </article>
  )
}

export default Tarjeta