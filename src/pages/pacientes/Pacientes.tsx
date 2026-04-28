/* eslint-disable @typescript-eslint/no-explicit-any */
import WelcomeText from "../../components/WelcomeText/welcomeText.tsx";
import style from './Pacientes.module.css';
import SearchBar from "../../components/SearchBar/searchBar.tsx";
import PacientCard from "../../components/PacientCard/pacientCards.tsx";
import { useState, useEffect } from "react";
import ProvInput from "../../components/Forms/NewProvForm/ProvInput.tsx";
import LightGreyButton from "../../components/Buttons/LightGreyButton/lightGreyButton.tsx";
import {NavLink} from "react-router-dom";
import { patientService } from "../../services/patient.service";
import type { PatientResponseDTO } from "../../types/patients.types";
import Patient from "../../components/patients/patient.tsx";

type HistoriaClinica = {
    id: number;
    fecha: string;
    evaluacion: string;
    archivo?: string;
    pacienteId: number;
    doctorId: number;
};

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
        text
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");

    const queryText = normalizeText(search);
    const queryNumber = normalize(search);

    const filteredPacientes = pacientesState.filter((p) => {
        const textMatch =
            normalizeText(p.fullName || "").includes(queryText) ||
            normalizeText(p.city || "").includes(queryText);

        const numberMatch =
            queryNumber &&
            ((p.dni || "").includes(queryNumber) ||
                normalize(p.phone || "").includes(queryNumber));

        return textMatch || numberMatch;
    });

    const [openModal, setOpenModal] = useState(false);

    const [deleteModal, setDeleteModal] = useState(false);
    const [selectedPaciente, setSelectedPaciente] = useState<PatientResponseDTO | null>(null);
    const [viewModal, setViewModal] = useState(false);
    const [turnosModal, setTurnosModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [editData, setEditData] = useState<PatientResponseDTO | null>(null);
    const [editStep, setEditStep] = useState(1);

    const [historiasModal, setHistoriasModal] = useState(false);
    const [historias, setHistorias] = useState<HistoriaClinica[]>([
        {
            id: 1,
            fecha: "2026-05-20",
            evaluacion: "Paciente con evolución favorable. Se indica continuar tratamiento actual.",
            archivo: "estudio_lab.pdf",
            pacienteId: 1,
            doctorId: 1
        },
        {
            id: 2,
            fecha: "2026-06-10",
            evaluacion: "Control general. Sin complicaciones.",
            pacienteId: 1,
            doctorId: 2
        }
    ]);
    const [newHistoria, setNewHistoria] = useState<Partial<HistoriaClinica>>({});
    const [creatingHistoria, setCreatingHistoria] = useState(false);

    const handleDelete = async () => {
        if (!selectedPaciente) return;

        try {
            await patientService.deletePatient(selectedPaciente.id);
            setPacientesState(prev =>
                prev.filter(p => p.id !== selectedPaciente.id)
            );
            setDeleteModal(false);
            setSelectedPaciente(null);
        } catch (error) {
            console.error("Error eliminando paciente:", error);
            alert("No se pudo eliminar el paciente.");
        }
    };

    const handleEditNext = () => {
        if (!editData) return null;

        if (editStep < 3) {
            setEditStep(editStep + 1);
        } else {
            setPacientesState(prev =>
                prev.map(p =>
                    p.id === editData.id ? editData : p
                )
            );

            setEditModal(false);
            setEditData(null);
            setEditStep(1);
        }
    };

    return(
        <main className={style.main}>
            <WelcomeText
                sectionText={'Acá el listado de los pacientes existentes.'}
                className={'darkStyle'}
            />

            <div className={style.functionalities}>
                <div className={style.searchBar}>
                    <SearchBar
                        text="Buscá por Nombre, Apellido o DNI"
                        value={search}
                        onChange={setSearch}
                    />
                </div>

                <div className={style.secondFunctionalities}>
                    <div className={style.estadistics}>
                        <NavLink to={'/estadisticas'}>
                            <img src={'/icons/estadistics.png'} alt={'estadistics image'}/>
                        </NavLink>
                    </div>

                    <div
                        className={style.newPacient}
                        onClick={() => setOpenModal(true)}
                    >
                        <img src={'/icons/plus.png'} alt={'plus image'}/>
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
                            onDelete={() => {
                                setSelectedPaciente(p);
                                setDeleteModal(true);
                            }}
                            onView={() => {
                                setSelectedPaciente(p);
                                setViewModal(true);
                            }}
                            onEdit={() => {
                                setEditData(p);
                                setEditModal(true);
                                setEditStep(1);
                            }}
                            attachments={true}
                        />
                    ))
                ) : (
                    <p style={{padding: '20px'}}>No se encontraron pacientes.</p>
                )}
            </div>

            {openModal && (
                <Patient 
                    onNuevoPacienteClick={() => {
                        setOpenModal(false); 
                        fetchPacientes();    
                    }} 
                />
            )}

            {deleteModal && (
                <div
                    className={style.overlay}
                    onClick={() => setDeleteModal(false)}
                >
                    <div
                        className={style.miniModal}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3>Eliminar paciente</h3>

                        <p>
                            ¿Seguro que querés eliminar a{" "}
                            <strong>{selectedPaciente?.fullName}</strong>?
                        </p>

                        <div className={style.modalActions}>
                            <LightGreyButton
                                text="Eliminar"
                                onClick={handleDelete}
                                variant="primary"
                            />

                            <LightGreyButton
                                text="Cancelar"
                                onClick={() => setDeleteModal(false)}
                                variant="secondary"
                            />
                        </div>
                    </div>
                </div>
            )}

            {viewModal && selectedPaciente && (
                <div
                    className={style.overlay}
                    onClick={() => setViewModal(false)}
                >
                    <div
                        className={style.modal}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className={style.close}
                            onClick={() => setViewModal(false)}
                        >
                            ✕
                        </button>

                        <h3>Detalle del paciente</h3>

                        <div className={style.details}>

                            <div className={style.section}>
                                <h5>Datos personales</h5>

                                <div className={style.row}>
                                    <span>Nombre</span>
                                    <h6>{selectedPaciente.fullName}</h6>
                                </div>

                                <div className={style.row}>
                                    <span>Documento</span>
                                    <h6>
                                        {selectedPaciente.documentType || "DNI"} {selectedPaciente.dni}
                                    </h6>
                                </div>

                                <div className={style.row}>
                                    <span>Fecha de nacimiento</span>
                                    <h6>{selectedPaciente.birthDate || "-"}</h6>
                                </div>
                            </div>

                            <div className={style.section}>
                                <h5>Contacto</h5>

                                <div className={style.row}>
                                    <span>Teléfono</span>
                                    <h6>{selectedPaciente.phone || "-"}</h6>
                                </div>

                                <div className={style.row}>
                                    <span>Dirección</span>
                                    <h6>{selectedPaciente.address || "-"}</h6>
                                </div>

                                <div className={style.row}>
                                    <span>Localidad</span>
                                    <h6>{selectedPaciente.city || "-"}</h6>
                                </div>
                            </div>

                            <div className={style.section}>
                                <h5>Información adicional</h5>

                                <div className={style.row}>
                                    <span>Obra social</span>
                                    <h6>{selectedPaciente.obraSocial || "-"}</h6>
                                </div>

                                <div className={style.row}>
                                    <span>¿Cómo nos conoció?</span>
                                    <h6>{selectedPaciente.from || "-"}</h6>
                                </div>

                                <div className={style.column}>
                                    <span>Observaciones</span>
                                    <h6>{selectedPaciente.observations || "-"}</h6>
                                </div>
                            </div>

                        </div>
                        <div className={style.modalFooter}>
                            <LightGreyButton
                                text="Ver historias clínicas"
                                onClick={() => {
                                    setViewModal(false);
                                    setHistoriasModal(true);
                                }}
                                variant="primary"
                            />
                        </div>
                    </div>
                </div>
            )}

            {editModal && editData && (
                <div
                    className={style.overlay}
                    onClick={() => setEditModal(false)}
                >
                    <div
                        className={style.formModal}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className={style.close}
                            onClick={() => setEditModal(false)}
                        >
                            ✕
                        </button>

                        <h3>Editar paciente</h3>
                        <p>Paso {editStep} de 3</p>

                        {editStep === 1 && (
                            <>
                                <div className={style.inputGroup}>
                                    <span className={style.label}>Nombre completo: {editData.fullName}</span>
                                    <ProvInput
                                        placeholder="Nombre completo"
                                        type="text"
                                        className="inputBoxDefault"
                                        value={editData.fullName}
                                        onChange={(e) =>
                                            setEditData({...editData, fullName: e.target.value})
                                        }
                                    />
                                </div>

                                <div className={style.inputGroup}>
                                    <span className={style.label}>Fecha de nacimiento: {editData.birthDate || "-"}</span>
                                    <ProvInput
                                        placeholder="Fecha de nacimiento"
                                        type="date"
                                        className="inputBoxDefault"
                                        value={editData.birthDate}
                                        onChange={(e) =>
                                            setEditData({...editData, birthDate: e.target.value})
                                        }
                                    />
                                </div>

                                <div className={style.inputGroup}>
                                    <span className={style.label}>Teléfono: {editData.phone || "-"}</span>
                                    <ProvInput
                                        placeholder="Teléfono"
                                        type="text"
                                        className="inputBoxDefault"
                                        value={editData.phone}
                                        onChange={(e) =>
                                            setEditData({...editData, phone: e.target.value})
                                        }
                                    />
                                </div>
                            </>
                        )}

                        {editStep === 2 && (
                            <>
                                <div className={style.inputGroup}>
                                    <span className={style.label}>Dirección: {editData.address || "-"}</span>
                                    <ProvInput
                                        placeholder="Dirección"
                                        type="text"
                                        className="inputBoxDefault"
                                        value={editData.address}
                                        onChange={(e) =>
                                            setEditData({...editData, address: e.target.value})
                                        }
                                    />
                                </div>

                                <div className={style.inputGroup}>
                                    <span className={style.label}>Localidad: {editData.city || "-"}</span>
                                    <ProvInput
                                        placeholder="Localidad"
                                        type="text"
                                        className="inputBoxDefault"
                                        value={editData.city}
                                        onChange={(e) =>
                                            setEditData({...editData, city: e.target.value})
                                        }
                                    />
                                </div>

                                <div className={style.inputGroup}>
                                    <span className={style.label}>Obra Social: {editData.obraSocial || "-"}</span>
                                    <ProvInput
                                        placeholder="Obra social"
                                        as="select"
                                        className="inputBoxDefault"
                                        value={editData.obraSocial}
                                        onChange={(e) =>
                                            setEditData({...editData, obraSocial: e.target.value as any})
                                        }
                                        options={[
                                            {value: "OSDE", label: "OSDE"},
                                            {value: "IOMA", label: "IOMA"},
                                            {value: "PARTICULAR", label: "Particular"}
                                        ]}
                                    />
                                </div>
                            </>
                        )}

                        {editStep === 3 && (
                            <>
                                <div className={style.inputGroup}>
                                    <span className={style.label}>Observaciones: {editData.observations || "-"}</span>
                                    <ProvInput
                                        placeholder="Observaciones"
                                        type="text"
                                        className="inputBoxBig"
                                        value={editData.observations}
                                        onChange={(e) =>
                                            setEditData({...editData, observations: e.target.value})
                                        }
                                    />
                                </div>

                                <div className={style.inputGroup}>
                                    <span className={style.label}>¿Cómo nos conoció?: {editData.from || "-"}</span>
                                    <ProvInput
                                        placeholder="¿Cómo nos conoció?"
                                        as="select"
                                        className="inputBoxDefault"
                                        value={editData.from}
                                        onChange={(e) =>
                                            setEditData({...editData, from: e.target.value as any})
                                        }
                                        options={[
                                            {value: "INSTAGRAM", label: "Instagram"},
                                            {value: "FACEBOOK", label: "Facebook"},
                                            {value: "RECOMMENDATION", label: "Recomendación"}
                                        ]}
                                    />
                                </div>
                            </>
                        )}

                        <div className={style.modalActions}>
                            <div className={style.buttons}>
                                <LightGreyButton
                                    text={editStep === 3 ? "Guardar cambios" : "Siguiente"}
                                    onClick={handleEditNext}
                                    variant="primary"
                                />
                            </div>

                            {editStep > 1 && (
                                <span
                                    className={style.back}
                                    onClick={() => setEditStep(editStep - 1)}
                                >
                        ← Volver atrás
                    </span>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {turnosModal && selectedPaciente && (
                <div className={style.overlay} onClick={() => setTurnosModal(false)}>
                    <div className={style.modal} onClick={(e) => e.stopPropagation()}>
                        <button className={style.close} onClick={() => setTurnosModal(false)}>✕</button>
                        <h3>Turnos de {selectedPaciente.fullName}</h3>
                        <div className={style.turnosList}>
                            <div className={style.turnoItem}><span>27/05/2026</span><span>10:30</span><span>Consulta general</span></div>
                        </div>
                        <span className={style.back} onClick={() => { setTurnosModal(false); setViewModal(true); }}>← Volver al paciente</span>
                    </div>
                </div>
            )}

            {historiasModal && selectedPaciente && (
                <div className={style.overlay} onClick={() => setHistoriasModal(false)}>
                    <div className={style.modal} onClick={(e) => e.stopPropagation()}>
                        <button className={style.close} onClick={() => setHistoriasModal(false)}>✕</button>
                        <h3>Historias clínicas de {selectedPaciente.fullName}</h3>

                        {!creatingHistoria ? (
                            <>
                                <div className={style.turnosList}>
                                    {historias.filter(h => h.pacienteId === selectedPaciente.id).map(h => (
                                        <div key={h.id} className={style.turnoItem}>
                                            <div>Fecha: {h.fecha}</div>
                                            <div>Evaluación: {h.evaluacion}</div>
                                            <div>Doctor: {h.doctorId === 1 ? "Dr. Pérez" : "Dra. Gómez"}</div>
                                            {h.archivo && <div>Archivo: {h.archivo}</div>}
                                        </div>
                                    ))}
                                </div>
                                <LightGreyButton text="Nueva historia clínica" onClick={() => setCreatingHistoria(true)} variant="primary" />
                            </>
                        ) : (
                            <div className={style.formModal}>
                                <ProvInput placeholder="Fecha (opcional)" type="date" className="inputBoxDefault" value={newHistoria.fecha || ""} onChange={(e) => setNewHistoria({...newHistoria, fecha: e.target.value})} />
                                <ProvInput placeholder="Evaluación" type="text" className="inputBoxBig" value={newHistoria.evaluacion || ""} onChange={(e) => setNewHistoria({...newHistoria, evaluacion: e.target.value})} />
                                
                                <div className={style.fileUpload}>
                                    <label className={style.fileLabel}>
                                        <input type="file" onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) setNewHistoria({...newHistoria, archivo: file.name});
                                            }} />
                                        📎 Subir archivo
                                    </label>
                                    {newHistoria.archivo && <span className={style.fileName}>{newHistoria.archivo}</span>}
                                </div>

                                <ProvInput placeholder="Doctor" as="select" className="inputBoxDefault" value={String(newHistoria.doctorId) || ''} onChange={(e) => setNewHistoria({...newHistoria, doctorId: Number(e.target.value)})} options={[{ value: "1", label: "Dr. Pérez" }, { value: "2", label: "Dra. Gómez" }]} />
                                
                                <LightGreyButton text="Guardar" onClick={() => {
                                        if (!newHistoria.evaluacion || !newHistoria.doctorId) { alert("Completá evaluación y doctor"); return; }
                                        const nuevaHistoria: HistoriaClinica = { id: Date.now(), fecha: newHistoria.fecha || new Date().toISOString().split("T")[0], evaluacion: newHistoria.evaluacion, archivo: newHistoria.archivo || "", pacienteId: selectedPaciente.id, doctorId: newHistoria.doctorId };
                                        setHistorias(prev => [...prev, nuevaHistoria]);
                                        setCreatingHistoria(false); setNewHistoria({});
                                    }} variant="primary" />
                                
                                <span className={style.back} onClick={() => { setCreatingHistoria(false); setNewHistoria({}); }}>← Cancelar</span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </main>
    )
}