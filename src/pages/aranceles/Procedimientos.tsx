import WelcomeText from "../../components/WelcomeText/welcomeText.tsx";
import style from './Procedimientos.module.css';
import FilterButton from "../../components/Buttons/FilterButton/filterButton.tsx";
import Procedimiento from "../../components/Procedimiento/procedimiento.tsx";
import {useState} from "react";
import ProvInput from "../../components/Forms/NewProvForm/ProvInput.tsx";
import MiniInput from "../../components/Forms/NewProvForm/MiniInput.tsx";
import GreenFormButton from "../../components/Buttons/GreenFormButton/greenFormButton.tsx";

export default function Procedimientos() {
    const [creating, setCreating] = useState(false);
    const [newArancel, setNewArancel] = useState({
        fecha: "",
        dni: "",
        cirugia: "",
        implante: "",
        reimplante: "",
        cantidad: ""
    });

    return(
        <main className={style.main}>
            <WelcomeText
                sectionText={'Acá todos los procedimientos internos'}
                className={'darkStyle'}
            />

            <div className={style.filters}>
                <FilterButton/>
            </div>

            {!creating ? (
                <div className={style.procedimientosContainer}>
                    <div className={style.columnNames}>
                        <p>Fecha</p>
                        <p>D.N.I del paciente</p>
                        <p>Tipo de cirugía</p>
                        <p>Tipo de implante</p>
                        <p>Reimplante</p>
                        <p>Cantidad</p>
                    </div>

                    <Procedimiento/>
                    <Procedimiento/>
                    <Procedimiento/>
                    <Procedimiento/>
                    <Procedimiento/>
                    <Procedimiento/>
                </div>
            ) : (
                <div className={style.formContainer}>
                    <p>Nuevo arancel</p>

                    <div className={style.form}>

                        <div className={style.sharedInput}>
                            <MiniInput
                                placeholder="Fecha"
                                className="inputBoxDefault"
                                value={newArancel.fecha}
                                type={'date'}
                                onChange={(e) =>
                                    setNewArancel({...newArancel, fecha: e.target.value})
                                }
                            />

                            <MiniInput
                                placeholder="DNI paciente"
                                className="inputBoxDefault"
                                value={newArancel.dni}
                                onChange={(e) =>
                                    setNewArancel({...newArancel, dni: e.target.value})
                                }
                            />
                        </div>

                        <div className={style.sharedInput}>
                            <MiniInput
                                placeholder="Tipo de cirugía"
                                className="inputBoxDefault"
                                value={newArancel.cirugia}
                                onChange={(e) =>
                                    setNewArancel({...newArancel, cirugia: e.target.value})
                                }
                            />

                            <MiniInput
                                placeholder="Tipo de implante"
                                className="inputBoxDefault"
                                value={newArancel.implante}
                                onChange={(e) =>
                                    setNewArancel({...newArancel, implante: e.target.value})
                                }
                            />
                        </div>

                        <div className={style.sharedInput}>
                            <MiniInput
                                placeholder="Reimplante"
                                as="select"
                                className="inputBoxDefault"
                                value={newArancel.reimplante}
                                onChange={(e) =>
                                    setNewArancel({...newArancel, reimplante: e.target.value})
                                }
                                options={[
                                    {value: "si", label: "Sí"},
                                    {value: "no", label: "No"}
                                ]}
                            />

                            <MiniInput
                                placeholder="Cantidad"
                                className="inputBoxDefault"
                                value={newArancel.cantidad}
                                onChange={(e) =>
                                    setNewArancel({...newArancel, cantidad: e.target.value})
                                }
                            />
                        </div>
                    </div>

                    <div className={style.button}>
                        <GreenFormButton text={'Guardar arancel'}/>
                    </div>
                </div>
            )}

            <div
                className={style.createContainer}
                onClick={() => setCreating(!creating)}
            >
                <img
                    src={'/icons/up.png'}
                    alt={'toggle arrow'}
                />

                <h6>
                    {creating ? 'Ver registros de aranceles' : 'Crear un nuevo arancel'}
                </h6>
            </div>
        </main>
    )
}