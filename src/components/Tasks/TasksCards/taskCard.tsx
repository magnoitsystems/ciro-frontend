import { useState } from 'react';
import styles from './taskCard.module.css'
import type { TaskResponseDTO } from '../../../types/management.types';

//va a recibir las tareas

type BotonInfo = {
    tipo: string;
    subtipo?: string;
}

type Prop = {
    task: TaskResponseDTO
    onBotonClick: (boton: BotonInfo) => void
    onBotonEliminarClick: (boton: boolean) => void
}

export default function TaskCard({ task, onBotonClick, onBotonEliminarClick }: Prop) {
    const coloresPrioridad: Record<string, string> = {
        "HIGH": '#EB0C0C',
        "MEDIUM": '#FFFF00',
        "LOW": '#29C41B',
    }
    const [priority, setPriority] = useState(task.priority)
    const color = coloresPrioridad[priority] ?? '#FFFFFF'
    const [estado, setEstado] = useState('Pendiente');

     const taskStatus: Record<string, string> = {
        "PENDING": 'Pendiente',
        "IN_PROGRESS": 'En proceso',
        "COMPLETED": 'Completada',
    }

    const state = taskStatus[task.status]

    return (
        <div className={styles.cardContainerProperties}>
            <div className={styles.barraColor} style={{ backgroundColor: color }}></div>
            <div className={styles.containerProperties}>
                <div className={styles.infoContainerProperties}>
                    <h3>{task.title}</h3>
                    <h3>{task.taskDate ? new Date(task.taskDate).toLocaleDateString() : ''}</h3>
                </div>
                <div className={styles.buttonsContainerProperties}>
                    <div className={styles.selectProperties}>
                        <select value={estado} onChange={(e) => setEstado(e.target.value)}>
                            <option value={''}>Seleccione un estado</option>
                            <option value="Pendiente">{state}</option>
                            <option value="Pendiente">Pendiente</option>
                            <option value="En proceso">En proceso</option>
                            <option value="Finalizada">Finalizada</option>
                        </select>
                    </div>
                    <div className={styles.buttonsProperties}>
                        <button onClick={() => onBotonClick({ tipo: 'edit' })}><img src='./icons/editIcon.png' width={20} height={20}></img></button>
                        <button onClick={() => onBotonClick({ tipo: 'show' })}><img src='./icons/plus.png' width={20} height={20}></img></button>
                        <button onClick={() => setPriority("HIGH")}><img src='./icons/deudas.png'></img></button>
                        <button onClick={() => onBotonEliminarClick(true)}><img src='./icons/trash.png'></img></button>
                    </div>
                </div>
            </div>
            <div className={styles.barraColor} style={{ backgroundColor: color }}></div>
        </div>
    );
}