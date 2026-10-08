import Esencia from '../components/Esencia.jsx'
import Valores from '../components/Valores.jsx'
import Equipo from '../components/Equipo.jsx'


import '../styles/Inicio.css'

function Inicio() {
  return (
    <>
      <section className="hero">
        <p className="hero__texto">
          No nacimos para aceptar el riesgo como rutina; nacimos para reinventar la manera en que se protege la vida. Con tecnología, sí, pero sobre todo, con propósito humano.
        
        </p>
      </section>
      <Esencia />
      <Valores />
      <Equipo />
      
    </>
  )
}

export default Inicio