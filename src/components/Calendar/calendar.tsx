import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import styles from './Calendar.module.css'
import WelcomeText from '../WelcomeText/welcomeText'
import { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import CreateAppointment from './CreateAppointment/create'
import Help from './Help/help'
import Appointment from './Appointment/appointment'
import ButtonsRod from '../Buttons/ButtonsRod/buttonsRod'
import type { ButtonInfo } from '../../types/buttonInfo'
import type { ShiftResponseDTO } from '../../types/clinical.types'
import { shiftService } from '../../services/shift.service'
import type { ShiftStatus } from '../../types/enums.types'
import { useNavigate } from 'react-router-dom'
import { noteService } from '../../services/note.service'
import type { NoteResponseDTO } from '../../types/management.types'

export default function CalendarioMedico() {

  const navigate = useNavigate()

  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date | null>(new Date());
  const [tipo, setTipo] = useState<'view' | 'confirm'>('view');
  const [tipoForm, setTipoForm] = useState<'create' | 'edit'>('create');

  const [mostarInfoTurno, setInfoTurno] = useState(false);
  const [turnoSeleccionado, setTurnoSeleccionado] = useState<ShiftResponseDTO | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [turnos, setTurnos] = useState<ShiftResponseDTO[]>([]);
  const [turnoConfirmado, setTurnoConfirmado] = useState<ShiftResponseDTO | null>(null);

  const [dateCalendar, setDateCalendar] = useState<Date>(new Date());

  const [comments, setComments] = useState<Record<string, NoteResponseDTO>>({});
  const [mostrarInfoComment, setMostrarInfoComment] = useState(false);

  useEffect(() => {
    noteService.getAll()
      .then(fetchedComments => {
        const commentMap: Record<string, NoteResponseDTO> = {}
        fetchedComments.forEach(c => {
          const key = c.date.slice(0, 10)
          commentMap[key] = c
        })
        setComments(commentMap)
      })
      .catch(error => console.error(error))
  }, [])

  const fetchTurnos = () => {
    shiftService.getAll()
      .then(fetchedTurnos => setTurnos(fetchedTurnos))
      .catch(error => console.error('Error fetching turnos:', error));
  }

  useEffect(() => {
    fetchTurnos();
  }, [])

  const coloresEstados: Record<string, string> = {
    'REQUIRED': '#FF2600',
    'ASSIGNED': '#77FF00',
  }

  const [botonActivo, setBotonActivo] = useState<ButtonInfo | null>(null);
  const [showOptions, setShowOptions] = useState<number | null>(null);

  // Mapeamos los eventos asegurándonos de pasarle toda la data individual a "extendedProps"
  const eventos = turnos.map((turno) => ({
    id: String(turno.id),
    title: turno.patientFullName,
    start: turno.shiftDate,
    extendedProps: {
      barColor: coloresEstados[turno.status] ?? '#FFFFFF', // Cada evento se lleva su color
      comment: turno.noteDescription,
      turnoCompleto: turno // Guardamos el objeto entero para el modal
    }
  }));

  const handleShiftSaved = (newShift: ShiftResponseDTO) => {
    fetchTurnos();
    setShowForm(false);
    setBotonActivo(null);
    setTurnoConfirmado(newShift);
  }

  return (
    <div>
      {botonActivo?.tipo === 'info' && botonActivo.subtipo === 'setting' ? (
        <Help type={botonActivo.subtipo} component={'calendar'} />
      ) : botonActivo?.tipo === 'info' && botonActivo.subtipo === 'info' ? (
        <Help type={botonActivo.subtipo} component={'calendar'} />
      ) : botonActivo?.tipo === 'calendar' && botonActivo.subtipo === 'calendar' ? (
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
      ) : botonActivo?.tipo === 'label' && botonActivo.subtipo === 'label' ? (
        <Help type={botonActivo.subtipo} component={'calendar'} />
      ) : null}

      {(botonActivo?.tipo === 'form' && botonActivo.subtipo === 'form') && (
        <CreateAppointment
          type={tipoForm}
          component='calendar'
          name='Ana'
          onClose={() => { setBotonActivo(null); setTipoForm('create'); }}
          onlyComment={false}
          onShiftSaved={handleShiftSaved}
        />
      )}

      {showForm && (
        <CreateAppointment
          type={tipoForm}
          component='calendar'
          name='Ana'
          onClose={() => { setShowForm(false); setTipoForm('create'); }}
          onlyComment={false}
          dateCalendar={dateCalendar}
          onShiftSaved={handleShiftSaved}
        />
      )}

      {showCommentForm && (
        <CreateAppointment
          type={tipoForm}
          component='calendar'
          name='Ana'
          onClose={() => { setShowCommentForm(false); setTipoForm('create'); }}
          onlyComment={true}
          dateCalendar={dateCalendar}
          onShiftSaved={handleShiftSaved}
        />
      )}

      {tipo === 'view' && mostarInfoTurno && turnoSeleccionado && (
        <Appointment
          component='calendar'
          turnos={[turnoSeleccionado]}
          type='view'
          onClose={() => { setInfoTurno(false); setTurnoSeleccionado(null); }}
        />
      )}

      {tipo === 'view' && mostrarInfoComment && (
        <Appointment
          component='calendar'
          justComment={true}
          type='view'
          comment={comments[dateCalendar.toISOString().slice(0, 10)]}
          onClose={() => { setMostrarInfoComment(false); }}
        />
      )}

      {turnoConfirmado && (
        <div style={{ position: 'fixed', zIndex: 9999, top: 0, left: 0, width: '100%', height: '100%' }}>
          <Appointment
            component='calendar'
            turnos={[turnoConfirmado]}
            type='confirm'
            onClose={() => setTurnoConfirmado(null)}
          />
        </div>
      )}

      <div className={styles.calendarContainerProperties}>
        <WelcomeText sectionText='Aca el calendario de la semana' className='darkStyle' />
        <div className={styles.calendarAndButtonsContainerProperties}>
          <div className={styles.calendarContainerProperties}>
            <FullCalendar
              plugins={[timeGridPlugin]}
              initialView="timeGridWeek"
              allDaySlot={false}
              events={eventos}
              contentHeight={600}
              expandRows={true}
              slotMinTime="06:00:00"
              slotMaxTime="20:00:00"
              slotDuration="00:30:00"
              dayHeaderContent={(args) => {
                const fechaKey = args.date.toISOString().slice(0, 10)
                const comentarioDelDia = comments[fechaKey]

                return (
                  <div className={styles.diaHeader}>
                    <span>{args.text}</span>
                    {comentarioDelDia ? (
                      <button className={styles.commentIcon} onClick={() => {
                        setDateCalendar(args.date)
                        setMostrarInfoComment(true)
                      }}><img src='/icons/seeMoreIcon.png' /></button>
                    ) : (
                      <button className={styles.commentIcon} onClick={() => {
                        setShowCommentForm(true)
                        setTipoForm('create')
                        setDateCalendar(args.date)
                      }}>+</button>
                    )}
                  </div>
                )
              }}
              eventContent={(eventInfo) => {
                const eventId = Number(eventInfo.event.id);
                const barColor = eventInfo.event.extendedProps.barColor;
                const turno = eventInfo.event.extendedProps.turnoCompleto as ShiftResponseDTO;

                return (
                  <div className={styles.evento}>
                    <div className={styles.barraColor} style={{ backgroundColor: barColor }}></div>
                    <div className={styles.container}>
                      <div className={styles.mainInfoProperties}>
                        <span>{eventInfo.timeText}</span>
                        <span style={{ backgroundColor: barColor }}>Dr/dra: {turno.doctorFullName}</span>
                      </div>
                      <div className={styles.buttonsProperties}>
                        <button onClick={() => {
                          setTipo('view');
                          setTurnoSeleccionado(turno);
                          setInfoTurno(true);
                        }}>
                          <img src='/icons/seeMoreIcon.png' />
                        </button>
                        <button onClick={() => { setBotonActivo({ tipo: 'form', subtipo: 'form' }); setTipoForm('edit') }}>
                          <img src='/icons/editIcon.png' />
                        </button>
                        <button onClick={() => setShowOptions(showOptions === eventId ? null : eventId)}>
                          <img src='/icons/refreshIcon.png' />
                        </button>
                      </div>
                    </div>
                    <div className={styles.barraColor} style={{ backgroundColor: barColor }}></div>
                    {showOptions === eventId && (
                      <select
                        style={{ position: 'absolute', zIndex: 10 }}
                        onChange={async (e) => {
                          try {
                            await shiftService.update(turno.id, { ...turno, status: e.target.value as ShiftStatus })
                            fetchTurnos()
                            setShowOptions(null)
                            navigate('/calendario')
                          } catch (error) {
                            console.error(error)
                          }
                        }}
                      >
                        <option value="" disabled selected>Seleccionar estado</option>
                        <option value="REQUIRED">Requerido</option>
                        <option value="ASSIGNED">Asignado</option>
                      </select>
                    )}
                  </div>
                );
              }}
            />
          </div>
          <div>
            <ButtonsRod onBotonClick={(boton: any) => setBotonActivo(boton)} botonActivo={botonActivo} />
          </div>
        </div>
      </div>
    </div>
  )
}