import { useEffect, useState } from 'react';
import styles from './newBudget.module.css';
import { budgetService } from '../../../services/budget.service';
import { useNavigate } from 'react-router-dom'
import type { BudgetCreateDTO } from '../../../types/budgets.types';
import type { PatientResponseDTO } from '../../../types/patients.types';
import { patientService } from '../../../services/patient.service';

type Prop = {
    onNuevoPacienteClick: () => void;
}


export default function NewBudget({ onNuevoPacienteClick }: Prop) {
    const [patient, setPatient] = useState<PatientResponseDTO[]>([]);
    const navigate = useNavigate()

    useEffect(() => {
        patientService.getAllPatients()
            .then(fetchedPatients => setPatient(fetchedPatients))
            .catch(error => console.error('Error fetching patients:', error));
    }, [])

    const [data, setData] = useState<BudgetCreateDTO>({} as BudgetCreateDTO);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setData({ ...data, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault() // evita que recargue la página
        try {
            await budgetService.createBudget(data) // hago la petición a la API para crear la tarea
            navigate('/budget.tsx') // redirijo a la página de tareas para ver la nueva tarea creada
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className={styles.newBudget}>
            <div className={styles.textContainer}>
                <p>Para cargar un nuevo presupuesto complete los siguientes datos.</p>
                <p>Si no se elige un paciente al que asignar el mismo, el estado del presupuesto sera “Pendiente” hasta que se determine a quien pertenece. De lo contrario, se catalogará como “Enviado”.</p>
            </div>
            <div className={styles.formContainer}>
                <form onSubmit={handleSubmit} className={styles.formContainer}>
                    <div>
                        <label htmlFor="date">Fecha de carga</label>
                        <div className={styles.fileInputContainer}>
                            <input type="date" id="date" name="date" onClick={() => handleChange} required />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="file">Ajunte el presupuesto</label>
                        <div className={styles.fileInputContainer}>
                            <input type="file" id="file" name="file" accept=".pdf,.doc,.docx,.jpg,.png" required placeholder='Suba un archivo' onClick={() => handleChange} />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="patient">Paciente destinatario</label>
                        <select id="patient" name="patient" onChange={(e) => {
                            if (e.target.value === 'nuevo') {
                                onNuevoPacienteClick();
                            } else {
                                handleChange(e)
                            }
                        }}>
                            <option value="">Seleccione un paciente</option>
                            {patient.map((paciente) => (
                                <option key={paciente.id} value={paciente.id}>{paciente.fullName}</option>
                            ))}
                            <option value="nuevo">Crear nuevo paciente +</option>
                        </select>
                    </div>

                    <button className={styles.buttonFormProperties} type="submit">Cargar presupuesto</button>
                </form>
            </div>
        </div>
    )
}