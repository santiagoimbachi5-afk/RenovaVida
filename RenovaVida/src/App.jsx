import Navbar from './components/Navbar.jsx'
import Inicio from './pages/SobreNosotros.jsx'
import Contactanos from './pages/Contactanos.jsx'
import Footer from './components/Footer.jsx'
import { Routes, Route, useLocation, Navigate } from "react-router-dom"
import IniciarSesion from './pages/IniciarSesion.jsx'
import Registro from './pages/Registro.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import LayoutProfesional from './layouts/LayoutProfesional.jsx'
import Perfil from './pages/profesional/Perfil.jsx'
import ProgramacionCitas from './pages/profesional/ProgramacionCitas.jsx'
import AtenderEmergencias from './pages/profesional/AtenderEmergencias.jsx'
import ReportesGenerados from './pages/profesional/ReportesGenerados.jsx'
import SolicitudesUsuarios from './pages/profesional/SolicitudesUsuarios.jsx'
import PlanesTratamiento from './pages/profesional/PlanesTratamiento.jsx'
import Intereses from './pages/Intereses.jsx'


function App() {
  const location = useLocation()
  const rutasPanel = ["/profesional", "/administrador", "/paciente","/intereses"]
  const esPanel = rutasPanel.some((ruta) => location.pathname.startsWith(ruta))

  return (
    <>
      <ScrollToTop />
      {!esPanel && <Navbar />}

      <Routes>
        {/* Páginas públicas */}
        <Route path="/" element={<Inicio />} />
        <Route path="/contactanos" element={<Contactanos />} />
        <Route path="/iniciar-sesion" element={<IniciarSesion />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/intereses" element={<Intereses />} />

        {/* Rol profesional */}
        <Route path="/profesional" element={<LayoutProfesional />}>
          <Route index element={<Navigate to="perfil" replace />} />
          <Route path="perfil" element={<Perfil />} />
          <Route path="citas" element={<ProgramacionCitas />} />
          <Route path="emergencias" element={<AtenderEmergencias />} />
          <Route path="reportes" element={<ReportesGenerados />} />
          <Route path="solicitudes" element={<SolicitudesUsuarios />} />
          <Route path="planes" element={<PlanesTratamiento />} />
        </Route>

        {/* prueba */}
        <Route path="/administrador" element={<h1>Panel del administrador</h1>} />
        <Route path="/paciente" element={<h1>Panel del paciente</h1>} />
      </Routes>

      {!esPanel && <Footer />}
    </>
  )
}

export default App