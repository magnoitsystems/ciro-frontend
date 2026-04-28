import styles from './patient.module.css';
import { useState } from 'react';
import type { PatientCreateDTO } from '../../types/patients.types';
import { patientService } from '../../services/patient.service';
import { useNavigate } from 'react-router-dom';
import type { DocumentType, HealthInsurance, PatientFrom } from '../../types/enums.types';

type PatientProps = {
    onNuevoPacienteClick: () => void;
}

export default function Patient({ onNuevoPacienteClick }: PatientProps) {
    const navigate = useNavigate();
    const [next, setNext] = useState(false);

    const currentUserId = Number(localStorage.getItem('userId')) || 0;

    const [formData, setFormData] = useState<PatientCreateDTO>({
        fullName: '',
        address: '',
        city: '',
        phone: '',
        birthDate: '',
        documentType: 'DNI',
        dni: '',
        obraSocial: 'PARTICULAR',
        from: 'INSTAGRAM',
        observations: '',
        createdById: currentUserId
    });

    const documentTypes: DocumentType[] = ['DNI', 'CUIT', 'CUIL', 'CDI', 'LE', 'LC', 'PASAPORTE', 'OTRO'];
    const himKnowOur: PatientFrom[] = ['RECOMMENDATION', 'FACEBOOK', 'INSTAGRAM', 'TIKTOK', 'WEBSITE', 'ANOTHER'];
    const healthInsurances: HealthInsurance[] = ['PARTICULAR', 'OSDE', 'SWISS_MEDICAL', 'GALENO', 'SANCOR_SALUD', 'IOMA', 'PAMI', 'OMINT', 'OTRA'];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await patientService.createPatient(formData);
            onNuevoPacienteClick();
            navigate('/budget.tsx'); 
        } catch (error) {
            console.error("Error creando el paciente:", error);
        }
    };

    return (
        <div className={styles.formPatientContainerProperties}>
            <form onSubmit={handleSubmit} className={styles.formPatienProperties}>
                <button type="button" className={styles.closeIcon} onClick={onNuevoPacienteClick}>
                    &times;
                </button>

                <h3>Nuevo Paciente</h3>
                <p className={styles.subtitle}>Complete los datos necesarios para crear el perfil</p>

                {!next ? (
                    <div className={styles.containerPatientLabelProperties}>
                        <div className={styles.formPatientLabelProperties}>
                            <label htmlFor="fullName">Nombre y apellido *</label>
                            <input required value={formData.fullName} onChange={handleChange} type="text" id="fullName" name="fullName" placeholder="Ej: Juan Pérez" />
                        </div>
                        <div className={styles.formPatientLabelProperties}>
                            <label htmlFor="address">Dirección</label>
                            <input value={formData.address} onChange={handleChange} type="text" id="address" name="address" placeholder="Ej: Calle Falsa 123" />
                        </div>
                        <div className={styles.formPatientLabelProperties}>
                            <label htmlFor="city">Ciudad</label>
                            <input value={formData.city} onChange={handleChange} type="text" id="city" name="city" placeholder="Ej: Mar del Plata" />
                        </div>
                        <div className={styles.formPatientLabelProperties}>
                            <label htmlFor="phone">Teléfono</label>
                            <input value={formData.phone} onChange={handleChange} type="text" id="phone" name="phone" placeholder="Ej: 223 123 4567" />
                        </div>
                        <div className={styles.formPatientLabelProperties}>
                            <label htmlFor="birthDate">Fecha de nacimiento</label>
                            <input value={formData.birthDate} onChange={handleChange} type="date" id="birthDate" name="birthDate" />
                        </div>
                        
                        <div className={styles.buttonsProperties}>
                            <button type="button" className={styles.cancelButton} onClick={onNuevoPacienteClick}>Cancelar</button>
                            <button type="button" className={styles.nextButton} onClick={() => setNext(true)}>Siguiente</button>
                        </div>
                    </div>
                ) : (
                    <div className={styles.containerPatientLabelProperties}>
                        <div className={styles.formPatientLabelProperties}>
                            <label htmlFor="documentType">Tipo de documento</label>
                            <select id="documentType" name="documentType" value={formData.documentType} onChange={handleChange}>
                                {documentTypes.map((type) => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>
                        <div className={styles.formPatientLabelProperties}>
                            <label htmlFor="dni">Número de documento *</label>
                            <input required value={formData.dni} onChange={handleChange} type="text" id="dni" name="dni" placeholder="Ej: 35123456" />
                        </div>
                        <div className={styles.formPatientLabelProperties}>
                            <label htmlFor="obraSocial">Obra social</label>
                            <select id="obraSocial" name="obraSocial" value={formData.obraSocial} onChange={handleChange}>
                                {healthInsurances.map((insurance) => (
                                    <option key={insurance} value={insurance}>{insurance.replace('_', ' ')}</option>
                                ))}
                            </select>
                        </div>
                        <div className={styles.formPatientLabelProperties}>
                            <label htmlFor="from">Nos conoció por</label>
                            <select id="from" name="from" value={formData.from} onChange={handleChange}>
                                {himKnowOur.map((source) => (
                                    <option key={source} value={source}>{source}</option>
                                ))}
                            </select>
                        </div>
                        <div className={styles.formPatientLabelProperties}>
                            <label htmlFor="observations">Observaciones</label>
                            <textarea 
                                value={formData.observations} 
                                onChange={handleChange} 
                                id="observations" 
                                name="observations" 
                                placeholder="Alergias, notas médicas, etc..." 
                                rows={3}
                            />
                        </div>
                        
                        <div className={styles.buttonsProperties}>
                            <button type="button" className={styles.lastButton} onClick={() => setNext(false)}>Anterior</button>
                            <button type="submit" className={styles.createButton}>Crear paciente</button>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
}