import style from './CtaCorriente.module.css';
import type { CurrentAccountMovementDTO } from '../../types/currentAccount.types';
import { receiptService } from '../../services/receipt.service';
import { currentAccountService } from '../../services/currentAccount.service';

type Props = {
    movement: CurrentAccountMovementDTO;
    onClick?: () => void;
    onRefresh: () => void;
}

export default function Register({ movement, onClick, onRefresh }: Props) {
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

    const registerClassName = `${style.register} ${movement.canceled ? style.canceled : ''}`;

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation(); 
        if (!window.confirm("¿Estás seguro de eliminar este registro?")) return;

        try {
            if (movement.type === 'RECEIPT') {
                await receiptService.deleteReceipt(movement.id);
            } else {
                await currentAccountService.deleteVoucher(movement.id);
            }
            onRefresh(); 
        } catch (error) {
            console.error(error);
            alert("No se pudo eliminar el registro.");
        }
    };

    return (
        <main onClick={onClick} className={registerClassName}>
            <div className={style[displayType] || style.defaultTag}>
                {displayType}
            </div>
            
            <h6>{dateStr}</h6>
            <h6 style={movement.canceled ? { textDecoration: 'line-through', opacity: 0.6 } : {}}>${amtPesos}</h6>
            <h6 style={movement.canceled ? { textDecoration: 'line-through', opacity: 0.6 } : {}}>${amtDollars}</h6>
            <h6 className={style.balanceMobile}>${balPesos}</h6>
            <h6 className={style.balanceMobile}>${balDollars}</h6>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <button 
                    onClick={handleDelete} 
                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                    <img src="/icons/trash.png" alt="Borrar" style={{ width: '18px' }} />
                </button>
            </div>
        </main>
    )
}