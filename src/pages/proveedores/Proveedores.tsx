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
    const [viewModal, setViewModal] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState<SupplierResponseDTO | null>(null);

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

    const handleRowClick = (prov: SupplierResponseDTO) => {
        setSelectedSupplier(prov);
        setViewModal(true);
    };

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
                                        <div key={prov.id} className={style.row} onClick={() => handleRowClick(prov)}>
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

            {viewModal && selectedSupplier && (
                <div className={style.overlay} onClick={() => setViewModal(false)}>
                    <div className={style.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={style.modalHeader}>
                            <h3>Detalle del proveedor</h3>
                            <button className={style.close} onClick={() => setViewModal(false)}>✕</button>
                        </div>
                        <div className={style.details}>
                            <div className={style.section}>
                                <h5>Datos de la entidad</h5>
                                <div className={style.detailRow}><span>Nombre</span><h6>{selectedSupplier.fullName}</h6></div>
                                <div className={style.detailRow}><span>Documento</span><h6>DNI {selectedSupplier.dni}</h6></div>
                            </div>
                            <div className={style.section}>
                                <h5>Contacto y otros</h5>
                                <div className={style.detailRow}><span>Dirección</span><h6>{selectedSupplier.address || "-"}</h6></div>
                                <div className={style.detailRow}><span>Localidad</span><h6>{selectedSupplier.city || "-"}</h6></div>
                                <div className={style.detailRow}><span>Observaciones</span><h6>{selectedSupplier.observations || "-"}</h6></div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    )
}