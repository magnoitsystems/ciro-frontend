import { useState, useEffect } from 'react';
import type { TaskCreateDTO, TaskResponseDTO } from '../../../types/management.types';
import styles from './CreateAppointment.module.css';
import { taskService } from '../../../services/task.service';

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
    onTaskSaved: (task: TaskResponseDTO) => void; // 🔥 NUEVO
}

export default function CreateAppointment({
    name,
    onClose,
    type,
    turnos,
    component,
    task,
    onlyComment,
    onTaskSaved
}: Props) {

    // 🔥 ESTADOS (agregados)
    const [date, setDate] = useState('');
    const [comment, setComment] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('');

    const startValueTurno = turnos?.start instanceof Date
        ? turnos.start.toISOString().slice(0, 16)
        : turnos?.start ?? '';

    // 🔥 cargar datos en edit
    useEffect(() => {
        if (type === 'edit' && task) {
            setDate(task.taskDate ?? '');
            setComment(task.noteDescription ?? '');
            setDescription(task.description ?? '');
            setPriority(task.priority ?? '');
        }
    }, [type, task]);

    // 🔥 SUBMIT
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload: TaskCreateDTO = {
            userId: 1,
            taskDate: date,
            title: "",
            description,
            status: "PENDING",
            priority: "HIGH",
            noteDescription: comment
        };


        try {
            let response;

            if (type === 'create') {
                response = await taskService.create(payload);
            } else {
                response = await taskService.update(task!.id, payload);
            }

            onTaskSaved(response); // 🔥 actualizar lista
            onClose(); // cerrar modal

        } catch (error:any) {
            console.error(error.response.data);
        }
    };

    return (
        <div className={styles.backgroundTransparents}>
            {/* 🔥 AGREGAR onSubmit */}
            <form className={styles.formContainerProperties} onSubmit={handleSubmit}>

                {type === 'create' && onlyComment === false ? (
                    <h3>{name}, complete los siguientes datos para crear {component === 'calendar' ? 'el turno' : 'la tarea'}</h3>
                ) : (
                    <h3>{name}, complete los siguientes datos necesario para modificar {component === 'calendar' ? 'el turno' : 'la tarea'}</h3>
                )}

                <div className={styles.campsContainerProperties}>

                    {onlyComment === false && (
                        <div className={styles.labelAndInputProperties}>
                            <label>Fecha</label>
                            <input
                                type='date'
                                name='date'
                                value={type === 'create' ? date : component === 'calendar' ? startValueTurno : date}
                                onChange={(e) => setDate(e.target.value)} // 🔥
                            />
                        </div>
                    )}

                    {onlyComment === false && (
                        <div className={styles.labelAndInputProperties}>
                            <label>Paciente</label>
                            <select>
                                <option>{component === 'task' ? task?.userFullName : 'Seleccione un paciente'}</option>
                                <option value="new">Crear nuevo paciente +</option>
                            </select>
                        </div>
                    )}

                    {component === 'calendar' && onlyComment === false && (
                        <div className={styles.labelAndInputProperties}>
                            <label>Horario</label>
                            <input
                                type='datetime-local'
                                name='hour'
                                placeholder={type === 'create' ? '' : startValueTurno}
                            />
                        </div>
                    )}

                    <div className={styles.labelAndInputProperties}>
                        <label>Comentario</label>
                        <input
                            type='text'
                            name='comment'
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder={type === 'create' ? 'Comentario' : ''}
                        />
                    </div>

                    {component === 'task' && (
                        <div className={styles.labelAndInputProperties}>
                            <label>Descripción</label>
                            <input
                                type='text'
                                name='task'
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder={type === 'create' ? 'Nueva descripción' : ''}
                            />
                        </div>
                    )}

                    {component === 'task' && (
                        <div className={styles.labelAndInputProperties}>
                            <label>Tarea</label>
                            <input
                                type='text'
                                name='task'
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                    )}

                    {component === 'task' && (
                        <div className={styles.labelAndInputProperties}>
                            <label>Prioridad</label>
                            <select
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                            >
                                <option>{task != null ? task?.priority : 'Seleccione una prioridad'}</option>
                                <option value="HIGH">Alta</option>
                                <option value="MEDIUM">Media</option>
                                <option value="LOW">Baja</option>
                            </select>
                        </div>
                    )}

                    <div className={styles.buttonsContainerProperties}>
                        {/* 🔥 type submit */}
                        <button type="submit" className={styles.confirmButton}>
                            {component === 'calendar' ? 'Confirmar turno' : 'Confirmar tarea'}
                        </button>

                        {/* 🔥 evitar submit accidental */}
                        <button type="button" className={styles.cancelButton} onClick={onClose}>
                            <img src='./icons/cancelIcon.png'></img>
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}