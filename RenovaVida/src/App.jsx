import Navbar from './components/Navbar.jsx'
import Inicio from './pages/SobreNosotros.jsx'
import Contactanos from './pages/Contactanos.jsx'
import Footer from './components/Footer.jsx'
import { Routes, Route } from "react-router-dom";
import IniciarSesion from './pages/IniciarSesion.jsx'
import Registro from './pages/Registro.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'

function App() {
  return (
    <>
      <ScrollToTop />
      <Navbar />

      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/contactanos" element={<Contactanos />} />
        <Route path="/iniciar-sesion" element={<IniciarSesion />} />
        <Route path="/registro" element={<Registro />} />
      </Routes>

      <Footer />
    </>
  )
}

export default App 