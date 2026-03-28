import ButtonsRod from "../Buttons/ButtonsRod/buttonsRod";
import WelcomeText from "../WelcomeText/welcomeText";
import styles from "./task.module.css"
import TaskCard from "./TasksCards/taskCard";

/** SOLO DE PRUEBA: AGREGO VARIOS LLAMADOS AL COMPONENTE TaskCard */

const task = {
    cliente: 'Milagros Alvarez',
    fecha: new Date('2026-03-20'),
    estado: 'Pendiente',
    prioridad: 'media'
}

export default function Task() {
    return (
        <section className={styles.mainContainerProperties}>
            <div className={styles.containerProperties}>
                <WelcomeText sectionText="Aca las tareas proximas." className=""></WelcomeText>
                <div className={styles.taskContainerProperties}>
                    <TaskCard task={task}></TaskCard>
                    <TaskCard task={task}></TaskCard>
                    <TaskCard task={task}></TaskCard>
                    <TaskCard task={task}></TaskCard>
                    <TaskCard task={task}></TaskCard>
                    <TaskCard task={task}></TaskCard>
                    <TaskCard task={task}></TaskCard>
                    <TaskCard task={task}></TaskCard>
                    <TaskCard task={task}></TaskCard>
                    <TaskCard task={task}></TaskCard>
                    <TaskCard task={task}></TaskCard>
                    <TaskCard task={task}></TaskCard>
                    <TaskCard task={task}></TaskCard>
                </div>
            </div>
            <div className={styles.buttonsRodContainerProperties}>
                <ButtonsRod></ButtonsRod>
            </div>
        </section>
    );
}