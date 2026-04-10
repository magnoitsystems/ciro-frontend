import style from './NewProvForm.module.css';
import ProvInput from "./ProvInput.tsx";
import GreenFormButton from "../../Buttons/GreenFormButton/greenFormButton";
import {useState} from "react";

type Proveedor = {
    id: number;
    nombre: string;
    documento: string;
    direccion: string;
    localidad: string;
    observaciones: string;
};

type Props = {
    onCreate: (prov: Proveedor) => void;
}

export default function NewProvForm({ onCreate }: Props) {

    const [formData, setFormData] = useState({
        nombre: "",
        documento: "",
        direccion: "",
        localidad: "",
        observaciones: ""
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const nuevoProveedor = {
            id: Date.now(),
            ...formData
        };

        onCreate(nuevoProveedor);

        // reset
        setFormData({
            nombre: "",
            documento: "",
            direccion: "",
            localidad: "",
            observaciones: ""
        });
    };

    return(
        <main className={style.formContainer}>
            <p>Crear nuevo proveedor</p>

            <form onSubmit={handleSubmit} className={style.form}>

                <div className={style.sharedInputs}>
                    <ProvInput
                        placeholder="Nombre y apellido"
                        className="inputBoxDefault"
                        value={formData.nombre}
                        onChange={(e) =>
                            setFormData({...formData, nombre: e.target.value})
                        }
                    />
                    <ProvInput
                        type="text"
                        placeholder="Número de documento"
                        className={'inputBoxDefault'}
                        value={formData.documento}
                        onChange={(e) =>
                            setFormData({...formData, documento: e.target.value})
                        }
                    />
                </div>

                <div className={style.sharedInputs}>
                    <ProvInput
                        type="text"
                        placeholder="Dirección"
                        className={'inputBoxDefault'}
                        value={formData.direccion}
                        onChange={(e) =>
                            setFormData({...formData, direccion: e.target.value})
                        }
                    />
                    <ProvInput
                        type="text"
                        placeholder="Localidad"
                        className={'inputBoxDefault'}
                        value={formData.localidad}
                        onChange={(e) =>
                            setFormData({...formData, localidad: e.target.value})
                        }
                    />
                </div>

                <ProvInput
                    type="text"
                    placeholder="Observaciones"
                    className={'inputBoxBig'}
                    value={formData.observaciones}
                    onChange={(e) =>
                        setFormData({...formData, observaciones: e.target.value})
                    }
                />

                <div className={style.sharedInputs}>
                    <GreenFormButton
                        text="Crear proveedor"
                        onClick={handleSubmit}
                    />
                </div>

            </form>
        </main>
    )
}