import style from './Sueldos.module.css';
import WelcomeText from "../../components/WelcomeText/welcomeText.tsx";
import SueldoCard from "../../components/SueldoCard/sueldoCard.tsx";
import {useState} from "react";
import ReporteForm from "../../components/Forms/ReporteForm/ReporteForm.tsx";

export default function Sueldos() {
    const [activeTab, setActiveTab] = useState<"sueldos" | "gastos" | "reporte">("sueldos");

    const gastos = [
        {
            id: 1,
            resumen: "Compra de insumos médicos",
            fecha: "2026-06-15",
            metodo: "Transferencia",
            monto: 250000,
            moneda: "ARS"
        },
        {
            id: 2,
            resumen: "Pago servicio limpieza",
            fecha: "2026-06-10",
            metodo: "Efectivo",
            monto: 80000,
            moneda: "ARS"
        },
        {
            id: 1,
            resumen: "Compra de insumos médicos",
            fecha: "2026-06-15",
            metodo: "Transferencia",
            monto: 250000,
            moneda: "ARS"
        },
        {
            id: 2,
            resumen: "Pago servicio limpieza",
            fecha: "2026-06-10",
            metodo: "Efectivo",
            monto: 80000,
            moneda: "ARS"
        },
        {
            id: 1,
            resumen: "Compra de insumos médicos",
            fecha: "2026-06-15",
            metodo: "Transferencia",
            monto: 250000,
            moneda: "ARS"
        },
        {
            id: 2,
            resumen: "Pago servicio limpieza",
            fecha: "2026-06-10",
            metodo: "Efectivo",
            monto: 80000,
            moneda: "ARS"
        }
    ];

    return(
        <main className={style.main}>
            <WelcomeText
                sectionText={'Acá los registros de sueldos y gastos'}
                className={'darkStyle'}
            />

            <div className={style.container}>
                <div className={style.pages}>
                    <h4
                        className={`${style.tab} ${activeTab === "sueldos" ? style.activeTab : ""}`}
                        onClick={() => setActiveTab("sueldos")}
                    >
                        Sueldos
                    </h4>

                    <h4
                        className={`${style.tab} ${activeTab === "gastos" ? style.activeTab : ""}`}
                        onClick={() => setActiveTab("gastos")}
                    >
                        Gastos
                    </h4>

                    <h4
                        className={`${style.tab} ${activeTab === "reporte" ? style.activeTab : ""}`}
                        onClick={() => setActiveTab("reporte")}
                    >
                        Generar reporte
                    </h4>
                </div>

                <div className={style.content}>

                    {activeTab === "sueldos" && (
                        <>
                            <div className={style.sevenColumnNames}>
                                <p>Nombre y apellido</p>
                                <p>Fecha de pago</p>
                                <p>Método de pago</p>
                                <p>Monto</p>
                                <p>Moneda</p>
                                <p>Origen del dinero</p>
                                <p>Estado</p>
                            </div>

                            <SueldoCard/>
                            <SueldoCard/>
                        </>
                    )}

                    {activeTab === "gastos" && (
                        <>
                            <div className={style.fiveColumnNames}>
                                <p>Resumen de gasto</p>
                                <p>Fecha de pago</p>
                                <p>Método de pago</p>
                                <p>Monto</p>
                                <p>Moneda</p>
                            </div>

                            {gastos.map(g => (
                                <div key={g.id} className={style.fiveRow}>
                                    <span title={g.resumen}>{g.resumen}</span>
                                    <span>{g.fecha}</span>
                                    <span>{g.metodo}</span>
                                    <span>${g.monto.toLocaleString()}</span>
                                    <span>{g.moneda}</span>
                                </div>
                            ))}
                        </>
                    )}

                    {activeTab === "reporte" && (
                        <div className={style.reportContainer}>
                            <ReporteForm/>
                        </div>
                    )}

                </div>
            </div>
        </main>
    )
}