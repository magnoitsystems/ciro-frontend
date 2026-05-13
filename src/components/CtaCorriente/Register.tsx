import { useState } from 'react';
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

    const [showConfirm, setShowConfirm] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);

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

    const handleDeleteConfirmed = async () => {
        setDeleting(true);
        try {
            if (movement.type === 'RECEIPT') {
                await receiptService.deleteReceipt(movement.id);
            } else {
                await currentAccountService.deleteVoucher(movement.id);
            }
            setShowConfirm(false);
            onRefresh();
        } catch (error) {
            console.error(error);
            setShowConfirm(false);
            setErrorMsg("No se pudo eliminar el registro.");
            setTimeout(() => setErrorMsg(null), 3000);
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div style={{ position: 'relative', width: '100%' }}>
            <main onClick={onClick} className={registerClassName}>
                <div className={style[displayType] || style.defaultTag}>
                    {displayType}
                </div>

                <h6>{dateStr}</h6>
                <h6 style={movement.canceled ? { textDecoration: 'line-through', opacity: 0.6 } : {}}>${amtPesos}</h6>
                <h6 style={movement.canceled ? { textDecoration: 'line-through', opacity: 0.6 } : {}}>${amtDollars}</h6>
                <h6 className={style.balanceMobile}>${balPesos}</h6>
                <h6 className={style.balanceMobile}>${balDollars}</h6>

                <button
                    onClick={(e) => { e.stopPropagation(); setShowConfirm(true); }}
                    style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: 0.5,
                        transition: 'opacity 0.15s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                    onMouseLeave={e => (e.currentTarget.style.opacity = '0.5')}
                >
                    <img src="/icons/trash.png" alt="Borrar" style={{ width: '16px' }} />
                </button>
            </main>

            {showConfirm && (
                <div
                    onClick={(e) => e.stopPropagation()}
                    style={{
                        position: 'absolute',
                        top: '50%',
                        right: '12px',
                        transform: 'translateY(-50%)',
                        zIndex: 10,
                        background: 'var(--blue-2, #1a2236)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        borderRadius: '12px',
                        padding: '8px 14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                        whiteSpace: 'nowrap',
                    }}
                >
                    <span style={{ fontSize: '13px', color: 'var(--neutral-1, #eee)' }}>
                        ¿Eliminar este registro?
                    </span>
                    <button
                        onClick={handleDeleteConfirmed}
                        disabled={deleting}
                        style={{
                            background: '#c0392b',
                            border: 'none',
                            borderRadius: '8px',
                            color: 'white',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            padding: '4px 12px',
                            cursor: 'pointer',
                        }}
                    >
                        {deleting ? '...' : 'Eliminar'}
                    </button>
                    <button
                        onClick={() => setShowConfirm(false)}
                        style={{
                            background: 'rgba(255,255,255,0.08)',
                            border: 'none',
                            borderRadius: '8px',
                            color: 'var(--neutral-1, #eee)',
                            fontSize: '12px',
                            padding: '4px 10px',
                            cursor: 'pointer',
                        }}
                    >
                        Cancelar
                    </button>
                </div>
            )}

            {errorMsg && (
                <div
                    style={{
                        position: 'absolute',
                        top: '50%',
                        right: '12px',
                        transform: 'translateY(-50%)',
                        zIndex: 10,
                        background: '#5c1a1a',
                        border: '1px solid #c0392b',
                        borderRadius: '10px',
                        padding: '8px 14px',
                        fontSize: '13px',
                        color: '#fcc',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
                        whiteSpace: 'nowrap',
                    }}
                >
                    ⚠ {errorMsg}
                </div>
            )}
        </div>
    );
}