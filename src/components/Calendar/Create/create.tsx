/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import type { TaskCreateDTO, TaskResponseDTO } from '../../../types/management.types';
import styles from './Create.module.css';
import { taskService } from '../../../services/task.service';
import type { ShiftStatus, TaskPriority, TaskStatus } from '../../../types/enums.types';
import type { ShiftResponseDTO } from '../../../types/clinical.types';
import { shiftService } from '../../../services/shift.service';
import type { UserResponseDTO } from '../../../types/users.types';
import { userService } from '../../../services/user.service';
import { noteService } from '../../../services/note.service';
import { useNavigate } from 'react-router-dom';
import { patientService } from '../../../services/patient.service';
import type { PatientResponseDTO } from '../../../types/patients.types';
import type { SubtaskDTO } from '../../../types/management.types';
import { sub } from 'date-fns';

type Props = {
    name: string;
    onClose: () => void;
    type: 'create' | 'edit';
    turnos?: ShiftResponseDTO;
    task?: TaskResponseDTO;
    component: string;
    onlyComment: boolean;
    onTaskSaved?: (task: TaskResponseDTO) => void;
    onShiftSaved?: (shift: ShiftResponseDTO) => void;
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
    onShiftSaved,
    dateCalendar
}: Props) {
    const navigate = useNavigate();
    const [subTask, setSubTask] = useState({
        title: '',
        description: '',
        priority: '' as TaskPriority | '',
        status: 'PENDING' as TaskStatus,
        date: '',
    });
    const [subTasksList, setSubTasksList] = useState<SubtaskDTO[]>([]);
    const [date, setDate] = useState('');
    const [comment, setComment] = useState('');
    const [description, setDescription] = useState('');
    const [title, setTitle] = useState('');
    const [priority, setPriority] = useState<TaskPriority | ''>('');
    const [status, setStatus] = useState<TaskStatus>('PENDING');

    const [patientDni, setPatientDni] = useState('');
    const [doctorId, setDoctorId] = useState(0);
    const [statusShift, setStatusShift] = useState<ShiftStatus>('REQUIRED');
    const [doctors, setDoctors] = useState<UserResponseDTO[]>([]);
    const [subTasks, setSubTasks] = useState(false);

    const [loading, setLoading] = useState(false);
    const [showSubTareas, setShowSubTareas] = useState(false);

    const [patientSearch, setPatientSearch] = useState('');
    const [patients, setPatients] = useState<PatientResponseDTO[]>([]);
    const [filteredPatients, setFilteredPatients] = useState<PatientResponseDTO[]>([]);

    useEffect(() => {
        patientService.getAllPatients()
            .then(fetchedPatients => setPatients(fetchedPatients))
            .catch(error => console.error(error));
    }, []);

    const handlePatientSearch = (value: string) => {
        setPatientSearch(value)
        if (value.length > 0) {
            setFilteredPatients(
                patients.filter(p => p.fullName.toLowerCase().includes(value.toLowerCase()))
            )
        } else {
            setFilteredPatients([])
        }
    }

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
        console.log("voy a guardar")
        setLoading(true);

        if (onlyComment) {
            handleSubmitComment(e);
        }
        else if (component === 'calendar') {
            handleSubmitShift(e);
            return;
        }
        else if (component === 'task') {
            handleSubmitTask(e);
            return;
        }
    };

    const handleDeleteSubTask = (index: number) => {
        setSubTasksList(prev => prev.filter((_, i) => i !== index))
    }

    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            description: comment,
            shiftId: turnos?.id,
            date: dateCalendar ? dateCalendar.toISOString() : new Date().toISOString(),
            taskId: task?.id,
        };
        try {
            console.log("voy a crear el comentario")
            await noteService.create(payload);
            navigate('/Calendario');
            console.log("ya cree el comentario")
        } catch (error) {
            console.error("Error al guardar el comentario:", error);
        }
    }
    const handleSubmitSubTask = () => {

        if (!subTask.title.trim()) {
            alert("Ingrese un título para la subtarea");
            return;
        }

        const newSubTask: SubtaskDTO = {
            title: subTask.title,
            description: subTask.description,
            status: subTask.status,
        };

        setSubTasksList(prev => [...prev, newSubTask]);

        setSubTask({
            title: '',
            description: '',
            priority: '',
            status: 'PENDING',
            date: '',
        });
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
            subtasks: subTasksList,
        };

        try {
            let response;
            if (type === 'create') {
                response = await taskService.create(payload);
            } else {
                response = await taskService.update(task!.id, payload);
            }

            if (onTaskSaved) {
                onTaskSaved(response);
            }
            onClose();
            navigate('/Tareas');

        } catch (error: any) {
            console.error(error);
        }
    }

    const handleSubmitShift = async (e: React.FormEvent) => {
        e.preventDefault();

        const formattedDate = date.length === 16 ? `${date}:00` : date;

        const payload = {
            patientDni,
            doctorId,
            shiftDate: formattedDate,
            status: statusShift,
            noteDescription: comment,
        };

        try {
            let response;
            if (type === 'create') {
                response = await shiftService.create(payload);
            } else {
                response = await shiftService.update(turnos!.id, payload);
            }

            if (onShiftSaved) {
                onShiftSaved(response);
            }

            onClose();
            navigate('/Calendario');
        } catch (error) {
            console.error("Error al guardar el turno:", error);
        }
    };

    return (
        <div className={styles.backgroundTransparents}>
            {!showSubTareas ? (
                <form className={styles.formContainerProperties} onSubmit={handleSubmit}>

                    {type === 'create' && !onlyComment ? (
                        <h3>{name}, complete los siguientes datos para crear {component === 'calendar' ? 'el turno' : component === 'task' ? 'la tarea' : 'el comentario'}</h3>
                    ) : (
                        <h3>{name}, modifique los datos {component === 'calendar' ? 'del turno' : component === 'task' ? 'de la tarea' : 'del comentario'}</h3>
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
                                <label>Paciente</label>
                                <input
                                    type='text'
                                    value={patientSearch}
                                    onChange={(e) => handlePatientSearch(e.target.value)}
                                    placeholder='Buscar por nombre'
                                />
                                {filteredPatients.length > 0 && (
                                    <div className={styles.dropdownProperties}>
                                        {filteredPatients.map(patient => (
                                            <div
                                                key={patient.id}
                                                className={styles.dropdownItemProperties}
                                                onClick={() => {
                                                    setPatientDni(patient.dni)
                                                    setPatientSearch(patient.fullName)
                                                    setFilteredPatients([])
                                                }}
                                            >
                                                <span>{patient.fullName}</span>
                                                <span>{patient.dni}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
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
                    </div>

                    {subTasks && (
                        <div className={styles.subTasksContainerProperties}>
                            <div className={styles.inputProperties}>
                                <input
                                    type='text'
                                    value={subTask.title}
                                    onChange={(e) => setSubTask({ ...subTask, title: e.target.value })}
                                    placeholder='Título de la tarea'
                                />

                                <input
                                    type='text'
                                    value={subTask.description}
                                    onChange={(e) => setSubTask({ ...subTask, description: e.target.value })}
                                    placeholder='Descripción'
                                />

                                <select
                                    value={subTask.priority}
                                    onChange={(e) => setSubTask({ ...subTask, priority: e.target.value as TaskPriority })}
                                >
                                    <option value="">Seleccione una prioridad</option>
                                    <option value="HIGH">Alta</option>
                                    <option value="MEDIUM">Media</option>
                                    <option value="LOW">Baja</option>
                                </select>
                                <button
                                    disabled={loading}
                                    type="button"
                                    onClick={handleSubmitSubTask}
                                    className={styles.addSubTaskButton}
                                >
                                    <img src='./icons/plus.png' />
                                </button>
                            </div>
                        </div>
                    )}

                    <div className={styles.buttonsContainerProperties}>
                        <div className={styles.buttonsProperties}>
                            <button type="submit" className={styles.confirmButton} disabled={loading}>
                                {!loading && component === 'calendar' ? 'Confirmar turno' : !loading ? 'Confirmar tarea' : 'Confirmando...'}
                            </button>

                            <button type="button" className={styles.cancelButton} onClick={onClose}>
                                <img src='./icons/cancelIcon.png'></img>
                            </button>
                            <div className={styles.subTasksButtonsContainer}>
                                {component === 'task' && (
                                    <button
                                        type="button"
                                        className={styles.subTasksButton}
                                        onClick={() => {
                                            setSubTasks(!subTasks);
                                        }}
                                    >
                                        {subTasks ? 'Ocultar sub tareas' : 'Agregar sub tareas'}
                                    </button>
                                )}
                                {subTasksList.length > 0 && (
                                    <button className={styles.subTasksButton} onClick={() => setShowSubTareas(true)}>
                                        Ver subtareas ({subTasksList.length})
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </form>
            ) : (
                <div className={styles.formContainerProperties}>
                    <h2>Sub tareas</h2>
                    <div className={styles.subTaskItemContainer}>
                        {subTasksList.map((subtask, index) => (

                            <div key={index} className={styles.subTaskItemProperties}>
                                <div className={styles.subTaskInfoContainer}>
                                    <strong>{subtask.title}</strong>
                                    {subtask.description && ` - ${subtask.description}`}
                                </div>
                                <button className={styles.deleteSubTaskButtonContainer} onClick={() => handleDeleteSubTask(index)}>
                                    <img src='./icons/trash.png' alt="Eliminar" />
                                </button>
                            </div>
                        ))}
                    </div>
                    <button className={styles.subTasksButton} style={{ height: '40px' }} onClick={() => setShowSubTareas(false)}>
                        Volver
                    </button>
                </div>
            )}
        </div>
    )
}
