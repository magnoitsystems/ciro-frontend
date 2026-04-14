import style from './Procedimiento.module.css';
import type { TariffResponseDTO } from '../../types/tariffs.types';

interface Props {
    tariff: TariffResponseDTO;
}

export default function Procedimiento({ tariff }: Props) {
    return (
        <main className={style.main}>
            <h6>{tariff.tariffDate || '-'}</h6>
            <h6>{tariff.name}</h6>
            <h6>{tariff.amountDollars ? `$${tariff.amountDollars}` : '-'}</h6>
            <h6>{tariff.amountPesos ? `$${tariff.amountPesos}` : '-'}</h6>
            <h6>{tariff.tc || '-'}</h6>
        </main>
    )
}