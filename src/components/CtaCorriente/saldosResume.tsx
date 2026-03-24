import style from './CtaCorriente.module.css';

export default function SaldosResume() {
    return(
        <main className={style.saldosResume}>
            <img src={'/icons/adjustments.png'}/>

            <div className={style.saldoBox}>
                <div className={style.saldo}>
                    <h6>Saldo actual en USD: 1.232,00</h6>
                </div>

                <div className={style.saldo}>
                    <h6>Saldo actual en $: 332.255,00</h6>
                </div>
            </div>
        </main>
    )
}