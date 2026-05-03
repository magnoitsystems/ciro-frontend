import WelcomeText from "../../components/WelcomeText/welcomeText.tsx";
import style from './Pacientes.module.css';
import SearchBar from "../../components/SearchBar/searchBar.tsx";
import PacientCard from "../../components/PacientCard/pacientCards.tsx";
import { useState, useEffect } from "react";
import ProvInput from "../../components/Forms/NewProvForm/ProvInput.tsx";
import LightGreyButton from "../../components/Buttons/LightGreyButton/lightGreyButton.tsx";
import { NavLink } from "react-router-dom";
import { patientService } from "../../services/patient.service";
import type { PatientResponseDTO, PatientUpdateDTO } from "../../types/patients.types";
import type { HealthInsurance, PatientFrom } from '../../types/enums.types';
import Patient from "../../components/patients/patient.tsx";
import HistoriaClinicaModal from "../../components/HistoriaClinica/HistoriaClinicaModal.tsx";

export default function Pacientes() {

    const [search, setSearch] = useState("");
    
    const [pacientesState, setPacientesState] = useState<PatientResponseDTO[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchPacientes = async () => {
        try {
            setLoading(true);
            const data = await patientService.getAllPatients();
            setPacientesState(data);
        } catch (error) {
            console.error("Error al cargar los pacientes:", error);
            alert("Hubo un error al cargar los pacientes.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPacientes();
    }, []);

    const normalize = (text: string) => text.replace(/\D/g, "");
    const normalizeText = (text: string) =>
        text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    const queryText = normalizeText(search);
    const queryNumber = normalize(search);

    const filteredPacientes = pacientesState.filter((p) => {
        const textMatch = normalizeText(p.fullName || "").includes(queryText) || normalizeText(p.city || "").includes(queryText);
        const numberMatch = queryNumber && ((p.dni || "").includes(queryNumber) || normalize(p.phone || "").includes(queryNumber));
        return textMatch || numberMatch;
    });

    const [openModal, setOpenModal] = useState(false);
    const [selectedPaciente, setSelectedPaciente] = useState<PatientResponseDTO | null>(null);
    const [viewModal, setViewModal] = useState(false);
    
    const [editModal, setEditModal] = useState(false);
    const [editData, setEditData] = useState<PatientResponseDTO | null>(null);
    const [editNext, setEditNext] = useState(false);

    const [historiasModal, setHistoriasModal] = useState(false);

    const himKnowOur: PatientFrom[] = ['RECOMMENDATION', 'FACEBOOK', 'INSTAGRAM', 'TIKTOK', 'WEBSITE', 'ANOTHER'];
    const healthInsurances: HealthInsurance[] = ['PARTICULAR', 'OSDE', 'SWISS_MEDICAL', 'GALENO', 'SANCOR_SALUD', 'IOMA', 'PAMI', 'OMINT', 'OTRA'];

    const handleUpdatePatient = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editData) return;

        const updatePayload: PatientUpdateDTO = {
            fullName: editData.fullName,
            birthDate: editData.birthDate,
            address: editData.address,
            city: editData.city,
            phone: editData.phone,
            obraSocial: editData.obraSocial,
            from: editData.from,
            observations: editData.observations
        };

        try {
            await patientService.updatePatient(editData.id, updatePayload);
            
            fetchPacientes(); 
            setEditModal(false);
            setEditData(null);
            setEditNext(false);
        } catch (error) {
            console.error("Error editando el paciente:", error);
            alert("Hubo un error al guardar los cambios del paciente.");
        }
    };


    return(
        <main className={style.main}>
            <WelcomeText sectionText={'Acá el listado de los pacientes existentes.'} className={'darkStyle'} />

            <div className={style.functionalities}>
                <div className={style.searchBar}>
                    <SearchBar text="Buscá por Nombre, Apellido o DNI" value={search} onChange={setSearch} />
                </div>

                <div className={style.secondFunctionalities}>
                    <div className={style.estadistics}>
                        <NavLink to={'/estadisticas'}>
                            <img src={'/icons/estadistics.png'} alt={'estadistics'}/>
                        </NavLink>
                    </div>

                    <div className={style.newPacient} onClick={() => setOpenModal(true)}>
                        <img src={'/icons/plus.png'} alt={'plus'}/>
                    </div>
                </div>
            </div>

            <div className={style.pacientCards}>
                {loading ? (
                    <p style={{padding: '20px'}}>Cargando pacientes...</p>
                ) : filteredPacientes.length > 0 ? (
                    filteredPacientes.map((p) => (
                        <PacientCard
                            key={p.id}
                            id={p.id} 
                            nombre={p.fullName}
                            dni={p.dni}
                            onView={() => { setSelectedPaciente(p); setViewModal(true); }}
                            onEdit={() => { setEditData(p); setEditModal(true); setEditNext(false); }}
                            attachments={true}
                        />
                    ))
                ) : (
                    <p style={{padding: '20px'}}>No se encontraron pacientes.</p>
                )}
            </div>

            {openModal && (
                <Patient onNuevoPacienteClick={() => { setOpenModal(false); fetchPacientes(); }} />
            )}

            {editModal && editData && (
                <div className={style.overlay} onClick={() => setEditModal(false)}>
                    <div className={style.modal} onClick={(e) => e.stopPropagation()}>
                        
                        <div className={style.modalHeader}>
                            <h3>Editar Paciente</h3>
                            <button type="button" className={style.close} onClick={() => setEditModal(false)}>
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleUpdatePatient} className={style.form}>
                            {!editNext ? (
                                <>
                                    <ProvInput 
                                        placeholder="Nombre y apellido *" 
                                        value={editData.fullName} 
                                        onChange={(e) => setEditData(prev => ({ ...prev!, fullName: e.target.value }))} 
                                        className="inputBoxDefault" 
                                    />
                                    
                                    <ProvInput 
                                        placeholder="Fecha de nacimiento" 
                                        type="date"
                                        value={editData.birthDate} 
                                        onChange={(e) => setEditData(prev => ({ ...prev!, birthDate: e.target.value }))} 
                                        className="inputBoxDefault" 
                                    />
                                    
                                    <ProvInput 
                                        placeholder="Dirección (Ej: Calle 123)" 
                                        value={editData.address} 
                                        onChange={(e) => setEditData(prev => ({ ...prev!, address: e.target.value }))} 
                                        className="inputBoxDefault" 
                                    />
                                    
                                    <ProvInput 
                                        placeholder="Ciudad (Ej: Mar del Plata)" 
                                        value={editData.city} 
                                        onChange={(e) => setEditData(prev => ({ ...prev!, city: e.target.value }))} 
                                        className="inputBoxDefault" 
                                    />
                                    
                                    <ProvInput 
                                        placeholder="Teléfono (Ej: 223 123 4567)" 
                                        value={editData.phone} 
                                        onChange={(e) => setEditData(prev => ({ ...prev!, phone: e.target.value }))} 
                                        className="inputBoxDefault" 
                                    />

                                    <div className={style.submitButton}>
                                        <button type="button" className={style.cancelButton} onClick={() => setEditModal(false)}>Cancelar</button>
                                        <button type="button" className={style.nextButton} onClick={() => setEditNext(true)}>Siguiente</button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    
                                    <ProvInput 
                                        placeholder="Obra social" 
                                        as="select"
                                        value={editData.obraSocial} 
                                        onChange={(e) => setEditData(prev => ({ ...prev!, obraSocial: e.target.value as HealthInsurance }))} 
                                        className="inputBoxDefault"
                                        options={healthInsurances.map(i => ({ value: i, label: i.replace('_', ' ') }))}
                                    />
                                    
                                    <ProvInput 
                                        placeholder="Nos conoció por" 
                                        as="select"
                                        value={editData.from} 
                                        onChange={(e) => setEditData(prev => ({ ...prev!, from: e.target.value as PatientFrom }))} 
                                        className="inputBoxDefault"
                                        options={himKnowOur.map(s => ({ value: s, label: s }))}
                                    />
                                    
                                    <ProvInput 
                                        placeholder="Observaciones (Alergias, notas...)" 
                                        value={editData.observations} 
                                        onChange={(e) => setEditData(prev => ({ ...prev!, observations: e.target.value }))} 
                                        className="inputBoxBig" 
                                    />

                                    <div className={style.submitButton}>
                                        <button type="button" className={style.lastButton} onClick={() => setEditNext(false)}>Anterior</button>
                                        <button type="submit" className={style.createButton}>Guardar cambios</button>
                                    </div>
                                </>
                            )}
                        </form>
                    </div>
                </div>
            )}

            {viewModal && selectedPaciente && (
                <div className={style.overlay} onClick={() => setViewModal(false)}>
                    <div className={style.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={style.modalHeader}>
                            <h3>Detalle del paciente</h3>
                            <button className={style.close} onClick={() => setViewModal(false)}>✕</button>
                        </div>
                        <div className={style.details}>
                            <div className={style.section}>
                                <h5>Datos personales</h5>
                                <div className={style.row}><span>Nombre</span><h6>{selectedPaciente.fullName}</h6></div>
                                <div className={style.row}><span>Documento</span><h6>{selectedPaciente.documentType || "DNI"} {selectedPaciente.dni}</h6></div>
                                <div className={style.row}><span>Nacimiento</span><h6>{selectedPaciente.birthDate || "-"}</h6></div>
                            </div>
                            <div className={style.section}>
                                <h5>Contacto</h5>
                                <div className={style.row}><span>Teléfono</span><h6>{selectedPaciente.phone || "-"}</h6></div>
                                <div className={style.row}><span>Dirección</span><h6>{selectedPaciente.address || "-"}</h6></div>
                                <div className={style.row}><span>Localidad</span><h6>{selectedPaciente.city || "-"}</h6></div>
                            </div>
                        </div>
                        <div className={style.modalFooter}>
                            <LightGreyButton text="Ver historias clínicas" onClick={() => { setViewModal(false); setHistoriasModal(true); }} variant="primary" />
                        </div>
                    </div>
                </div>
            )}
            
            {historiasModal && selectedPaciente && (
                <HistoriaClinicaModal 
                    paciente={selectedPaciente} 
                    onClose={() => setHistoriasModal(false)} 
                />
            )}
        </main>
    )
}