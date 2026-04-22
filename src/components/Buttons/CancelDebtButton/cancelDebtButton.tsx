import style from '../Buttons.module.css';

type Props = {
    onClick?: () => void;
}

export default function DebtButton({ onClick }: Props) {
    return(
        <button className={style.debtButton} onClick={onClick}>
            <h5>Cancelar deuda por abandono de tratamiento</h5>
        </button>
    )
}