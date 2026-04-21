import { useEffect, useState } from 'react';
import styles from './newBudget.module.css';
import { budgetService } from '../../../services/budget.service';
import { useNavigate } from 'react-router-dom'
import type { BudgetCreateDTO } from '../../../types/budgets.types';
import type { PatientResponseDTO } from '../../../types/patients.types';
import { patientService } from '../../../services/patient.service';
import type { BudgetStatus } from '../../../types/enums.types';

type Prop = {
    onNuevoPacienteClick: () => void;
}

export default function NewBudget({ onNuevoPacienteClick }: Prop) {
    const [patient, setPatient] = useState<PatientResponseDTO[]>([]);
    const navigate = useNavigate()
    const [status, setStatus] = useState<BudgetStatus>('ENVIADO')
    const [patientId, setPatientId] = useState(-1)
    const [file, setFile] = useState<File>()
    const [date, setDate] = useState('')
    const estados = ['ENVIADO', 'ACEPTADO', 'ACEPTADO_PARCIALMENTE', 'RECHAZADO', 'PENDIENTE_DE_RESPUESTA', 'SIN_ENVIAR', 'SIN_HACER']

    useEffect(() => {
        patientService.getAllPatients()
            .then(fetchedPatients => setPatient(fetchedPatients))
            .catch(error => console.error('Error fetching patients:', error));
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const newBudget: BudgetCreateDTO = {
            patientId,
            date,
            status,
            file
        }

        try {
            await budgetService.createBudget(newBudget)
            navigate('/presupuestos.tsx')
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
                        <label htmlFor="patient">Paciente destinatario</label>
                        <select id="patient" name="patient" onChange={(e) => {
                            if (e.target.value === 'nuevo') {
                                onNuevoPacienteClick();
                            } else {
                                setPatientId(Number(e.target.value))
                            }
                        }}>
                            <option value="">Seleccione un paciente</option>
                            {patient.map((paciente) => (
                                <option key={paciente.id} value={paciente.id}>{paciente.fullName}</option>
                            ))}
                            <option value="nuevo">Crear nuevo paciente +</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="date">Fecha de carga</label>
                        <div className={styles.fileInputContainer}>
                            <input type="date" id="uploadedDate" name="date" onChange={(e) => setDate(e.target.value)} required />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="state">Estado</label>
                        <select id="state" name="state" onChange={(e) => setStatus(e.target.value as BudgetStatus)}>
                            <option value="">Seleccione un paciente</option>
                            {estados.map((estado) => (
                                <option key={estado} value={estado}>{estado}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="file">Ajunte el presupuesto</label>
                        <div className={styles.fileInputContainer}>
                            <input type="file" id="file" name="file" accept=".pdf,.doc,.docx,.jpg,.png" required placeholder='Suba un archivo' onChange={(e) => {
                                if (e.target.files) {
                                    setFile(e.target.files[0])
                                }
                            }} />
                        </div>
                    </div>
                    <button className={styles.buttonFormProperties} type="submit">Cargar presupuesto</button>
                </form>
            </div>
        </div>
    )
}