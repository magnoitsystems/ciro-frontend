/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import ButtonsRod from "../Buttons/ButtonsRod/buttonsRod";
import WelcomeText from "../WelcomeText/welcomeText";
import styles from "./task.module.css"
import TaskCard from "./TasksCards/taskCard";
import { useEffect, useState } from 'react'
import 'react-datepicker/dist/react-datepicker.css'
import Help from './../Calendar/Help/help'
import CreateAppointment from '../Calendar/Create/create'
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
  
  const [allTasks, setAllTasks] = useState<TaskResponseDTO[]>([]);
  
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const [botonActivo, setBotonActivo] = useState<typeButton | null>(null)
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date | null>(new Date());
  const [taskSeleccionada, setTaskSeleccionada] = useState<TaskResponseDTO | null>(null);
  const [cardEliminarTask, setCardEliminarTask] = useState(false)
  const [idCard, setIdCard] = useState(-1)
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const role = localStorage.getItem('userRole');
        const userId = Number(localStorage.getItem('userId'));
        
        let fetchedTasks: TaskResponseDTO[] = [];

        if (role === 'ADMIN') {
          fetchedTasks = await taskService.getAll();
        } else if (userId) {
          fetchedTasks = await taskService.getByUserId(userId);
        }
        
        setAllTasks(fetchedTasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  const handleDelete = async () => {
    setLoading(true);
    try {
      console.log(idCard)
      await taskService.delete(idCard)
      setAllTasks(prev => prev.filter(t => t.id !== idCard));
      setCardEliminarTask(false);
      navigate('/Tareas')
    }
    catch (error:any) {
      console.error(error.response?.data)
    } finally {
      setLoading(false);
    }
  }

  const displayedTasks = filterStatus === 'ALL' 
    ? allTasks 
    : allTasks.filter(t => t.status === filterStatus);

  return (
    <section className={styles.mainContainerProperties}>

      {botonActivo?.tipo === 'info' && botonActivo.subtipo === 'setting' && (
        <Help type={botonActivo.subtipo} component={'task'} />
      )}
      {botonActivo?.tipo === 'info' && botonActivo.subtipo === 'info' && (
        <Help type={botonActivo.subtipo} component={'task'} />
      )}
       {botonActivo?.tipo === 'label' && botonActivo.subtipo === 'label' && (
        <Help type={botonActivo.subtipo} component={'task'} />
      )}
      {botonActivo?.tipo === 'form' && botonActivo.subtipo === 'form' && (
        <CreateAppointment onTaskSaved={(newTask) => {
          setAllTasks(prev => [...prev, newTask])
        }} type={'create'} component="task" name='Ana' onClose={() => setBotonActivo(null)}
          onlyComment={false} />
      )}
      {cardEliminarTask && (
        <DeleteConfirmCard component="la tarea" onClose={() => setCardEliminarTask(false)}
          onAcceptButtonClick={() => {
            handleDelete()
          }} loading={loading}></DeleteConfirmCard>
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
          setAllTasks(prev =>
            prev.map(t => t.id === updatedTask.id ? updatedTask : t)
          )
        }} task={taskSeleccionada} type={'edit'} component='task' name='Ana' onClose={() => setBotonActivo(null)} onlyComment={false} />
      )}
      {botonActivo?.tipo === 'show' && taskSeleccionada && (
        <Appointment task={taskSeleccionada} type="view" component='task' onClose={() => setBotonActivo(null)} />
      )}

      <div className={styles.containerProperties}>
        <WelcomeText sectionText="Acá las tareas proximas" className=""></WelcomeText>
        
        <div className={styles.filterContainer}>
            <label className={styles.filterLabel}>Filtrar por estado:</label>
            <select 
                className={styles.statusSelect}
                value={filterStatus} 
                onChange={(e) => setFilterStatus(e.target.value)}
            >
                <option value="ALL">Todas</option>
                <option value="PENDING">Pendiente</option>
                <option value="IN_PROGRESS">En proceso</option>
                <option value="COMPLETED">Completada</option>
            </select>
        </div>

        <div className={styles.taskContainerProperties}>
          {displayedTasks.length === 0 ? (
            <p className={styles.noTasksText}>No hay tareas próximas</p>
          ) : (
            displayedTasks.map((task) => (
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

                    setAllTasks(prev =>
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

                    setAllTasks(prev =>
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

      <div className={styles.buttonsRodContainerProperties}>
        <ButtonsRod onBotonClick={(boton: any) => setBotonActivo(boton)} botonActivo={botonActivo} component="task" />
      </div>
    </section>
  );
}