import styles from './newBudget.module.css';

export default function NewBudget() {
    return (
        <div className={styles.newBudget}>
            <div className={styles.textContainer}>
                <p>Para cargar un nuevo presupuesto complete los siguientes datos.</p>
                <p>Si no se elige un paciente al que asignar el mismo, el estado del presupuesto sera “Pendiente” hasta que se determine a quien pertenece. De lo contrario, se catalogará como “Enviado”.</p>
            </div>
            <div className={styles.formContainer}>
                <form className={styles.formContainer}>
                    <div>
                        <label htmlFor="file">Ajunte el presupuesto</label>
                        <div className={styles.fileInputContainer}>
                        <input type="file" id="file" name="file" accept=".pdf,.doc,.docx,.jpg,.png" required placeholder='Suba un archivo' />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="patient">Paciente destinatario</label>
                        <select id="patient" name="patient">
                            <option value="">Seleccione un paciente</option>
                            <option value="patient1">Paciente 1</option>
                        </select>
                    </div>

                    <button className={styles.buttonFormProperties} type="submit">Cargar presupuesto</button>
                </form>
            </div>
        </div>
    )
}