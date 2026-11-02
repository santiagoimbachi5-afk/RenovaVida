import { Outlet } from "react-router-dom";

function LayoutProfesional() {
  return (
    <div>
      <h2>Aquí va el sidebar</h2>
      <Outlet />
    </div>
  );
}

export default LayoutProfesional;