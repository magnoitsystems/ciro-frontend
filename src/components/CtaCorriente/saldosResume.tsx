import style from './CtaCorriente.module.css';

type FilterType = 'ALL' | 'RECEIPT' | 'VOUCHER';

type Props = {
    saldoPesos: number;
    saldoDolares: number;
    filter: FilterType;
    onFilterChange: (f: FilterType) => void;
}

export default function SaldosResume({ saldoPesos, saldoDolares, filter, onFilterChange }: Props) {
    return(
        <main className={style.saldosResume}>
            <div className={style.filterButtons}>
                <button
                    className={filter === 'ALL' ? style.filterActive : style.filterBtn}
                    onClick={() => onFilterChange('ALL')}
                >Todos</button>
                <button
                    className={filter === 'RECEIPT' ? style.filterActive : style.filterBtn}
                    onClick={() => onFilterChange('RECEIPT')}
                >Recibos</button>
                <button
                    className={filter === 'VOUCHER' ? style.filterActive : style.filterBtn}
                    onClick={() => onFilterChange('VOUCHER')}
                >Comprobantes</button>
            </div>

            <div className={style.saldoBox}>
                <div className={style.saldo}>
                    <h6>Saldo actual en USD: {saldoDolares.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h6>
                </div>
                <div className={style.saldo}>
                    <h6>Saldo actual en $: {saldoPesos.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h6>
                </div>
            </div>
        </main>
    )
}