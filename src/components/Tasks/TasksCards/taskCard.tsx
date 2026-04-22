import styles from './taskCard.module.css'
import type { TaskResponseDTO } from '../../../types/management.types';
import type { TaskStatus } from '../../../types/enums.types';

//va a recibir las tareas

type BotonInfo = {
    tipo: string;
    subtipo?: string;
}

type Prop = {
    task: TaskResponseDTO
    onBotonClick: (boton: BotonInfo) => void
    onBotonEliminarClick: (boton: boolean) => void
    onPriorityChange: (task: TaskResponseDTO) => void
    onStatusChange: (task: TaskResponseDTO, status: TaskStatus) => void
}

export default function TaskCard({ task, onBotonClick, onBotonEliminarClick, onPriorityChange, onStatusChange }: Prop) {

const coloresPrioridad: Record<string, string> = {
    "HIGH": '#EB0C0C',
    "MEDIUM": '#FFFF00',
    "LOW": '#29C41B',
}

const color = coloresPrioridad[task.priority] ?? '#FFFFFF'

const taskStatus: Record<string, string> = {
    "PENDING": 'Pendiente',
    "IN_PROGRESS": 'En proceso',
    "COMPLETED": 'Completada',
}

const state = taskStatus[task.status]

return (
    <div className={styles.cardContainerProperties}>
        <div className={styles.upperBarraColor} style={{ backgroundColor: color }}></div>
        <div className={styles.containerProperties}>
            <div className={styles.infoContainerProperties}>
                <h4>{task.title}</h4>
                <h5>{task.taskDate ? new Date(task.taskDate).toLocaleDateString() : ''}</h5>
            </div>
            <div className={styles.buttonsContainerProperties}>
                <div className={styles.selectProperties}>
                    <h6>{state}</h6>
                </div>
                <div className={styles.buttonsProperties}>
                    <button onClick={() => onBotonClick({ tipo: 'edit' })}><img src='./icons/editIcon.png' width={20} height={20}></img></button>
                    <button onClick={() => onBotonClick({ tipo: 'show' })}><img src='./icons/plus.png' width={20} height={20}></img></button>
                    <button onClick={() => onPriorityChange(task)}><img src='./icons/deudas.png'></img></button>
                    <button onClick={() => onBotonEliminarClick(true)}><img src='./icons/trash.png'></img></button>
                </div>
            </div>
        </div>
        <div className={styles.bottomBarraColor} style={{ backgroundColor: color }}></div>
    </div>
);
}