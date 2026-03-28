import styles from './taskCard.module.css'

//va a recibir las tareas

type Prop = {
    task: {
        cliente: string;
        fecha: Date;
        estado: string;
        prioridad: string;
    }
}

const coloresPrioridad: Record<string, string> = {
    alta: '#EB0C0C',
    media: '#FFFF00',
    baja: '#29C41B',
}

export default function TaskCard({ task }: Prop) {

    const color = coloresPrioridad[task.prioridad.toLocaleLowerCase()] ?? '#FFFFFF'
    return (
        <div className={styles.cardContainerProperties}>
            <div className={styles.barraColor} style={{ backgroundColor: color }}></div>
            <div className={styles.containerProperties}>
                <div className={styles.infoContainerProperties}>
                    <h3>Pedir informacion al paciente {task.cliente}</h3>
                    <h3>{task.fecha.toLocaleDateString()}</h3>
                </div>
                <div className={styles.buttonsContainerProperties}>
                    <div className={styles.selectProperties}>
                        <select>
                            <option>{task.estado}</option>
                        </select>
                    </div>
                    <div className={styles.buttonsProperties}>
                        <button><img src='./icons/editIcon.png' width={20} height={20}></img></button>
                        <button><img src='./icons/plus.png' width={20} height={20}></img></button>
                        <button><img src='./icons/deudas.png'></img></button>
                    </div>
                </div>
            </div>
            <div className={styles.barraColor} style={{ backgroundColor: color }}></div>
        </div>
    );
}