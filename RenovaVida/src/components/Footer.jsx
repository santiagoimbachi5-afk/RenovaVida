import { Link } from 'react-router-dom'
import '../styles/Footer.css'

function Footer() {
  const subir = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <footer className="footer">
      <div className="footer__contenido">
        <div>
          <h3>
            <span style={{color:'#ffffff'}}>Renova</span>
            <span style={{color:'#79c4ff'}}>Vida</span>
          </h3>
          <p>Un espacio diseñado para brindar apoyo, orientación y bienestar a las personas</p>
        </div>

        <div>
          <h4>Enlaces</h4>
          <ul>
            <li>-</li>
            <li>
              <Link to="/" onClick={subir}>Sobre Nosotros</Link>
            </li>
            <li>
              <Link to="/contactanos">Contáctenos</Link>
            </li>
          </ul>
        </div>

        <div>
          <h4>Contáctenos</h4>
          <ul>
            <li><a href="mailto:renovavida@gmail.com">renovavida@gmail.com</a></li>
            <li><a href="tel:3212342343">3212342343</a></li>
          </ul>
        </div>
      </div>

      <p className="footer__copy">© 2026 RenovaVida. Todos los derechos reservados.</p>
    </footer>
  )
}

export default Footer