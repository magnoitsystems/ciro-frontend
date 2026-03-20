import WelcomeText from "../../components/WelcomeText/welcomeText.tsx";
import style from './Panel.module.css';
import PanelButton from "../../components/Buttons/PanelButton/panelButton.tsx";
import TaskSummery from "../../components/TaskSummery/taskSummery.tsx";

export default function Panel() {
    return(
        <main className={style.main}>
            <WelcomeText
                sectionText={'Acá el resumen del día de hoy.'}
                className={'lightStyle'}
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
                    <p>7</p>
                    <h5>Tareas en estado PENDIENTE</h5>
                </div>

                <div className={style.tasksSummery}>
                    <TaskSummery/>
                    <TaskSummery/>
                    <TaskSummery/>
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