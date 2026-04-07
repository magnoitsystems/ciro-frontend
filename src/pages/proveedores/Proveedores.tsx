import style from './Proveedores.module.css';
import WelcomeText from "../../components/WelcomeText/welcomeText.tsx";
import NewProvForm from "../../components/Forms/NewProvForm/newProvForm.tsx";
import { useState } from "react";

export default function Proveedores() {

    const [showForm, setShowForm] = useState(false);

    const [proveedores, setProveedores] = useState([
        {
            id: 1,
            nombre: "MedInsumos SRL",
            documento: "30-71234567-8",
            direccion: "Av. Siempre Viva 123",
            localidad: "Tandil",
            observaciones: "Proveedor habitual"
        },
        {
            id: 1,
            nombre: "MedInsumos SRL",
            documento: "30-71234567-8",
            direccion: "Av. Siempre Viva 123",
            localidad: "Tandil",
            observaciones: "Proveedor habitual"
        },
        {
            id: 1,
            nombre: "MedInsumos SRL",
            documento: "30-71234567-8",
            direccion: "Av. Siempre Viva 123",
            localidad: "Tandil",
            observaciones: "Proveedor habitual"
        },
        {
            id: 1,
            nombre: "MedInsumos SRL",
            documento: "30-71234567-8",
            direccion: "Av. Siempre Viva 123",
            localidad: "Tandil",
            observaciones: "Proveedor habitual"
        },
        {
            id: 1,
            nombre: "MedInsumos SRL",
            documento: "30-71234567-8",
            direccion: "Av. Siempre Viva 123",
            localidad: "Tandil",
            observaciones: "Proveedor habitual"
        },{
            id: 1,
            nombre: "MedInsumos SRL",
            documento: "30-71234567-8",
            direccion: "Av. Siempre Viva 123",
            localidad: "Tandil",
            observaciones: "Proveedor habitual"
        },
        {
            id: 1,
            nombre: "MedInsumos SRL",
            documento: "30-71234567-8",
            direccion: "Av. Siempre Viva 123",
            localidad: "Tandil",
            observaciones: "Proveedor habitual"
        },
        {
            id: 1,
            nombre: "MedInsumos SRL",
            documento: "30-71234567-8",
            direccion: "Av. Siempre Viva 123",
            localidad: "Tandil",
            observaciones: "Proveedor habitual"
        },{
            id: 1,
            nombre: "MedInsumos SRL",
            documento: "30-71234567-8",
            direccion: "Av. Siempre Viva 123",
            localidad: "Tandil",
            observaciones: "Proveedor habitual"
        },

    ]);

    return(
        <main className={style.main}>
            <WelcomeText
                sectionText={'Acá la administración de proveedores'}
                className={'darkStyle'}
            />

            <div className={style.content}>

                {!showForm ? (
                    <div className={style.tableContainer}>
                        <p>Listado de proveedores</p>

                        <div className={style.tableScroll}>
                            <div className={style.table}>
                                <div className={style.rowHeader}>
                                    <span>Nombre completo</span>
                                    <span>Documento</span>
                                    <span>Dirección</span>
                                    <span>Localidad</span>
                                    <span>Observaciones</span>
                                </div>

                                {proveedores.map((prov) => (
                                    <div key={prov.id} className={style.row}>
                                        <span>{prov.nombre}</span>
                                        <span>{prov.documento}</span>
                                        <span>{prov.direccion}</span>
                                        <span>{prov.localidad}</span>
                                        <span title={prov.observaciones}>
                                            {prov.observaciones}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                ) : (
                    <div className={style.newProvForm}>
                        <NewProvForm onCreate={(nuevoProveedor) => {
                            setProveedores(prev => [...prev, nuevoProveedor]);
                        }}/>
                    </div>
                )}

                <div
                    className={`${style.seeMore} ${showForm ? style.active : ""}`}
                    onClick={() => setShowForm(!showForm)}
                >
                    <img src={'/icons/bigRight.png'}/>
                    <h6>
                        {showForm
                            ? "Ver listado de todos los proveedores"
                            : "Crear nuevo proveedor"}
                    </h6>
                </div>

            </div>
        </main>
    )
}