import { useState, useEffect } from 'react';
import type { TaskCreateDTO, TaskResponseDTO } from '../../../types/management.types';
import styles from './CreateAppointment.module.css';
import { taskService } from '../../../services/task.service';
import type { TaskPriority, TaskStatus } from '../../../types/enums.types';

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
    onTaskSaved: (task: TaskResponseDTO) => void;
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
    const [date, setDate] = useState('');
    const [comment, setComment] = useState('');
    const [description, setDescription] = useState('');
    const [title, setTitle] = useState('');
    const [priority, setPriority] = useState<TaskPriority | ''>('');
    const [status, setStatus] = useState<TaskStatus>('PENDING');

    const startValueTurno = turnos?.start instanceof Date
        ? turnos.start.toISOString().slice(0, 16)
        : turnos?.start ?? '';

    useEffect(() => {
        if (type === 'edit' && task) {
            setDate(task.taskDate ? task.taskDate.slice(0, 10) : '')
            setComment(task.noteDescription ?? '');
            setDescription(task.description ?? '');
            setTitle(task.title ?? '');
            setPriority(task.priority ?? '');
            setStatus(task.status ?? '')
        }
    }, [type, task]);

    const handleSubmit = async (e: React.FormEvent) => {
        console.log("SUBMIT ejecutado");
        e.preventDefault();

        if (!priority) {
            alert("Seleccioná una prioridad");
            return;
        }

        const payload: TaskCreateDTO = {
            userId: task?.userId != null ? task.userId : 1,
            taskDate: date + "T00:00:00",
            title,
            description,
            status,
            priority,
            noteDescription: comment,
        };

        console.log("Creo la tarea");

        try {
            let response;
            console.log("Entro al try");

            if (type === 'create') {
                console.log("Voy a crear la task");
                response = await taskService.create(payload);
            } else {
                response = await taskService.update(task!.id, payload);
            }

            onTaskSaved(response);
            onClose();

        } catch (error: any) {
            console.error(error);
        }
    };

    return (
        <div className={styles.backgroundTransparents}>
            <form className={styles.formContainerProperties} onSubmit={handleSubmit}>

                {type === 'create' && !onlyComment ? (
                    <h3>{name}, complete los siguientes datos para crear {component === 'calendar' ? 'el turno' : 'la tarea'}</h3>
                ) : (
                    <h3>{name}, modifique los datos de {component === 'calendar' ? 'el turno' : 'la tarea'}</h3>
                )}

                <div className={styles.campsContainerProperties}>

                    {!onlyComment && (
                        <div className={styles.labelAndInputProperties}>
                            <label>Fecha</label>
                            <input
                                type='date'
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </div>
                    )}

                    {component === 'task' && (
                        <div className={styles.labelAndInputProperties}>
                            <label>Título</label>
                            <input
                                type='text'
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder='Título de la tarea'
                            />
                        </div>
                    )}

                    {component === 'task' && (
                        <div className={styles.labelAndInputProperties}>
                            <label>Estado</label>
                            <select value={status} onChange={(e) => setStatus(e.target.value as TaskStatus)}>
                                <option value={''}>Seleccione un estado</option>
                                <option value="PENDING">Pendiente</option>
                                <option value="IN_PROGRESS">En proceso</option>
                                <option value="COMPLETED">Finalizada</option>
                            </select>
                        </div>
                    )}

                    {component === 'task' && (
                        <div className={styles.labelAndInputProperties}>
                            <label>Descripción</label>
                            <input
                                type='text'
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder='Descripción de la tarea'
                            />
                        </div>
                    )}

                    {component === 'task' && (
                        <div className={styles.labelAndInputProperties}>
                            <label>Prioridad</label>
                            <select
                                value={priority}
                                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                            >
                                <option value="">Seleccione una prioridad</option>
                                <option value="HIGH">Alta</option>
                                <option value="MEDIUM">Media</option>
                                <option value="LOW">Baja</option>
                            </select>
                        </div>
                    )}

                    <div className={styles.labelAndInputProperties}>
                        <label>Comentario (opcional)</label>
                        <input
                            type='text'
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder='Comentario de la tarea'
                        />
                    </div>

                    {component === 'calendar' && !onlyComment && (
                        <div className={styles.labelAndInputProperties}>
                            <label>Horario</label>
                            <input
                                type='datetime-local'
                                placeholder={type === 'create' ? 'Horario' : startValueTurno}
                            />
                        </div>
                    )}

                    <div className={styles.buttonsContainerProperties}>
                        <button type="submit" className={styles.confirmButton}>
                            {component === 'calendar' ? 'Confirmar turno' : 'Confirmar tarea'}
                        </button>

                        <button type="button" className={styles.cancelButton} onClick={onClose}>
                            <img src='./icons/cancelIcon.png'></img>
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}