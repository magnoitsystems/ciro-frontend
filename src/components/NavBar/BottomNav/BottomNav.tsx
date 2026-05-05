/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import style from "./BottomNav.module.css";

const PRIMARY_ITEMS = [
    { label: "Inicio",    image: "/icons/panel.png",    to: "/Panel" },
    { label: "Calendario",    image: "/icons/calendar.png", to: "/calendario" },
    { label: "Pacientes", image: "/icons/pacientes.png",to: "/pacientes" },
    { label: "Tareas",    image: "/icons/tasks.png",    to: "/tareas" },
];

const MORE_ITEMS = [
    { section: "Herramientas" },
    { label: "Aranceles",       image: "/icons/proc.png",    to: "/aranceles" },
    { label: "Presupuestos",    image: "/icons/presup.png",  to: "/presupuestos" },
    { section: "Administrativas" },
    { label: "Proveedores",     image: "/icons/prov.png",    to: "/proveedores" },
    { label: "Sueldos y gastos",image: "/icons/sueldos.png", to: "/sueldos" },
    { label: "Deudas",          image: "/icons/deudas.png",  to: "/deudas" },
    { label: "Caja",            image: "/icons/caja.png",    to: "/caja" },
    { label: "Panel Admin",     image: "/icons/supervisorAccount.png", to: "/admin" },
];

type Props = {
    onLogout: () => void;
};

export default function BottomNav({ onLogout }: Props) {
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => { setMenuOpen(false); }, [location.pathname]);

    useEffect(() => {
        if (!menuOpen) return;
        const handler = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [menuOpen]);

    const moreRoutes = MORE_ITEMS.filter(i => i.to).map(i => i.to!);
    const moreIsActive = moreRoutes.includes(location.pathname);

    return (
        <nav className={style.bottomNav} ref={menuRef}>
            <div className={`${style.moreMenu} ${menuOpen ? style.open : ""}`}>
                {MORE_ITEMS.map((item, i) =>
                    item.section ? (
                        <span key={i} className={style.moreLabel}>{item.section}</span>
                    ) : (
                        <NavLink
                            key={item.to}
                            to={item.to!}
                            className={({ isActive }) =>
                                `${style.moreRow} ${isActive ? style.moreActive : ""}`
                            }
                        >
                            <img src={item.image} alt={item.label} className={style.moreIcon} />
                            {item.label}
                        </NavLink>
                    )
                )}

                <span className={style.moreLabel} style={{ marginTop: '10px' }}>Sesión</span>
                <button 
                    onClick={onLogout} 
                    className={`${style.moreRow} ${style.logoutMobileRow}`} 
                >
                    <img src="/icons/logout.png" alt="Cerrar sesión" className={style.moreIcon} />
                    Cerrar sesión
                </button>
            </div>

            {PRIMARY_ITEMS.map(item => (
                <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                        `${style.bnItem} ${isActive ? style.bnActive : ""}`
                    }
                >
                    <img src={item.image} alt={item.label} className={style.bnIcon} />
                    <span>{item.label}</span>
                </NavLink>
            ))}

            <button
                className={`${style.bnItem} ${(menuOpen || moreIsActive) ? style.bnActive : ""}`}
                onClick={() => setMenuOpen(prev => !prev)}
                aria-label="Más opciones"
            >
                <span className={`${style.hamburger} ${menuOpen ? style.hambOpen : ""}`}>
                    <span /><span /><span />
                </span>
                <span>Más</span>
            </button>
        </nav>
    );
}