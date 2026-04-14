import { useState } from 'react';
import type { TaskResponseDTO } from '../../../types/management.types';
import styles from './CreateAppointment.module.css';

type Props = {
    name: string;
    onClose: () => void;
    type: 'create' | 'edit';
    turnos?: {
        title: string;
        start: string | Date;
        comment: string;
    };
    task?: TaskResponseDTO;
    component: string;
    onlyComment: boolean;
}

export default function CreateAppointment({ name, onClose, type, turnos, component, task, onlyComment }: Props) {
    const startValueTurno = turnos?.start instanceof Date
        ? turnos.start.toISOString().slice(0, 16)
        : turnos?.start ?? ''

    /*const startValueTask = task?.taskDate instanceof Date
    ? task.taskDate.toISOString().slice(0, 16)
    : task?.taskDate ?? ''*/
    return (
        <div className={styles.backgroundTransparents}>
            <form className={styles.formContainerProperties}>
                {type === 'create' && onlyComment === false ? (
                    <h3>{name}, complete los siguientes datos para crear {component === 'calendar' ? 'el turno' : 'la tarea'}</h3>
                ) : (
                    <h3>{name}, complete los siguientes datos necesario para modificar {component === 'calendar' ? 'el turno' : 'la tarea'}</h3>
                )}
                <div className={styles.campsContainerProperties}>

                    {onlyComment === false && (
                        <div className={styles.labelAndInputProperties}>
                            <label>Fecha</label>
                            <input type='date' name='date' value={type === 'create' ? '' : component === 'calendar' ? startValueTurno : task?.taskDate} />
                        </div>
                    )}

                     {onlyComment === false && (
                    <div className={styles.labelAndInputProperties}>
                        <label>Paciente</label>
                        <select>
                // me llega la lista de pacientes y los recorro. Por cada uno, se arma un option.
                            <option>{component === 'task' ? task?.userFullName : 'Seleccione un paciente'}</option>
                            <option><button>Crear nuevo paciente +</button></option>
                        </select>
                    </div>
                     )}
                    {component === 'calendar' && onlyComment === false && (
                        <div className={styles.labelAndInputProperties}>
                            <label>Horario</label>
                            <input type='datetime-local' name='hour' placeholder={type === 'create' ? '' : startValueTurno} />
                        </div>
                    )}
                    <div className={styles.labelAndInputProperties}>
                        <label>Comentario</label>
                        <input type='text' name='comment' placeholder={type === 'create' ? 'Comentario' : component === 'task' ? task?.noteDescription : turnos?.comment} />
                    </div>
                    {component === 'task' && (
                        <div className={styles.labelAndInputProperties}>
                            <label>Descripción</label>
                            <input type='textbox' name='task' placeholder={type === 'create' ? 'Nueva descripción' : task?.description} />
                        </div>
                    )}

                    {component === 'task' && (
                        <div className={styles.labelAndInputProperties}>
                            <label>Tarea</label>
                            <input type='text' name='task' placeholder={type === 'create' ? 'Nueva tarea' : task?.description} />
                        </div>
                    )}

                    {component === 'task' && (
                        <div className={styles.labelAndInputProperties}>
                            <label>Prioridad</label>
                            <select>
                                <option>{task != null ? task?.priority : 'Seleccione una prioridad'}</option>
                                <option>Alta</option>
                                <option>Media</option>
                                <option>Baja</option>
                            </select>
                        </div>
                    )}

                    <div className={styles.buttonsContainerProperties}>
                        <button className={styles.confirmButton}>{component === 'calendar' ? 'Confirmar turno' : 'Confirmar tarea'}</button>
                        <button className={styles.cancelButton} onClick={onClose}><img src='./icons/cancelIcon.png'></img></button>
                    </div>
                </div>
            </form>
        </div>
    )
}