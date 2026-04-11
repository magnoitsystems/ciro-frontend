import styles from './patient.module.css';
import { useState } from 'react';
import type { PatientCreateDTO } from '../types/patients.types';
import { patientService } from '../services/patient.service';
import { useNavigate } from 'react-router-dom'

type PatientProps = {
    onNuevoPacienteClick: () => void;
}


export default function Patient({ onNuevoPacienteClick }: PatientProps) {
    const navigate = useNavigate()

    const [patient, setPatient] = useState<PatientCreateDTO>({} as PatientCreateDTO);
    const [next, setNext] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setPatient({ ...patient, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault() // evita que recargue la página
        try {
            await patientService.createPatient(patient) // hago la petición a la API para crear la tarea
            navigate('/budget.tsx') // redirijo a la página de tareas para ver la nueva tarea creada
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className={styles.formPatientContainerProperties}>
            <form onSubmit={handleSubmit} className={styles.formPatienProperties}>
                <h3>Complete los datos necesarios para crear al paciente</h3>
                {!next ? (
                    <div className={styles.containerPatientLabelProperties}>
                        <div className={styles.formPatientLabelProperties}>
                            <label htmlFor="name">Nombre y apellido</label>
                            <input type="text" id="name" name="name" placeholder="Nombre y apellido del paciente" onClick={() => handleChange} />
                        </div>
                        <div className={styles.formPatientLabelProperties}>
                            <label htmlFor="address">Dirección</label>
                            <input type="text" id="address" name="address" placeholder="Dirección del paciente" onClick={() => handleChange} />
                        </div>
                        <div className={styles.formPatientLabelProperties}>
                            <label htmlFor="city">Ciudad</label>
                            <input type="text" id="city" name="city" placeholder="Ciudad del paciente" onClick={() => handleChange} />
                        </div>
                        <div className={styles.formPatientLabelProperties}>
                            <label htmlFor="phone">Teléfono</label>
                            <input type="text" id="phone" name="phone" placeholder="Teléfono del paciente" onClick={() => handleChange} />
                        </div>
                        <div className={styles.formPatientLabelProperties}>
                            <label htmlFor="birthDate">Fecha de nacimiento</label>
                            <input type="date" id="birthDate" name="birthDate" onClick={() => handleChange} />
                        </div>

                        <div className={styles.buttonsProperties}>
                            <button className={styles.cancelButton} onClick={() => (onNuevoPacienteClick())}>Cancelar </button>
                            <button className={styles.nextButton} onClick={() => setNext(!next)}>Siguente</button>
                        </div>
                    </div>

                ) : (
                    <div className={styles.containerPatientLabelProperties}>
                        <div className={styles.formPatientLabelProperties}>
                            <label htmlFor="documentType">Tipo de documento</label>
                            <select id="documentType" name="documentType" onClick={() => handleChange}>
                                <option value="DNI">DNI</option>
                                <option value="Pasaporte">Pasaporte</option>
                            </select>
                        </div>
                        <div className={styles.formPatientLabelProperties}>
                            <label htmlFor="dni">Número de documento</label>
                            <input type="text" id="dni" name="dni" placeholder="Número de documento del paciente" onClick={() => handleChange} />
                        </div>
                        <div className={styles.formPatientLabelProperties}>
                            <label htmlFor="obraSocial">Obra social</label>
                            <input type="text" id="obraSocial" name="obraSocial" placeholder="Obra social del paciente" onClick={() => handleChange} />
                        </div>
                        <div className={styles.formPatientLabelProperties}>
                            <label htmlFor="from">Dirección</label>
                            <input type="text" id="from" name="from" placeholder="Dirección del paciente" onClick={() => handleChange} />
                        </div>
                        <div className={styles.formPatientLabelProperties}>
                            <label htmlFor="observations">Observaciones</label>
                            <input type="text" id="observations" name="observations" placeholder="Observaciones sobre el paciente" onClick={() => handleChange} />
                        </div>

                        <div className={styles.buttonsProperties}>
                            <button className={styles.lastButton} onClick={() => setNext(!next)}>Anterior </button>
                            <button className={styles.createButton} type="submit">Crear paciente</button>
                        </div>
                    </div>
                )}
            </form>
        </div>
    )
}