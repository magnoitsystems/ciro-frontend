/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import style from "../../pages/pacientes/Pacientes.module.css";
import ProvInput from "../Forms/NewProvForm/ProvInput.tsx";
import LightGreyButton from "../Buttons/LightGreyButton/lightGreyButton.tsx";
import { userService } from "../../services/user.service";
import type { PatientResponseDTO } from "../../types/patients.types";
import type { MedicalRecordResponseDTO, MedicalRecordCreateDTO } from "../../types/clinical.types";
import type { UserResponseDTO } from "../../types/users.types";
import { medicalRecordService } from "../../services/medical-record.service.ts";

type Props = {
    paciente: PatientResponseDTO;
    onClose: () => void;
};

export default function HistoriaClinicaModal({ paciente, onClose }: Props) {
    const [historias, setHistorias] = useState<MedicalRecordResponseDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [creatingHistoria, setCreatingHistoria] = useState(false);
    
    const [newRecord, setNewRecord] = useState<Partial<MedicalRecordCreateDTO>>({});
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [doctors, setDoctors] = useState<UserResponseDTO[]>([]);

    const [feedback, setFeedback] = useState<{ show: boolean, type: 'success' | 'error', message: string } | null>(null);

    useEffect(() => {
        fetchHistorias();
        fetchDoctors();
    }, [paciente.dni]);

    const fetchHistorias = async () => {
        try {
            setLoading(true);
            const data = await medicalRecordService.getByPatientDni(paciente.dni);
            setHistorias(data);
        } catch (error) {
            console.error("Error al cargar historias clínicas:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchDoctors = async () => {
        try {
            const data = await userService.getAllUsers();
            setDoctors(data.filter(u => u.role === 'ADMIN' || u.role === 'USER'));
        } catch (error) {
            console.error("Error al cargar doctores:", error);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5242880) {
                setFeedback({ show: true, type: 'error', message: 'El archivo es muy pesado. Máximo 5MB.' });
                setSelectedFile(null);
                return;
            }
            setSelectedFile(file);
        } else {
            setSelectedFile(null);
        }
    };

    const handleSaveRecord = async () => {
        if (!newRecord.evaluation || !newRecord.doctorId) {
            setFeedback({ show: true, type: 'error', message: 'Por favor, completá la evaluación y seleccioná un doctor.' });
            return;
        }

        try {
            setFeedback(null); 
            const payload: MedicalRecordCreateDTO = {
                patientDni: paciente.dni,
                doctorId: newRecord.doctorId,
                evaluation: newRecord.evaluation,
                recordDate: newRecord.recordDate || new Date().toISOString().split("T")[0],
                file: selectedFile || undefined
            };

            await medicalRecordService.create(payload);
            
            fetchHistorias();
            setCreatingHistoria(false);
            setNewRecord({});
            setSelectedFile(null);
            
            setFeedback({ show: true, type: 'success', message: '¡Evolución guardada con éxito!' });
            
            setTimeout(() => setFeedback(null), 3000);

        } catch (error) {
            console.error("Error al guardar:", error);
            setFeedback({ show: true, type: 'error', message: 'Hubo un problema al guardar. Intentá nuevamente.' });
        }
    };

    return (
        <div className={style.overlay} onClick={onClose}>
            <div className={style.modal} onClick={(e) => e.stopPropagation()}>
                
                {feedback && feedback.show && (
                    <div className={feedback.type === 'success' ? style.feedbackSuccess : style.feedbackError}>
                        {feedback.message}
                        <button onClick={() => setFeedback(null)}>✕</button>
                    </div>
                )}

                <div className={style.modalHeader}>
                    <h3>Historias Clínicas - {paciente.fullName}</h3>
                    <button className={style.close} onClick={onClose}>✕</button>
                </div>

                {!creatingHistoria ? (
                    <>
                        <div className={style.turnosList}>
                            {loading ? (
                                <p style={{ textAlign: "center", opacity: 0.7 }}>Cargando historias...</p>
                            ) : historias.length > 0 ? (
                                historias.map(h => (
                                    <div key={h.id} className={style.turnoItem}>
                                        <div className={style.row}>
                                            <span>Fecha:</span> 
                                            <h6>{h.recordDate ? new Date(h.recordDate).toLocaleDateString('es-AR') : "-"}</h6>
                                        </div>
                                        <div className={style.row}>
                                            <span>Doctor:</span> 
                                            <h6>{h.doctorFullName || `ID: ${h.doctorId}`}</h6>
                                        </div>
                                        <div className={style.column}>
                                            <span>Evaluación:</span> 
                                            <p>{h.evaluation}</p>
                                        </div>
                                        {h.fileUrl && (
                                            <div className={style.row}>
                                                <span>Archivo adjunto:</span> 
                                                <a href={h.fileUrl} target="_blank" rel="noopener noreferrer">Ver documento</a>
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p style={{ textAlign: "center", opacity: 0.7 }}>No hay historias clínicas registradas.</p>
                            )}
                        </div>
                        
                        <div className={style.actionButtonWrapper}>
                            <LightGreyButton text="+ Nueva Evolución" onClick={() => { setCreatingHistoria(true); setFeedback(null); }} variant="primary" />
                        </div>
                    </>
                ) : (
                    <div className={style.formModal}>
                        <h4>Nueva Evolución</h4>
                        
                        <ProvInput 
                            placeholder="Fecha (Opcional, asume hoy)" 
                            type="date" 
                            className="inputBoxDefault" 
                            value={newRecord.recordDate || ''} 
                            onChange={(e) => setNewRecord({...newRecord, recordDate: e.target.value})} 
                        />
                        
                        <ProvInput 
                            placeholder="Evaluación médica..." 
                            as="textarea" 
                            className="inputBoxBig" 
                            value={newRecord.evaluation || ''} 
                            onChange={(e) => setNewRecord({...newRecord, evaluation: e.target.value})} 
                        />
                        
                        <div className={style.fileUpload}>
                            <label className={style.fileLabel}>
                                📎 Adjuntar archivo (Max 5MB)
                                <input type="file" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" />
                            </label>
                            {selectedFile && <span className={style.fileName}>{selectedFile.name}</span>}
                        </div>

                        <ProvInput 
                            placeholder="Doctor a cargo" 
                            as="select" 
                            className="inputBoxDefault" 
                            value={String(newRecord.doctorId || '')} 
                            onChange={(e) => setNewRecord({...newRecord, doctorId: Number(e.target.value)})} 
                            options={[
                                { value: "", label: "Seleccione un doctor" },
                                ...doctors.map(d => ({ value: String(d.id), label: d.name }))
                            ]} 
                        />
                        
                        <div className={style.modalActions}>
                            <div className={style.actionButtonWrapper}>
                                <LightGreyButton text="Guardar Evolución" onClick={handleSaveRecord} variant="primary" />
                            </div>
                            
                            <span className={style.back} onClick={() => { setCreatingHistoria(false); setNewRecord({}); setSelectedFile(null); setFeedback(null); }}>
                                ← Cancelar
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}