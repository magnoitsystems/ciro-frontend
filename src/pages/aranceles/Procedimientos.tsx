import WelcomeText from "../../components/WelcomeText/welcomeText.tsx";
import style from './Procedimientos.module.css';
import Procedimiento from "../../components/Procedimiento/procedimiento.tsx";
import {useState} from "react";
import MiniInput from "../../components/Forms/NewProvForm/MiniInput.tsx";
import GreenFormButton from "../../components/Buttons/GreenFormButton/greenFormButton.tsx";

export default function Procedimientos() {
    const [creating, setCreating] = useState(false);
    const [newArancel, setNewArancel] = useState({
        fecha: "",
        nombre: "",
        monto_pesos: "",
        monto_dolares: "",
        tc: ""
    });

    const validate = () => {
        const montoVacio =
            !newArancel.monto_pesos.trim() &&
            !newArancel.monto_dolares.trim();

        setErrors({
            monto: montoVacio
        });

        return !montoVacio;
    };


    const [errors, setErrors] = useState({
        monto: false
    });

    return(
        <main className={style.main}>
            <WelcomeText
                sectionText={'Acá todos los procedimientos internos'}
                className={'darkStyle'}
            />

            {!creating ? (
                <div className={style.procedimientosContainer}>
                    <div className={style.columnNames}>
                        <p>Fecha</p>
                        <p>Nombre</p>
                        <p>Monto en USD</p>
                        <p>Monto en ARS</p>
                        <p>Tipo de cambio</p>
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
                                placeholder="Nombre"
                                className="inputBoxDefault"
                                value={newArancel.nombre}
                                onChange={(e) =>
                                    setNewArancel({...newArancel, nombre: e.target.value})
                                }
                            />
                        </div>

                        <div className={style.sharedInput}>
                            <MiniInput
                                placeholder="Monto en ARS"
                                className="inputBoxDefault"
                                value={newArancel.monto_pesos}
                                onChange={(e) =>
                                    setNewArancel({...newArancel, monto_pesos: e.target.value})
                                }
                                error={errors.monto}
                            />

                            <MiniInput
                                placeholder="Monto en ARS"
                                className="inputBoxDefault"
                                value={newArancel.monto_dolares}
                                onChange={(e) =>
                                    setNewArancel({...newArancel, monto_dolares: e.target.value})
                                }
                                error={errors.monto}
                            />
                        </div>

                        <div className={style.sharedInput}>

                            <MiniInput
                                placeholder="Tipo de cambio"
                                className="inputBoxDefault"
                                value={newArancel.tc}
                                onChange={(e) =>
                                    setNewArancel({...newArancel, tc: e.target.value})
                                }
                            />
                        </div>
                    </div>

                    <div className={style.button}>
                        <GreenFormButton text={'Guardar arancel'}
                                         onClick={() => {
                            if (!validate()) return;

                            console.log("Ok enviar");
                        }}
                        />
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