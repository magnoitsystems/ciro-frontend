import styles from './patient.module.css';
import { useEffect, useState } from 'react';
import type { PatientCreateDTO } from '../types/patients.types';
import { patientService } from '../services/patient.service';
import { useNavigate } from 'react-router-dom'
import type { DocumentType, HealthInsurance, PatientFrom } from '../types/enums.types';
import { userService } from '../services/user.service';
import type { UserResponseDTO } from '../types/users.types';

type PatientProps = {
    onNuevoPacienteClick: () => void;
}


export default function Patient({ onNuevoPacienteClick }: PatientProps) {
    useEffect(() => {
        userService.getAllUsers()
        .then(fetchUser => setUsers(fetchUser))
        .catch(error => console.log(error))
    }, [])
    const navigate = useNavigate()

    const [patient, setPatient] = useState<PatientCreateDTO>({} as PatientCreateDTO);
    const [next, setNext] = useState(false)

    const [fullName, setNombre] = useState('')
    const [address, setDireccion] = useState('')
    const [city, setCiudad] = useState('')
    const [phone, setTelefono] = useState('')
    const [birthDate, setNacimiento] = useState('')
    const [documentType, setDocumentType] = useState<DocumentType>('DNI')
    const [dni, setDni] = useState('')
    const [obraSocial, setObraSocial] = useState<HealthInsurance>('PARTICULAR')
    const [from, setFrom] = useState<PatientFrom>('INSTAGRAM')
    const [observations, setObservaciones] = useState('')
    const [users, setUsers] = useState<UserResponseDTO[]>([])
    const [createdById, setCreateById] = useState(-1)
    const documentTypes = ['DNI', 'CUIT', 'CUIL', 'CDI', 'LE', 'LC', 'PASAPORTE', 'OTRO']
    const himKnowOur = ['RECOMMENDATION', 'FACEBOOK', 'INSTAGRAM', 'TIKTOK', 'WEBSITE', 'ANOTHER']

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setPatient({ ...patient, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const newPatient: PatientCreateDTO = {
            fullName,
            address,
            city,
            phone,
            birthDate,
            documentType,
            dni,
            obraSocial,
            from,
            observations,
            createdById
        }

        try {
            await patientService.createPatient(newPatient) 
            navigate('/budget.tsx') 
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
                            <input value={fullName} onChange={(e) => setNombre(e.target.value)} type="text" id="name" name="name" placeholder="Nombre y apellido del paciente" onClick={() => handleChange} />
                        </div>
                        <div className={styles.formPatientLabelProperties}>
                            <label htmlFor="address">Dirección</label>
                            <input value={address} onChange={(e) => setDireccion(e.target.value)} type="text" id="address" name="address" placeholder="Dirección del paciente" onClick={() => handleChange} />
                        </div>
                        <div className={styles.formPatientLabelProperties}>
                            <label htmlFor="city">Ciudad</label>
                            <input value={city} onChange={(e) => setCiudad(e.target.value)} type="text" id="city" name="city" placeholder="Ciudad del paciente" onClick={() => handleChange} />
                        </div>
                        <div className={styles.formPatientLabelProperties}>
                            <label htmlFor="phone">Teléfono</label>
                            <input value={phone} onChange={(e) => setTelefono(e.target.value)} type="text" id="phone" name="phone" placeholder="Teléfono del paciente" onClick={() => handleChange} />
                        </div>
                        <div className={styles.formPatientLabelProperties}>
                            <label htmlFor="birthDate">Fecha de nacimiento</label>
                            <input value={birthDate} onChange={(e) => setNacimiento(e.target.value)} type="date" id="birthDate" name="birthDate" onClick={() => handleChange} />
                        </div>
                        <div className={styles.buttonsProperties}>
                            <button className={styles.cancelButton} onClick={() => (onNuevoPacienteClick())}>Cancelar </button>
                            <button className={styles.nextButton} onClick={() => setNext(!next)}>Siguente</button>
                        </div>
                    </div>

                ) : (
                    <div className={styles.containerPatientLabelProperties}>
                        <div className={styles.formPatientLabelProperties}>
                            <label>Tipo de documento</label>
                            <select onChange={(e) => setDocumentType(e.target.value as DocumentType)}>
                                {documentTypes.map((documentType) => (
                                    <option>
                                        {documentType}
                                    </option>
                                ))}

                            </select>
                        </div>
                        <div className={styles.formPatientLabelProperties}>
                            <label htmlFor="dni">Número de documento</label>
                            <input value={dni} onChange={(e) => setDni(e.target.value)} type="text" id="dni" name="dni" placeholder="Número de documento del paciente" onClick={() => handleChange} />
                        </div>
                        <div className={styles.formPatientLabelProperties}>
                            <label htmlFor="obraSocial">Obra social</label>
                            <input value={obraSocial} onChange={(e) => setObraSocial(e.target.value as HealthInsurance)} type="text" id="obraSocial" name="obraSocial" placeholder="Obra social del paciente" onClick={() => handleChange} />
                        </div>
                        <div className={styles.formPatientLabelProperties}>
                            <label htmlFor="observations">Observaciones</label>
                            <input value={observations} onChange={(e) => setObservaciones(e.target.value)} type="text" id="observations" name="observations" placeholder="Observaciones sobre el paciente" onClick={() => handleChange} />
                        </div>
                        <div className={styles.formPatientLabelProperties}>
                            <label>Nos conoció por</label>
                            <select onChange={(e) => setFrom(e.target.value as PatientFrom)}>
                                {himKnowOur.map((from) => (
                                    <option>
                                        {from}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className={styles.formPatientLabelProperties}>
                            <label>Creado por</label>
                            <select onChange={(e) => setCreateById(Number(e.target.value))}>
                                {users.map((user) => (
                                    <option value={user.id}>
                                        {user.username}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className={styles.buttonsProperties}>
                            <button className={styles.lastButton} onClick={() => setNext(!next)}>Anterior </button>
                            <button className={styles.createButton} type="submit">Crear paciente</button>
                        </div>
                    </div>
                )
                }
            </form >
        </div >
    )
}