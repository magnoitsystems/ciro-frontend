import style from './CtaCorriente.module.css';
import type { CurrentAccountMovementDTO } from '../../types/currentAccount.types';

type Props = {
    movement: CurrentAccountMovementDTO;
    onClick?: () => void;
}

export default function Register({ movement, onClick }: Props) {
    const displayType = movement.type === 'RECEIPT' ? 'Recibo' : 'Comprobante';

    const formatCurrency = (value: number | null | undefined) => {
        if (value === null || value === undefined) return "0,00";
        return value.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    const amtPesos = formatCurrency(movement.transactionAmountPesos);
    const amtDollars = formatCurrency(movement.transactionAmountDollars);
    const balPesos = formatCurrency(movement.balancePesos);
    const balDollars = formatCurrency(movement.balanceDollars);

    const dateStr = movement.date ? new Date(movement.date).toLocaleDateString('es-AR') : "-";

    const canceledStyle: React.CSSProperties = movement.canceled ? {
        backgroundColor: 'rgba(255, 77, 77, 0.08)', 
        borderLeft: '4px solid #ff4d4d',
    } : {};

    return (
        <main onClick={onClick} className={style.register} style={canceledStyle}>
            <div className={style[displayType] || style.defaultTag}>
                {displayType}
            </div>
            
            <h6>{dateStr}</h6>
            <h6 style={movement.canceled ? { textDecoration: 'line-through', opacity: 0.6 } : {}}>${amtPesos}</h6>
            <h6 style={movement.canceled ? { textDecoration: 'line-through', opacity: 0.6 } : {}}>U$D {amtDollars}</h6>
            <h6>${balPesos}</h6>
            <h6>USD {balDollars}</h6>
        </main>
    )
}