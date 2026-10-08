import Tarjeta from './Tarjeta.jsx'
import '../styles/Esencia.css'

const pilares = [
  { titulo: 'Misión', texto: 'Ser la plataforma digital líder en prevención y apoyo emocional.', color: 'azul' },
  { titulo: 'Visión', texto: 'Brindar un espacio seguro y accesible donde las personas puedan expresarse.', color: 'azul' },
  { titulo: 'Propuesta de valor', texto: 'Previnox combina tecnología y humanidad: ofrece asistencia rápida y motivación constante.', color: 'azul' },

]

function Esencia() {
  return (
    <section className="esencia">
      <h2>Nuestra esencia</h2>
      <p>Los pilares que nos mueven, nos inspiran y dan sentido a cada paso que damos...</p>

      <div className="esencia__tarjetas">
       {pilares.map((pilar) => (
     <Tarjeta
       key={pilar.titulo}
       titulo={pilar.titulo}
       texto={pilar.texto}
       color={pilar.color}
     />
     ))}

      </div>
    </section>
  )
}

export default Esencia