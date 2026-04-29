import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import styles from './Calendar.module.css'
import WelcomeText from '../WelcomeText/welcomeText'
import { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import CreateAppointment from './CreateAppointment/createAppointment'
import Help from './Help/help'
import Appointment from './Appointment/appointment'
import ButtonsRod from '../Buttons/ButtonsRod/buttonsRod'
import type { ButtonInfo } from '../../types/buttonInfo'
import type { ShiftResponseDTO } from '../../types/clinical.types'
import { shiftService } from '../../services/shift.service'
import type { NoteResponseDTO } from '../../types/management.types'

export default function CalendarioMedico() {

  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date | null>(new Date());
  const [tipo, setTipo] = useState<'view' | 'confirm'>('view')
  const [tipoForm, setTipoForm] = useState<'create' | 'edit'>('create')
  const [mostarInfoTurno, setInfoTurno] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [turnos, setTurnos] = useState<ShiftResponseDTO[]>([])
  const [comment, setComment] = useState<NoteResponseDTO>()
  const [dateCalendar, setDateCalendar] = useState<Date>(new Date())

  useEffect(() => {
    shiftService.getAll()
      .then(fetchedTurnos => setTurnos(fetchedTurnos))
      .catch(error => console.error('Error fetching turnos:', error));
    console.log(turnos)
  }, [])

  const coloresEstados: Record<string, string> = {
    'REQUIRED': '#FF2600',
    'ASSIGNED': '#77FF00',
  }

  const [estadosTurnos, setEstadosTurnos] = useState<Record<number, string>>({
    0: 'solicitado',
    1: 'solicitado',
  })

  const [botonActivo, setBotonActivo] = useState<ButtonInfo | null>(null)
  const [showOptions, setShowOptions] = useState<number | null>(null)

  const index = turnos.findIndex(t => t.patientFullName === turnos[0].patientFullName)
  const estadoActual = estadosTurnos[index] ?? 'solicitado'
  const colorActual = coloresEstados[estadoActual] ?? '#FFFFFF'

  const eventos = turnos.map((turno) => ({
    id: String(turno.id),
    fullNamePatient: turno.patientFullName,
    start: turno.shiftDate,
    extendedProps: {
      barColor: coloresEstados[turno.status] ?? '#FFFFFF',
      comment: turno.noteDescription
    }
  }))

  return (
    <div>
      {botonActivo?.tipo === 'info' && botonActivo.subtipo === 'setting' ? (
        <div>
          <Help type={botonActivo.subtipo} component={'calendar'}></Help>
        </div>
      ) : botonActivo?.tipo === 'info' && botonActivo.subtipo === 'info' ? (
        <div>
          <Help type={botonActivo.subtipo} component={'calendar'}></Help>
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
      ) : botonActivo?.tipo === 'label' && botonActivo.subtipo === 'label' ? (
        <div>
          <Help type={botonActivo.subtipo} component={'calendar'}></Help>
        </div>
      ) : null}

      {(botonActivo?.tipo === 'form' && botonActivo.subtipo === 'form') && (
        <div>
          <CreateAppointment type={tipoForm} component='calendar' name='Ana' onClose={() => {
            setBotonActivo(null)
            setTipoForm('create')
          }} onlyComment={false}></CreateAppointment>
        </div>
      )}

      {showForm && (
        <div>
          <CreateAppointment type={tipoForm} component='calendar' name='Ana' onClose={() => {
            setBotonActivo(null)
            setTipoForm('create')
          }} onlyComment={true} dateCalendar={dateCalendar}></CreateAppointment>
        </div>
      )}

      {tipo === 'view' && mostarInfoTurno && (
        <div>
          <Appointment component='calendar' turnos={turnos} type='view' onClose={() => setInfoTurno(false)}></Appointment>
        </div>
      )}

      <div className={styles.calendarContainerProperties}>
        <WelcomeText sectionText='Aca el calendario de la semana' className='darkStyle'></WelcomeText>
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
              dayHeaderContent={(args) => (
                <div className={styles.diaHeader}>
                  <span>{args.text}</span>
                  {comment ? <span className={styles.commentIcon}>💬</span> : (
                    <button onClick={() => {
                      setShowForm(true)
                      setTipoForm('create')
                      setDateCalendar(args.date)
                    }}>+</button>
                  )}

                </div>
              )}
              eventContent={(eventInfo) => (
                <div className={styles.evento}>
                  <div className={styles.barraColor} style={{ backgroundColor: colorActual }}></div>
                  <div className={styles.container}>
                    <div className={styles.mainInfoProperties}>
                      <span>{eventInfo.timeText}</span>
                      <span style={{ backgroundColor: colorActual }}>{eventInfo.event.title}</span>
                    </div>
                    <div className={styles.buttonsProperties}>
                      <button onClick={() => { setTipo('view'); setInfoTurno(!mostarInfoTurno) }}>
                        <img src='/icons/seeMoreIcon.png' />
                      </button>
                      <button onClick={() => { setBotonActivo({ tipo: 'form', subtipo: 'form' }); setTipoForm('edit') }}>
                        <img src='/icons/editIcon.png' />
                      </button>
                      <button><img src='/icons/refreshIcon.png' onClick={() => { setShowOptions(showOptions === index ? null : index) }} /></button>
                    </div>
                  </div>
                  <div className={styles.barraColor} style={{ backgroundColor: colorActual }}></div>
                  {showOptions === index && (
                    <select onChange={(e) => {
                      setEstadosTurnos(prev => ({ ...prev, [index]: e.target.value }))
                      setShowOptions(null)
                    }}>
                      <option value="confirmado">{colorActual}</option>
                      <option value="confirmado">Confirmado</option>
                      <option value="solicitado">Solicitado</option>
                      <option value="descartado">Descartado</option>
                      <option value="sin avisar">Sin avisar</option>
                    </select>
                  )}
                </div>
              )}
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