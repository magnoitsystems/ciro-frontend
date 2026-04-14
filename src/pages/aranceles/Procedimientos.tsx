/* eslint-disable @typescript-eslint/no-explicit-any */
import WelcomeText from "../../components/WelcomeText/welcomeText.tsx";
import style from './Procedimientos.module.css';
import Procedimiento from "../../components/Procedimiento/procedimiento.tsx";
import { useState, useEffect } from "react";
import MiniInput from "../../components/Forms/NewProvForm/MiniInput.tsx";
import GreenFormButton from "../../components/Buttons/GreenFormButton/greenFormButton.tsx";
import { tariffService } from "../../services/tariff.service"; 
import type { TariffResponseDTO, TariffUpdateDTO } from "../../types/tariffs.types";

export default function Procedimientos() {
    const [creating, setCreating] = useState(false);
    const [tariffs, setTariffs] = useState<TariffResponseDTO[]>([]);
    
    const [tariffToDelete, setTariffToDelete] = useState<number | null>(null);

    const [newArancel, setNewArancel] = useState({
        fecha: "",
        nombre: "",
        monto_pesos: "",
        monto_dolares: "",
        tc: ""
    });

    const [errors, setErrors] = useState({
        monto: false
    });
    
    const loadTariffs = async () => {
        try {
            const data = await tariffService.getTariffs();
            const responseData: any = data;
            
            if (Array.isArray(responseData)) {
                setTariffs(responseData);
            } else if (responseData && Array.isArray(responseData.content)) {
                setTariffs(responseData.content);
            } else if (responseData && Array.isArray(responseData.data)) {
                setTariffs(responseData.data);
            } else {
                setTariffs([]); 
            }
        } catch (error) {
            console.error("Error al obtener aranceles:", error);
            setTariffs([]); 
        }
    };

    useEffect(() => {
        loadTariffs();
    }, []);

    const validate = () => {
        const montoVacio =
            !newArancel.monto_pesos.trim() &&
            !newArancel.monto_dolares.trim();

        setErrors({
            monto: montoVacio
        });

        return !montoVacio;
    };

    const handleSave = async () => {
        if (!validate()) return;

        try {
            const dataToSave = {
                name: newArancel.nombre,
                tariffDate: newArancel.fecha ? newArancel.fecha : undefined,
                amountPesos: newArancel.monto_pesos ? Number(newArancel.monto_pesos) : undefined,
                amountDollars: newArancel.monto_dolares ? Number(newArancel.monto_dolares) : undefined,
                tc: newArancel.tc ? Number(newArancel.tc) : undefined
            };

            await tariffService.createTariff(dataToSave);
            
            setNewArancel({ fecha: "", nombre: "", monto_pesos: "", monto_dolares: "", tc: "" });
            setCreating(false);
            loadTariffs();

        } catch (error) {
            console.error("Error al guardar el arancel:", error);
        }
    };

    const handleDeleteRequest = (id: number) => {
        setTariffToDelete(id);
    };

    const confirmDelete = async () => {
        if (tariffToDelete === null) return;
        try {
            await tariffService.deleteTariff(tariffToDelete);
            loadTariffs();
        } catch (error) {
            console.error("Error al eliminar:", error);
        } finally {
            setTariffToDelete(null); 
        }
    };

    const handleUpdate = async (id: number, data: TariffUpdateDTO) => {
        try {
            await tariffService.updateTariff(id, data);
            loadTariffs();
        } catch (error) {
            console.error("Error al actualizar:", error);
        }
    };

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
                        <p>Acciones</p>
                    </div>

                    {Array.isArray(tariffs) ? (
                        tariffs.map((tariff) => (
                            <Procedimiento 
                                key={tariff.id} 
                                tariff={tariff} 
                                onDelete={handleDeleteRequest} 
                                onUpdate={handleUpdate}
                            />
                        ))
                    ) : (
                        <p style={{ textAlign: "center", marginTop: "2rem" }}>
                            Cargando datos o error en el formato...
                        </p>
                    )}

                    {Array.isArray(tariffs) && tariffs.length === 0 && (
                        <p style={{ textAlign: "center", marginTop: "2rem" }}>
                            Aún no hay aranceles cargados.
                        </p>
                    )}
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
                                type="number" 
                                onChange={(e) =>
                                    setNewArancel({...newArancel, monto_pesos: e.target.value})
                                }
                                error={errors.monto}
                            />

                            <MiniInput
                                placeholder="Monto en USD" 
                                className="inputBoxDefault"
                                value={newArancel.monto_dolares}
                                type="number"
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
                                type="number"
                                onChange={(e) =>
                                    setNewArancel({...newArancel, tc: e.target.value})
                                }
                            />
                        </div>
                    </div>

                    <div className={style.button}>
                        <GreenFormButton 
                            text={'Guardar arancel'}
                            onClick={handleSave}
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

            {tariffToDelete !== null && (
                <div className={style.modalOverlay}>
                    <div className={style.modalContent}>
                        <p>¿Estás seguro que querés eliminar este arancel?</p>
                        <div className={style.modalButtons}>
                            <button 
                                className={style.cancelBtn} 
                                onClick={() => setTariffToDelete(null)}
                            >
                                Cancelar
                            </button>
                            <button 
                                className={style.confirmDeleteBtn} 
                                onClick={confirmDelete}
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    )
}