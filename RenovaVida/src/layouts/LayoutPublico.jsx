<Routes>
  <Route element={<LayoutPublico />}>
    <Route path="/" element={<Inicio />} />
    <Route path="/contactanos" element={<Contactanos />} />
    <Route path="/iniciar-sesion" element={<IniciarSesion />} />
    <Route path="/registro" element={<Registro />} />
  </Route>
</Routes>