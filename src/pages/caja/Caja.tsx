import style from './Caja.module.css';
import WelcomeText from "../../components/WelcomeText/welcomeText.tsx";
import CajaRegister from "../../components/CajaRegister/cajaRegister.tsx";
import {ReporteCaja} from "../../components/Forms/CajaForm/CajaForm.tsx";
import {useState} from "react";

export default function Caja() {
    const [showReport, setShowReport] = useState(false);

    return(
        <main className={style.main}>
            <WelcomeText
                sectionText={'Acá los movimientos de la caja'}
                className={'darkStyle'}
            />

            {!showReport ? (
                <>
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

                    <div
                        className={style.createReport}
                        onClick={() => setShowReport(true)}
                    >
                        <img src={'/icons/up.png'} alt="reporte"/>
                        <h6>Generar reportes</h6>
                    </div>
                </>
            ) : (
                <div className={style.reportContainer}>
                    <div className={style.reportInfo}>
                        <h4>Generar reporte</h4>
                        <p>
                            Seleccioná el tipo de reporte y el rango de fechas para obtener
                            un resumen de los movimientos de caja.
                        </p>
                        <span
                            className={style.back}
                            onClick={() => setShowReport(false)}
                        >
                            ← Volver a movimientos
                        </span>
                    </div>
                    <ReporteCaja/>
                </div>
            )}
        </main>
    )
}