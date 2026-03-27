import style from './Caja.module.css';
import WelcomeText from "../../components/WelcomeText/welcomeText.tsx";
import CajaRegister from "../../components/CajaRegister/cajaRegister.tsx";

export default function Caja() {
    return(
        <main className={style.main}>
            <WelcomeText
                sectionText={'Acá los movimientos de la caja'}
                className={'darkStyle'}
            />

            <div className={style.content}>
                <div className={style.columnNames}>
                    <p>Movimiento</p>
                    <p>Medio de pago</p>
                    <p>Destinatario</p>
                    <p>¿Comisión?</p>
                    <p>¿A quién?</p>
                    <p>Monto</p>
                    <p>Moneda</p>
                    <p>Acciones</p>
                </div>

                <div className={style.registers}>
                    <CajaRegister/>
                    <CajaRegister/>
                    <CajaRegister/>
                    <CajaRegister/>
                    <CajaRegister/>
                    <CajaRegister/>
                </div>
            </div>

            <div className={style.createReport}>
                <img src={'/icons/up.png'}/>
                <h6>Generar reportes</h6>
            </div>
        </main>
    )
}