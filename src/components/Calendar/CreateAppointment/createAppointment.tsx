import styles from './CreateAppointment.module.css';

type Props = {
    name: string;
    onClose: () => void;
    type: 'create' | 'edit';
    turnos?: {
        title: string;
        start: string | Date;
    };
}

export default function CreateAppointment({ name, onClose, type, turnos }: Props) {
    const startValue = turnos?.start instanceof Date
        ? turnos.start.toISOString().slice(0, 16)
        : turnos?.start ?? ''
    return (
        <div className={styles.backgroundTransparents}>
            <form className={styles.formContainerProperties}>
                {type === 'create' ? (
                    <h3>{name}, complete los siguientes datos para crear el turno</h3>
                ) : (
                    <h3>{name}, complete los siguientes datos necesario para modificar el turno</h3>
                )}
                <div className={styles.campsContainerProperties}>
                    <div className={styles.labelAndInputProperties}>
                        <label>Fecha</label>
                        <input type='date' name='date' value={type === 'create' ? '' : startValue} />
                    </div>
                    <div className={styles.labelAndInputProperties}>
                        <label>Paciente</label>
                        <select>
                // me llega la lista de pacientes y los recorro. Por cada uno, se arma un option.
                            <option>Seleccione un paciente</option>
                            <option><button>Crear nuevo paciente +</button></option>
                        </select>
                    </div>
                    <div className={styles.labelAndInputProperties}>
                        <label>Horario</label>
                       

                        <input type='datetime-local' name='hour' value={type === 'create' ? '' : startValue} />
                    </div>

                    <div className={styles.buttonsContainerProperties}>
                        <button className={styles.confirmButton}>Confirmar turno</button>
                        <button className={styles.cancelButton} onClick={onClose}><img src='./icons/cancelIcon.png'></img></button>
                    </div>
                </div>
            </form>
        </div>
    )
}