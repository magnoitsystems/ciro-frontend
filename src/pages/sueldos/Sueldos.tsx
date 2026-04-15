import style from './Sueldos.module.css';
import WelcomeText from "../../components/WelcomeText/welcomeText.tsx";
import BillCard from "../../components/BillCard/billCard.tsx";
import {useState} from "react";
import ReporteForm from "../../components/Forms/ReporteForm/ReporteForm.tsx";

export default function Sueldos() {
    const [activeTab, setActiveTab] = useState<"sueldos" | "gastos" | "reporte">("sueldos");

    return(
        <main className={style.main}>
            <WelcomeText
                sectionText={'Acá los registros de sueldos y gastos'}
                className={'darkStyle'}
            />

            <div className={style.newBill}>
                <div className={style.button}><h3>+</h3></div>
            </div>

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
                            <div className={style.columnNames}>
                                <p>Nombre y apellido</p>
                                <p>Fecha de pago</p>
                                <p>Método de pago</p>
                                <p>Monto</p>
                                <p>Moneda</p>
                                <p>Origen del dinero</p>
                                <p>Estado</p>
                            </div>

                            <BillCard/>
                            <BillCard/>
                        </>
                    )}

                    {activeTab === "gastos" && (
                        <>
                            <div className={style.columnNames}>
                                <p>Nombre y apellido</p>
                                <p>Fecha de pago</p>
                                <p>Método de pago</p>
                                <p>Monto</p>
                                <p>Moneda</p>
                                <p>Origen del dinero</p>
                                <p>Estado</p>
                            </div>

                            <BillCard/>
                            <BillCard/>
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