import type { NoteResponseDTO, TaskResponseDTO } from '../../../types/management.types';
import styles from './Appointment.module.css';
import type { ShiftResponseDTO } from '../../../types/clinical.types';
import { authService } from '../../../services/auth.service';
import { useState } from 'react';

type Prop = {
    type: 'view' | 'confirm';
    onClose: () => void
    component: string;
    turnos?: ShiftResponseDTO[]
    task?: TaskResponseDTO
    justComment?: boolean
    comment?: NoteResponseDTO
}

const nombresEstados: Record<string, string> = {
    'REQUIRED': 'Requerido',
    'ASSIGNED': 'Asignado',
}

const taskStatus: Record<string, string> = {
    "PENDING": 'Pendiente',
    "IN_PROGRESS": 'En proceso',
    "COMPLETED": 'Completada',
}

const taskPriority: Record<string, string> = {
    "HIGH": 'Alta',
    "MEDIUM": 'Media',
    "LOW": 'Baja',
}

const userName = authService.getUserName();

export default function Appointment({ type, onClose, component, turnos, task, justComment, comment }: Prop) {
    const [showSubTareas, setShowSubTareas] = useState(false);
    return (
        <div className={styles.mainContainerProperties}>
            <div className={styles.infoContainerProperties}>
                <div>
                    <h3>
                        {type === 'view'
                            ? (component === 'calendar'
                                ? `${userName}, aca el resumen del turno.`
                                : component === 'task'
                                    ? `${userName}, aca el resumen de la tarea.`
                                    : `${userName}, aca el resumen del comentario.`)
                            : component === 'calendar'
                                ? 'Buenisimo, el turno se ha agendado correctamente!'
                                : 'Buenisimo, la tarea se ha agendado correctamente!'}
                    </h3>
                </div>
                {!justComment && component === 'calendar' ? (
                    turnos?.map((turno) => (
                        <div className={styles.infoAppointmentProperties}>
                            <h4>Paciente: <span>{turno.patientFullName}</span></h4>
                            <h4>Fecha: <span>{new Date(turno.shiftDate).toLocaleDateString()}</span></h4>
                            <h4>Hora: <span>{new Date(turno.shiftDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></h4>
                            <h4>Estado: <span>{nombresEstados[turno.status] || turno.status}</span></h4>
                            <h4>Doctor: <span>{turno.doctorFullName}</span></h4>
                        </div>
                    ))
                ) : component === 'task' ? (
                    <div className={styles.infoTaskProperties}>
                        {!showSubTareas ? (
                            <div className={styles.infoAppointmentProperties}>
                                <h4>Fecha: <span>{task?.taskDate ? new Date(task.taskDate).toLocaleDateString() : ''}</span></h4>
                                <h4>Hora: <span>{task?.taskDate ? new Date(task.taskDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</span></h4>
                                <h4>Estado: <span>{taskStatus[task?.status || ''] || task?.status}</span></h4>
                                <h4>Prioridad: <span>{taskPriority[task?.priority || ''] || task?.priority}</span></h4>
                                <h4>Título: <span>{task?.title}</span></h4>
                                <h4>Doctor: <span>{task?.userFullName}</span></h4>
                                <h4>Descripción: <span>{task?.description}</span></h4>
                            </div>
                        ) : (
                            <div className={styles.subTareasContainerProperties}>
                                {task?.subtasks?.map((subtask) => (
                                    <div className={styles.checkListProperties} key={subtask.id}>
                                        <div>
                                            <label htmlFor="subTareas">{subtask.title}</label>
                                        </div>
                                    
                                        <input type="checkbox" id="subTareas" name="subTareas" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className={styles.infoCommentProperties}>
                        <h4>Comentario: <span>{comment?.description || 'No hay comentario disponible'}</span></h4>
                    </div>
                )}

                <div className={styles.buttonsContainerProperties}>
                    <div className={styles.buttonsProperties}>
                        <button onClick={onClose} className={styles.cancelButton}><img src='./icons/cancelIcon.png'></img></button>
                    </div>


                    {component === 'task' && task?.subtasks && task.subtasks.length > 0 && (
                        <button className={styles.showSubTareasProperties} onClick={() => setShowSubTareas(!showSubTareas)}>
                            {showSubTareas ? 'Ocultar sub-tareas' : 'Ver sub-tareas'}
                        </button>
                    )}

                </div>
            </div>
        </div>
    )
}