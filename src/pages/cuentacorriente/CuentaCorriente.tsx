import WelcomeText from "../../components/WelcomeText/welcomeText.tsx";
import style from './CuentaCorriente.module.css';
import SaldosResume from "../../components/CtaCorriente/saldosResume.tsx";

export default function CuentaCorriente() {
    return(
        <main className={style.main}>
            <WelcomeText
                sectionText={'Acá la Cta. Corriente de Milagros Alvarez'}
                className={'darkStyle'}
            />

            <div className={style.content}>
                <div className={style.allInformation}>
                    <SaldosResume/>
                </div>

                <div className={style.createRegisters}>

                </div>
            </div>
        </main>
    )
}