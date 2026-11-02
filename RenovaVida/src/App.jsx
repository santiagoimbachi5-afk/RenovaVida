import Navbar from './components/Navbar.jsx'
import Inicio from './pages/SobreNosotros.jsx'
import Contactanos from './pages/Contactanos.jsx'
import Footer from './components/Footer.jsx'
import { Routes, Route, useLocation } from "react-router-dom";   // 1. agregaste useLocation
import IniciarSesion from './pages/IniciarSesion.jsx'
import Registro from './pages/Registro.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import Perfil from './pages/profesional/Perfil.jsx'              // 2. nuevo import

function App() {
  const location = useLocation()
  const esPanel = location.pathname.startsWith("/profesional")   // 3. detecta si estás en el panel

  return (
    <>
      <ScrollToTop />
      {!esPanel && <Navbar />}

      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/contactanos" element={<Contactanos />} />
        <Route path="/iniciar-sesion" element={<IniciarSesion />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/profesional" element={<Perfil />} />       {/* 4. nueva ruta */}
      </Routes>

      {!esPanel && <Footer />}
    </>
  )
}

export default App