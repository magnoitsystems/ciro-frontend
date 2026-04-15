import style from './Sueldos.module.css';
import WelcomeText from "../../components/WelcomeText/welcomeText.tsx";
import BillCard from "../../components/BillCard/billCard.tsx";
import {useState} from "react";
import ReporteForm from "../../components/Forms/ReporteForm/ReporteForm.tsx";
import ProvInput from "../../components/Forms/NewProvForm/ProvInput.tsx";
import GreenFormButton from "../../components/Buttons/GreenFormButton/greenFormButton.tsx";
import MiniInput from "../../components/Forms/NewProvForm/MiniInput.tsx";

export default function Sueldos() {
    const [activeTab, setActiveTab] = useState<"sueldos" | "gastos" | "reporte">("sueldos");

    const [showGastoModal, setShowGastoModal] = useState(false);

    const [newGasto, setNewGasto] = useState({
        employeeId: "",
        supplierId: "",
        billDate: "",
        amount: "",
        description: "",
        status: "",
        paymentMethod: "",
        currencyType: "",
        from: "",
        billType: ""
    });

    const [viewGastoModal, setViewGastoModal] = useState(false);
    const [selectedGasto, setSelectedGasto] = useState<any>(null);


    return(
        <main className={style.main}>
            <WelcomeText
                sectionText={'Acá los registros de sueldos y gastos'}
                className={'darkStyle'}
            />

            <div
                className={style.newBill}
            >
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

                    {activeTab === "sueldos" && (
                        <>
                            <div className={style.columnNames}>
                                <p>Nombre y apellido</p>
                                <p>Fecha de pago</p>
                                <p>Método de pago</p>
                                <p>Monto</p>
                                <p>Moneda</p>
                                <p>Origen del dinero</p>
                                <p>Estado</p>
                            </div>

                            <BillCard
                                onClick={() => {
                                    setSelectedGasto({
                                        employeeId: 1,
                                        supplierId: 2,
                                        billDate: "2026-04-10",
                                        amount: 15000,
                                        description: "Compra de insumos",
                                        status: "PAGADO",
                                        paymentMethod: "EFECTIVO",
                                        currencyType: "PESOS",
                                        from: "CAJA",
                                        billType: "SERVICIO"
                                    });
                                    setViewGastoModal(true);
                                }}
                            />
                            <BillCard
                                onClick={() => {
                                    setSelectedGasto({
                                        employeeId: 1,
                                        supplierId: 2,
                                        billDate: "2026-04-10",
                                        amount: 15000,
                                        description: "Compra de insumos",
                                        status: "PAGADO",
                                        paymentMethod: "EFECTIVO",
                                        currencyType: "PESOS",
                                        from: "CAJA",
                                        billType: "SERVICIO"
                                    });
                                    setViewGastoModal(true);
                                }}
                            />
                        </>
                    )}

                    {activeTab === "gastos" && (
                        <>
                            <div className={style.columnNames}>
                                <p>Nombre y apellido</p>
                                <p>Fecha de pago</p>
                                <p>Método de pago</p>
                                <p>Monto</p>
                                <p>Moneda</p>
                                <p>Origen del dinero</p>
                                <p>Estado</p>
                            </div>

                            <BillCard
                                onClick={() => {
                                    setSelectedGasto({
                                        employeeId: 1,
                                        supplierId: null,
                                        billDate: "2026-04-15",
                                        amount: 20000,
                                        description: "Compra insumos",
                                        status: "PAGADO",
                                        paymentMethod: "EFECTIVO",
                                        currencyType: "PESOS",
                                        from: "CAJA",
                                        billType: "SERVICIO"
                                    });
                                    setViewGastoModal(true);
                                }}
                            />
                            <BillCard
                                onClick={() => {
                                    setSelectedGasto({
                                        employeeId: 1,
                                        supplierId: null,
                                        billDate: "2026-04-15",
                                        amount: 20000,
                                        description: "Compra insumos",
                                        status: "PAGADO",
                                        paymentMethod: "EFECTIVO",
                                        currencyType: "PESOS",
                                        from: "CAJA",
                                        billType: "SERVICIO"
                                    });
                                    setViewGastoModal(true);
                                }}
                            />
                        </>
                    )}

                    {activeTab === "reporte" && (
                        <div className={style.reportContainer}>
                            <ReporteForm/>
                        </div>
                    )}

                </div>
            </div>
            {showGastoModal && (
                <div
                    className={style.overlay}
                    onClick={() => setShowGastoModal(false)}
                >
                    <div
                        className={style.modal}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className={style.close}
                            onClick={() => setShowGastoModal(false)}
                        >
                            ✕
                        </button>

                        <h3>Nuevo gasto</h3>

                        <div className={style.form}>

                            <div className={style.sharedInput}>
                                <MiniInput
                                    placeholder="ID Empleado (opcional)"
                                    value={newGasto.employeeId}
                                    onChange={(e) =>
                                        setNewGasto({...newGasto, employeeId: e.target.value})
                                    }
                                    className={"inputBoxDefault"}
                                />

                                <MiniInput
                                    placeholder="ID Proveedor (opcional)"
                                    value={newGasto.supplierId}
                                    onChange={(e) =>
                                        setNewGasto({...newGasto, supplierId: e.target.value})
                                    }
                                    className={"inputBoxDefault"}
                                />
                            </div>

                            <div className={style.sharedInput}>
                                <ProvInput
                                    type="date"
                                    placeholder={'Fecha'}
                                    value={newGasto.billDate}
                                    onChange={(e) =>
                                        setNewGasto({...newGasto, billDate: e.target.value})
                                    }
                                    className={"inputBoxDefault"}
                                />

                                <ProvInput
                                    type="number"
                                    placeholder="Monto"
                                    value={newGasto.amount}
                                    onChange={(e) =>
                                        setNewGasto({...newGasto, amount: e.target.value})
                                    }
                                    className={"inputBoxDefault"}
                                />
                            </div>

                            <ProvInput
                                placeholder="Descripción"
                                value={newGasto.description}
                                onChange={(e) =>
                                    setNewGasto({...newGasto, description: e.target.value})
                                }
                                className={"inputBoxBig"}
                            />

                            <div className={style.sharedInput}>
                                <ProvInput
                                    placeholder="Estado"
                                    as="select"
                                    className="inputBoxDefault"
                                    value={newGasto.status}
                                    onChange={(e) =>
                                        setNewGasto({...newGasto, status: e.target.value})
                                    }
                                    options={[
                                        {value: "PENDIENTE", label: "Pendiente"},
                                        {value: "PAGADO", label: "Pagado"}
                                    ]}
                                />

                                <ProvInput
                                    placeholder="Tipo de gasto"
                                    as="select"
                                    className="inputBoxDefault"
                                    value={newGasto.billType}
                                    onChange={(e) =>
                                        setNewGasto({...newGasto, billType: e.target.value})
                                    }
                                    options={[
                                        {value: "SERVICIO", label: "Servicio"},
                                        {value: "SUELDO", label: "Sueldo"}
                                    ]}
                                />
                            </div>

                            <div className={style.sharedInput}>
                                <ProvInput
                                    placeholder="Método de pago"
                                    as="select"
                                    className="inputBoxDefault"
                                    value={newGasto.paymentMethod}
                                    onChange={(e) =>
                                        setNewGasto({...newGasto, paymentMethod: e.target.value})
                                    }
                                    options={[
                                        {value: "EFECTIVO", label: "Efectivo"},
                                        {value: "TRANSFERENCIA", label: "Transferencia"},
                                        {value: "TARJETA_CREDITO", label: "Tarjeta de crédito"},
                                        {value: "TARJETA_DEBITO", label: "Tarjeta de débito"},
                                        {value: "MERCADO_PAGO", label: "Mercado Pago"},
                                        {value: "DOLARES", label: "Dolares"},
                                        {value: "CHEQUE", label: "Cheque"}
                                    ]}
                                />

                                <ProvInput
                                    placeholder="Tipo de moneda"
                                    as="select"
                                    className="inputBoxDefault"
                                    value={newGasto.currencyType}
                                    onChange={(e) =>
                                        setNewGasto({...newGasto, currencyType: e.target.value})
                                    }
                                    options={[
                                        {value: "PESOS", label: "Efectivo"},
                                        {value: "DOLARES", label: "Transferencia"},
                                        {value: "REALES", label: "Tarjeta de crédito"},
                                        {value: "EUROS", label: "Tarjeta de débito"}
                                    ]}
                                />
                            </div>

                            <ProvInput
                                placeholder="Proveniencia del pago"
                                as="select"
                                className="inputBoxDefault"
                                value={newGasto.from}
                                onChange={(e) =>
                                    setNewGasto({...newGasto, from: e.target.value})
                                }
                                options={[
                                    {value: "CAJA", label: "Caja"},
                                    {value: "DOCTOR", label: "Doctor"}
                                ]}
                            />

                        </div>

                        <div className={style.submitButton}>
                            <GreenFormButton
                                text={'Cargar gasto'}
                                onClick={() => {
                                    const payload = {
                                        ...newGasto,
                                        employeeId: newGasto.employeeId ? Number(newGasto.employeeId) : undefined,
                                        supplierId: newGasto.supplierId ? Number(newGasto.supplierId) : undefined,
                                        amount: Number(newGasto.amount)
                                    };

                                    console.log("GASTO:", payload);
                                    setShowGastoModal(false);
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}
            {viewGastoModal && selectedGasto && (
                <div
                    className={style.overlay}
                    onClick={() => setViewGastoModal(false)}
                >
                    <div
                        className={style.modal}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className={style.close}
                            onClick={() => setViewGastoModal(false)}
                        >
                            ✕
                        </button>

                        <h3>Detalle del gasto</h3>

                        <div className={style.reciboContainer}>

                            <div className={style.reciboSection}>
                                <h5>Información</h5>

                                <div className={style.row}>
                                    <span>Fecha</span>
                                    <p>{selectedGasto.billDate}</p>
                                </div>

                                <div className={style.row}>
                                    <span>Monto</span>
                                    <p>
                                        {selectedGasto.currencyType} {selectedGasto.amount}
                                    </p>
                                </div>

                                <div className={style.row}>
                                    <span>Estado</span>
                                    <p>{selectedGasto.status}</p>
                                </div>
                            </div>

                            <div className={style.reciboSection}>
                                <h5>Detalle</h5>

                                <div className={style.row}>
                                    <span>Descripción</span>
                                    <p>{selectedGasto.description}</p>
                                </div>

                                <div className={style.row}>
                                    <span>Método de pago</span>
                                    <p>{selectedGasto.paymentMethod}</p>
                                </div>

                                <div className={style.row}>
                                    <span>Origen</span>
                                    <p>{selectedGasto.from}</p>
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
        </main>
    )
}