import ButtonsRod from "../Buttons/ButtonsRod/buttonsRod";
import WelcomeText from "../WelcomeText/welcomeText";
import styles from "./task.module.css"
import TaskCard from "./TasksCards/taskCard";
import { useState } from 'react'
import 'react-datepicker/dist/react-datepicker.css'
import Help from './../Calendar/Help/help'
import CreateAppointment from './../Calendar/CreateAppointment/createAppointment'
import DatePicker from 'react-datepicker'
import Appointment from "../Calendar/Appointment/appointment";

/** SOLO DE PRUEBA: AGREGO VARIOS LLAMADOS AL COMPONENTE TaskCard */

const task = {
  cliente: 'Milagros Alvarez',
  fecha: new Date('2026-03-20'),
  estado: 'Pendiente',
  prioridad: 'Media',
  tarea: 'Pedir informacion al paciente',
  comentario: 'El paciente se comunicó por teléfono pero no se pudo obtener la información necesaria. Se dejó un mensaje solicitando que se comuniquen nuevamente para completar los datos.'
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
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date | null>(new Date());
  const [showForm, setShowForm] = useState(false);

  return (
    <section className={styles.mainContainerProperties}>
      {botonActivo?.tipo === 'info' && botonActivo.subtipo === 'setting' ? (
        <div>
          <Help type={botonActivo.subtipo} component={'task'}></Help>
        </div>
      ) : botonActivo?.tipo === 'info' && botonActivo.subtipo === 'info' ? (
        <div>
          <Help type={botonActivo.subtipo} component={'task'}></Help>
        </div>
      ) : botonActivo?.tipo === 'label' && botonActivo.subtipo === 'label' ? (
        <div>
          <CreateAppointment turnos={turnos[1]} type={'create'} component="task" name='Ana' onClose={() => setBotonActivo(null)}></CreateAppointment>
        </div>
      ) : botonActivo?.tipo === 'calendar' && botonActivo.subtipo === 'calendar' ? (
        <div className={styles.miniCalendarProperties}>
          <DatePicker
            selected={fechaSeleccionada}
            onChange={(fecha: Date | null) => {
              if (fecha) {
                setFechaSeleccionada(fecha)
                setBotonActivo(null) // Cerrar el calendario después de seleccionar una fecha
              }
            }}
            inline
          />
        </div>
      ) : botonActivo?.tipo === 'edit' ? (
        <div>
          <CreateAppointment task={task} type={'edit'} component='task' name='Ana' onClose={() => setBotonActivo(null)}></CreateAppointment>
        </div>
      ) : botonActivo?.tipo === 'show' ? (
        <div>
          <Appointment task={task} type="view" component='task' onClose={() => setBotonActivo(null)}></Appointment>
        </div>
      ) : null}

      <div className={styles.containerProperties}>
        <WelcomeText sectionText="Aca las tareas proximas" className=""></WelcomeText>
        <div className={styles.taskContainerProperties}>
          <TaskCard task={task} onBotonClick={(boton: any) => setBotonActivo(boton)}></TaskCard>
        </div>
      </div>
      <div className={styles.buttonsRodContainerProperties}>
        <ButtonsRod onBotonClick={(boton: any) => setBotonActivo(boton)} />
      </div>
    </section>
  );
}