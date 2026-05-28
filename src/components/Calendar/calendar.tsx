/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/immutability */
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import styles from './Calendar.module.css'
import WelcomeText from '../WelcomeText/welcomeText'
import { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import CreateAppointment from './Create/create'
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
import Shift from '../Shifts/Shift'
import esLocale from '@fullcalendar/core/locales/es'

export default function CalendarioMedico() {

  const navigate = useNavigate()

  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date | null>(new Date());
  const [tipo, setTipo] = useState<'view' | 'confirm'>('view');
  const [tipoForm, setTipoForm] = useState<'create' | 'edit'>('create');
  const [allShifts, setAllShifts] = useState<ShiftResponseDTO[]>([]); // Para el contador de turnos

  const [mostarInfoTurno, setInfoTurno] = useState(false);
  const [turnoSeleccionado, setTurnoSeleccionado] = useState<ShiftResponseDTO | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [turnos, setTurnos] = useState<ShiftResponseDTO[]>([]);
  const [turnosFiltrados, setTurnosFiltrados] = useState<ShiftResponseDTO[]>([]);
  const [turnoConfirmado, setTurnoConfirmado] = useState<ShiftResponseDTO | null>(null);

  const [dateCalendar, setDateCalendar] = useState<Date>(new Date());

  const [comments, setComments] = useState<Record<string, NoteResponseDTO>>({});
  const [mostrarInfoComment, setMostrarInfoComment] = useState(false);
  const [showShifts, setShowShifts] = useState(false);
  const [showShiftsParDay, setShowShiftsParDay] = useState(false);
  const [doctor, setDoctor] = useState(-1);

  const [expandedEventId, setExpandedEventId] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const [searchDoctor, setSearchDoctor] = useState('');
  const [doctorsSuggestions, setDoctorsSuggestions] = useState<string[]>([]);
  const doctoresUnicos = [...new Set(turnos.map(t => t.doctorFullName))]

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = () => {
      setExpandedEventId(null);
      if (isMobile) setShowOptions(null);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMobile]);

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
    const userId = Number(localStorage.getItem('userId'))
    shiftService.getByDoctorId(userId)
      .then(fetchedTurnos => {
        setTurnos(fetchedTurnos)
        setTurnosFiltrados(fetchedTurnos)
      })
      .catch(error => console.error(error));
    // Todos los turnos para el contador
    shiftService.getAll()
      .then(fetchedTurnos => setAllShifts(fetchedTurnos))
      .catch(error => console.error(error));
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

  const eventos = turnosFiltrados.map((turno) => ({
    id: String(turno.id),
    title: turno.patientFullName,
    start: turno.shiftDate,
    extendedProps: {
      barColor: coloresEstados[turno.status] ?? '#FFFFFF',
      comment: turno.noteDescription,
      turnoCompleto: turno
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
        <Help
          type={botonActivo.subtipo}
          component={'calendar'}
          onShiftsFound={(shifts, doctor) => {
            setTurnos(shifts)
            setDoctor(doctor)
            setBotonActivo(null)
            setShowShifts(true)
          }}
        />
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
          component='comment'
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
          component='comment'
          justComment={true}
          type='view'
          comment={comments[dateCalendar.toISOString().slice(0, 10)]}
          onClose={() => { setMostrarInfoComment(false); }}
        />
      )}

      {turnoConfirmado && (
        <div style={{ position: 'fixed', zIndex: 9999, top: 0, left: 0, width: '100%', height: '100%' }}>
          
        </div>
      )}

      {showShiftsParDay && (
        <div style={{ position: 'fixed', zIndex: 9999, top: 0, left: 0, width: '100%', height: '100%' }}>
         <Shift shifts={allShifts.filter(t => {
            const turnoFecha = new Date(t.shiftDate)
            const hoy = new Date()

            const mismodia = turnoFecha.getDate() === hoy.getDate() &&
              turnoFecha.getMonth() === hoy.getMonth() &&
              turnoFecha.getFullYear() === hoy.getFullYear()

            return mismodia
          })} doctor={-1} doctors={[]} onClose={() => setShowShiftsParDay(false)}></Shift>
        </div>
      )}

      {!showShifts ? (
        <div className={styles.calendarContainerProperties}>
          <div className={styles.headerProperties}>
            <WelcomeText sectionText='Aca el calendario de la semana' className='darkStyle' />
            <div className={styles.searchBarProperties}>
              <input
                type='text'
                placeholder='Buscar por médico...'
                value={searchDoctor}
                onChange={(e) => {
                  const valor = e.target.value
                  setSearchDoctor(valor)
                  if (valor === '') {
                    setTurnosFiltrados(turnos)
                    setDoctorsSuggestions([])
                  } else {
                    setDoctorsSuggestions(
                      doctoresUnicos.filter(d => d.toLowerCase().includes(valor.toLowerCase()))
                    )
                    setTurnosFiltrados(
                      turnos.filter(t => t.doctorFullName.toLowerCase().includes(valor.toLowerCase()))
                    )
                  }
                }}
              />
              {doctorsSuggestions.length > 0 && (
                <div className={styles.dropdownProperties}>
                  {doctorsSuggestions.map(doctor => (
                    <div
                      key={doctor}
                      className={styles.dropdownItemProperties}
                      onClick={() => {
                        setSearchDoctor(doctor)
                        setTurnosFiltrados(turnos.filter(t => t.doctorFullName === doctor))
                        setDoctorsSuggestions([])
                      }}
                    >
                      {doctor}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className={styles.calendarAndButtonsContainerProperties}>
            <div className={styles.calendarContainerProperties}>
              <div className={styles.calendarContainerProperties}>
                <FullCalendar
                  locale={esLocale}
                  plugins={[timeGridPlugin]}
                  initialView={isMobile ? "timeGridDay" : "timeGridWeek"}
                  allDaySlot={false}
                  events={eventos}
                  contentHeight={600}
                  expandRows={true}
                  slotMinTime="06:00:00"
                  slotMaxTime="20:00:00"
                  slotDuration="00:30:00"
                  slotLabelContent={(args) => {
                    const hora = `${String(args.date.getHours()).padStart(2, '0')}:${String(args.date.getMinutes()).padStart(2, '0')}`

                    const cantidadTurnos = allShifts.filter(t => {
                      const turnoFecha = new Date(t.shiftDate)
                      const hoy = new Date()

                      const mismodia = turnoFecha.getDate() === hoy.getDate() &&
                        turnoFecha.getMonth() === hoy.getMonth() &&
                        turnoFecha.getFullYear() === hoy.getFullYear()

                      const turnoHoraStr = `${String(turnoFecha.getHours()).padStart(2, '0')}:${String(turnoFecha.getMinutes()).padStart(2, '0')}`

                      return mismodia && turnoHoraStr === hora
                    }).length

                    return (
                      <div className={styles.slotLabel}>
                        <span>{args.text}</span>
                        {cantidadTurnos > 0 && (
                          <span onClick={() => setShowShiftsParDay(true)} className={styles.turnosCount}>{cantidadTurnos}</span>
                        )}
                      </div>
                    )
                  }}
                  dayHeaderContent={(args) => {
                    const fechaKey = args.date.toISOString().slice(0, 10)
                    const comentarioDelDia = comments[fechaKey]

                    return (
                      <div className={styles.diaHeader}>
                        <span>{args.text}</span>
                        {comentarioDelDia ? (
                          <button className={styles.commentIcon} onClick={(e) => {
                            e.stopPropagation();
                            setDateCalendar(args.date)
                            setMostrarInfoComment(true)
                          }}><img src='/icons/seeMoreIcon.png' /></button>
                        ) : (
                          <button className={styles.commentIcon} onClick={(e) => {
                            e.stopPropagation();
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

                    if (!isMobile) {
                      return (
                        <div className={styles.evento}>
                          <div className={styles.container} style={{ borderTop: `5px solid ${barColor}`, borderBottom: `5px solid ${barColor}` }}>
                            <div className={styles.mainInfoProperties}>
                              <span>{eventInfo.timeText}</span>
                              <span style={{ backgroundColor: barColor }}>Dr/dra: {turno.doctorFullName}</span>
                            </div>
                            <div className={styles.buttonsProperties}>
                              <button onClick={(e) => {
                                e.stopPropagation();
                                setTipo('view');
                                setTurnoSeleccionado(turno);
                                setInfoTurno(true);
                              }}>
                                <img src='/icons/seeMoreIcon.png' />
                              </button>
                              <button onClick={(e) => { e.stopPropagation(); setBotonActivo({ tipo: 'form', subtipo: 'form' }); setTipoForm('edit') }}>
                                <img src='/icons/editIcon.png' />
                              </button>
                              <button onClick={(e) => { e.stopPropagation(); setShowOptions(showOptions === eventId ? null : eventId); }}>
                                <img src='/icons/refreshIcon.png' />
                              </button>
                            </div>
                          </div>
                          {showOptions === eventId && (
                            <select
                              style={{ position: 'absolute', zIndex: 10 }}
                              onChange={async (e) => {
                                e.stopPropagation();
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
                    } else {
                      const isExpanded = expandedEventId === eventId;
                      return (
                        <div
                          className={`${styles.eventoWrapper} ${isExpanded ? styles.expanded : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedEventId(isExpanded ? null : eventId);
                            if (isExpanded) setShowOptions(null);
                          }}
                        >
                          <div className={styles.eventoMinimal} style={{ borderLeft: `10px solid ${barColor}` }}>
                            <span className={styles.timeText}>{eventInfo.timeText}</span>
                            <span className={styles.patientText}>{turno.patientFullName}</span>
                          </div>

                          {isExpanded && (
                            <div
                              className={styles.eventoDetalles}
                              style={{ borderLeft: `10px solid ${barColor}` }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className={styles.infoTurno}>
                                <p className={styles.timeTextExpanded}>{eventInfo.timeText}</p>
                                <p><strong>Paciente:</strong> {turno.patientFullName}</p>
                                <p><strong>Dr/a:</strong> {turno.doctorFullName}</p>
                              </div>

                              <div className={styles.botonesAccion}>
                                <button onClick={(e) => { e.stopPropagation(); setTipo('view'); setTurnoSeleccionado(turno); setInfoTurno(true); setExpandedEventId(null); }}>
                                  <img src='/icons/seeMoreIcon.png' alt="Ver más" />
                                </button>
                                <button onClick={(e) => { e.stopPropagation(); setBotonActivo({ tipo: 'form', subtipo: 'form' }); setTipoForm('edit'); setExpandedEventId(null); }}>
                                  <img src='/icons/editIcon.png' alt="Editar" />
                                </button>
                                <button onClick={(e) => { e.stopPropagation(); setShowOptions(showOptions === eventId ? null : eventId); }}>
                                  <img src='/icons/refreshIcon.png' alt="Estado" />
                                </button>
                              </div>

                              {showOptions === eventId && (
                                <select
                                  className={styles.statusSelect}
                                  onChange={async (e) => {
                                    e.stopPropagation();
                                    try {
                                      await shiftService.update(turno.id, { ...turno, status: e.target.value as ShiftStatus })
                                      fetchTurnos()
                                      setShowOptions(null)
                                      setExpandedEventId(null)
                                      navigate('/calendario')
                                    } catch (error) {
                                      console.error(error)
                                    }
                                  }}
                                >
                                  <option value="" disabled selected>Cambiar estado</option>
                                  <option value="REQUIRED">Requerido</option>
                                  <option value="ASSIGNED">Asignado</option>
                                </select>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    }
                  }}
                />
              </div>

            </div>
            <div>
              <ButtonsRod onBotonClick={(boton: any) => setBotonActivo(boton)} botonActivo={botonActivo} />
            </div>
          </div>
        </div>
      ) : (
        <Shift shifts={turnos} doctor={doctor} doctors={[]} onClose={() => setShowShiftsParDay(false)}></Shift>
      )}
    </div>
  )
}