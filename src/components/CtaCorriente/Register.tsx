import style from './CtaCorriente.module.css';
import type { CurrentAccountMovementDTO } from '../../types/currentAccount.types';

type Props = {
    movement: CurrentAccountMovementDTO;
    onClick?: () => void;
}

export default function Register({ movement, onClick }: Props) {
    // El backend devuelve 'RECEIPT' o 'VOUCHER'. Lo mapeamos a español para la UI
    const displayType = movement.type === 'RECEIPT' ? 'Recibo' : 'Comprobante';

    // Formateamos los números para que no se rompan si vienen en null/undefined
    const amtPesos = movement.transactionAmountPesos ? movement.transactionAmountPesos.toLocaleString('es-AR', { minimumFractionDigits: 2 }) : "0,00";
    const amtDollars = movement.transactionAmountDollars ? movement.transactionAmountDollars.toLocaleString('es-AR', { minimumFractionDigits: 2 }) : "0,00";
    const balPesos = movement.balancePesos ? movement.balancePesos.toLocaleString('es-AR', { minimumFractionDigits: 2 }) : "0,00";
    const balDollars = movement.balanceDollars ? movement.balanceDollars.toLocaleString('es-AR', { minimumFractionDigits: 2 }) : "0,00";

    // Formateamos la fecha (ej: 2026-05-27 -> 27/05/2026)
    const dateStr = movement.date ? new Date(movement.date).toLocaleDateString('es-AR') : "-";

    return (
        <main onClick={onClick} className={style.register}>
            <div className={style[displayType] || style.defaultTag}>{displayType}</div>
            <h6>{dateStr}</h6>
            <h6>{amtPesos}</h6>
            <h6>{amtDollars}</h6>
            <h6>{balPesos}</h6>
            <h6>{balDollars}</h6>
        </main>
    )
}