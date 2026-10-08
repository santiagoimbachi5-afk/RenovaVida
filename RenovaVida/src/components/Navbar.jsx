import { NavLink, Link } from "react-router-dom";
import '../styles/Navbar.css'

function Navbar() {
  return (
    
    <header className="navbar">
      <h2>
        <span style={{color:'#ffffff'}}>Renova</span>
        <span style={{color:'#79c4ff'}}>Vida</span>
      </h2>
      <nav className="navbar__links">
        <NavLink to="/">Sobre Nosotros</NavLink>
        <NavLink to="/contactanos">Contáctanos</NavLink>
        <Link to="/iniciar-sesion" className="btn-sesion">Inicio Sesion</Link>
        <button className="navbar__boton navbar__boton--rosa">Botón de Pánico</button>
      </nav>
    </header>
  )
}

export default Navbar