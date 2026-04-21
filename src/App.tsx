import './App.css'
import NavBar from "./components/NavBar/navBar.tsx";
import { Routes, Route } from "react-router-dom";
import Panel from "./pages/panel/Panel.tsx";
import Sueldos from "./pages/sueldos/Sueldos.tsx";
import Proveedores from "./pages/proveedores/Proveedores.tsx";
import Procedimientos from "./pages/aranceles/Procedimientos.tsx";
import Presupuestos from "./pages/presupuestos/Presupuestos.tsx";
import Pacientes from "./pages/pacientes/Pacientes.tsx";
import Deudas from "./pages/deudas/Deudas.tsx";
import Caja from "./pages/caja/Caja.tsx";
import Calendario from "./pages/calendario/Calendario.tsx";
import Tareas from "./pages/tareas/Tareas.tsx";
import CuentaCorriente from "./pages/cuentacorriente/CuentaCorriente.tsx";
import Estadisticas from "./pages/estadisticas/Estadisticas.tsx";
import Login from './components/Login/login.tsx';
import { useState } from 'react';

function App() {
    const [isLogueado, setIsLogueado] = useState(false)
    return (
        <div className="appContainer">
            {!isLogueado ? (
                <Login onLogin={() => setIsLogueado(true)}/>
            ): (
                <NavBar />
            )}

            <div className="content">
                <Routes>
                    <Route path="/Panel" element={<Panel />} />
                    <Route path="/calendario" element={<Calendario />} />
                    <Route path="/caja" element={<Caja />} />
                    <Route path="/deudas" element={<Deudas />} />
                    <Route path="/pacientes" element={<Pacientes />} />
                    <Route path="/presupuestos" element={<Presupuestos />} />
                    <Route path="/aranceles" element={<Procedimientos />} />
                    <Route path="/proveedores" element={<Proveedores />} />
                    <Route path="/sueldos" element={<Sueldos />} />
                    <Route path="/tareas" element={<Tareas />} />
                    <Route path="/cuentacorriente/:patientId" element={<CuentaCorriente />} />
                    <Route path="/estadisticas" element={<Estadisticas />} />
                </Routes>
            </div>
        </div>
    )
}

export default App
