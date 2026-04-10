import styles from './patient.module.css';
import { useState } from 'react';
import type { PatientCreateDTO } from '../types/patients.types';
import { patientService } from '../services/patient.service';
import { useNavigate } from 'react-router-dom'


export default function Patient() {
    const navigate = useNavigate()

    const [patient, setPatient] = useState<PatientCreateDTO>({} as PatientCreateDTO);

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
        <div className={styles.formPatientContainer}>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Nombre y apellido</label>
                    <input type="text" id="name" name="name" placeholder="Ingrese el nombre y apellido del paciente" onClick={() => handleChange} />
                </div>
                <div>
                    <label htmlFor="address">Dirección</label>
                    <input type="text" id="address" name="address" placeholder="Ingrese la dirección del paciente" onClick={() => handleChange} />
                </div>
                <div>
                    <label htmlFor="city">Ciudad</label>
                    <input type="text" id="city" name="city" placeholder="Ingrese la ciudad del paciente" onClick={() => handleChange} />
                </div>
                <div>
                    <label htmlFor="phone">Teléfono</label>
                    <input type="text" id="phone" name="phone" placeholder="Ingrese el teléfono del paciente" onClick={() => handleChange} />
                </div>
                <div>
                    <label htmlFor="birthDate">Fecha de nacimiento</label>
                    <input type="date" id="birthDate" name="birthDate" onClick={() => handleChange} />
                </div>
                <div>
                    <label htmlFor="documentType">Tipo de documento</label>
                    <select id="documentType" name="documentType" onClick={() => handleChange}>
                        <option value="DNI">DNI</option>
                        <option value="Pasaporte">Pasaporte</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="dni">Número de documento</label>
                    <input type="text" id="dni" name="dni" placeholder="Ingrese el número de documento del paciente" onClick={() => handleChange} />
                </div>
                <div>
                    <label htmlFor="obraSocial">Obra social</label>
                    <input type="text" id="obraSocial" name="obraSocial" placeholder="Ingrese la obra social del paciente" onClick={() => handleChange} />
                </div>
                <div>
                    <label htmlFor="from">Dirección</label>
                    <input type="text" id="from" name="from" placeholder="Ingrese la dirección del paciente" onClick={() => handleChange} />
                </div>
                <div>
                    <label htmlFor="observations">Observaciones</label>
                    <input type="text" id="observations" name="observations" placeholder="Ingrese observaciones sobre el paciente" onClick={() => handleChange} />
                </div>
                <div>
                    <label htmlFor="createdById">Creado por</label>
                    <input type="number" id="createdById" name="createdById" placeholder="Ingrese el ID del usuario que creó el paciente" onClick={() => handleChange} />
                </div>
                <button type="submit">Crear paciente</button>
            </form>
        </div>
    )
}