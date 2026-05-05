import style from "./NavBar.module.css";
import NavItem from "./NavItem/navItem.tsx";
import BottomNav from "./BottomNav/BottomNav.tsx";
import {NavLink} from "react-router-dom";

type NavBarProps = {
    onLogout: () => void;
};

export default function NavBar({ onLogout }: NavBarProps) {
    return (
        <>
            <main className={style.navContainer}>
                <NavLink
                    to={'/panel'}
                >
                    <img src={'/logo/whiteLogo.png'} alt={'ciro estetics logo'}/>
                </NavLink>

                <div className={style.sectionsGroup}>
                <p>Inicio</p>
                    <NavItem
                        sectionName={'Panel principal'}
                        image={'/icons/panel.png'}
                        to={'/Panel'}
                    />
                </div>

                <div className={style.sectionsGroup}>
                    <p>Herramientas principales</p>
                    <div className={style.navItems}>
                        <NavItem sectionName={'Calendario'}    image={'/icons/calendar.png'} to={'/calendario'} />
                        <NavItem sectionName={'Pacientes'}     image={'/icons/pacientes.png'} to={'/pacientes'} />
                        <NavItem sectionName={'Tareas'}        image={'/icons/tasks.png'}    to={'/tareas'} />
                        <NavItem sectionName={'Aranceles'}     image={'/icons/proc.png'}     to={'/aranceles'} />
                        <NavItem sectionName={'Presupuestos'}  image={'/icons/presup.png'}   to={'/presupuestos'} />
                    </div>
                </div>

                <div className={style.sectionsGroup}>
                    <p>Administrativas</p>
                    <div className={style.navItems}>
                        <NavItem sectionName={'Proveedores'}    image={'/icons/prov.png'}    to={'/proveedores'} />
                        <NavItem sectionName={'Sueldos y gastos'} image={'/icons/sueldos.png'} to={'/sueldos'} />
                        <NavItem sectionName={'Deudas'}         image={'/icons/deudas.png'}  to={'/deudas'} />
                        <NavItem sectionName={'Caja'}           image={'/icons/caja.png'}    to={'/caja'} />
                        <NavItem sectionName={'Panel Admin'}    image={'/icons/supervisorAccount.png'} to={'/admin'} />
                    </div>
                </div>

                <div className={style.sectionsGroup} style={{ marginTop: 'auto' }}>
                    <p>Sesión</p>
                    <div className={style.navItems}>
                        <div 
                            className={`${style.navItem} ${style.logoutItem}`} 
                            onClick={onLogout}
                        >
                            <img src={'/icons/logout.png'} alt="logout" />
                            <h6>Cerrar sesión</h6>
                        </div>
                    </div>
                </div>
            </main>

            <BottomNav onLogout={onLogout} />
        </>
    );
}