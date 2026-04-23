import { useState } from "react";
import style from './BillCard.module.css';
import type { BillResponseDTO } from "../../types/bills.types";

type Props = {
    bill: BillResponseDTO;
    onClick?: () => void;
}

export default function BillCard({ bill, onClick }: Props) {
    const [selected, setSelected] = useState(false);

    const displayName = bill.billType === 'SUELDO' 
        ? (bill.employeeFullName || "Empleado sin nombre") 
        : (bill.supplierFullName || bill.entityName || "Sin entidad");

    return (
        <main
            className={`${style.sueldo} ${selected ? style.active : ""}`}
            onClick={() => setSelected(!selected)}
        >
            <div>{displayName}</div>
            <h6>{bill.billDate}</h6>
            <h6>{bill.paymentMethod.replace('_', ' ')}</h6>
            <h6>{new Intl.NumberFormat('es-AR').format(bill.amount)}</h6>
            <h6>{bill.currencyType === 'PESOS' ? '$' : bill.currencyType}</h6>
            <h6>{bill.from}</h6>

            <div 
                className={`${style.select} ${bill.status === "PAGADO" ? style.pago : style.nopago}`}
                onClick={(e) => e.stopPropagation()} 
            >
                {bill.status}
            </div>

            {selected && (
                <>
                    <button
                        className={style.view}
                        onClick={(e) => {
                            e.stopPropagation();
                            onClick?.();
                        }}
                    >
                        Ver detalle
                    </button>

                    <button
                        className={style.delete}
                        onClick={(e) => {
                            e.stopPropagation();
                            console.log(`Eliminar bill id: ${bill.id}`);
                        }}
                    >
                        Eliminar
                    </button>
                </>
            )}
        </main>
    )
}