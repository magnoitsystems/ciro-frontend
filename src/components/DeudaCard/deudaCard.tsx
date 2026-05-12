import type { PatientDebtorDTO } from '../../types/currentAccount.types';
import style from './DeudaCard.module.css';

type Props = {
    deudor: PatientDebtorDTO;
}

export default function DeudaCard({ deudor }: Props) {
    return (
        <main className={`${style.main} ${deudor.overdue ? style.overdue : ''}`}>
            <h6>
                {deudor.fullName || "Sin nombre"} 
                {deudor.overdue && <span className={style.overdueText}> (Vencido)</span>}
            </h6>
            <h6>{deudor.dni || "Sin DNI"}</h6>
            <h6 className={style.debt}>
                {deudor.debtDolares ? `U$D ${deudor.debtDolares.toLocaleString('es-AR')}` : "U$D 0"}
            </h6>
            <h6 className={style.debt}>
                {deudor.debtPesos ? `$ ${deudor.debtPesos.toLocaleString('es-AR')}` : "$ 0"}
            </h6>
        </main>
    )
}