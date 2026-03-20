import style from './TaskSummery.module.css';

export default function TaskSummery() {
    return(
        <main className={style.task}>
            <div className={style.state}>
                <h6>Pendiente</h6>
            </div>
            <h5>Cargar turnos anotados en cuaderno azul de rayas</h5>
        </main>
    )
}