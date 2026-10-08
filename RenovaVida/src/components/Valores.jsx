import '../styles/Valores.css'

const valores = [
  'Trabajo en equipo',
  'Innovación',
  'Pasión',
  'Respeto',
  'Empatía',
  'Responsabilidad',
]

function Valores() {
  return (
    <section className="valores">
      <h2>Nuestros valores</h2>

      <div className="valores__contenido">
        <ul className="valores__lista">
          {valores.map((valor) => (
            <li key={valor}>{valor}</li>
          ))}
        </ul>

        <p>En RenovaVida vivimos la empatía, el respeto y el trabajo en equipo; impulsamos la innovación con responsabilidad y pasión, porque cuidar vidas es nuestra verdadera misión</p>
      </div>
    </section>
  )
}

export default Valores