import { useState } from 'react';
import type { TaskResponseDTO } from '../../../types/management.types';
import styles from './Appointment.module.css';
import type { ShiftResponseDTO } from '../../../types/clinical.types';

type Prop = {
    type: 'view' | 'confirm';
    onClose: () => void
    component: string;
    turnos?: ShiftResponseDTO[]
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
                {turnos?.map((turno, index) => (
                    <div className={styles.infoAppointmentProperties}>
                        <h4>Paciente: <span>{turno?.patientFullName || task?.userFullName}</span></h4>
                        <h4>Horario: <span>{'09:00'}</span></h4>
                        <h4>Dia: <span>{turno?.shiftDate ? new Date(turno.shiftDate).toLocaleDateString() : task?.taskDate ? new Date(task.taskDate).toLocaleDateString() : ''}</span></h4>
                        {type === 'view' && component === 'calendar' && (
                            <h4>Dr./Dra.: <span>{turno?.doctorFullName}</span></h4>
                        )}
                        {type === 'view' && component === 'calendar' && (
                            <h4>Como nos conocio? <span>Instagram</span></h4>
                        )}
                        <h4>Comentario: <span>{turno?.noteDescription || task?.noteDescription || 'No hay comentario disponible'}</span></h4>
                        {component === 'task' && (
                            <h4>Descripción: <span>{task?.description || 'No hay descripción disponible'}</span></h4>
                        )}
                    </div>
                ))}
                <div className={styles.buttonsProperties}>
                    <button onClick={onClose} className={styles.cancelButton}><img src='./icons/cancelIcon.png'></img></button>
                </div>
            </div>
        </div>
    )
}