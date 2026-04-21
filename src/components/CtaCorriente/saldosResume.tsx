import style from './CtaCorriente.module.css';

type Props = {
    saldoPesos: number;
    saldoDolares: number;
}

export default function SaldosResume({ saldoPesos, saldoDolares }: Props) {
    return(
        <main className={style.saldosResume}>
            <img src={'/icons/adjustments.png'} alt="Ajustes" />

            <div className={style.saldoBox}>
                <div className={style.saldo}>
                    <h6>Saldo actual en USD: U$D {saldoDolares.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h6>
                </div>

                <div className={style.saldo}>
                    <h6>Saldo actual en $: ${saldoPesos.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h6>
                </div>
            </div>
        </main>
    )
}