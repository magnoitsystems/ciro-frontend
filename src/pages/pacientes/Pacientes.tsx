import WelcomeText from "../../components/WelcomeText/welcomeText.tsx";
import style from './Pacientes.module.css';
import SearchBar from "../../components/SearchBar/searchBar.tsx";
import FilterButton from "../../components/Buttons/FilterButton/filterButton.tsx";
import PacientCard from "../../components/PacientCard/pacientCards.tsx";
import { useState } from "react";
import ProvInput from "../../components/Forms/NewProvForm/ProvInput.tsx";
import LightGreyButton from "../../components/Buttons/LightGreyButton/lightGreyButton.tsx";

type Paciente = {
    id: number;
    nombre: string;
    tipoDocumento: string;
    numeroDocumento: string;
    fechaNacimiento: string;

    telefono: string;
    direccion: string;
    localidad: string;
    obraSocial: string;

    secretaria: string;
    observaciones: string;
    comoNosConocio: string;
};

export default function Pacientes() {

    const [search, setSearch] = useState("");

    const pacientes: Paciente[] = [
        {
            id: 1,
            nombre: "Agostina Bidegain",
            tipoDocumento: "DNI",
            numeroDocumento: "46185819",
            fechaNacimiento: "1998-05-27",

            telefono: "2494567890",
            direccion: "Av. Colón 123",
            localidad: "Tandil",
            obraSocial: "OSDE",

            secretaria: "Milagros Alvarez",
            observaciones: "Paciente con tratamiento en curso. Buena evolución.",
            comoNosConocio: "Instagram"
        },
        {
            id: 2,
            nombre: "Juan Pérez",
            tipoDocumento: "DNI",
            numeroDocumento: "30123456",
            fechaNacimiento: "1985-09-12",

            telefono: "2494123456",
            direccion: "San Martín 456",
            localidad: "Tandil",
            obraSocial: "IOMA",

            secretaria: "Lucía Fernández",
            observaciones: "Primera consulta realizada. Estudios pendientes.",
            comoNosConocio: "Recomendación"
        },
        {
            id: 3,
            nombre: "María López",
            tipoDocumento: "DNI",
            numeroDocumento: "28999888",
            fechaNacimiento: "1990-03-22",

            telefono: "2494987654",
            direccion: "Belgrano 789",
            localidad: "Azul",
            obraSocial: "Swiss Medical",

            secretaria: "Carla Gómez",
            observaciones: "Control mensual. Sin complicaciones.",
            comoNosConocio: "Facebook"
        },
        {
            id: 4,
            nombre: "Carlos Gómez",
            tipoDocumento: "DNI",
            numeroDocumento: "33444555",
            fechaNacimiento: "1978-11-02",

            telefono: "2494332211",
            direccion: "Rivadavia 321",
            localidad: "Olavarría",
            obraSocial: "Particular",

            secretaria: "Milagros Alvarez",
            observaciones: "Paciente derivado. Requiere seguimiento.",
            comoNosConocio: "Sitio Web"
        },
        {
            id: 5,
            nombre: "Lucía Martínez",
            tipoDocumento: "DNI",
            numeroDocumento: "35222111",
            fechaNacimiento: "1995-07-18",

            telefono: "2494556677",
            direccion: "España 654",
            localidad: "Tandil",
            obraSocial: "Avalian",

            secretaria: "Lucía Fernández",
            observaciones: "Turnos frecuentes. Muy puntual.",
            comoNosConocio: "Tik Tok"
        }
    ];

    const [pacientesState, setPacientesState] = useState<Paciente[]>(pacientes);

    const filteredPacientes = pacientesState.filter((p) => {
        const query = search.toLowerCase();

        return (
            p.nombre.toLowerCase().includes(query) ||
            p.numeroDocumento.includes(query)
        );
    });

    const [openModal, setOpenModal] = useState(false);

    const [step, setStep] = useState(1);

    const handleNext = () => {
        if (step < 3) {
            setStep(step + 1);
        } else {
            console.log("CREAR PACIENTE");
        }
    };

    const [deleteModal, setDeleteModal] = useState(false);
    const [selectedPaciente, setSelectedPaciente] = useState<Paciente | null>(null);
    const [viewModal, setViewModal] = useState(false);
    const [turnosModal, setTurnosModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [editData, setEditData] = useState<Paciente | null>(null);
    const [editStep, setEditStep] = useState(1);

    const handleDelete = () => {
        if (!selectedPaciente) return;

        setPacientesState(prev =>
            prev.filter(p => p.id !== selectedPaciente.id)
        );

        setDeleteModal(false);
        setSelectedPaciente(null);
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
                        <img src={'/icons/estadistics.png'} alt={'estadistics image'}/>
                    </div>

                    <div
                        className={style.newPacient}
                        onClick={() => setOpenModal(true)}
                    >
                        <img src={'/icons/plus.png'} alt={'plus image'}/>
                    </div>

                    <div className={style.filter}>
                        <FilterButton/>
                    </div>
                </div>
            </div>

            <div className={style.pacientCards}>
                {filteredPacientes.map((p) => (
                    <PacientCard
                        key={p.id}
                        nombre={p.nombre}
                        dni={p.numeroDocumento}
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
                    />
                ))}
            </div>

            {openModal && (
                <div
                    className={style.overlay}
                    onClick={() => {
                        setOpenModal(false);
                        setStep(1);
                    }}
                >
                    <div
                        className={style.formModal}
                        onClick={(e) => e.stopPropagation()}
                    >

                        <button
                            className={style.close}
                            onClick={() => {
                                setOpenModal(false);
                                setStep(1);
                            }}
                        >
                            ✕
                        </button>

                        <h3>Cargar nuevo paciente</h3>

                        <p>Paso {step} de 3</p>

                        {step === 1 && (
                            <>
                                <ProvInput placeholder="Nombre completo" type="text" className="inputBoxDefault"/>
                                <ProvInput placeholder="Tipo de documento"
                                           as="select"
                                           className="inputBoxDefault"
                                           options={[
                                               { value: "dni", label: "DNI" },
                                               { value: "cuit", label: "CUIT" },
                                               { value: "pasaporte", label: "Pasaporte" },
                                               { value: "cuil", label: "CUIL" },
                                               { value: "cdi", label: "CDI" },
                                               { value: "le", label: "LE" },
                                               { value: "lc", label: "LC" },
                                               { value: "otro", label: "Otro" }
                                           ]}
                                />
                                <ProvInput placeholder="Número de documento" type="text" className="inputBoxDefault"/>
                                <ProvInput placeholder="Fecha de nacimiento" type="date" className="inputBoxDefault"/>
                            </>
                        )}

                        {step === 2 && (
                            <>
                                <ProvInput placeholder="Teléfono" type="text" className="inputBoxDefault"/>
                                <ProvInput placeholder="Dirección" type="text" className="inputBoxDefault"/>
                                <ProvInput placeholder="Localidad" type="text" className="inputBoxDefault"/>
                                <ProvInput
                                    placeholder="Obra social"
                                    as="select"
                                    className="inputBoxDefault"
                                    options={[
                                        { value: "particular", label: "Particular" },
                                        { value: "sancor", label: "Sancor Salud (ficha verde)" },
                                        { value: "federada", label: "Federada Salud (solo ficha verde)" },
                                        { value: "avalian", label: "Avalian (1ra vez ficha verde y bono, luego solo bono)" },
                                        { value: "amebpba", label: "AMEBPBA (ficha verde y bono)" },
                                        { value: "medicus", label: "Medicus" },
                                        { value: "jerarquicos", label: "Jerarquicos Salud (ficha verde)" },
                                        { value: "medife", label: "Medife (no trabaja Manu)" },
                                        { value: "osiad", label: "OSIAD Salud" },
                                        { value: "ioma", label: "IOMA" },
                                        { value: "prevencion", label: "Prevención Salud" },
                                        { value: "osde", label: "OSDE" },
                                        { value: "swiss", label: "Swiss Medical" },
                                        { value: "osecac", label: "OSECAC" },
                                        { value: "osfatlyft", label: "OSFATLYFT" },
                                        { value: "union", label: "Unión Personal" }
                                    ]}
                                />
                            </>
                        )}

                        {step === 3 && (
                            <>
                                <ProvInput placeholder="Secretaria a cargo" type="text" className="inputBoxDefault"/>
                                <ProvInput placeholder="Observaciones" type="text" className="inputBoxBig"/>
                                <ProvInput
                                    placeholder="¿Cómo nos conoció?"
                                    as="select"
                                    className="inputBoxDefault"
                                    options={[
                                        { value: "RECOMMENDATION", label: "Recomendación" },
                                        { value: "FACEBOOK", label: "Facebook" },
                                        { value: "INSTAGRAM", label: "Instagram" },
                                        { value: "TIKTOK", label: "Tik Tok" },
                                        { value: "WEBSITE", label: "Sitio Web" },
                                        { value: "ANOTHER", label: "Otro" }
                                    ]}
                                />
                            </>
                        )}

                        <div className={style.modalActions}>

                            <div className={style.buttons}>
                                <LightGreyButton
                                    text={step === 3 ? "Confirmar" : "Siguiente"}
                                    onClick={handleNext}
                                    variant={'primary'}
                                />
                            </div>

                            {step > 1 && (
                                <span
                                    className={style.back}
                                    onClick={() => setStep(step - 1)}
                                >
                                    ← Volver atrás
                                </span>
                            )}

                        </div>
                    </div>
                </div>
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
                            <strong>{selectedPaciente?.nombre}</strong>?
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

                            {/* 🧍 DATOS PERSONALES */}
                            <div className={style.section}>
                                <h5>Datos personales</h5>

                                <div className={style.row}>
                                    <span>Nombre</span>
                                    <p>{selectedPaciente.nombre}</p>
                                </div>

                                <div className={style.row}>
                                    <span>Documento</span>
                                    <p>
                                        {selectedPaciente.tipoDocumento} {selectedPaciente.numeroDocumento}
                                    </p>
                                </div>

                                <div className={style.row}>
                                    <span>Fecha de nacimiento</span>
                                    <p>{selectedPaciente.fechaNacimiento}</p>
                                </div>
                            </div>

                            {/* 📞 CONTACTO */}
                            <div className={style.section}>
                                <h5>Contacto</h5>

                                <div className={style.row}>
                                    <span>Teléfono</span>
                                    <p>{selectedPaciente.telefono}</p>
                                </div>

                                <div className={style.row}>
                                    <span>Dirección</span>
                                    <p>{selectedPaciente.direccion}</p>
                                </div>

                                <div className={style.row}>
                                    <span>Localidad</span>
                                    <p>{selectedPaciente.localidad}</p>
                                </div>
                            </div>

                            {/* 🏥 INFO EXTRA */}
                            <div className={style.section}>
                                <h5>Información adicional</h5>

                                <div className={style.row}>
                                    <span>Obra social</span>
                                    <p>{selectedPaciente.obraSocial}</p>
                                </div>

                                <div className={style.row}>
                                    <span>Secretaria</span>
                                    <p>{selectedPaciente.secretaria}</p>
                                </div>

                                <div className={style.row}>
                                    <span>¿Cómo nos conoció?</span>
                                    <p>{selectedPaciente.comoNosConocio}</p>
                                </div>

                                <div className={style.column}>
                                    <span>Observaciones</span>
                                    <p>{selectedPaciente.observaciones}</p>
                                </div>
                            </div>

                        </div>
                        <div className={style.modalFooter}>
                            <LightGreyButton
                                text="Ver historial de turnos"
                                onClick={() => {
                                    setViewModal(false);
                                    setTurnosModal(true);
                                }}
                                variant="primary"
                            />
                        </div>
                    </div>
                </div>
            )}

            {turnosModal && selectedPaciente && (
                <div
                    className={style.overlay}
                    onClick={() => setTurnosModal(false)}
                >
                    <div
                        className={style.modal}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className={style.close}
                            onClick={() => setTurnosModal(false)}
                        >
                            ✕
                        </button>

                        <h3>Turnos de {selectedPaciente.nombre}</h3>

                        {/* 🧪 DATA MOCK (después backend) */}
                        <div className={style.turnosList}>
                            <div className={style.turnoItem}>
                                <span>27/05/2026</span>
                                <span>10:30</span>
                                <span>Consulta general</span>
                            </div>

                            <div className={style.turnoItem}>
                                <span>15/06/2026</span>
                                <span>12:00</span>
                                <span>Control</span>
                            </div>

                            <div className={style.turnoItem}>
                                <span>02/07/2026</span>
                                <span>09:15</span>
                                <span>Seguimiento</span>
                            </div>
                        </div>

                        {/* 🔙 volver */}
                        <span
                            className={style.back}
                            onClick={() => {
                                setTurnosModal(false);
                                setViewModal(true);
                            }}
                        >
                ← Volver al paciente
            </span>
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

                        {/* 🧍 PASO 1 */}
                        {editStep === 1 && (
                            <>
                                <div className={style.inputGroup}>
                                    <span className={style.label}>Nombre completo</span>
                                    <span className={style.currentValue}>{editData.nombre}</span>

                                    <ProvInput
                                        placeholder="Nombre completo"
                                        type="text"
                                        className="inputBoxDefault"
                                        value={editData.nombre}
                                        onChange={(e) =>
                                            setEditData({...editData, nombre: e.target.value})
                                        }
                                    />
                                </div>

                                <div className={style.inputGroup}>
                                    <span className={style.label}>Documento</span>
                                    <span className={style.currentValue}>
                                        {editData.tipoDocumento} {editData.numeroDocumento}
                                    </span>

                                    <ProvInput
                                        placeholder="Tipo de documento"
                                        as="select"
                                        className="inputBoxDefault"
                                        value={editData.tipoDocumento}
                                        onChange={(e) =>
                                            setEditData({...editData, tipoDocumento: e.target.value})
                                        }
                                        options={[
                                            {value: "DNI", label: "DNI"},
                                            {value: "CUIT", label: "CUIT"},
                                            {value: "Pasaporte", label: "Pasaporte"}
                                        ]}
                                    />
                                </div>

                                <div className={style.inputGroup}>
                                    <span className={style.label}>Número de documento</span>
                                    <span className={style.currentValue}>{editData.numeroDocumento}</span>

                                    <ProvInput
                                        placeholder="Número de documento"
                                        type="text"
                                        className="inputBoxDefault"
                                        value={editData.numeroDocumento}
                                        onChange={(e) =>
                                            setEditData({...editData, numeroDocumento: e.target.value})
                                        }
                                    />
                                </div>

                                <div>
                                    <span className={style.label}>Fecha de nacimiento</span>
                                    <span className={style.currentValue}>{editData.fechaNacimiento}</span>

                                    <ProvInput
                                        placeholder="Fecha de nacimiento"
                                        type="date"
                                        className="inputBoxDefault"
                                        value={editData.fechaNacimiento}
                                        onChange={(e) =>
                                            setEditData({...editData, fechaNacimiento: e.target.value})
                                        }
                                    />
                                </div>
                            </>
                        )}

                        {editStep === 2 && (
                            <>
                                <div className={style.inputGroup}>
                                    <span className={style.label}>Teléfono</span>
                                    <span className={style.currentValue}>{editData.telefono}</span>

                                    <ProvInput
                                        placeholder="Teléfono"
                                        type="text"
                                        className="inputBoxDefault"
                                        value={editData.telefono}
                                        onChange={(e) =>
                                            setEditData({...editData, telefono: e.target.value})
                                        }
                                    />
                                </div>

                                <div className={style.inputGroup}>
                                    <span className={style.label}>Dirección</span>
                                    <span className={style.currentValue}>{editData.direccion}</span>

                                    <ProvInput
                                        placeholder="Dirección"
                                        type="text"
                                        className="inputBoxDefault"
                                        value={editData.direccion}
                                        onChange={(e) =>
                                            setEditData({...editData, direccion: e.target.value})
                                        }
                                    />
                                </div>

                                <div className={style.inputGroup}>
                                    <span className={style.label}>Localidad</span>
                                    <span className={style.currentValue}>{editData.localidad}</span>

                                    <ProvInput
                                        placeholder="Localidad"
                                        type="text"
                                        className="inputBoxDefault"
                                        value={editData.localidad}
                                        onChange={(e) =>
                                            setEditData({...editData, localidad: e.target.value})
                                        }
                                    />
                                </div>

                                <div className={style.inputGroup}>
                                    <span className={style.label}>Obra Social</span>
                                    <span className={style.currentValue}>{editData.obraSocial}</span>

                                    <ProvInput
                                        placeholder="Obra social"
                                        as="select"
                                        className="inputBoxDefault"
                                        value={editData.obraSocial}
                                        onChange={(e) =>
                                            setEditData({...editData, obraSocial: e.target.value})
                                        }
                                        options={[
                                            {value: "OSDE", label: "OSDE"},
                                            {value: "IOMA", label: "IOMA"},
                                            {value: "Particular", label: "Particular"}
                                        ]}
                                    />
                                </div>
                            </>
                        )}

                        {/* 🏥 PASO 3 */}
                        {editStep === 3 && (
                            <>
                                <div className={style.inputGroup}>
                                    <span className={style.label}>Secretaria a cargo del registro</span>
                                    <span className={style.currentValue}>{editData.secretaria}</span>

                                    <ProvInput
                                        placeholder="Secretaria"
                                        type="text"
                                        className="inputBoxDefault"
                                        value={editData.secretaria}
                                        onChange={(e) =>
                                            setEditData({...editData, secretaria: e.target.value})
                                        }
                                    />
                                </div>

                                <div className={style.inputGroup}>
                                    <span className={style.label}>Observaciones</span>
                                    <span className={style.currentValue}>{editData.observaciones}</span>

                                    <ProvInput
                                        placeholder="Observaciones"
                                        type="text"
                                        className="inputBoxBig"
                                        value={editData.observaciones}
                                        onChange={(e) =>
                                            setEditData({...editData, observaciones: e.target.value})
                                        }
                                    />
                                </div>

                                <div className={style.inputGroup}>
                                    <span className={style.label}>¿Cómo nos conoció?</span>
                                    <span className={style.currentValue}>{editData.comoNosConocio}</span>

                                    <ProvInput
                                        placeholder="¿Cómo nos conoció?"
                                        as="select"
                                        className="inputBoxDefault"
                                        value={editData.comoNosConocio}
                                        onChange={(e) =>
                                            setEditData({...editData, comoNosConocio: e.target.value})
                                        }
                                        options={[
                                            {value: "Instagram", label: "Instagram"},
                                            {value: "Facebook", label: "Facebook"},
                                            {value: "Recomendación", label: "Recomendación"}
                                        ]}
                                    />
                                </div>
                            </>
                        )}

                        {/* 🔘 ACTIONS */}
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
        </main>
    )
}