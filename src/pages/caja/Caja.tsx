/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import style from './Caja.module.css';
import WelcomeText from "../../components/WelcomeText/welcomeText.tsx";
import CajaRegister from "../../components/CajaRegister/cajaRegister.tsx";
import { ReporteCaja } from "../../components/Forms/CajaForm/CajaForm.tsx";
import { useEffect, useState } from "react";
import { authService } from "../../services/auth.service.ts"; 
import type { CashMovementDetailDTO } from "../../types/cash.types.ts"; 
import type { ReportPeriod } from "../../types/enums.types.ts";
import { cashMovementService } from '../../services/cashMovement.service.ts';

export default function Caja() {
    const [movements, setMovements] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    
    const [showDetail, setShowDetail] = useState(false);
    const [selectedDetail, setSelectedDetail] = useState<CashMovementDetailDTO | null>(null);

    const isAdmin = authService.isAdmin();
    const currentUserId = Number(localStorage.getItem('userId'));

    useEffect(() => {
        fetchMovements();
    }, []);

    const fetchMovements = async () => {
        try {
            setLoading(true);
            const doctorId = isAdmin ? undefined : currentUserId;
            const data = await cashMovementService.getCashMovements(doctorId);
            setMovements(data);
        } catch (error) {
            console.error("Error al cargar la caja:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetail = async (id: number) => {
        try {
            const data = await cashMovementService.getMovementDetail(id);
            setSelectedDetail(data);
            setShowDetail(true);
        } catch (error) {
            console.error("Error al cargar detalle:", error);
            alert("No se pudo cargar el detalle del movimiento.");
        }
    };

    const handleDownloadReport = async (period: ReportPeriod) => {
        try {
            const blob = await cashMovementService.downloadCashReportPdf(undefined, period);
            const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Reporte_Caja_${period}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error al descargar el reporte:", error);
            alert("No se pudo generar el reporte. Verificá si tenés permisos de ADMIN.");
        }
    };

    return(
        <main className={style.main}>
            <WelcomeText
                sectionText={'Acá los movimientos de la caja'}
                className={'darkStyle'}
            />

            <div className={style.content}>
                <div className={style.columnNames}>
                    <p>Movimiento</p>
                    <p>Medio de pago</p>
                    <p>Fecha</p>
                    <p>Monto</p>
                    <p>Moneda</p>
                    <p style={{textAlign: 'right'}}>Acciones</p>
                </div>
                
                <div className={style.registers}>
                    {loading ? (
                        <p style={{ color: 'white', padding: '20px', textAlign: 'center' }}>Cargando movimientos...</p>
                    ) : movements.length > 0 ? (
                        movements.map((mov) => (
                            <CajaRegister 
                                key={mov.id}
                                id={mov.id}
                                type={mov.type}
                                paymentMethod={mov.paymentMethod}
                                amount={mov.amount}
                                currencyType={mov.currencyType}
                                movementDate={mov.movementDate || mov.date} 
                                onViewDetail={() => handleViewDetail(mov.id)}
                            />
                        ))
                    ) : (
                        <p style={{ color: 'var(--neutral-4)', padding: '20px', textAlign: 'center' }}>No hay movimientos registrados.</p>
                    )}
                </div>
            </div>

            {isAdmin && (
                <div className={style.reportContainer}>
                    <div className={style.reportInfo}>
                        <h4 style={{ margin: '0 0 10px 0', color: 'white' }}>Generar reporte</h4>
                        <p style={{ color: 'var(--neutral-4)', fontSize: '14px' }}>
                            Seleccioná el período para obtener un resumen en PDF de los movimientos de caja.
                        </p>
                    </div>
                    <ReporteCaja onGenerate={handleDownloadReport} />
                </div>
            )}

            {showDetail && selectedDetail && (
                <div className={style.overlay} onClick={() => setShowDetail(false)}>
                    <div className={style.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={style.modalHeader}>
                            <h3>Detalle del Movimiento #{selectedDetail.id}</h3>
                            <button className={style.close} onClick={() => setShowDetail(false)}>✕</button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <div style={{ background: 'var(--blue-3)', padding: '15px', borderRadius: '8px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                    <span style={{ color: 'var(--neutral-4)' }}>Tipo</span>
                                    <strong style={{ color: selectedDetail.type === 'INGRESO' ? '#22c55e' : '#ef4444' }}>
                                        {selectedDetail.type}
                                    </strong>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                    <span style={{ color: 'var(--neutral-4)' }}>Monto</span>
                                    <strong>{selectedDetail.currencyType === 'DOLARES' ? 'U$D' : '$'} {selectedDetail.amount}</strong>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                    <span style={{ color: 'var(--neutral-4)' }}>Medio de pago</span>
                                    <strong>{selectedDetail.paymentMethod?.replace('_', ' ')}</strong>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: 'var(--neutral-4)' }}>Fecha</span>
                                    <strong>{new Date(selectedDetail.movementDate).toLocaleString('es-AR')}</strong>
                                </div>
                            </div>

                            <div style={{ background: 'var(--blue-3)', padding: '15px', borderRadius: '8px' }}>
                                <h5 style={{ margin: '0 0 10px 0', color: 'var(--neutral-4)' }}>Observaciones</h5>
                                <p style={{ margin: 0, fontSize: '14px', color: 'var(--neutral-1)' }}>
                                    {selectedDetail.observations || "Sin observaciones."}
                                </p>
                            </div>

                            {selectedDetail.suggestedSplits && selectedDetail.suggestedSplits.length > 0 && (
                                <div style={{ background: 'var(--blue-2)', padding: '15px', borderRadius: '8px' }}>
                                    <h5 style={{ margin: '0 0 10px 0', color: 'var(--neutral-4)' }}>Sugerencia de Distribución</h5>
                                    {selectedDetail.suggestedSplits.map((split, idx) => (
                                        <div key={idx} style={{ marginBottom: '10px', fontSize: '13px' }}>
                                            <strong style={{ display: 'block', color: 'var(--primary)', marginBottom: '5px' }}>{split.label}</strong>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span>Doctor:</span> <strong>${split.doctorAmount}</strong>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span>Clínica:</span> <strong>${split.clinicAmount}</strong>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </main>
    )
}