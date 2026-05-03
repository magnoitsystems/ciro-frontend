/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import styles from './newBudget.module.css';
import { budgetService } from '../../../services/budget.service';
import type { BudgetCreateDTO, BudgetResponseDTO } from '../../../types/budgets.types';
import type { PatientResponseDTO } from '../../../types/patients.types';
import { patientService } from '../../../services/patient.service';
import type { BudgetStatus } from '../../../types/enums.types';

type Prop = {
    onNuevoPacienteClick: () => void;
    onSuccess: () => void;
    type: 'create' | 'edit';
    id?: number;
    budget?: BudgetResponseDTO;
}

export default function NewBudget({ onNuevoPacienteClick, onSuccess, type, budget }: Prop) {
    const [patient, setPatient] = useState<PatientResponseDTO[]>([]);
    const [status, setStatus] = useState<BudgetStatus>('ENVIADO');
    const [patientId, setPatientId] = useState(-1);
    const [file, setFile] = useState<File>();
    const [date, setDate] = useState('');
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(false);
    const estados = ['ENVIADO', 'ACEPTADO', 'ACEPTADO_PARCIALMENTE', 'RECHAZADO', 'PENDIENTE_DE_RESPUESTA', 'SIN_ENVIAR', 'SIN_HACER'];

    useEffect(() => {
        if (type === 'edit' && budget) {
            setDate(budget?.date ? budget.date.slice(0, 10) : '');
            setPatientId(budget?.patientId ?? -1);
            setTitle(budget?.title ?? '');
            setStatus(budget?.status ?? 'ENVIADO');
        }
    }, [type, budget]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const payload: BudgetCreateDTO = {
            patientId,
            title,
            date,
            status,
            file
        };

        try {
            if (type === 'create') {
                await budgetService.createBudget(payload);
                alert('Presupuesto creado exitosamente');
            } else {
                await budgetService.updateBudget(budget!.id, payload);
                alert('Presupuesto actualizado');
            }
            onSuccess(); 
        } catch (error: any) {
            console.error(error);
            alert('Hubo un error al guardar');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        patientService.getAllPatients()
            .then(fetchedPatients => setPatient(fetchedPatients))
            .catch(error => console.error('Error fetching patients:', error));
    }, []);

    return (
        <div className={styles.newBudget}>
            <div className={styles.textContainer}>
                <h6>Para cargar un nuevo presupuesto complete los siguientes datos.</h6>
                <h6>Si no se elige un paciente al que asignar el mismo, el estado del presupuesto sera “Pendiente” hasta que se determine a quien pertenece. De lo contrario, se catalogará como “Enviado”.</h6>
            </div>
            <div className={styles.formContainer}>
                <form onSubmit={handleSubmit} className={styles.formContainer}>
                    <div className={styles.holeInput}>
                        <label htmlFor="patient">Paciente destinatario</label>
                        <select id="patient" name="patient" value={patientId} onChange={(e) => {
                            if (e.target.value === 'nuevo') {
                                onNuevoPacienteClick();
                            } else {
                                setPatientId(Number(e.target.value));
                            }
                        }}>
                            <option value="">Seleccione un paciente</option>
                            {patient.map((paciente) => (
                                <option key={paciente.id} value={paciente.id}>{paciente.fullName}</option>
                            ))}
                            <option value="nuevo">Crear nuevo paciente +</option>
                        </select>
                    </div>
                    <div className={styles.holeInput}>
                        <label htmlFor="date">Fecha de carga</label>
                        <div className={styles.fileInputContainer}>
                            <input type="date" id="date" name="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                        </div>
                    </div>
                    <div className={styles.holeInput}>
                        <label htmlFor="title">Título</label>
                        <div className={styles.fileInputContainer}>
                            <input type="text" id="title" name="title" placeholder="Título" value={title} maxLength={50} onChange={(e) => setTitle(e.target.value)} required />
                        </div>
                    </div>
                    <div className={styles.holeInput}>
                        <label htmlFor="state">Estado</label>
                        <select id="state" name="state" value={status} onChange={(e) => setStatus(e.target.value as BudgetStatus)}>
                            <option value="">Seleccione un estado</option>
                            {estados.map((estado) => (
                                <option key={estado} value={estado}>{estado}</option>
                            ))}
                        </select>
                    </div>
                    <div className={styles.holeInput}>
                        <label htmlFor="file">Adjunte el presupuesto</label>
                        <div className={styles.fileInputContainer}>
                            <input type="file" id="file" name="file" accept=".pdf,.doc,.docx,.jpg,.png" required={type === 'create'} onChange={(e) => {
                                if (e.target.files) {
                                    setFile(e.target.files[0]);
                                }
                            }} />
                        </div>
                    </div>
                    <button className={styles.buttonFormProperties} type="submit" disabled={loading}>
                        {loading ? 'Cargando...' : 'Cargar presupuesto'}
                    </button>
                </form>
            </div>
        </div>
    )
}