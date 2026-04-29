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
import { userService } from "../../services/user.service"; 
import { receiptService } from "../../services/receipt.service";
import type { CurrentAccountResponseDTO, ReceiptCreateDTO, VoucherCreateDTO, ReceiptResponseDTO, VoucherDTO } from "../../types/currentAccount.types"; 
import type { CurrencyType, PaymentMethod } from "../../types/enums.types"; 
import type { UserResponseDTO } from "../../types/users.types.ts";

export default function CuentaCorriente() {
    const { patientId } = useParams<{ patientId: string }>();
    
    const [accountData, setAccountData] = useState<CurrentAccountResponseDTO | null>(null);
    const [users, setUsers] = useState<UserResponseDTO[]>([]);
    const [loading, setLoading] = useState(true);

    const [comprobanteData, setComprobanteData] = useState({
        fecha: "",
        observaciones: "",
        moneda: "PESOS",
        details: [{ detail: "", amount: 1, unitPrice: 0 }]
    });

    const [reciboData, setReciboData] = useState({
        fecha: "",
        cantidad: "",
        observaciones: "",
        moneda: "PESOS",
        tipoCambio: "",
        metodoPago: "EFECTIVO",
        pagarEnDolares: false,
        doctorId: "" 
    });

    const [showComprobanteModal, setShowComprobanteModal] = useState(false);
    const [showReciboModal, setShowReciboModal] = useState(false);
    
    const [viewReciboModal, setViewReciboModal] = useState(false);
    const [selectedRecibo, setSelectedRecibo] = useState<ReceiptResponseDTO | null>(null);

    const [viewVoucherModal, setViewVoucherModal] = useState(false);
    const [selectedVoucher, setSelectedVoucher] = useState<VoucherDTO | null>(null);

    const loadData = async () => {
        if (!patientId) return;
        try {
            setLoading(true);
            const [accData, usersData] = await Promise.all([
                currentAccountService.getPatientCurrentAccount(Number(patientId)),
                userService.getAllUsers()
            ]);
            setAccountData(accData);
            setUsers(usersData);
        } catch (error) {
            console.error("Error al cargar la cuenta corriente o usuarios:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [patientId]);

    const handleCreateVoucher = async () => {
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                alert("Error: No estás logueado.");
                return;
            }

            const payload: VoucherCreateDTO = {
                patientId: Number(patientId),
                userId: Number(userId),
                voucherDate: comprobanteData.fecha || undefined,
                observations: comprobanteData.observaciones || undefined,
                currencyType: comprobanteData.moneda as CurrencyType,
                details: comprobanteData.details 
            };

            await currentAccountService.createVoucher(payload);
            setShowComprobanteModal(false);
            setComprobanteData({ fecha: "", observaciones: "", moneda: "PESOS", details: [{ detail: "", amount: 1, unitPrice: 0 }] });
            loadData();
            
        } catch (error) {
            console.error("Error al crear comprobante", error);
            alert("Ocurrió un error al guardar el comprobante.");
        }
    };

    const handleCreateReceipt = async () => {
        if (!reciboData.doctorId) {
            alert("Por favor seleccioná el profesional que recibe el pago.");
            return;
        }

        try {
            const payload: ReceiptCreateDTO = {
                patientId: Number(patientId),
                doctorId: Number(reciboData.doctorId),
                amount: Number(reciboData.cantidad),
                currencyType: reciboData.moneda as CurrencyType,
                paymentMethod: reciboData.metodoPago as PaymentMethod,
                receiptDate: reciboData.fecha || undefined,
                observations: reciboData.observaciones || undefined,
                exchangeRate: reciboData.tipoCambio ? Number(reciboData.tipoCambio) : undefined,
                payDollarDebtWithPesos: reciboData.pagarEnDolares
            };

            await currentAccountService.createReceipt(payload);
            setShowReciboModal(false);
            setReciboData({ fecha: "", cantidad: "", observaciones: "", moneda: "PESOS", tipoCambio: "", metodoPago: "EFECTIVO", pagarEnDolares: false, doctorId: "" });
            loadData();

        } catch (error) {
            console.error("Error al crear recibo", error);
            alert("Ocurrió un error al guardar el recibo.");
        }
    };

    const handleCancelDebt = async () => {
        const confirmar = window.confirm("¿Seguro deseas cancelar la deuda por abandono de tratamiento?");
        if (!confirmar) return;

        try {
            await currentAccountService.cancelPatientDebt(Number(patientId));
            alert("Deuda cancelada exitosamente.");
            loadData();
        } catch (error) {
            console.error(error);
            alert("Error al intentar cancelar la deuda.");
        }
    };

    const handleViewReceipt = async (id: number) => {
        try {
            const data = await currentAccountService.getReceiptById(id);
            setSelectedRecibo(data);
            setViewReciboModal(true);
        } catch (error) {
            console.error(error);
            alert("Error al obtener el recibo.");
        }
    };

    const handleDownloadReceiptPdf = async (id: number) => {
        try {
            // Usamos el toast/alert que prefieras, acá te dejo un console.log de aviso
            console.log(`Iniciando descarga del recibo ${id}...`);
            await receiptService.downloadReceiptPdf(id);
        } catch (error) {
            console.error(error);
            alert("Error al intentar descargar el PDF del recibo.");
        }
    };

    const handleViewVoucher = async (id: number) => {
        try {
            const data = await currentAccountService.getVoucherById(id);
            setSelectedVoucher(data);
            setViewVoucherModal(true);
        } catch (error) {
            console.error(error);
            alert("Error al obtener el comprobante.");
        }
    };

    const addDetail = () => setComprobanteData(prev => ({ ...prev, details: [...prev.details, { detail: "", amount: 1, unitPrice: 0 }] }));
    const removeDetail = (index: number) => setComprobanteData(prev => ({ ...prev, details: prev.details.filter((_, i) => i !== index) }));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateDetail = (index: number, field: string, value: any) => {
        const newDetails = [...comprobanteData.details];
        newDetails[index] = { ...newDetails[index], [field]: value };
        setComprobanteData(prev => ({ ...prev, details: newDetails }));
    };
    
    const totalComprobante = comprobanteData.details.reduce((acc, d) => acc + (d.amount * d.unitPrice), 0);

    if (loading) return <div style={{padding: '40px', color: 'white'}}>Cargando cuenta corriente...</div>;
    if (!accountData) return <div style={{padding: '40px', color: 'white'}}>No se pudo cargar la cuenta corriente.</div>;

    return(
        <main className={style.main}>
            <WelcomeText sectionText={`Acá la Cta. Corriente de ${accountData.patientFullName || 'Paciente'}`} className={'darkStyle'} />

            <NavLink to={'/pacientes'} style={{ textDecoration: 'none' }}>
                <p style={{ cursor: 'pointer', color: 'var(--neutral-4)'}}>← Volver a la sección pacientes</p>
            </NavLink>

            <div className={style.content}>
                <div className={style.allInformation}>

                    <SaldosResume saldoPesos={accountData.debtInPesos || 0} saldoDolares={accountData.debtInDollars || 0} />

                    <div className={style.registerContainer}>

                        <div className={style.columnNames}>
                            <h6>Tipo</h6><h6>Fecha</h6><h6>Importe en ARS</h6><h6>Importe en USD</h6><h6>Saldo en
                            ARS</h6><h6>Saldo en USD</h6>
                        </div>

                        {accountData.movements && accountData.movements.length > 0 ? (
                            accountData.movements.map((movement) => (
                                <Register
                                    key={movement.id}
                                    movement={movement}
                                    onClick={() => {
                                        if (movement.type === 'RECEIPT' && movement.receiptId) {
                                            handleViewReceipt(movement.receiptId);
                                        } else if (movement.type === 'VOUCHER' && movement.voucherId) {
                                            handleViewVoucher(movement.voucherId);
                                        }
                                    }}
                                />
                            ))
                        ) : (
                            <p style={{padding: '20px', color: 'var(--neutral-4)'}}>No hay movimientos registrados.</p>
                        )}


                        <div style={{display: 'flex', justifyContent: 'center', marginBottom: '15px', width: '100%'}}>
                            <DebtButton onClick={handleCancelDebt}/>
                        </div>
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
                                            <input type="text" placeholder="Ej: Consulta" value={d.detail} onChange={(e) => updateDetail(i, "detail", e.target.value)} />
                                            <input type="number" value={d.amount} onChange={(e) => updateDetail(i, "amount", Number(e.target.value))} />
                                            <input type="number" value={d.unitPrice} onChange={(e) => updateDetail(i, "unitPrice", Number(e.target.value))} />
                                            <span className={style.rowTotal}>${(d.amount * d.unitPrice).toFixed(2)}</span>
                                            {comprobanteData.details.length > 1 && (<button onClick={() => removeDetail(i)}>✕</button>)}
                                        </div>
                                    ))}
                                </div>
                                <div className={style.totalBox}>
                                    Total: <strong>${totalComprobante.toFixed(2)}</strong>
                                </div>
                            </div>
                        </div>
                        <div className={style.submitButton}>
                            <GreenFormButton text="Guardar comprobante" onClick={handleCreateVoucher} />
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
                            <ProvInput 
                                placeholder="Profesional que recibe" 
                                as="select" 
                                className="inputBoxDefault" 
                                value={reciboData.doctorId} 
                                onChange={(e) => setReciboData({...reciboData, doctorId: e.target.value})} 
                                options={users.map(u => ({ value: String(u.id), label: `${u.name} ${u.lastname}` }))} 
                            />
                            <ProvInput placeholder="Fecha" type="date" className="inputBoxDefault" value={reciboData.fecha} onChange={(e) => setReciboData({...reciboData, fecha: e.target.value})} />
                            <ProvInput placeholder="Cantidad" type="number" className="inputBoxDefault" value={reciboData.cantidad} onChange={(e) => setReciboData({...reciboData, cantidad: e.target.value})} />
                            <ProvInput placeholder="Observaciones" type="text" className="inputBoxBig" value={reciboData.observaciones} onChange={(e) => setReciboData({...reciboData, observaciones: e.target.value})} />
                            
                            <ProvInput placeholder="Moneda" as="select" className="inputBoxDefault" value={reciboData.moneda} onChange={(e) => setReciboData({...reciboData, moneda: e.target.value})} options={[{value: "PESOS", label: "Pesos (ARS)"}, {value: "DOLARES", label: "Dólares (USD)"}, {value: "REALES", label: "Reales (R)"}, {value: "EUROS", label: "Euros (EUR)"}]} />
                            <ProvInput placeholder="Tipo de cambio al día" type="number" className="inputBoxDefault" value={reciboData.tipoCambio} onChange={(e) => setReciboData({...reciboData, tipoCambio: e.target.value})} />
                            <ProvInput placeholder="Método de pago" as="select" className="inputBoxDefault" value={reciboData.metodoPago} onChange={(e) => setReciboData({...reciboData, metodoPago: e.target.value})} options={[{value: "EFECTIVO", label: "Efectivo"}, {value: "TRANSFERENCIA", label: "Transferencia"}, {value: "TARJETA_CREDITO", label: "Tarjeta de crédito"}, {value: "TARJETA_DEBITO", label: "Tarjeta de débito"}, {value: "MERCADO_PAGO", label: "Mercado Pago"}, {value: "DOLARES", label: "Dólares"}, {value: "CHEQUE", label: "Cheque"}]} />
                            
                            <div className={style.checkboxContainer}>
                                <label className={style.checkboxLabel}>
                                    <input type="checkbox" checked={reciboData.pagarEnDolares} onChange={(e) => setReciboData({...reciboData, pagarEnDolares: e.target.checked})} />
                                    <span>Pagar deuda en dólares con pesos</span>
                                </label>
                            </div>
                        </div>
                        <div className={style.submitButton}>
                            <GreenFormButton text="Guardar recibo" onClick={handleCreateReceipt} />
                        </div>
                    </div>
                </div>
            )}

            {viewReciboModal && selectedRecibo && (
                <div className={style.overlay} onClick={() => setViewReciboModal(false)}>
                    <div className={style.modal} onClick={(e) => e.stopPropagation()}>
                        <button className={style.close} onClick={() => setViewReciboModal(false)}>✕</button>
                        <h3>Recibo #{selectedRecibo.id}</h3>
                        
                        <div className={style.reciboContainer}>
                            <div className={style.reciboSection}>
                                <h5>Detalles del Pago</h5>
                                <div className={style.row}><span>Fecha</span><p>{selectedRecibo.receiptDate}</p></div>
                                <div className={style.row}><span>Profesional</span><p>{selectedRecibo.doctorFullName || '-'}</p></div>
                                <div className={style.row}><span>Método de pago</span><p>{selectedRecibo.paymentMethod}</p></div>
                                <div className={style.row}><span>Monto original</span><p>{selectedRecibo.currencyType} {selectedRecibo.amount}</p></div>
                                
                                {selectedRecibo.exchangeRate && (
                                    <div className={style.row}><span>Tipo de cambio</span><p>{selectedRecibo.exchangeRate}</p></div>
                                )}
                                {selectedRecibo.convertedAmount && (
                                    <div className={style.row}><span>Monto convertido</span><p>${selectedRecibo.convertedAmount}</p></div>
                                )}
                            </div>

                            <div className={style.reciboSection}>
                                <h5>Observaciones</h5>
                                <p style={{ fontSize: '14px', color: '#ccc', marginTop: '5px' }}>
                                    {selectedRecibo.observations || 'Sin observaciones.'}
                                </p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '25px' }}>
                            <button 
                                onClick={() => handleDownloadReceiptPdf(selectedRecibo.id)}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: 'var(--primary)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontWeight: 'bold',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}
                            >
                                <span>📄</span> Descargar PDF
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {viewVoucherModal && selectedVoucher && (
                <div className={style.overlay} onClick={() => setViewVoucherModal(false)}>
                    <div className={style.modal} onClick={(e) => e.stopPropagation()}>
                        <button className={style.close} onClick={() => setViewVoucherModal(false)}>✕</button>
                        <h3>Comprobante #{selectedVoucher.id}</h3>
                        <div className={style.reciboContainer}>
                            <div className={style.reciboSection}>
                                <h5>Información General</h5>
                                <div className={style.row}><span>Paciente</span><p>{selectedVoucher.patientFullName}</p></div>
                                <div className={style.row}><span>Emitido por</span><p>{selectedVoucher.professionalFullName}</p></div>
                                <div className={style.row}><span>Fecha</span><p>{selectedVoucher.voucherDate}</p></div>
                                <div className={style.row}><span>Observaciones</span><p>{selectedVoucher.observations || '-'}</p></div>
                            </div>
                            <div className={style.reciboSection}>
                                <h5>Detalles de cargos</h5>
                                <div className={style.detailsTable}>
                                    <div className={style.detailsColumns}>
                                        <span>Detalle</span><span>Cant.</span><span>Precio U.</span><span>Subtotal</span>
                                    </div>
                                    {selectedVoucher.details.map((d, i) => (
                                        <div key={i} className={style.detailRow} style={{ marginBottom: "5px" }}>
                                            <span>{d.detail}</span>
                                            <span>{d.amount}</span>
                                            <span>${d.unitPrice}</span>
                                            <span style={{ fontWeight: "bold" }}>
                                                ${(d.amount * d.unitPrice).toFixed(2)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <div className={style.totalBox} style={{ marginTop: "15px", textAlign: "right" }}>
                                    Total: <strong>{selectedVoucher.currency} {selectedVoucher.totalAmount}</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    )
}