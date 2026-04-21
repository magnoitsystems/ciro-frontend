/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import WelcomeText from "../../components/WelcomeText/welcomeText.tsx";
import style from './CuentaCorriente.module.css';
import SaldosResume from "../../components/CtaCorriente/saldosResume.tsx";
import Register from "../../components/CtaCorriente/Register.tsx";
import DebtButton from "../../components/Buttons/CancelDebtButton/cancelDebtButton.tsx";
import { NavLink, useParams } from "react-router-dom";
import ProvInput from "../../components/Forms/NewProvForm/ProvInput.tsx";
import { useEffect, useState } from "react";
import GreenFormButton from "../../components/Buttons/GreenFormButton/greenFormButton.tsx";
import { currentAccountService } from "../../services/currentAccount.service"; 
import type { CurrentAccountResponseDTO } from "../../types/currentAccount.types"; 

export default function CuentaCorriente() {
    const { patientId } = useParams<{ patientId: string }>();
    
    const [accountData, setAccountData] = useState<CurrentAccountResponseDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [comprobanteData, setComprobanteData] = useState({
        fecha: "",
        observaciones: "",
        moneda: "",
        tipoCambio: "",
        metodoPago: "",
        details: [
            { detalle: "", cantidad: 1, precioUnitario: 0 }
        ]
    });

    useEffect(() => {
        const fetchCurrentAccount = async () => {
            if (!patientId) return;
            try {
                setLoading(true);
                const data = await currentAccountService.getPatientCurrentAccount(Number(patientId));
                setAccountData(data);
            } catch (error) {
                console.error("Error al obtener la cuenta corriente:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCurrentAccount();
    }, [patientId]);

    const addDetail = () => {
        setComprobanteData(prev => ({
            ...prev,
            details: [...prev.details, { detalle: "", cantidad: 1, precioUnitario: 0 }]
        }));
    };

    const removeDetail = (index: number) => {
        setComprobanteData(prev => ({
            ...prev,
            details: prev.details.filter((_, i) => i !== index)
        }));
    };

    const updateDetail = (index: number, field: string, value: any) => {
        const newDetails = [...comprobanteData.details];
        newDetails[index] = {
            ...newDetails[index],
            [field]: value
        };

        setComprobanteData(prev => ({
            ...prev,
            details: newDetails
        }));
    };

    const [showComprobanteModal, setShowComprobanteModal] = useState(false);
    const [showReciboModal, setShowReciboModal] = useState(false);

    const handleSubmit = () => {
        const payload = {
            fecha: comprobanteData.fecha || null,
            observaciones: comprobanteData.observaciones,
            moneda: comprobanteData.moneda,
            tipoCambio: Number(comprobanteData.tipoCambio),
            metodoPago: comprobanteData.metodoPago,
            details: comprobanteData.details
        };

        console.log("PAYLOAD:", payload);
    };

    const total = comprobanteData.details.reduce(
        (acc, d) => acc + d.cantidad * d.precioUnitario,
        0
    );

    const [pagarEnDolares, setPagarEnDolares] = useState(false);

    const [viewReciboModal, setViewReciboModal] = useState(false);
    const [selectedRecibo, setSelectedRecibo] = useState<any>(null);

    if (loading) return <div style={{padding: '40px', color: 'white'}}>Cargando cuenta corriente...</div>;
    if (!accountData) return <div style={{padding: '40px', color: 'white'}}>No se pudo cargar la cuenta corriente.</div>;

    return(
        <main className={style.main}>
            <WelcomeText
                sectionText={`Acá la Cta. Corriente de ${accountData.patientFullName || 'Paciente'}`}
                className={'darkStyle'}
            />

            <NavLink to={'/pacientes'} style={{ textDecoration: 'none' }}>
                <p style={{ cursor: 'pointer', color: 'var(--primary)', marginBottom: '20px' }}>
                    ← Volver a la sección pacientes
                </p>
            </NavLink>

            <div className={style.content}>
                <div className={style.allInformation}>
                    
                    {/* Pasamos los saldos reales */}
                    <SaldosResume 
                        saldoPesos={accountData.debtInPesos || 0} 
                        saldoDolares={accountData.debtInDollars || 0} 
                    />

                    <div className={style.registerContainer}>
                        <div className={style.columnNames}>
                            <h6>Tipo</h6>
                            <h6>Fecha</h6>
                            <h6>Importe en ARS</h6>
                            <h6>Importe en USD</h6>
                            <h6>Saldo en ARS</h6>
                            <h6>Saldo en USD</h6>
                        </div>

                        {/* Mapeamos el historial real */}
                        {accountData.movements && accountData.movements.length > 0 ? (
                            accountData.movements.map((movement) => (
                                <Register
                                    key={movement.id}
                                    movement={movement}
                                    onClick={() => {
                                        if (movement.type === 'RECEIPT') {
                                            setSelectedRecibo({
                                                receiptDate: movement.date,
                                                amount: movement.transactionAmountPesos > 0 ? movement.transactionAmountPesos : movement.transactionAmountDollars,
                                                currencyType: movement.transactionAmountDollars > 0 ? "DOLARES" : "PESOS",
                                                patientFullName: accountData.patientFullName,
                                                patientDni: "-"
                                            });
                                            setViewReciboModal(true);
                                        } else {
                                            console.log("Abrir detalle comprobante", movement.id);
                                        }
                                    }}
                                />
                            ))
                        ) : (
                            <p style={{ padding: '20px', color: 'var(--neutral-4)' }}>No hay movimientos registrados.</p>
                        )}

                        <DebtButton/>
                    </div>
                </div>

                <div className={style.createRegisters}>
                    <div onClick={() => setShowComprobanteModal(true)}>
                        <img src={'/icons/bigPlus.png'} alt="Crear Comprobante" />
                        <p>Crear nuevo comprobante</p>
                    </div>

                    <div onClick={() => setShowReciboModal(true)}>
                        <img src={'/icons/bigPlus.png'} alt="Crear Recibo" />
                        <p>Crear nuevo recibo</p>
                    </div>
                </div>
            </div>

            {showComprobanteModal && (
                <div className={style.overlay} onClick={() => setShowComprobanteModal(false)}>
                    <div className={style.modal} onClick={(e) => e.stopPropagation()}>
                        <button className={style.close} onClick={() => setShowComprobanteModal(false)}>✕</button>
                        <h3>Nuevo comprobante</h3>
                        <div className={style.form}>
                            <ProvInput placeholder="Fecha" type="date" className="inputBoxDefault" value={comprobanteData.fecha} onChange={(e) => setComprobanteData({...comprobanteData, fecha: e.target.value})} />
                            <ProvInput placeholder="Observaciones" type="text" className="inputBoxBig" value={comprobanteData.observaciones} onChange={(e) => setComprobanteData({...comprobanteData, observaciones: e.target.value})} />
                            <ProvInput placeholder="Moneda" as="select" className="inputBoxDefault" value={comprobanteData.moneda} onChange={(e) => setComprobanteData({...comprobanteData, moneda: e.target.value})} options={[{value: "PESOS", label: "Pesos (ARS)"}, {value: "DOLARES", label: "Dólares (USD)"}, {value: "REALES", label: "Reales (R)"}, {value: "EUROS", label: "Euros (EUR)"}]} />
                            
                            <div className={style.detailsContainer}>
                                <div className={style.detailsHeader}>
                                    <h5>Detalles</h5>
                                    <span onClick={addDetail}>+ Agregar</span>
                                </div>
                                <div className={style.detailsTable}>
                                    <div className={style.detailsColumns}>
                                        <span>Detalle</span><span>Cant.</span><span>Precio</span><span>Total</span><span></span>
                                    </div>
                                    {comprobanteData.details.map((d, i) => (
                                        <div key={i} className={style.detailRow}>
                                            <input type="text" placeholder="Ej: Consulta" value={d.detalle} onChange={(e) => updateDetail(i, "detalle", e.target.value)} />
                                            <input type="number" value={d.cantidad} onChange={(e) => updateDetail(i, "cantidad", Number(e.target.value))} />
                                            <input type="number" value={d.precioUnitario} onChange={(e) => updateDetail(i, "precioUnitario", Number(e.target.value))} />
                                            <span className={style.rowTotal}>${(d.cantidad * d.precioUnitario).toFixed(2)}</span>
                                            {comprobanteData.details.length > 1 && (<button onClick={() => removeDetail(i)}>✕</button>)}
                                        </div>
                                    ))}
                                </div>
                                <div className={style.totalBox}>
                                    Total: <strong>${total.toFixed(2)}</strong>
                                </div>
                            </div>
                        </div>
                        <div className={style.submitButton}>
                            <GreenFormButton text="Guardar comprobante" onClick={() => { console.log("guardar comprobante"); setShowComprobanteModal(false); }} />
                        </div>
                    </div>
                </div>
            )}

            {showReciboModal && (
                <div className={style.overlay} onClick={() => setShowReciboModal(false)}>
                    <div className={style.modal} onClick={(e) => e.stopPropagation()}>
                        <button className={style.close} onClick={() => setShowReciboModal(false)}>✕</button>
                        <h3>Nuevo recibo</h3>
                        <div className={style.form}>
                            <ProvInput placeholder="Fecha" type="date" className="inputBoxDefault" />
                            <ProvInput placeholder="Cantidad" type="number" className="inputBoxDefault" />
                            <ProvInput placeholder="Observaciones" type="text" className="inputBoxBig" />
                            <ProvInput placeholder="Moneda" as="select" className="inputBoxDefault" options={[{value: "PESOS", label: "Pesos (ARS)"}, {value: "DOLARES", label: "Dólares (USD)"}, {value: "REALES", label: "Reales (R)"}, {value: "EUROS", label: "Euros (EUR)"}]} />
                            <ProvInput placeholder="Tipo de cambio al día" type="number" className="inputBoxDefault" />
                            <ProvInput placeholder="Método de pago" as="select" className="inputBoxDefault" options={[{value: "EFECTIVO", label: "Efectivo"}, {value: "TRANSFERENCIA", label: "Transferencia"}, {value: "TARJETA_CREDITO", label: "Tarjeta de crédito"}, {value: "TARJETA_DEBITO", label: "Tarjeta de débito"}, {value: "MERCADO_PAGO", label: "Mercado Pago"}, {value: "DOLARES", label: "Dolares"}, {value: "CHEQUE", label: "Cheque"}]} />
                            
                            <div className={style.checkboxContainer}>
                                <label className={style.checkboxLabel}>
                                    <input type="checkbox" checked={pagarEnDolares} onChange={(e) => setPagarEnDolares(e.target.checked)} />
                                    <span>Pagar deuda en dólares</span>
                                </label>
                            </div>
                        </div>
                        <div className={style.submitButton}>
                            <GreenFormButton text="Guardar recibo" onClick={() => { console.log("guardar recibo"); setShowReciboModal(false); }} />
                        </div>
                    </div>
                </div>
            )}

            {viewReciboModal && selectedRecibo && (
                <div className={style.overlay} onClick={() => setViewReciboModal(false)}>
                    <div className={style.modal} onClick={(e) => e.stopPropagation()}>
                        <button className={style.close} onClick={() => setViewReciboModal(false)}>✕</button>
                        <h3>Recibo</h3>
                        <div className={style.reciboContainer}>
                            <div className={style.reciboSection}>
                                <h5>Paciente</h5>
                                <div className={style.row}><span>Nombre</span><p>{selectedRecibo.patientFullName}</p></div>
                                <div className={style.row}><span>DNI</span><p>{selectedRecibo.patientDni}</p></div>
                            </div>
                            <div className={style.reciboSection}>
                                <h5>Detalle</h5>
                                <div className={style.row}><span>Fecha</span><p>{new Date(selectedRecibo.receiptDate).toLocaleDateString('es-AR')}</p></div>
                                <div className={style.row}><span>Monto</span><p>{selectedRecibo.currencyType} {selectedRecibo.amount}</p></div>
                                {selectedRecibo.exchangeRate && (<div className={style.row}><span>Tipo de cambio</span><p>{selectedRecibo.exchangeRate}</p></div>)}
                                {selectedRecibo.convertedAmount && (<div className={style.row}><span>Monto convertido</span><p>${selectedRecibo.convertedAmount}</p></div>)}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    )
}