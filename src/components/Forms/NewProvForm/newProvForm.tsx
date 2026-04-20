import style from './NewProvForm.module.css';
import ProvInput from "./ProvInput.tsx";
import GreenFormButton from "../../Buttons/GreenFormButton/greenFormButton";
import { useState } from "react";
import { supplierService } from '../../../services/supplier.service.ts';
import type { SupplierResponseDTO, SupplierCreateDTO } from '../../../types/supplier.types.ts';

type Props = {
    onCreate: (prov: SupplierResponseDTO) => void;
}

export default function NewProvForm({ onCreate }: Props) {

    const [formData, setFormData] = useState<SupplierCreateDTO>({
        fullName: "",
        dni: "",
        address: "",
        city: "",
        observations: ""
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.fullName || !formData.dni) {
            alert("Por favor, completá al menos el Nombre y el Documento.");
            return;
        }

        try {
            setIsSubmitting(true);
            
            const nuevoProveedor = await supplierService.create(formData);

            onCreate(nuevoProveedor);

            setFormData({
                fullName: "",
                dni: "",
                address: "",
                city: "",
                observations: ""
            });

        } catch (error) {
            console.error("Error al crear proveedor:", error);
            alert("Ocurrió un error al intentar crear el proveedor. Por favor, intentá nuevamente.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return(
        <main className={style.formContainer}>
            <p>Crear nuevo proveedor</p>

            <form onSubmit={handleSubmit} className={style.form}>

                <div className={style.sharedInputs}>
                    <ProvInput
                        placeholder="Nombre y apellido"
                        className="inputBoxDefault"
                        value={formData.fullName}
                        onChange={(e) =>
                            setFormData({...formData, fullName: e.target.value})
                        }
                    />
                    <ProvInput
                        type="text"
                        placeholder="Número de documento"
                        className={'inputBoxDefault'}
                        value={formData.dni}
                        onChange={(e) =>
                            setFormData({...formData, dni: e.target.value})
                        }
                    />
                </div>

                <div className={style.sharedInputs}>
                    <ProvInput
                        type="text"
                        placeholder="Dirección"
                        className={'inputBoxDefault'}
                        value={formData.address}
                        onChange={(e) =>
                            setFormData({...formData, address: e.target.value})
                        }
                    />
                    <ProvInput
                        type="text"
                        placeholder="Localidad"
                        className={'inputBoxDefault'}
                        value={formData.city}
                        onChange={(e) =>
                            setFormData({...formData, city: e.target.value})
                        }
                    />
                </div>

                <ProvInput
                    type="text"
                    placeholder="Observaciones"
                    className={'inputBoxBig'}
                    value={formData.observations}
                    onChange={(e) =>
                        setFormData({...formData, observations: e.target.value})
                    }
                />

                <div className={style.sharedInputs}>
                    <GreenFormButton
                        text={isSubmitting ? "Creando..." : "Crear proveedor"}
                        onClick={handleSubmit}
                    />
                </div>

            </form>
        </main>
    )
}