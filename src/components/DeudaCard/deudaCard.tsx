import type { PatientDebtorDTO } from '../../types/patients.types';
import style from './DeudaCard.module.css';

type Props = {
    deudor: PatientDebtorDTO;
}

export default function DeudaCard({ deudor }: Props) {
    return (
        <main className={style.main}>
            <h6>{deudor.fullName || "Sin nombre"}</h6>
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