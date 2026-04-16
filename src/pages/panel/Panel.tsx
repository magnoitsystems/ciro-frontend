import style from './Panel.module.css'
import PanelButton from '../../components/Buttons/PanelButton/panelButton'
import TaskSummery from '../../components/TaskSummery/taskSummery'
import WelcomeText from '../../components/WelcomeText/welcomeText'
import { useState, useEffect } from 'react'
import { taskService } from '../../services/task.service' 
import { shiftService } from '../../services/shift.service'
import { receiptService } from '../../services/receipt.service'
import { billService } from '../../services/bill.service'
import type { TaskResponseDTO } from '../../types/management.types'
import type { RevenueWidgetDTO } from '../../types/currentAccount.types'
import type { ShiftWidgetDTO } from '../../types/clinical.types'
import type { PendingSalaryItemDTO } from '../../types/bills.types'

export default function Panel() {
    const [pendingCount, setPendingCount] = useState<number>(0);
    const [pendingTasks, setPendingTasks] = useState<TaskResponseDTO[]>([]);
    const [shiftData, setShiftData] = useState<ShiftWidgetDTO | null>(null);
    const [revenueData, setRevenueData] = useState<RevenueWidgetDTO | null>(null);
    const [pendingSalaries, setPendingSalaries] = useState<PendingSalaryItemDTO[]>([]); 
    const [currentTime, setCurrentTime] = useState<string>('');

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString('es-AR', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: false 
            }));
        }, 1000);

        const fetchDashboardData = async () => {
            const [tasksResult, shiftsResult, revenueResult, salariesResult] = await Promise.allSettled([
                taskService.getPendingWidget(),
                shiftService.getDashboardWidget(),
                receiptService.getWeeklyRevenueWidget(),
                billService.getPendingSalariesWidget()
            ]);

            if (tasksResult.status === 'fulfilled') {
                setPendingCount(tasksResult.value.pendingCount);
                setPendingTasks(tasksResult.value.pendingTasks);
            } else {
                console.error("El backend falló al traer las tareas", tasksResult.reason);
            }

            if (shiftsResult.status === 'fulfilled') {
                setShiftData(shiftsResult.value);
            } else {
                console.error("El backend falló al traer los turnos", shiftsResult.reason);
            }

            if (revenueResult.status === 'fulfilled') {
                setRevenueData(revenueResult.value);
            } else {
                console.error("El backend falló al traer los ingresos", revenueResult.reason);
            }

            if (salariesResult.status === 'fulfilled') {
                setPendingSalaries(salariesResult.value);
            } else {
                console.error("El backend falló al traer los saldos pendientes", salariesResult.reason);
            }
        };

        fetchDashboardData();

        return () => clearInterval(timer);
    }, []);

    const getShiftTime = (dateString?: string) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
    };

    const getFormattedDate = () => {
        const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const dateStr = new Date().toLocaleDateString('es-AR', options);
        return dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
    };

    const getCurrencySymbol = (currency: string) => {
        switch (currency) {
            case 'DOLARES': return 'USD ';
            case 'EUROS': return '€ ';
            case 'REALES': return 'R$ ';
            case 'PESOS':
            default: return '$ ';
        }
    };

    return(
        <main className={style.main}>
            <WelcomeText
                sectionText={'Acá el resumen del día de hoy.'}
                className={'darkStyle'}
            />

            <div className={style.firstWidgetsRow}>
                <div className={style.totalPacients}>
                    <h5>Total de pacientes atendidos en la semana:</h5>
                    <h1>{shiftData?.weeklyCount || 0}</h1>
                </div>

                <div className={style.totalMoney}>
                    <h5>Total de dinero recaudado en la semana:</h5>
                    <h2>{revenueData?.totalDollars ? `USD ${revenueData.totalDollars.toLocaleString('es-AR')}` : 'USD 0'}</h2>
                    <h2>{revenueData?.totalPesos ? `$ ${revenueData.totalPesos.toLocaleString('es-AR')}` : '$ 0'}</h2>
                </div>

                <div className={style.totalAppointments}>
                    <div>
                        <p>{currentTime}</p>
                        <h5>{getFormattedDate()}</h5>
                    </div>

                    <div className={style.appoInfo}>
                        <div>
                            <h6>{shiftData?.todayCount || 0} turnos para hoy</h6>
                            <h3>
                                {shiftData?.nextShift 
                                    ? `Próximo a las ${getShiftTime(shiftData.nextShift.shiftDate)}hs` 
                                    : 'No hay más turnos hoy'}
                            </h3>
                        </div>

                        <div>
                            <PanelButton
                                content={'Ver calendario completo ➝'}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className={style.secondWidgetsRow}>
                <div className={style.totalTasks}>
                    <p>{pendingCount}</p>
                    <h5>Tareas en estado PENDIENTE</h5>
                </div>

                <div className={style.tasksSummery}>
                    {pendingTasks.length > 0 ? (
                        pendingTasks.slice(0, 3).map((task) => (
                            <TaskSummery 
                                key={task.id} 
                                title={task.title} 
                            />
                        ))
                    ) : (
                        <p style={{ color: 'var(--neutral-4)', fontSize: '14px' }}>No hay tareas pendientes.</p>
                    )}
                </div>

                <div className={style.seeTasks}>
                    <PanelButton
                        content={'Ver todas las tareas ➝'}
                    />
                </div>
            </div>

            <div className={style.thirdWidgetsRow}>
                <div className={style.saldos}>
                    <div className={style.saldosList}>
                        <h6>Saldos pendientes</h6>
                        {pendingSalaries.length > 0 ? (
                            pendingSalaries.slice(0, 3).map((salary) => (
                                <h5 key={salary.id}>
                                    - {getCurrencySymbol(salary.currencyType)}{salary.amount.toLocaleString('es-AR')} {salary.employeeFullName}
                                </h5>
                            ))
                        ) : (
                            <p style={{ color: 'var(--neutral-4)', fontSize: '14px', marginTop: '10px' }}>Todo al día.</p>
                        )}
                    </div>

                    <div>
                        <PanelButton
                            content={'Ver todos los saldos ➝'}
                        />
                    </div>
                </div>

                <div className={style.estadistics}>

                </div>
            </div>
        </main>
    )
}