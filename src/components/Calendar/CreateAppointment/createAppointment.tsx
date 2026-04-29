import { useState, useEffect } from 'react';
import type { TaskCreateDTO, TaskResponseDTO } from '../../../types/management.types';
import styles from './CreateAppointment.module.css';
import { taskService } from '../../../services/task.service';
import type { ShiftStatus, TaskPriority, TaskStatus } from '../../../types/enums.types';
import type { ShiftResponseDTO } from '../../../types/clinical.types';
import { shiftService } from '../../../services/shift.service';
import type { UserResponseDTO } from '../../../types/users.types';
import { userService } from '../../../services/user.service';
import { noteService } from '../../../services/note.service';

type Props = {
    name: string;
    onClose: () => void;
    type: 'create' | 'edit';
    turnos?: ShiftResponseDTO;
    task?: TaskResponseDTO;
    component: string;
    onlyComment: boolean;
    onTaskSaved?: (task: TaskResponseDTO) => void;
    dateCalendar?: Date;
}

export default function CreateAppointment({
    name,
    onClose,
    type,
    turnos,
    component,
    task,
    onlyComment,
    onTaskSaved,
    dateCalendar
}: Props) {
    const [date, setDate] = useState('');
    const [comment, setComment] = useState('');
    const [description, setDescription] = useState('');
    const [title, setTitle] = useState('');
    const [priority, setPriority] = useState<TaskPriority | ''>('');
    const [status, setStatus] = useState<TaskStatus>('PENDING');

    const [patientDni, setPatientDni] = useState('');
    const [doctorId, setDoctorId] = useState(0);
    const [statusShift, setStatusShift] = useState<ShiftStatus>('REQUIRED');
    /**const [noteContent, setNoteContent] = useState('');*/
    const [doctors, setDoctors] = useState<UserResponseDTO[]>([]);

    useEffect(() => {
        userService.getAllUsers()
        .then(fetchedDoctors => setDoctors(fetchedDoctors.filter(user => user.role === 'ADMIN' || user.role === 'USER')))
        .catch(error => console.error('Error fetching doctors:', error));
    }, []);

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
        handleSubmitComment(e);
        if (component === 'calendar') {
            handleSubmitShift(e);
            return;
        }
        else if (component === 'task') {
            handleSubmitTask(e);
            return;
        }
    
    };

    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("fecha: ", dateCalendar);

        const payload = {
            description: comment,
            shiftId: turnos?.id,
            date: dateCalendar ? dateCalendar.toISOString() : new Date().toISOString(),
            taskId: task?.id,
        };

        try {
            await noteService.create(payload);
            onClose();
        } catch (error) {
            console.error("Error al guardar el comentario:", error);
        }
    }

    const handleSubmitTask = async (e: React.FormEvent) => {
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

            if (onTaskSaved) {
                onTaskSaved(response);
            }
            onClose();

        } catch (error: any) {
            console.error(error);
        }
    }

    const handleSubmitShift = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            patientDni,
            doctorId,
            shiftDate: date,
            status: statusShift,
            noteContent: comment,
        };

        try {
            console.log("Payload para turno:", payload);
            if (type === 'create') {
                await shiftService.create(payload);
            } else {
                await shiftService.update(turnos!.id, payload);
            }
            onClose();
        } catch (error) {
            console.error("Error al guardar el turno:", error);
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

                    {!onlyComment && component === 'task' && (
                        <div className={styles.labelAndInputProperties}>
                            <label>Fecha</label>
                            <input
                                type='date'
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </div>
                    )}

                    {!onlyComment && component === 'calendar' && (
                        <div className={styles.labelAndInputProperties}>
                            <label>DNI del paciente</label>
                            <input
                                type='text'
                                value={patientDni}
                                onChange={(e) => setPatientDni(e.target.value)}
                                placeholder='DNI'
                            />
                        </div>
                    )}

                    {!onlyComment && component === 'calendar' && (
                        <div className={styles.labelAndInputProperties}>
                            <label>Estado</label>
                            <select value={statusShift} onChange={(e) => setStatusShift(e.target.value as ShiftStatus)}>
                                <option value="REQUIRED">Requerido</option>
                                <option value="ASSIGNED">Asignado</option>
                            </select>
                        </div>
                    )}

                    {!onlyComment && component === 'calendar' && (
                        <div className={styles.labelAndInputProperties}>
                            <label>Doctor</label>
                            <select value={doctorId} onChange={(e) => setDoctorId(Number(e.target.value))}>
                                <option value={0}>Seleccione un doctor</option>
                                {doctors.map((doctor) => (
                                    <option key={doctor.id} value={doctor.id}>
                                        {doctor.name}
                                    </option>
                                ))}
                            </select>
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
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
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