import style from '../Buttons.module.css';

export default function FilterButton() {
    return(
        <button className={style.filterButton}>
            <h5>Filtrar por ➝</h5>
        </button>
    )
}