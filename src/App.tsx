import './App.css'
import NavBar from "./components/NavBar/navBar.tsx";
import { Routes, Route, Navigate } from "react-router-dom";
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
import { authService } from "./services/auth.service";
import AdminPanel from './pages/adminPanel/AdminPanel.tsx';

function App() {
    const [isLogueado, setIsLogueado] = useState<boolean>(authService.isAuthenticated());

    const handleLogout = async () => {
        await authService.logout(); 
        setIsLogueado(false);      
    };

    if (!isLogueado) {
        return (
            <div className="appContainer">
                <Routes>
                    <Route path="*" element={<Login onLogin={() => setIsLogueado(true)} />} />
                </Routes>
            </div>
        );
    }

    return (
        <div className="appContainer">
            <NavBar onLogout={handleLogout} />

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
                    <Route path="/admin" element={<AdminPanel />} />
                    <Route path="*" element={<Navigate to="/Panel" replace />} />
                </Routes>
            </div>
        </div>
    )
}

export default App;