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
    task?: { 
        cliente: string;
        fecha: Date;
        estado: string;
        prioridad: string;
        tarea: string;
        comentario?: string;
    }
    //turnos
}

export default function Appointment({ type , onClose, component, turnos, task }: Prop) {
    return (
        <div className={styles.mainContainerProperties}>
            <div className={styles.infoContainerProperties}>
                <div>
                   <h3>{type === 'view' ? (component === 'calendar' ? 'Ciro, aca el resumen del turno.' : 'Ciro, aca el resumen de la tarea.') : component === 'calendar' ? 'Buenisimo, el turno se ha agendado correctamente!' : 'Buenisimo, la tarea se ha agendado correctamente!'}</h3>
                </div>
                <div className={styles.infoAppointmentProperties}>
                    <h4>Paciente: <span>{turnos?.title || task?.cliente}</span></h4>
                    <h4>Horario: <span>{'09:00'}</span></h4>
<h4>Dia: <span>{turnos?.start ? new Date(turnos.start).toLocaleDateString() : task?.fecha ? new Date(task.fecha).toLocaleDateString() : ''}</span></h4>
                    <h4>Dr./Dra.: <span>{turnos?.title || 'Martin Rogriguez'}</span></h4>
                    {type === 'view' && component === 'calendar' && (
                        <h4>Como nos conocio? <span>Instagram</span></h4>
                    )}
                    <h4>Comentario: <span>{turnos?.comment || task?.comentario || 'No hay comentario disponible'}</span></h4>
                </div>
                <div className={styles.buttonsProperties}>
                    <button onClick={onClose} className={styles.cancelButton}><img src='./icons/cancelIcon.png'></img></button>
                </div>
            </div>
        </div>
    )
}