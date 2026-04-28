import styles from './patient.module.css';
import { useState } from 'react';
import type { PatientCreateDTO } from '../../types/patients.types';
import { patientService } from '../../services/patient.service';
import { useNavigate } from 'react-router-dom';
import type { DocumentType, HealthInsurance, PatientFrom } from '../../types/enums.types';
import ProvInput from '../../components/Forms/NewProvForm/ProvInput.tsx';

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
        <div className={styles.overlay} onClick={onNuevoPacienteClick}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                
                <div className={styles.modalHeader}>
                    <h3>Nuevo Paciente</h3>
                    <button type="button" className={styles.close} onClick={onNuevoPacienteClick}>
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    {!next ? (
                        <>
                            <ProvInput 
                                placeholder="Nombre y apellido *" 
                                value={formData.fullName} 
                                onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))} 
                                className="inputBoxDefault" 
                            />
                            
                            <ProvInput 
                                placeholder="Fecha de nacimiento" 
                                type="date"
                                value={formData.birthDate} 
                                onChange={(e) => setFormData(prev => ({ ...prev, birthDate: e.target.value }))} 
                                className="inputBoxDefault" 
                            />
                            
                            <ProvInput 
                                placeholder="Dirección (Ej: Calle 123)" 
                                value={formData.address} 
                                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))} 
                                className="inputBoxDefault" 
                            />
                            
                            <ProvInput 
                                placeholder="Ciudad (Ej: Mar del Plata)" 
                                value={formData.city} 
                                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))} 
                                className="inputBoxDefault" 
                            />
                            
                            <ProvInput 
                                placeholder="Teléfono (Ej: 223 123 4567)" 
                                value={formData.phone} 
                                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))} 
                                className="inputBoxDefault" 
                            />

                            <div className={styles.submitButton}>
                                <button type="button" className={styles.cancelButton} onClick={onNuevoPacienteClick}>Cancelar</button>
                                <button type="button" className={styles.nextButton} onClick={() => setNext(true)}>Siguiente</button>
                            </div>
                        </>
                    ) : (
                        <>
                            <ProvInput 
                                placeholder="Tipo de documento" 
                                as="select"
                                value={formData.documentType} 
                                onChange={(e) => setFormData(prev => ({ ...prev, documentType: e.target.value as DocumentType }))} 
                                className="inputBoxDefault"
                                options={documentTypes.map(t => ({ value: t, label: t }))}
                            />
                            
                            <ProvInput 
                                placeholder="Número de documento *" 
                                value={formData.dni} 
                                onChange={(e) => setFormData(prev => ({ ...prev, dni: e.target.value }))} 
                                className="inputBoxDefault" 
                            />
                            
                            <ProvInput 
                                placeholder="Obra social" 
                                as="select"
                                value={formData.obraSocial} 
                                onChange={(e) => setFormData(prev => ({ ...prev, obraSocial: e.target.value as HealthInsurance }))} 
                                className="inputBoxDefault"
                                options={healthInsurances.map(i => ({ value: i, label: i.replace('_', ' ') }))}
                            />
                            
                            <ProvInput 
                                placeholder="Nos conoció por" 
                                as="select"
                                value={formData.from} 
                                onChange={(e) => setFormData(prev => ({ ...prev, from: e.target.value as PatientFrom }))} 
                                className="inputBoxDefault"
                                options={himKnowOur.map(s => ({ value: s, label: s }))}
                            />
                            
                            <ProvInput 
                                placeholder="Observaciones (Alergias, notas...)" 
                                value={formData.observations} 
                                onChange={(e) => setFormData(prev => ({ ...prev, observations: e.target.value }))} 
                                className="inputBoxBig" 
                            />

                            <div className={styles.submitButton}>
                                <button type="button" className={styles.lastButton} onClick={() => setNext(false)}>Anterior</button>
                                <button type="submit" className={styles.createButton}>Crear paciente</button>
                            </div>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
}