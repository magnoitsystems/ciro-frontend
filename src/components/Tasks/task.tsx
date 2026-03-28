import WelcomeText from "../WelcomeText/welcomeText";
import styles from "./task.module.css"
import TaskCard from "./TasksCards/taskCard";

 /** SOLO DE PRUEBA: AGREGO VARIOS LLAMADOS AL COMPONENTE TaskCard */

export default function Task() {
    return (
        <section className={styles.containerProperties}>
            <WelcomeText sectionText="Aca las tareas proximas." className=""></WelcomeText>
            <div className={styles.taskContainerProperties}>
                <TaskCard></TaskCard>
                <TaskCard></TaskCard>

                <TaskCard></TaskCard>
                <TaskCard></TaskCard>

                <TaskCard></TaskCard>
                <TaskCard></TaskCard>
            </div>
        </section>
    );
}