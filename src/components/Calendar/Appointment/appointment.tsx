import type { NoteResponseDTO, TaskResponseDTO } from '../../../types/management.types';
import styles from './Appointment.module.css';
import type { ShiftResponseDTO } from '../../../types/clinical.types';

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

export default function Appointment({ type, onClose, component, turnos, task, justComment, comment }: Prop) {
    return (
        <div className={styles.mainContainerProperties}>
            <div className={styles.infoContainerProperties}>
                <div>
                    <h3>{type === 'view' ? (component === 'calendar' ? 'Ciro, aca el resumen del turno.' : 'Ciro, aca el resumen de la tarea.') : component === 'calendar' ? 'Buenisimo, el turno se ha agendado correctamente!' : 'Buenisimo, la tarea se ha agendado correctamente!'}</h3>
                </div>
                {!justComment ? (
                    turnos?.map((turno) => (
                        <div className={styles.infoAppointmentProperties}>
                            <h4>Paciente: <span>{turno.patientFullName}</span></h4>
                            <h4>Fecha: <span>{new Date(turno.shiftDate).toLocaleDateString()}</span></h4>
                            <h4>Hora: <span>{new Date(turno.shiftDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></h4>
                            <h4>Estado: <span>{nombresEstados[turno.status] || turno.status}</span></h4>
                        </div>
                    ))
                ) : (
                    <div className={styles.infoCommentProperties}>
                        <h4>Comentario: <span>{comment?.description || 'No hay comentario disponible'}</span></h4>
                    </div>

                )}

                <div className={styles.buttonsProperties}>
                    <button onClick={onClose} className={styles.cancelButton}><img src='./icons/cancelIcon.png'></img></button>
                </div>
            </div>
        </div>
    )
}