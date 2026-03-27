import style from '../Buttons.module.css';

export default function DebtButton() {
    return(
        <button className={style.debtButton}>
            <h5>Cancelar deuda por abandono de tratamiento</h5>
        </button>
    )
}