import styles from './Appointment.module.css';

type Prop = {
    type: 'view' | 'confirm';
     onClose: () => void
    //turnos
}

export default function Appointment({ type , onClose}: Prop) {
    return (
        <div className={styles.mainContainerProperties}>
            <div className={styles.infoContainerProperties}>
                <div>
                    <h3>{type == 'view' ? 'Ciro, aca el resumen del turno.' : 'Buenisimo, el turno se ha agendado correctamente!'}</h3>
                </div>
                <div className={styles.infoAppointmentProperties}>
                    <h4>Paciente: <span>Ana Bellinzona</span></h4>
                    <h4>Horario: <span>09:00</span></h4>
                    <h4>Dia: <span>23 de febrero</span></h4>
                    <h4>Dr./Dra.: <span>Martin Rogriguez</span></h4>
                    {type == 'view' && (
                        <h4>Como nos conocio? <span>Instagram</span></h4>
                    )}
                    <h4>Comentario: <span>este es un comentario</span></h4>
                </div>
                <div className={styles.buttonsProperties}>
                    <button onClick={onClose} className={styles.cancelButton}><img src='./icons/cancelIcon.png'></img></button>
                    {type == 'view' && (
                        <button className={styles.editButton}><img src='./icons/editIcon.png'></img></button>
                    )}
                </div>
            </div>
        </div>
    )
}