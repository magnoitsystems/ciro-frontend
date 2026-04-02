import ButtonsRod from "../Buttons/ButtonsRod/buttonsRod";
import WelcomeText from "../WelcomeText/welcomeText";
import styles from "./task.module.css"
import TaskCard from "./TasksCards/taskCard";
import { useState } from 'react'
import 'react-datepicker/dist/react-datepicker.css'
import Help from './../Calendar/Help/help'
import Appointment from '../Calendar/Appointment/appointment'
import CreateAppointment from './../Calendar/CreateAppointment/createAppointment'


/** SOLO DE PRUEBA: AGREGO VARIOS LLAMADOS AL COMPONENTE TaskCard */

const task = {
    cliente: 'Milagros Alvarez',
    fecha: new Date('2026-03-20'),
    estado: 'Pendiente',
    prioridad: 'media'
}

type typeButton = {
    tipo: string;
    subtipo?: string;
}

export default function Task() {
    const [botonActivo, setBotonActivo] = useState<typeButton | null>(null)
    const turnos = [
    { title: 'Dro. Juan Pérez', start: '2026-03-20T09:00:00', extendedProps: { barColor: '#FF00FF' }, comment: 'hola, este es un comentario' },
    { title: 'Dro. Ana García', start: '2026-03-20T10:00:00', extendedProps: { barColor: '#22ff00' }, comment: 'hola, este es otro comentario' },
  ]
    
    return (
        <section className={styles.mainContainerProperties}>
            {botonActivo?.tipo === 'info' && botonActivo.subtipo === 'setting' ? (
        <div>
          <Help type={botonActivo.subtipo}></Help>
        </div>
      ): botonActivo?.tipo === 'info' && botonActivo.subtipo === 'info' ? (
        <div>
          <Help type={botonActivo.subtipo}></Help>
        </div>
      ) : botonActivo?.tipo === 'label' && botonActivo.subtipo === 'label' ? (
        <div>
          <CreateAppointment turnos={turnos[1]} type={'create'} name='Ana' onClose={() => setBotonActivo(null)}></CreateAppointment>
        </div>
      ) : null}
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
                <ButtonsRod onBotonClick={(boton) => console.log(boton)} />
            </div>
        </section>
    );
}