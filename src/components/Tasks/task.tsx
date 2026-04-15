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
import DeleteConfirmCard from "../DeleteConfirmCard/deleteConfirmCard";
import { useNavigate } from 'react-router-dom'

type typeButton = {
  tipo: string;
  subtipo?: string;
}

export default function Task() {
  const navigate = useNavigate()
  const [tasks, setTasks] = useState<TaskResponseDTO[]>([]);
  const [botonActivo, setBotonActivo] = useState<typeButton | null>(null)
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date | null>(new Date());
  const [taskSeleccionada, setTaskSeleccionada] = useState<TaskResponseDTO | null>(null);
  const [cardEliminarTask, setCardEliminarTask] = useState(false)
  const [idCard, setIdCard] = useState(-1)

  useEffect(() => {
    taskService.getAll()
      .then(fetchedTasks => setTasks(fetchedTasks))
      .catch(error => console.error('Error fetching tasks:', error));
  }, []);

  const handleDelete = async () => {
    try {
      console.log(idCard)
      await taskService.delete(idCard)
      navigate('/task.tsx')
    }
    catch (error:any) {
      console.error(error.response?.data)
    }
  }

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
        <CreateAppointment onTaskSaved={(newTask) => {
          setTasks(prev => [...prev, newTask])
        }} type={'create'} component="task" name='Ana' onClose={() => setBotonActivo(null)}
          onlyComment={false} />
      )}
      {cardEliminarTask && (
        <DeleteConfirmCard component="la tarea" onClose={() => setCardEliminarTask(false)}
          onAcceptButtonClick={() => {
            handleDelete()
          }}></DeleteConfirmCard>
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
        <CreateAppointment onTaskSaved={(updatedTask) => {
          setTasks(prev =>
            prev.map(t => t.id === updatedTask.id ? updatedTask : t)
          )
        }} task={taskSeleccionada} type={'edit'} component='task' name='Ana' onClose={() => setBotonActivo(null)} onlyComment={false} />
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
                onBotonEliminarClick={(boton: any) => {
                  setCardEliminarTask(!cardEliminarTask)
                  setIdCard(task.id)
                }}
                onPriorityChange={async (task) => {
                  try {
                    await taskService.update(task.id, {
                      ...task,
                      priority: "HIGH"
                    });

                    setTasks(prev =>
                      prev.map(t =>
                        t.id === task.id ? { ...t, priority: "HIGH" } : t
                      )
                    );

                  } catch (error) {
                    console.error(error);
                  }
                }}
                onStatusChange={async (task, newStatus) => {
                  try {
                    await taskService.update(task.id, {
                      ...task,
                      status: newStatus
                    });

                    setTasks(prev =>
                      prev.map(t =>
                        t.id === task.id ? { ...t, status: newStatus } : t
                      )
                    );

                  } catch (error) {
                    console.error(error);
                  }
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