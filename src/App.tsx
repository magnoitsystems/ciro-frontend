import './App.css'
import NavBar from "./components/NavBar/navBar.tsx";
import Calendar from "./components/Calendar/calendar.tsx"
import { Routes, Route } from "react-router-dom";
import Panel from "./pages/panel/Panel.tsx";
import Sueldos from "./pages/sueldos/Sueldos.tsx";
import Proveedores from "./pages/proveedores/Proveedores.tsx";
import Procedimientos from "./pages/procedimientos/Procedimientos.tsx";
import Presupuestos from "./pages/presupuestos/Presupuestos.tsx";
import Pacientes from "./pages/pacientes/Pacientes.tsx";
import Deudas from "./pages/deudas/Deudas.tsx";
import Caja from "./pages/caja/Caja.tsx";
import Calendario from "./pages/calendario/Calendario.tsx";
import Tareas from "./pages/tareas/Tareas.tsx";

function App() {
  return (
      <div className="appContainer">
          <NavBar/>
          <Calendar/>


          <div className="content">
              <Routes>
                  <Route path="/" element={<Panel/>}/>
                  <Route path="/calendario" element={<Calendario/>}/>
                  <Route path="/caja" element={<Caja/>}/>
                  <Route path="/deudas" element={<Deudas/>}/>
                  <Route path="/pacientes" element={<Pacientes/>}/>
                  <Route path="/presupuestos" element={<Presupuestos/>}/>
                  <Route path="/procedimientos" element={<Procedimientos/>}/>
                  <Route path="/proveedores" element={<Proveedores/>}/>
                  <Route path="/sueldos" element={<Sueldos/>}/>
                  <Route path="/tareas" element={<Tareas/>}/>
              </Routes>
          </div>
      </div>
  )
}

export default App
