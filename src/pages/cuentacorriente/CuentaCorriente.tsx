import WelcomeText from "../../components/WelcomeText/welcomeText.tsx";
import style from './CuentaCorriente.module.css';
import SaldosResume from "../../components/CtaCorriente/saldosResume.tsx";
import Register from "../../components/CtaCorriente/Register.tsx";
import DebtButton from "../../components/Buttons/CancelDebtButton/cancelDebtButton.tsx";

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

                    <div className={style.registerContainer}>
                        <div className={style.columnNames}>
                            <p>Referencia</p>
                            <p>Fecha</p>
                            <p>Tipo</p>
                            <p>Moneda</p>
                            <p>Importe/Pago</p>
                            <p>Saldo total</p>
                            <p>Link</p>
                        </div>

                        <Register/>
                        <Register/>
                        <Register/>
                        <Register/>
                        <Register/>

                        <DebtButton/>
                    </div>
                </div>

                <div className={style.createRegisters}>
                    <div>
                        <img src={'/icons/bigPlus.png'}/>
                        <p>Crear nuevo comprobante</p>
                    </div>

                    <div>
                        <img src={'/icons/bigPlus.png'}/>
                        <p>Crear nuevo recibo</p>
                    </div>
                </div>
            </div>
        </main>
    )
}