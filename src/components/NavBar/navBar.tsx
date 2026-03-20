import style from "./NavBar.module.css";
import NavItem from "./NavItem/navItem.tsx";

export default function NavBar() {
    return (
        <main className={style.navContainer}>
            <img src={'/logo/whiteLogo.png'} alt={'ciro estetics logo'}/>

            <div className={style.sectionsGroup}>
                <p>Inicio</p>

                <NavItem
                    sectionName={'Panel principal'}
                    image={'/icons/panel.png'}
                    to={'/'}
                />
            </div>

            <div className={style.sectionsGroup}>
                <p>Herramientas principales</p>

                <div className={style.navItems}>
                    <NavItem
                        sectionName={'Calendario'}
                        image={'/icons/calendar.png'}
                        to={'/calendario'}
                    />
                    <NavItem
                        sectionName={'Pacientes'}
                        image={'/icons/pacientes.png'}
                        to={'/pacientes'}
                    />
                    <NavItem
                        sectionName={'Tareas'}
                        image={'/icons/tasks.png'}
                        to={'/tareas'}
                    />
                    <NavItem
                        sectionName={'Procedimientos'}
                        image={'/icons/proc.png'}
                        to={'/procedimientos'}
                    />
                    <NavItem
                        sectionName={'Presupuestos'}
                        image={'/icons/presup.png'}
                        to={'/presupuestos'}
                    />
                </div>
            </div>

            <div className={style.sectionsGroup}>
                <p>Administrativas</p>

                <div className={style.navItems}>
                    <NavItem
                        sectionName={'Proveedores'}
                        image={'/icons/prov.png'}
                        to={'/proveedores'}
                    />
                    <NavItem
                        sectionName={'Sueldos y gastos'}
                        image={'/icons/sueldos.png'}
                        to={'/sueldos'}
                    />
                    <NavItem
                        sectionName={'Deudas'}
                        image={'/icons/deudas.png'}
                        to={'/deudas'}
                    />
                    <NavItem
                        sectionName={'Caja'}
                        image={'/icons/caja.png'}
                        to={'/caja'}
                    />
                </div>
            </div>
        </main>
    );
}