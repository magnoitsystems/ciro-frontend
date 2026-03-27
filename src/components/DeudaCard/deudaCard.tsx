import style from './DeudaCard.module.css';

export default function DeudaCard() {
    return (
        <main className={style.main}>
            <h6>Milagros Alvarez</h6>
            <h6>46.185.819</h6>
            <h6>Necochea</h6>
            <h6 className={style.debt}>1.150,00</h6>
            <h6 className={style.debt}>223.455,00</h6>
        </main>
    )
}