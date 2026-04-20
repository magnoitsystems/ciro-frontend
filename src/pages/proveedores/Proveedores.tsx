import style from './Proveedores.module.css';
import WelcomeText from "../../components/WelcomeText/welcomeText.tsx";
import NewProvForm from "../../components/Forms/NewProvForm/newProvForm.tsx";
import { useState, useEffect } from "react";
import type { SupplierResponseDTO } from '../../types/supplier.types';
import { supplierService } from '../../services/supplier.service.ts';

export default function Proveedores() {

    const [showForm, setShowForm] = useState(false);
    const [proveedores, setProveedores] = useState<SupplierResponseDTO[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchProveedores = async () => {
        try {
            setIsLoading(true);
            const data = await supplierService.getAll();
            setProveedores(data);
        } catch (error) {
            console.error("Error al cargar los proveedores:", error);
            alert("No pudimos cargar la lista de proveedores. Comprobá tu conexión o intentá de nuevo.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProveedores();
    }, []);

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

                                {isLoading ? (
                                    <p style={{ padding: '20px' }}>Cargando proveedores...</p>
                                ) : proveedores.length > 0 ? (
                                    proveedores.map((prov) => (
                                        <div key={prov.id} className={style.row}>
                                            <span>{prov.fullName}</span>
                                            <span>{prov.dni}</span>
                                            <span>{prov.address}</span>
                                            <span>{prov.city}</span>
                                            <span title={prov.observations}>
                                                {prov.observations || "-"}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <p style={{ padding: '20px' }}>No hay proveedores registrados aún.</p>
                                )}
                            </div>
                        </div>

                    </div>
                ) : (
                    <div className={style.newProvForm}>
                        <NewProvForm onCreate={(nuevoProveedor) => {
                            setProveedores(prev => [...prev, nuevoProveedor]);
                            setShowForm(false);
                            alert("¡Proveedor creado y guardado con éxito!");
                        }}/>
                    </div>
                )}

                <div
                    className={`${style.seeMore} ${showForm ? style.active : ""}`}
                    onClick={() => setShowForm(!showForm)}
                >
                    <img src={'/icons/bigRight.png'} alt="Flecha" />
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