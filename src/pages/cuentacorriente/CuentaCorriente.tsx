/* eslint-disable @typescript-eslint/no-unused-vars */
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
import type { CurrentAccountResponseDTO, ReceiptCreateDTO, VoucherCreateDTO, ReceiptResponseDTO, VoucherDTO, VoucherDetailDTO } from "../../types/currentAccount.types"; 
import type { CurrencyType, PaymentMethod } from "../../types/enums.types"; 
import type { UserResponseDTO } from "../../types/users.types.ts";

// Toast simple
type ToastState = { msg: string; type: 'error' | 'info' } | null;

export default function CuentaCorriente() {
    const { patientId } = useParams<{ patientId: string }>();
    
    const [accountData, setAccountData] = useState<CurrentAccountResponseDTO | null>(null);
    const [users, setUsers] = useState<UserResponseDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [movementFilter, setMovementFilter] = useState<'ALL' | 'RECEIPT' | 'VOUCHER'>('ALL');
    const [toast, setToast] = useState<ToastState>(null);

    const showToast = (msg: string, type: 'error' | 'info' = 'error') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3500);
    };

    const [comprobanteData, setComprobanteData] = useState<{
        fecha: string;
        observaciones: string;
        moneda: string;
        doctorId: string;
        details: { detail: string; amount: number; unitPrice: number; dueDate?: string }[]
    }>({
        fecha: "",
        observaciones: "",
        moneda: "PESOS",
        doctorId: "", 
        details: [{ detail: "", amount: 1, unitPrice: 0, dueDate: "" }]
    });

    const [reciboData, setReciboData] = useState<{
        fecha: string;
        cantidad: string;
        observaciones: string;
        moneda: string;
        tipoCambio: string;
        metodoPago: string;
        pagarEnDolares: boolean;
        doctorId: string;
        voucherId?: number;
        voucherDetailId?: number;
        paymentContextText?: string;
    }>({
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
    const [showVoucherDetail, setShowVoucherDetail] = useState(false);
    const [showReceiptDetail, setShowReceiptDetail] = useState(false);
    
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
        if (!comprobanteData.doctorId) {
            showToast("Por favor seleccioná el profesional al que se le adeuda.", 'info');
            return;
        }

        try {
            const payload: VoucherCreateDTO = {
                patientId: Number(patientId),
                userId: Number(comprobanteData.doctorId), 
                voucherDate: comprobanteData.fecha || undefined,
                observations: comprobanteData.observaciones || undefined,
                currencyType: comprobanteData.moneda as CurrencyType,
                details: comprobanteData.details.map(d => ({
                    ...d,
                    dueDate: d.dueDate || undefined 
                }))
            };

            await currentAccountService.createVoucher(payload);
            setShowComprobanteModal(false);
            setComprobanteData({ fecha: "", observaciones: "", moneda: "PESOS", doctorId: "", details: [{ detail: "", amount: 1, unitPrice: 0, dueDate: "" }] });
            loadData();
            
        } catch (error) {
            console.error("Error al crear comprobante", error);
            showToast("Ocurrió un error al guardar el comprobante.");
        }
    };

    const handleCreateReceipt = async () => {
        if (!reciboData.doctorId) {
            showToast("Por favor seleccioná el profesional que recibe el pago.", 'info');
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
                payDollarDebtWithPesos: reciboData.pagarEnDolares,
                voucherId: reciboData.voucherId,
                voucherDetailId: reciboData.voucherDetailId
            };

            await currentAccountService.createReceipt(payload);
            setShowReciboModal(false);
            setReciboData({ fecha: "", cantidad: "", observaciones: "", moneda: "PESOS", tipoCambio: "", metodoPago: "EFECTIVO", pagarEnDolares: false, doctorId: "", voucherId: undefined, voucherDetailId: undefined, paymentContextText: "" });
            loadData();

        } catch (error) {
            console.error("Error al crear recibo", error);
            showToast("Ocurrió un error al guardar el recibo.");
        }
    };

    const fetchAccountData = async () => {
        if (!patientId) return;
        try {
            setLoading(true);
            const data = await currentAccountService.getPatientCurrentAccount(Number(patientId));
            setAccountData(data);
        } catch (error) {
            console.error("Error al cargar cuenta corriente:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelVoucherDebt = async (voucherId: number) => {
        if (!window.confirm("¿Estás seguro de cancelar administrativamente la deuda de este comprobante?")) return;
        
        try {
            await currentAccountService.cancelVoucherDebt(voucherId);
            setViewVoucherModal(false); 
            loadData(); 
        } catch (error) {
            console.error(error);
            showToast("Error al intentar cancelar la deuda.");
        }
    };

    const handleViewReceipt = async (id: number) => {
        try {
            const data = await currentAccountService.getReceiptById(id);
            setSelectedRecibo(data);
            setViewReciboModal(true);
        } catch (error) {
            console.error(error);
            showToast("Error al obtener el recibo.");
        }
    };

    const handleDownloadReceiptPdf = async (id: number) => {
        try {
            console.log(`Iniciando descarga del recibo ${id}...`);
            await receiptService.downloadReceiptPdf(id);
        } catch (error) {
            console.error(error);
            showToast("Error al intentar descargar el PDF del recibo.");
        }
    };

    const handleViewVoucher = async (id: number) => {
        try {
            const data = await currentAccountService.getVoucherById(id);
            setSelectedVoucher(data);
            setViewVoucherModal(true);
        } catch (error) {
            console.error(error);
            showToast("Error al obtener el comprobante.");
        }
    };

    const handlePayVoucher = (voucher: VoucherDTO) => {
        setReciboData({
            ...reciboData,
            cantidad: String(voucher.totalAmount),
            moneda: voucher.currency,
            voucherId: voucher.id,
            voucherDetailId: undefined,
            paymentContextText: `Comprobante #${voucher.id} completo`
        });
        setViewVoucherModal(false);
        setShowReciboModal(true);
    };

    const handlePayVoucherDetail = (voucher: VoucherDTO, detail: VoucherDetailDTO) => {
        setReciboData({
            ...reciboData,
            cantidad: String(detail.amount * detail.unitPrice),
            moneda: voucher.currency,
            voucherId: voucher.id,
            voucherDetailId: detail.id,
            paymentContextText: `Detalle: "${detail.detail}" (Comp. #${voucher.id})`
        });
        setViewVoucherModal(false);
        setShowReciboModal(true);
    };

    const addDetail = () => setComprobanteData(prev => ({ ...prev, details: [...prev.details, { detail: "", amount: 1, unitPrice: 0, dueDate: "" }] }));
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

            {toast && (
                <div style={{
                    position: 'fixed',
                    bottom: '28px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 9999,
                    background: toast.type === 'error' ? '#5c1a1a' : '#1a2a3a',
                    border: `1px solid ${toast.type === 'error' ? '#c0392b' : 'rgba(255,255,255,0.15)'}`,
                    borderRadius: '12px',
                    padding: '12px 22px',
                    color: toast.type === 'error' ? '#fcc' : '#eee',
                    fontSize: '14px',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
                    whiteSpace: 'nowrap',
                }}>
                    {toast.type === 'error' ? '⚠ ' : 'ℹ '}{toast.msg}
                </div>
            )}

            <div className={style.content}>
                <div className={style.allInformation}>

                    <SaldosResume
                        saldoPesos={accountData.debtInPesos || 0}
                        saldoDolares={accountData.debtInDollars || 0}
                        filter={movementFilter}
                        onFilterChange={setMovementFilter}
                    />

                    <div className={style.registerContainer}>

                        <div className={style.columnNames}>
                            <h6>Tipo</h6><h6>Fecha</h6><h6>Importe en ARS</h6><h6>Importe en USD</h6><h6>Saldo en
                            ARS</h6><h6>Saldo en USD</h6>
                        </div>

                        {accountData.movements && accountData.movements.length > 0 ? (
                            accountData.movements
                                .filter(m => movementFilter === 'ALL' || m.type === movementFilter)
                                .map((movement) => (
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
                                        onRefresh={loadData}
                                    />
                                ))
                        ) : (
                            <p style={{padding: '20px', color: 'var(--neutral-4)'}}>No hay movimientos registrados.</p>
                        )}

                    </div>


                </div>

                <div className={style.createRegisters}>
                    <div onClick={() => setShowComprobanteModal(true)} style={{ width: '100%' }}>
                    <img src={'/icons/bigPlus.png'} alt="Crear Comprobante" />
                        <p>Crear nuevo comprobante</p>
                    </div>
                </div>
            </div>

            {showComprobanteModal && (
                <div className={style.overlay} onClick={() => setShowComprobanteModal(false)}>
                    <div className={style.modal} onClick={(e) => e.stopPropagation()}>
                        <button className={style.close} onClick={() => setShowComprobanteModal(false)}>✕</button>
                        <h3>Nuevo comprobante</h3>
                        <div className={style.form}>
                            <ProvInput 
                                placeholder="Profesional al que adeuda" 
                                as="select" 
                                className="inputBoxDefault" 
                                value={comprobanteData.doctorId} 
                                onChange={(e) => setComprobanteData({...comprobanteData, doctorId: e.target.value})} 
                                options={users.map(u => ({ value: String(u.id), label: `${u.name} ${u.lastname}` }))} 
                            />
                            <ProvInput placeholder="Fecha de emisión" type="date" className="inputBoxDefault" value={comprobanteData.fecha} onChange={(e) => setComprobanteData({...comprobanteData, fecha: e.target.value})} />
                            <ProvInput placeholder="Observaciones" type="text" className="inputBoxBig" value={comprobanteData.observaciones} onChange={(e) => setComprobanteData({...comprobanteData, observaciones: e.target.value})} />
                            <ProvInput placeholder="Moneda" as="select" className="inputBoxDefault" value={comprobanteData.moneda} onChange={(e) => setComprobanteData({...comprobanteData, moneda: e.target.value})} options={[{value: "PESOS", label: "Pesos (ARS)"}, {value: "DOLARES", label: "Dólares (USD)"}, {value: "REALES", label: "Reales (R)"}, {value: "EUROS", label: "Euros (EUR)"}]} />
                            
                            <div className={style.detailsContainer}>
                                <div className={style.detailsHeader}>
                                    <h5>Detalles de cargos</h5>
                                    <span onClick={addDetail}>+ Agregar cargo</span>
                                </div>
                                <div className={style.detailsTable}>
                                    <div className={style.detailsColumns}>
                                        <span>Detalle</span><span>Cant.</span><span>Precio</span><span>Vencimiento</span><span>Total</span><span></span>
                                    </div>
                                    {comprobanteData.details.map((d, i) => (
                                        <div key={i} className={style.detailRow}>
                                            <input type="text" placeholder="Ej: Consulta" value={d.detail} onChange={(e) => updateDetail(i, "detail", e.target.value)} />
                                            <input type="number" value={d.amount} onChange={(e) => updateDetail(i, "amount", Number(e.target.value))} />
                                            <input type="number" value={d.unitPrice} onChange={(e) => updateDetail(i, "unitPrice", Number(e.target.value))} />
                                            <input type="date" value={d.dueDate || ""} onChange={(e) => updateDetail(i, "dueDate", e.target.value)} title="Fecha límite de pago" />
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
                <div className={style.overlay} onClick={() => {
                    setShowReciboModal(false);
                    setReciboData({...reciboData, voucherId: undefined, voucherDetailId: undefined, paymentContextText: ""});
                }}>
                    <div className={style.modal} onClick={(e) => e.stopPropagation()}>
                        <button className={style.close} onClick={() => setShowReciboModal(false)}>✕</button>
                        <h3>Nuevo recibo</h3>
                        
                        <div className={style.form}>
                            {reciboData.paymentContextText && (
                                <div className={style.contextTag}>
                                    <span>Asignando pago a: {reciboData.paymentContextText}</span>
                                    <button type="button" className={style.clearContextBtn} onClick={() => setReciboData({...reciboData, voucherId: undefined, voucherDetailId: undefined, paymentContextText: ""})}>✕ (Desvincular)</button>
                                </div>
                            )}

                            <ProvInput 
                                placeholder="Profesional que recibe" 
                                as="select" 
                                className="inputBoxDefault" 
                                value={reciboData.doctorId} 
                                onChange={(e) => setReciboData({...reciboData, doctorId: e.target.value})} 
                                options={users.map(u => ({ value: String(u.id), label: `${u.name} ${u.lastname}` }))} 
                            />
                            <ProvInput placeholder="Fecha del pago" type="date" className="inputBoxDefault" value={reciboData.fecha} onChange={(e) => setReciboData({...reciboData, fecha: e.target.value})} />
                            <ProvInput placeholder="Cantidad abonada" type="number" className="inputBoxDefault" value={reciboData.cantidad} onChange={(e) => setReciboData({...reciboData, cantidad: e.target.value})} />
                            <ProvInput placeholder="Observaciones" type="text" className="inputBoxBig" value={reciboData.observaciones} onChange={(e) => setReciboData({...reciboData, observaciones: e.target.value})} />
                            
                            <ProvInput placeholder="Moneda de pago" as="select" className="inputBoxDefault" value={reciboData.moneda} onChange={(e) => setReciboData({...reciboData, moneda: e.target.value})} options={[{value: "PESOS", label: "Pesos (ARS)"}, {value: "DOLARES", label: "Dólares (USD)"}, {value: "REALES", label: "Reales (R)"}, {value: "EUROS", label: "Euros (EUR)"}]} />
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

                            {(selectedRecibo.voucherId || selectedRecibo.voucherDetailId) && (
                                <div className={style.reciboSection}>
                                    <h5>Imputación de Pago</h5>
                                    {selectedRecibo.voucherId && (
                                        <div className={style.row}><span>Comprobante asoc.</span><p>#{selectedRecibo.voucherId}</p></div>
                                    )}
                                    {selectedRecibo.voucherDetailId && (
                                        <div className={style.row}><span>Detalle asoc.</span><p>#{selectedRecibo.voucherDetailId}</p></div>
                                    )}
                                </div>
                            )}

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
                                    <div className={style.detailsColumnsView}>
                                        <span>Detalle</span><span>Cant.</span><span>Precio U.</span><span>Vencimiento</span><span>Subtotal</span><span>Pagar</span>
                                    </div>
                                    {selectedVoucher.details.map((d, i) => (
                                        <div key={i} className={style.detailRowView} style={{ marginBottom: "5px" }}>
                                            <span>{d.detail}</span>
                                            <span>{d.amount}</span>
                                            <span>${d.unitPrice}</span>
                                            <span>{d.dueDate ? new Date(d.dueDate).toLocaleDateString('es-AR') : '-'}</span>
                                            <span style={{ fontWeight: "bold" }}>
                                                ${(d.amount * d.unitPrice).toFixed(2)}
                                            </span>
                                            <button 
                                                className={style.payBtn} 
                                                onClick={() => handlePayVoucherDetail(selectedVoucher, d)} 
                                                title="Pagar este detalle"
                                            >
                                                <img src="/icons/bigPlus.png" alt="Pagar" style={{width: '12px', filter: 'brightness(0) invert(1)'}}/>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <div className={style.totalBox} style={{ marginTop: "15px", display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '15px' }}>
                                    <span style={{ fontSize: '16px' }}>Total: <strong>{selectedVoucher.currency} {selectedVoucher.totalAmount}</strong></span>
                                    
                                    <button 
                                        className={style.payBtnText} 
                                        style={{ backgroundColor: '#6c757d' }} 
                                        onClick={() => handleCancelVoucherDebt(selectedVoucher.id)}
                                    >
                                        <img src="/icons/trash.png" alt="Cancelar" style={{width: '12px', filter: 'brightness(0) invert(1)'}}/>
                                        Cancelar Deuda
                                    </button>

                                    <button className={style.payBtnText} onClick={() => handlePayVoucher(selectedVoucher)}>
                                        <img src="/icons/bigPlus.png" alt="Pagar" style={{width: '12px', filter: 'brightness(0) invert(1)'}}/>
                                        Pagar Totalidad
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    )
}