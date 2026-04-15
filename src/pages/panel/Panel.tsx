import style from './Panel.module.css'
import PanelButton from '../../components/Buttons/PanelButton/panelButton'
import TaskSummery from '../../components/TaskSummery/taskSummery'
import WelcomeText from '../../components/WelcomeText/welcomeText'
import { useState, useEffect } from 'react'
import { taskService } from '../../services/task.service' 
import type { TaskResponseDTO } from '../../types/management.types'

export default function Panel() {
    const [pendingCount, setPendingCount] = useState<number>(0);
    const [pendingTasks, setPendingTasks] = useState<TaskResponseDTO[]>([]);

    useEffect(() => {
        const fetchPendingTasks = async () => {
            try {
                const data = await taskService.getPendingWidget();
                setPendingCount(data.pendingCount);
                setPendingTasks(data.pendingTasks);
            } catch (error) {
                console.error("Error al obtener el widget de tareas pendientes:", error);
            }
        };

        fetchPendingTasks();
    }, []);

    return(
        <main className={style.main}>
            <WelcomeText
                sectionText={'Acá el resumen del día de hoy.'}
                className={'darkStyle'}
            />

            <div className={style.firstWidgetsRow}>
                <div className={style.totalPacients}>
                    <h5>Total de pacientes atendidos en la semana:</h5>
                    <h1>17</h1>
                </div>

                <div className={style.totalMoney}>
                    <h5>Total de dinero recaudado en la semana:</h5>
                    <h1>$147.450</h1>
                </div>

                <div className={style.totalAppointments}>
                    <div>
                        <p>16:42</p>
                        <h5>Lunes 12 de Enero de 2026</h5>
                    </div>

                    <div className={style.appoInfo}>
                        <div>
                            <h6>3 turnos para hoy</h6>
                            <h3>Próximo a las 11:15hs</h3>
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
                        <h5>- $44.565 Juan M. García</h5>
                        <h5>- $44.565 Juan M. García</h5>
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