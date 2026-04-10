import ButtonsRod from "../Buttons/ButtonsRod/buttonsRod";
import WelcomeText from "../WelcomeText/welcomeText";
import styles from "./task.module.css"
import TaskCard from "./TasksCards/taskCard";
import { useEffect, useState } from 'react'
import 'react-datepicker/dist/react-datepicker.css'
import Help from './../Calendar/Help/help'
import CreateAppointment from './../Calendar/CreateAppointment/createAppointment'
import DatePicker from 'react-datepicker'
import Appointment from "../Calendar/Appointment/appointment";
import type { TaskResponseDTO } from "../../types/management.types";
import { taskService } from "../../services/task.service";

type typeButton = {
  tipo: string;
  subtipo?: string;
}

export default function Task() {
  const [tasks, setTasks] = useState<TaskResponseDTO[]>([]);
  const [botonActivo, setBotonActivo] = useState<typeButton | null>(null)
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date | null>(new Date());
  const [taskSeleccionada, setTaskSeleccionada] = useState<TaskResponseDTO | null>(null);

  const turnos = [
    { title: 'Dro. Juan Pérez', start: '2026-03-20T09:00:00', extendedProps: { barColor: '#FF00FF' }, comment: 'hola, este es un comentario' },
    { title: 'Dro. Ana García', start: '2026-03-20T10:00:00', extendedProps: { barColor: '#22ff00' }, comment: 'hola, este es otro comentario' },
  ]

  useEffect(() => {
    taskService.getAll()
      .then(fetchedTasks => setTasks(fetchedTasks))
      .catch(error => console.error('Error fetching tasks:', error));
  }, []);

  return (
    <section className={styles.mainContainerProperties}>

      {/* Modales */}
      {botonActivo?.tipo === 'info' && botonActivo.subtipo === 'setting' && (
        <Help type={botonActivo.subtipo} component={'task'} />
      )}
      {botonActivo?.tipo === 'info' && botonActivo.subtipo === 'info' && (
        <Help type={botonActivo.subtipo} component={'task'} />
      )}
      {botonActivo?.tipo === 'form' && botonActivo.subtipo === 'form' && (
        <CreateAppointment turnos={turnos[1]} type={'create'} component="task" name='Ana' onClose={() => setBotonActivo(null)} />
      )}
      {botonActivo?.tipo === 'calendar' && botonActivo.subtipo === 'calendar' && (
        <div className={styles.miniCalendarProperties}>
          <DatePicker
            selected={fechaSeleccionada}
            onChange={(fecha: Date | null) => {
              if (fecha) {
                setFechaSeleccionada(fecha)
                setBotonActivo(null)
              }
            }}
            inline
          />
        </div>
      )}
      {botonActivo?.tipo === 'edit' && taskSeleccionada && (
        <CreateAppointment task={taskSeleccionada} type={'edit'} component='task' name='Ana' onClose={() => setBotonActivo(null)} />
      )}
      {botonActivo?.tipo === 'show' && taskSeleccionada && (
        <Appointment task={taskSeleccionada} type="view" component='task' onClose={() => setBotonActivo(null)} />
      )}

      <div className={styles.containerProperties}>
        <WelcomeText sectionText="Aca las tareas proximas" className=""></WelcomeText>
        <div className={styles.taskContainerProperties}>
          {tasks.length === 0 ? (
            <p className={styles.noTasksText}>No hay tareas próximas</p>
          ) : (
            tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onBotonClick={(boton: any) => {
                  setTaskSeleccionada(task)
                  setBotonActivo(boton)
                }}
              />
            ))
          )}
        </div>
      </div>

      {/* Botones */}
      <div className={styles.buttonsRodContainerProperties}>
        <ButtonsRod onBotonClick={(boton: any) => setBotonActivo(boton)} botonActivo={botonActivo} component="task" />
      </div>

    </section>
  );
}