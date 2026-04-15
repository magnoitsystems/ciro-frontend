import { useState } from 'react';
import type { TaskResponseDTO } from '../../../types/management.types';
import styles from './Appointment.module.css';

type Prop = {
    type: 'view' | 'confirm';
    onClose: () => void
    component: string;
    turnos?: {
        title: string;
        start: string | Date;
        comment: string;
    }
    task?: TaskResponseDTO
    //turnos
}

export default function Appointment({ type, onClose, component, turnos, task }: Prop) {
    return (
        <div className={styles.mainContainerProperties}>
            <div className={styles.infoContainerProperties}>
                <div>
                    <h3>{type === 'view' ? (component === 'calendar' ? 'Ciro, aca el resumen del turno.' : 'Ciro, aca el resumen de la tarea.') : component === 'calendar' ? 'Buenisimo, el turno se ha agendado correctamente!' : 'Buenisimo, la tarea se ha agendado correctamente!'}</h3>
                </div>
                <div className={styles.infoAppointmentProperties}>
                    <h4>Paciente: <span>{turnos?.title || task?.userFullName}</span></h4>
                    <h4>Horario: <span>{'09:00'}</span></h4>
                    <h4>Dia: <span>{turnos?.start ? new Date(turnos.start).toLocaleDateString() : task?.taskDate ? new Date(task.taskDate).toLocaleDateString() : ''}</span></h4>
                    {type === 'view' && component === 'calendar' && (
                        <h4>Dr./Dra.: <span>{turnos?.title}</span></h4>
                    )}
                    {type === 'view' && component === 'calendar' && (
                        <h4>Como nos conocio? <span>Instagram</span></h4>
                    )}
                    <h4>Comentario: <span>{turnos?.comment || task?.noteDescription || 'No hay comentario disponible'}</span></h4>
                    {component === 'task' && (
                        <h4>Descripción: <span>{task?.description || 'No hay descripción disponible'}</span></h4>
                    )}
                </div>
                <div className={styles.buttonsProperties}>
                    <button onClick={onClose} className={styles.cancelButton}><img src='./icons/cancelIcon.png'></img></button>
                </div>
            </div>
        </div>
    )
}