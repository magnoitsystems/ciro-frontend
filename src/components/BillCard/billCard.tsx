import style from './BillCard.module.css';
import type { BillResponseDTO } from "../../types/bills.types";

type Props = {
    bill: BillResponseDTO;
    onClick?: () => void;
}

export default function BillCard({ bill, onClick }: Props) {
    const displayName = bill.billType === 'SUELDO' 
        ? (bill.employeeFullName || bill.supplierFullName || "Empleado sin nombre") 
        : (bill.supplierFullName || bill.entityName || "Sin entidad");

    return (
        <main
            className={style.sueldo}
            onClick={onClick}
        >
            <div>{displayName}</div>
            <h6>{bill.billDate}</h6>
            <h6>{bill.paymentMethod ? bill.paymentMethod.replace('_', ' ') : '-'}</h6>
            <h6>{new Intl.NumberFormat('es-AR').format(bill.amount)}</h6>
            <h6>{bill.currencyType === 'PESOS' ? '$' : bill.currencyType}</h6>
            <h6>{bill.from || '-'}</h6>

            <div className={style.statusContainer}>
                <div className={`${style.select} ${bill.status === "PAGADO" ? style.pago : style.nopago}`}>
                    {bill.status}
                </div>
            </div>
        </main>
    )
}