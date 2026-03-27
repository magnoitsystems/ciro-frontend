import style from './Sueldos.module.css';
import WelcomeText from "../../components/WelcomeText/welcomeText.tsx";
import SueldoCard from "../../components/SueldoCard/sueldoCard.tsx";

export default function Sueldos() {
    return(
        <main className={style.main}>
            <WelcomeText
                sectionText={'Acá los registros de sueldos y gastos'}
                className={'darkStyle'}
            />

            <div className={style.container}>
                <div className={style.pages}>
                    <h4>Sueldos</h4>
                    <h4>Gastos</h4>
                    <h4>Generar reporte</h4>
                </div>

                <div className={style.content}>
                    <div className={style.columnNames}>
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
                    <SueldoCard/>
                    <SueldoCard/>
                    <SueldoCard/>
                    <SueldoCard/>
                    <SueldoCard/>
                    <SueldoCard/>
                    <SueldoCard/>
                    <SueldoCard/>
                </div>
            </div>
        </main>
    )
}