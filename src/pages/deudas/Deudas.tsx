import style from './Deudas.module.css';
import WelcomeText from "../../components/WelcomeText/welcomeText.tsx";
import DeudaCard from "../../components/DeudaCard/deudaCard.tsx";

export default function Deudas() {
    return(
        <main className={style.main}>
            <WelcomeText
                sectionText={'Acá el listado de deudores.'}
                className={'darkStyle'}
            />

            <div className={style.cardsContainer}>
                <div className={style.columnNames}>
                    <p>Nombre y apellido</p>
                    <p>D.N.I del paciente</p>
                    <p>Localidad</p>
                    <p>Deuda en dólares</p>
                    <p>Deuda en pesos</p>
                </div>

                <DeudaCard/>
                <DeudaCard/>
                <DeudaCard/>
                <DeudaCard/>
                <DeudaCard/>
                <DeudaCard/>
            </div>
        </main>
    )
}