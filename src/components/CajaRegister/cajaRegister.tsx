/* eslint-disable @typescript-eslint/no-unused-vars */
import style from './CajaRegister.module.css';
import type { CashMovementType, CurrencyType, PaymentMethod } from '../../types/enums.types';

type CashMovementProps = {
    id: number;
    type: CashMovementType;
    paymentMethod: PaymentMethod;
    amount: number;
    currencyType: CurrencyType;
    movementDate: string;
    onViewDetail: () => void;
};

export default function CajaRegister({ id, type, paymentMethod, amount, currencyType, movementDate, onViewDetail }: CashMovementProps) {
    
    const dateStr = movementDate ? new Date(movementDate).toLocaleDateString('es-AR') : "-";
    
    const amountStr = amount ? amount.toLocaleString('es-AR', { minimumFractionDigits: 2 }) : "0,00";

    const isIngreso = type === 'INGRESO';
    const movClass = isIngreso ? style.movimientoIngreso : style.movimientoEgreso;

    return(
        <main className={style.main} onClick={onViewDetail}>
            <div className={style.column}><h6 className={movClass}>{type}</h6></div>
            <div className={style.column}><h6>{paymentMethod?.replace('_', ' ') || '-'}</h6></div>
            <div className={style.column}><h6>{dateStr}</h6></div>
            <div className={style.column}><h6>{currencyType === 'DOLARES' ? 'U$D' : '$'} {amountStr}</h6></div>
            <div className={style.column}><h6>{currencyType}</h6></div>
            
            <div className={style.actions}>
                <img src={'/icons/eye.png'} alt={'Ver detalle'} onClick={(e) => { e.stopPropagation(); onViewDetail(); }}/>
            </div>
        </main>
    )
}