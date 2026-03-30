import WelcomeText from "../../components/WelcomeText/welcomeText.tsx";
import style from './Pacientes.module.css';
import SearchBar from "../../components/SearchBar/searchBar.tsx";
import FilterButton from "../../components/Buttons/FilterButton/filterButton.tsx";
import PacientCard from "../../components/PacientCard/pacientCards.tsx";
import { useState } from "react";
import ProvInput from "../../components/Forms/NewProvForm/ProvInput.tsx";

export default function Pacientes() {

    const [search, setSearch] = useState("");

    const pacientes = [
        { nombre: "Agostina Bidegain", dni: "46185819" },
        { nombre: "Juan Pérez", dni: "30123456" },
        { nombre: "María López", dni: "28999888" },
        { nombre: "Carlos Gómez", dni: "33444555" },
        { nombre: "Agostina Bidegain", dni: "46185819" },
        { nombre: "Juan Pérez", dni: "30123456" },
        { nombre: "María López", dni: "28999888" },
        { nombre: "Carlos Gómez", dni: "33444555" },
        { nombre: "Agostina Bidegain", dni: "46185819" },
        { nombre: "Juan Pérez", dni: "30123456" },
        { nombre: "María López", dni: "28999888" },
        { nombre: "Carlos Gómez", dni: "33444555" },
        { nombre: "Agostina Bidegain", dni: "46185819" },
        { nombre: "Juan Pérez", dni: "30123456" },
        { nombre: "María López", dni: "28999888" },
        { nombre: "Carlos Gómez", dni: "33444555" },
    ];

    const filteredPacientes = pacientes.filter((p) => {
        const query = search.toLowerCase();

        return (
            p.nombre.toLowerCase().includes(query) ||
            p.dni.includes(query)
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
                {filteredPacientes.map((p, index) => (
                    <PacientCard
                        key={index}
                        nombre={p.nombre}
                        dni={p.dni}
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
                        className={style.modal}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3>Cargar nuevo paciente</h3>

                        <p>Paso {step} de 3</p>

                        {step === 1 && (
                            <>
                                <ProvInput placeholder="Nombre completo" type="text" className="inputBoxDefault"/>
                                <ProvInput placeholder="Tipo de documento" type="text" className="inputBoxDefault"/>
                                <ProvInput placeholder="Número de documento" type="text" className="inputBoxDefault"/>
                                <ProvInput placeholder="Fecha de nacimiento" type="text" className="inputBoxDefault"/>
                            </>
                        )}

                        {step === 2 && (
                            <>
                                <ProvInput placeholder="Teléfono" type="text" className="inputBoxDefault"/>
                                <ProvInput placeholder="Dirección" type="text" className="inputBoxDefault"/>
                                <ProvInput placeholder="Localidad" type="text" className="inputBoxDefault"/>
                                <ProvInput placeholder="Obra social" type="text" className="inputBoxDefault"/>
                            </>
                        )}

                        {step === 3 && (
                            <>
                                <ProvInput placeholder="Secretaria a cargo" type="text" className="inputBoxDefault"/>
                                <ProvInput placeholder="Observaciones" type="text" className="inputBoxBig"/>
                                <ProvInput placeholder="¿Cómo nos conoció?" type="text" className="inputBoxBig"/>
                            </>
                        )}

                        <div className={style.modalActions}>

                            {step > 1 && (
                                <span
                                    className={style.back}
                                    onClick={() => setStep(step - 1)}
                                >
                                    ← Volver atrás
                                </span>
                            )}

                            <div>
                                <button onClick={() => setOpenModal(false)}>
                                    Cancelar
                                </button>

                                <button onClick={handleNext}>
                                    {step === 3 ? "Confirmar" : "Siguiente"}
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            )}
        </main>
    )
}