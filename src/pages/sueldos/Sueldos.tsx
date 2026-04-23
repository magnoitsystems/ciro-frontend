/* eslint-disable @typescript-eslint/no-unused-vars */
import style from './Sueldos.module.css';
import WelcomeText from "../../components/WelcomeText/welcomeText.tsx";
import BillCard from "../../components/BillCard/billCard.tsx";
import { useEffect, useState } from "react";
import ReporteForm from "../../components/Forms/ReporteForm/ReporteForm.tsx";
import ProvInput from "../../components/Forms/NewProvForm/ProvInput.tsx";
import GreenFormButton from "../../components/Buttons/GreenFormButton/greenFormButton.tsx";
import { billService } from '../../services/bill.service.ts';
import type { BillCreateDTO, BillResponseDTO } from "../../types/bills.types";
import type { BillStatus, BillType, PaymentMethod, CurrencyType, OriginType, ReportPeriod } from "../../types/enums.types";
import { supplierService } from '../../services/supplier.service.ts';
import { userService } from '../../services/user.service.ts';
import type { SupplierResponseDTO } from '../../types/supplier.types.ts';
import type { UserResponseDTO } from '../../types/users.types.ts';

export default function Sueldos() {
    const [activeTab, setActiveTab] = useState<"sueldos" | "gastos" | "reporte">("sueldos");
    const [bills, setBills] = useState<BillResponseDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [users, setUsers] = useState<UserResponseDTO[]>([]);
    const [suppliers, setSuppliers] = useState<SupplierResponseDTO[]>([]);

    const [showGastoModal, setShowGastoModal] = useState(false);
    const [viewGastoModal, setViewGastoModal] = useState(false);
    const [selectedGasto, setSelectedGasto] = useState<BillResponseDTO | null>(null);
    
    const [isEditMode, setIsEditMode] = useState(false);

    const [notificacion, setNotificacion] = useState<{ message: string, type: "success" | "error" } | null>(null);

    const initialGastoState = {
        employeeId: "",
        supplierId: "",
        billDate: new Date().toISOString().split('T')[0], 
        amount: "",
        description: "",
        status: "PENDIENTE" as BillStatus,
        paymentMethod: "EFECTIVO" as PaymentMethod,
        currencyType: "PESOS" as CurrencyType,
        from: "CAJA" as OriginType,
        billType: "SUELDO" as BillType
    };

    const [newGasto, setNewGasto] = useState(initialGastoState);

    useEffect(() => {
        if (notificacion) {
            const timer = setTimeout(() => setNotificacion(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [notificacion]);

    const fetchBills = async () => {
        setLoading(true);
        try {
            if (activeTab !== "reporte") {
                const typeFilter: BillType = activeTab === "sueldos" ? "SUELDO" : "SERVICIO";
                const data = await billService.getAllBills(typeFilter);
                setBills(data);
            }
        } catch (error) {
            console.error("Error al cargar los datos:", error);
            setNotificacion({ message: "Error al cargar los registros.", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    const loadDependencies = async () => {
        try {
            const [usersData, suppliersData] = await Promise.all([
                userService.getAllUsers(),
                supplierService.getAll()
            ]);
            setUsers(usersData);
            setSuppliers(suppliersData);
        } catch (error) {
            console.error("Error al cargar usuarios/proveedores:", error);
        }
    };

    useEffect(() => {
        loadDependencies();
    }, []);

    useEffect(() => {
        fetchBills();
        setNewGasto(prev => ({
            ...initialGastoState,
            billType: activeTab === "sueldos" ? "SUELDO" : "SERVICIO",
        }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab]);

    const handleSubmitBill = async () => {
        try {
            const payload: BillCreateDTO = {
                employeeId: newGasto.employeeId ? Number(newGasto.employeeId) : undefined,
                supplierId: newGasto.supplierId ? Number(newGasto.supplierId) : undefined,
                billDate: newGasto.billDate,
                amount: Number(newGasto.amount),
                description: newGasto.description,
                status: newGasto.status,
                paymentMethod: newGasto.paymentMethod,
                currencyType: newGasto.currencyType,
                from: newGasto.from,
                billType: newGasto.billType
            };

            if (isEditMode && selectedGasto) {
                await billService.updateBill(selectedGasto.id, payload);
                setNotificacion({ message: "Registro actualizado exitosamente.", type: "success" });
            } else {
                await billService.createBill(payload);
                setNotificacion({ message: "Registro creado exitosamente.", type: "success" });
            }
            
            closeFormModal();
            fetchBills(); 

        } catch (error) {
            console.error("Error al guardar:", error);
            setNotificacion({ message: "Ocurrió un error al guardar el registro.", type: "error" });
        }
    };

    const handleEditClick = () => {
        if (!selectedGasto) return;
        setNewGasto({
            employeeId: selectedGasto.employeeId ? String(selectedGasto.employeeId) : "",
            supplierId: selectedGasto.supplierId ? String(selectedGasto.supplierId) : "",
            billDate: selectedGasto.billDate,
            amount: String(selectedGasto.amount),
            description: selectedGasto.description || "",
            status: selectedGasto.status,
            paymentMethod: selectedGasto.paymentMethod || "EFECTIVO",
            currencyType: selectedGasto.currencyType || "PESOS",
            from: selectedGasto.from || "CAJA",
            billType: selectedGasto.billType
        });
        setIsEditMode(true);
        setViewGastoModal(false); 
        setShowGastoModal(true); 
    };

    const handleDeleteClick = async () => {
        if (!selectedGasto) return;
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!selectedGasto) return;
        
        try {
            console.log(`Eliminando registro ID: ${selectedGasto.id}...`);
            // Descomentar cuando haya hecho el eliminar en el back
            // await billService.deleteBill(selectedGasto.id);
            
            setNotificacion({ message: "Registro eliminado exitosamente.", type: "success" });
            setShowDeleteModal(false);
            setViewGastoModal(false);
            fetchBills();
        } catch (error) {
            console.error("Error al eliminar el registro:", error);
            setNotificacion({ message: "Ocurrió un error al eliminar el registro.", type: "error" });
            setShowDeleteModal(false);
        }
    };

    const closeFormModal = () => {
        setShowGastoModal(false);
        setIsEditMode(false);
        setNewGasto({...initialGastoState, billType: activeTab === "sueldos" ? "SUELDO" : "SERVICIO"});
    };

    const handleGenerateReport = async (period: string, date?: string) => {
        try {
            let javaFriendlyDate = date;
            if (date && date.length === 7) {
                javaFriendlyDate = `${date}-01`;
            }

            await billService.downloadBillsReport(period as ReportPeriod, javaFriendlyDate);
            setNotificacion({ message: "Reporte generado con éxito.", type: "success" });
        } catch (error) {
            setNotificacion({ message: "Error al descargar el reporte PDF.", type: "error" });
        }
    };

    return(
        <main className={style.main}>
            <WelcomeText
                sectionText={'Acá los registros de sueldos y gastos'}
                className={'darkStyle'}
            />

            {notificacion && (
                <div style={{
                    padding: "12px 16px",
                    margin: "0 auto 20px auto",
                    width: "fit-content",
                    minWidth: "300px",
                    backgroundColor: notificacion.type === "error" ? "#fee2e2" : "#dcfce7",
                    color: notificacion.type === "error" ? "#991b1b" : "#166534",
                    borderRadius: "8px",
                    border: `1px solid ${notificacion.type === "error" ? "#f87171" : "#86efac"}`,
                    textAlign: "center",
                    fontWeight: "500",
                    fontSize: "14px",
                    transition: "all 0.3s ease",
                    zIndex: 100
                }}>
                    {notificacion.message}
                </div>
            )}

            <div className={style.newBill}>
                <div onClick={() => setShowGastoModal(true)} className={style.button}><h3>+</h3></div>
            </div>

            <div className={style.container}>
                <div className={style.pages}>
                    <h4
                        className={`${style.tab} ${activeTab === "sueldos" ? style.activeTab : ""}`}
                        onClick={() => setActiveTab("sueldos")}
                    >
                        Sueldos
                    </h4>

                    <h4
                        className={`${style.tab} ${activeTab === "gastos" ? style.activeTab : ""}`}
                        onClick={() => setActiveTab("gastos")}
                    >
                        Gastos
                    </h4>

                    <h4
                        className={`${style.tab} ${activeTab === "reporte" ? style.activeTab : ""}`}
                        onClick={() => setActiveTab("reporte")}
                    >
                        Generar reporte
                    </h4>
                </div>

                <div className={style.content}>
                    {activeTab !== "reporte" && (
                        <>
                            <div className={style.columnNames}>
                                <p>Beneficiario / Entidad</p>
                                <p>Fecha de pago</p>
                                <p>Método de pago</p>
                                <p>Monto</p>
                                <p>Moneda</p>
                                <p>Origen del dinero</p>
                                <p>Estado</p>
                            </div>

                            {loading ? (
                                <p style={{ textAlign: "center", marginTop: "20px" }}>Cargando registros...</p>
                            ) : bills.length === 0 ? (
                                <p style={{ textAlign: "center", marginTop: "20px" }}>No hay registros para mostrar.</p>
                            ) : (
                                bills.map((bill) => (
                                    <BillCard
                                        key={bill.id}
                                        bill={bill}
                                        onClick={() => {
                                            setSelectedGasto(bill);
                                            setViewGastoModal(true);
                                        }}
                                    />
                                ))
                            )}
                        </>
                    )}

                    {activeTab === "reporte" && (
                        <div className={style.reportContainer}>
                            <ReporteForm onGenerate={handleGenerateReport} />
                        </div>
                    )}
                </div>
            </div>

            {showGastoModal && (
                <div className={style.overlay} onClick={closeFormModal}>
                    <div className={style.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={style.modalHeader}>
                            <h3>{isEditMode ? "Editar" : "Nuevo"} {newGasto.billType === "SUELDO" ? "Sueldo" : "Gasto"}</h3>
                            <button className={style.close} onClick={closeFormModal}>✕</button>
                        </div>

                        <div className={style.form}>
                            {newGasto.billType === "SUELDO" && (
                                <div className={style.sharedInput}>
                                    <ProvInput
                                        placeholder="Seleccionar Empleado (opcional)"
                                        as="select"
                                        value={newGasto.employeeId}
                                        onChange={(e) => setNewGasto({...newGasto, employeeId: e.target.value, supplierId: ""})} 
                                        className={"inputBoxDefault"}
                                        options={[
                                            { value: "", label: "-- Ninguno --" },
                                            ...users.map(u => ({ value: String(u.id), label: `${u.name} ${u.lastname}` }))
                                        ]}
                                    />
                                    <ProvInput
                                        placeholder="Seleccionar Proveedor (opcional)"
                                        as="select"
                                        value={newGasto.supplierId}
                                        onChange={(e) => setNewGasto({...newGasto, supplierId: e.target.value, employeeId: ""})} 
                                        className={"inputBoxDefault"}
                                        options={[
                                            { value: "", label: "-- Ninguno --" },
                                            ...suppliers.map(s => ({ value: String(s.id), label: s.fullName }))
                                        ]}
                                    />
                                </div>
                            )}

                            <div className={style.sharedInput}>
                                <ProvInput
                                    type="date"
                                    placeholder={'Fecha'}
                                    value={newGasto.billDate}
                                    onChange={(e) => setNewGasto({...newGasto, billDate: e.target.value})}
                                    className={"inputBoxDefault"}
                                />
                                <ProvInput
                                    type="number"
                                    placeholder="Monto a pagar"
                                    value={newGasto.amount}
                                    onChange={(e) => setNewGasto({...newGasto, amount: e.target.value})}
                                    className={"inputBoxDefault"}
                                />
                            </div>

                            <ProvInput
                                placeholder="Descripción del pago..."
                                value={newGasto.description}
                                onChange={(e) => setNewGasto({...newGasto, description: e.target.value})}
                                className={"inputBoxBig"}
                            />

                            <div className={style.sharedInput}>
                                <ProvInput
                                    placeholder="Estado del pago"
                                    as="select"
                                    className="inputBoxDefault"
                                    value={newGasto.status}
                                    onChange={(e) => setNewGasto({...newGasto, status: e.target.value as BillStatus})}
                                    options={[
                                        {value: "PENDIENTE", label: "Pendiente"},
                                        {value: "PAGADO", label: "Pagado"}
                                    ]}
                                />
                                <ProvInput
                                    placeholder="Proveniencia del pago"
                                    as="select"
                                    className="inputBoxDefault"
                                    value={newGasto.from}
                                    onChange={(e) => setNewGasto({...newGasto, from: e.target.value as OriginType})}
                                    options={[
                                        {value: "CAJA", label: "Caja"},
                                        {value: "DOCTOR", label: "Doctor"}
                                    ]}
                                />
                            </div>

                            <div className={style.sharedInput}>
                                <ProvInput
                                    placeholder="Método de pago"
                                    as="select"
                                    className="inputBoxDefault"
                                    value={newGasto.paymentMethod}
                                    onChange={(e) => setNewGasto({...newGasto, paymentMethod: e.target.value as PaymentMethod})}
                                    options={[
                                        {value: "EFECTIVO", label: "Efectivo"},
                                        {value: "TRANSFERENCIA", label: "Transferencia"},
                                        {value: "TARJETA_CREDITO", label: "Tarjeta de crédito"},
                                        {value: "TARJETA_DEBITO", label: "Tarjeta de débito"},
                                        {value: "MERCADO_PAGO", label: "Mercado Pago"},
                                        {value: "DOLARES", label: "Dólares"},
                                        {value: "CHEQUE", label: "Cheque"}
                                    ]}
                                />
                                <ProvInput
                                    placeholder="Tipo de moneda"
                                    as="select"
                                    className="inputBoxDefault"
                                    value={newGasto.currencyType}
                                    onChange={(e) => setNewGasto({...newGasto, currencyType: e.target.value as CurrencyType})}
                                    options={[
                                        {value: "PESOS", label: "Pesos"},
                                        {value: "DOLARES", label: "Dólares"},
                                        {value: "REALES", label: "Reales"},
                                        {value: "EUROS", label: "Euros"}
                                    ]}
                                />
                            </div>
                        </div>

                        <div className={style.submitButton}>
                            <GreenFormButton text={isEditMode ? 'Actualizar registro' : 'Cargar registro'} onClick={handleSubmitBill} />
                        </div>
                    </div>
                </div>
            )}

            {viewGastoModal && selectedGasto && (
                <div className={style.overlay} onClick={() => setViewGastoModal(false)}>
                    <div className={style.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={style.modalHeader}>
                            <h3>Detalle del registro</h3>
                            <div className={style.headerActions}>
                                <img 
                                    src="/icons/editGrey.png" 
                                    alt="Editar" 
                                    title="Editar registro"
                                    className={style.actionIcon} 
                                    onClick={handleEditClick} 
                                />
                                <img 
                                    src="/icons/trash.png" 
                                    alt="Eliminar" 
                                    title="Eliminar registro"
                                    className={style.actionIcon} 
                                    onClick={handleDeleteClick} 
                                />
                                <button className={style.close} onClick={() => setViewGastoModal(false)}>✕</button>
                            </div>
                        </div>

                        <div className={style.reciboContainer}>
                            <div className={style.reciboSection}>
                                <h5>Información</h5>
                                <div className={style.row}>
                                    <span>Beneficiario/Entidad</span>
                                    <p>{selectedGasto.employeeFullName || selectedGasto.supplierFullName || selectedGasto.entityName}</p>
                                </div>
                                <div className={style.row}>
                                    <span>Fecha</span>
                                    <p>{selectedGasto.billDate}</p>
                                </div>
                                <div className={style.row}>
                                    <span>Monto</span>
                                    <p>{selectedGasto.currencyType === 'PESOS' ? '$' : selectedGasto.currencyType} {selectedGasto.amount}</p>
                                </div>
                                <div className={style.row}>
                                    <span>Estado</span>
                                    <p className={selectedGasto.status === 'PAGADO' ? style.paid : style.pending}>{selectedGasto.status}</p>
                                </div>
                            </div>

                            <div className={style.reciboSection}>
                                <h5>Detalle</h5>
                                <div className={style.row}>
                                    <span>Descripción</span>
                                    <p>{selectedGasto.description || '-'}</p>
                                </div>
                                <div className={style.row}>
                                    <span>Método de pago</span>
                                    <p>{selectedGasto.paymentMethod ? selectedGasto.paymentMethod.replace('_', ' ') : '-'}</p>
                                </div>
                                <div className={style.row}>
                                    <span>Origen</span>
                                    <p>{selectedGasto.from || '-'}</p>
                                </div>
                                <div className={style.row}>
                                    <span>Tipo</span>
                                    <p>{selectedGasto.billType}</p>
                                </div>
                            </div>

                            {(selectedGasto.employeeId || selectedGasto.supplierId) && (
                                <div className={style.reciboSection}>
                                    <h5>Relación</h5>
                                    {selectedGasto.employeeId && (
                                        <div className={style.row}>
                                            <span>ID Empleado</span>
                                            <p>{selectedGasto.employeeId}</p>
                                        </div>
                                    )}
                                    {selectedGasto.supplierId && (
                                        <div className={style.row}>
                                            <span>ID Proveedor</span>
                                            <p>{selectedGasto.supplierId}</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {showDeleteModal && (
                <div className={style.overlay} onClick={() => setShowDeleteModal(false)} style={{ zIndex: 1000 }}>
                    <div className={style.modal} onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px', textAlign: 'center' }}>
                        <h3 style={{ marginBottom: '15px' }}>¿Eliminar registro?</h3>
                        <p style={{ marginBottom: '25px', color: '#ccc' }}>Esta acción no se puede deshacer.</p>
                        
                        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                            <button 
                                onClick={() => setShowDeleteModal(false)}
                                style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid #555', backgroundColor: 'transparent', color: '#fff', cursor: 'pointer' }}
                            >
                                Cancelar
                            </button>
                            <button 
                                onClick={confirmDelete}
                                style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', backgroundColor: '#ef4444', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}
                            >
                                Sí, eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    )
}