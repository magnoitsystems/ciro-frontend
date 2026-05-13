/* eslint-disable react-hooks/static-components */
import styles from './patient.module.css';
import { useState } from 'react';
import type { PatientCreateDTO } from '../../types/patients.types';
import { patientService } from '../../services/patient.service';
import { useNavigate } from 'react-router-dom';
import type { DocumentType, HealthInsurance, PatientFrom, ReasonForConsultation, AppointmentStatus } from '../../types/enums.types';
import ProvInput from '../../components/Forms/NewProvForm/ProvInput.tsx';

type PatientProps = {
    onNuevoPacienteClick: () => void;
}

export default function Patient({ onNuevoPacienteClick }: PatientProps) {
    const navigate = useNavigate();
    const [next, setNext] = useState(false);
    const [errors, setErrors] = useState<Record<string, boolean>>({});

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
        appointmentStatus: 'TODAVIA_NO', 
        reasonForConsultation: 'OTRO',
        observations: '',
        createdById: currentUserId
    });

    const documentTypesOptions = [
        { value: 'DNI', label: 'DNI' },
        { value: 'CUIT', label: 'CUIT' },
        { value: 'CUIL', label: 'CUIL' },
        { value: 'CDI', label: 'CDI' },
        { value: 'LE', label: 'LE' },
        { value: 'LC', label: 'LC' },
        { value: 'PASAPORTE', label: 'Pasaporte' },
        { value: 'OTRO', label: 'Otro' }
    ];

    const healthInsurancesOptions = [
        { value: 'PARTICULAR', label: 'Particular' },
        { value: 'OSDE', label: 'OSDE' },
        { value: 'SWISS_MEDICAL', label: 'Swiss Medical' },
        { value: 'GALENO', label: 'Galeno' },
        { value: 'SANCOR_SALUD', label: 'Sancor Salud' },
        { value: 'IOMA', label: 'IOMA' },
        { value: 'PAMI', label: 'PAMI' },
        { value: 'OMINT', label: 'Omint' },
        { value: 'OTRA', label: 'Otra' }
    ];

    const fromOptions = [
        { value: 'RECOMMENDATION', label: 'Recomendación' },
        { value: 'FACEBOOK', label: 'Facebook' },
        { value: 'INSTAGRAM', label: 'Instagram' },
        { value: 'TIKTOK', label: 'TikTok' },
        { value: 'WEBSITE', label: 'Sitio Web' },
        { value: 'ANOTHER', label: 'Otro' }
    ];

    const turnosOptions = [
        { value: 'SACO_TURNO', label: 'Sacó turno' },
        { value: 'TODAVIA_NO', label: 'Todavía no' },
        { value: 'NO_VA_A_SACAR', label: 'No va a sacar' },
        { value: 'NO_RESPONDIO', label: 'No respondió' },
        { value: 'SACO_PERO_CANCELO', label: 'Sacó pero canceló'}
    ];

    const motivosOptions = [
       { value: 'CIRUGIA_ORTOGNATICA_MAXILOFACIAL', label: 'Cirugía Ortognática Maxilofacial'},
       { value: 'IMPLANTOLOGIA', label: 'Implantología'},
       { value: 'ESTETICA_DENTAL', label: 'Estética dental'},
       { value: 'BLANQUEAMIENTO', label: 'Blanqueamiento'},
       { value: 'PROTESIS', label: 'Prótesis'},
       { value: 'ORTODONCIA', label: 'Ortodoncia'},
       { value: 'ODONTOPEDIATRIA_ORTOPEDIA_FUNCIONAL', label: 'Odontopediatría Ortopedia Funcional'},
       { value: 'ODONTOLOGIA_GENERAL_RESTAURACION', label: 'Odontología General Restauración'},
       { value: 'LIMPIEZA_DENTAL_PROFILAXIS', label: 'Limpeza dental profilaxis'},
       { value: 'REGENERACION_RECONSTRUCCION_OSEA', label: 'Regeneración Reconstrucción ósea'},
       { value: 'ESTETICA_FACIAL', label: 'Estética facial'},
       { value: 'OTRO', label: 'Otro'}
    ];

    const handleNextStep = () => {
        const newErrors: Record<string, boolean> = {};
        if (!(formData.fullName || '').trim()) newErrors.fullName = true;
        if (!(formData.city || '').trim()) newErrors.city = true;
        if (!(formData.phone || '').trim()) newErrors.phone = true;

        setErrors(prev => ({ ...prev, ...newErrors }));

        if (Object.keys(newErrors).length > 0) {
            return;
        }
        setNext(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const newErrors: Record<string, boolean> = {};
        if (!(formData.fullName || '').trim()) newErrors.fullName = true;
        if (!(formData.city || '').trim()) newErrors.city = true;
        if (!(formData.phone || '').trim()) newErrors.phone = true;
        if (!(formData.dni || '').trim()) newErrors.dni = true;
        if (!formData.from) newErrors.from = true;
        if (!formData.appointmentStatus) newErrors.appointmentStatus = true;
        if (!formData.reasonForConsultation) newErrors.reasonForConsultation = true;

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            return;
        }

        try {
            await patientService.createPatient(formData);
            onNuevoPacienteClick(); 
            navigate('/budget.tsx'); 
        } catch (error) {
            console.error("Error creando el paciente:", error);
        }
    };

    const ErrorMsg = () => <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '-10px', marginBottom: '10px', display: 'block' }}>Por favor, complete este campo.</span>;

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
                                onChange={(e) => {
                                    setFormData(prev => ({ ...prev, fullName: e.target.value }));
                                    if (errors.fullName) setErrors(prev => ({ ...prev, fullName: false }));
                                }} 
                                className="inputBoxDefault" 
                            />
                            {errors.fullName && <ErrorMsg />}
                            
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
                                placeholder="Ciudad (Ej: Mar del Plata) *" 
                                value={formData.city} 
                                onChange={(e) => {
                                    setFormData(prev => ({ ...prev, city: e.target.value }));
                                    if (errors.city) setErrors(prev => ({ ...prev, city: false }));
                                }} 
                                className="inputBoxDefault" 
                            />
                            {errors.city && <ErrorMsg />}
                            
                            <ProvInput 
                                placeholder="Teléfono (Ej: 223 123 4567) *" 
                                value={formData.phone} 
                                onChange={(e) => {
                                    setFormData(prev => ({ ...prev, phone: e.target.value }));
                                    if (errors.phone) setErrors(prev => ({ ...prev, phone: false }));
                                }} 
                                className="inputBoxDefault" 
                            />
                            {errors.phone && <ErrorMsg />}

                            <div className={styles.submitButton}>
                                <button type="button" className={styles.cancelButton} onClick={onNuevoPacienteClick}>Cancelar</button>
                                <button type="button" className={styles.nextButton} onClick={handleNextStep}>Siguiente</button>
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
                                options={documentTypesOptions}
                            />
                            
                            <ProvInput 
                                placeholder="Número de documento *" 
                                value={formData.dni} 
                                onChange={(e) => {
                                    setFormData(prev => ({ ...prev, dni: e.target.value }));
                                    if (errors.dni) setErrors(prev => ({ ...prev, dni: false }));
                                }} 
                                className="inputBoxDefault" 
                            />
                            {errors.dni && <ErrorMsg />}
                            
                            <ProvInput 
                                placeholder="Obra social" 
                                as="select"
                                value={formData.obraSocial} 
                                onChange={(e) => setFormData(prev => ({ ...prev, obraSocial: e.target.value as HealthInsurance }))} 
                                className="inputBoxDefault"
                                options={healthInsurancesOptions}
                            />
                            
                            <ProvInput 
                                placeholder="Nos conoció por *" 
                                as="select"
                                value={formData.from} 
                                onChange={(e) => {
                                    setFormData(prev => ({ ...prev, from: e.target.value as PatientFrom }));
                                    if (errors.from) setErrors(prev => ({ ...prev, from: false }));
                                }} 
                                className="inputBoxDefault"
                                options={fromOptions}
                            />
                            {errors.from && <ErrorMsg />}

                            <ProvInput 
                                placeholder="Turno *" 
                                as="select"
                                value={formData.appointmentStatus} 
                                onChange={(e) => {
                                    setFormData(prev => ({ ...prev, appointmentStatus: e.target.value as AppointmentStatus }));
                                    if (errors.appointmentStatus) setErrors(prev => ({ ...prev, appointmentStatus: false }));
                                }} 
                                className="inputBoxDefault"
                                options={turnosOptions}
                            />
                            {errors.appointmentStatus && <ErrorMsg />}

                            <ProvInput 
                                placeholder="Motivo de consulta *" 
                                as="select"
                                value={formData.reasonForConsultation} 
                                onChange={(e) => {
                                    setFormData(prev => ({ ...prev, reasonForConsultation: e.target.value as ReasonForConsultation }));
                                    if (errors.reasonForConsultation) setErrors(prev => ({ ...prev, reasonForConsultation: false }));
                                }} 
                                className="inputBoxDefault"
                                options={motivosOptions}
                            />
                            {errors.reasonForConsultation && <ErrorMsg />}
                            
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