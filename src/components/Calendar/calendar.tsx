import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import styles from './Calendar.module.css'
import WelcomeText from '../WelcomeText/welcomeText'
import { useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import CreateAppointment from './CreateAppointment/createAppointment'
import Help from './Help/help'
import Appointment from './Appointment/appointment'

export default function CalendarioMedico() {
  const [mostrarMiniCalendario, setMostrarMiniCalendario] = useState(false);

  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date | null>(new Date());

  const [showForm, setShowForm] = useState(false);

  const [iconoSeleccionado, setIconoSeleccionado] = useState<'info' | 'setting'>('info')

  const [mostrarInformacionDeAyuda, setMostrarInformacionDeAyuda] = useState(false);

  const [tipo, setTipo] = useState<'view' | 'confirm'>('view')

  const [tipoForm, setTipoForm] = useState<'create' | 'edit'>('create')

  const [mostarInfoTurno, setInfoTurno] = useState(false);

  const turnos = [
    { title: 'Dro. Juan Pérez', start: '2026-03-20T09:00:00' },
    { title: 'Dro. Ana García', start: '2026-03-20T10:00:00' },
    { title: 'Dro. Ana García', start: '2026-03-19T08:00:00' },
  ]

  return (
    <div className={styles.calendarProperties}>
      {mostrarMiniCalendario && (
        <div className={styles.miniCalendarProperties}>
          <DatePicker
            selected={fechaSeleccionada}
            onChange={(fecha: Date | null) => {
              if (fecha) {
                setFechaSeleccionada(fecha)
                setMostrarMiniCalendario(false)
              }
            }}
            inline
          />
        </div>
      )}
      {mostrarInformacionDeAyuda && (
        <div className={styles.miniCalendarProperties}>
          <Help type={iconoSeleccionado}></Help>
        </div>
      )}

      {showForm && (
        <div>
          <CreateAppointment turnos={turnos[1]} type={tipoForm} name='Ana' onClose={() => setShowForm(false)}></CreateAppointment>
        </div>
      )}

      {mostarInfoTurno && (
        <div>
          <Appointment onClose={() => setInfoTurno(false)} type={tipo}></Appointment>
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
              events={turnos}
              contentHeight={600}
              expandRows={true}
              slotMinTime="06:00:00"
              slotMaxTime="20:00:00"
              slotDuration="00:30:00"
              eventContent={(eventInfo) => (
                <div className={styles.evento}>
                  <div className={styles.mainInfoProperties}>
                    <span>{eventInfo.timeText}</span>
                    <span>{eventInfo.event.title}</span>
                  </div>
                  <div className={styles.buttonsProperties}>
                    <button onClick={() => {
                      setTipo('view')
                      setInfoTurno(!mostarInfoTurno)
                    }}><img src='/icons/seeMoreIcon.png'></img></button>
                    <button onClick={() => {setShowForm(!showForm)
                      setTipoForm('edit')
                    }}><img src='/icons/editIcon.png'></img></button>
                    <button><img src='/icons/refreshIcon.png'></img></button>
                  </div>
                </div>
              )}
            />
          </div>
          <div className={styles.buttonsContainerProperties}>
            <div className={styles.newAppointment}>
              <button onClick={() => {setShowForm(!showForm)
                setTipoForm('create')
              }}>+</button>
            </div>
            <div className={styles.buttonsSectionProperties}>
              <button><img src='/icons/label.png'></img></button>
              <button onClick={() => setMostrarMiniCalendario(!mostrarMiniCalendario)}><img src='/icons/calendar.png'></img></button>
              <button onClick={() => {
                setIconoSeleccionado('info')
                setMostrarInformacionDeAyuda(!mostrarInformacionDeAyuda)
              }}><img src='/icons/settings.png'></img></button>
              <button onClick={() => {
                setMostrarInformacionDeAyuda(!mostrarInformacionDeAyuda)
                setIconoSeleccionado('setting')
              }}><img src='/icons/info.png'></img></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}