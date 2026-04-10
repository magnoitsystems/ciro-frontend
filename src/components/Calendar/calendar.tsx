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
import ButtonsRod from '../Buttons/ButtonsRod/buttonsRod'
import type { ButtonInfo } from '../../types/buttonInfo'

export default function CalendarioMedico() {

  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date | null>(new Date());

  const [tipo, setTipo] = useState<'view' | 'confirm'>('view')

  const [tipoForm, setTipoForm] = useState<'create' | 'edit'>('create')

  const [mostarInfoTurno, setInfoTurno] = useState(false);

  const coloresEstados: Record<string, string> = {
    'confirmado': '#77FF00',
    'solicitado': '#FF00C8',
    'descartado': '#FF2600',
    'sin avisar': '#FFFF00',
  }

  const turnos = [
    { title: 'Dro. Juan Pérez', start: '2026-03-20T09:00:00', estado: "solicitado", comment: 'hola, este es un comentario' },
    { title: 'Dro. Ana García', start: '2026-03-20T10:00:00', estado: "solicitado", comment: 'hola, este es otro comentario' },
  ]

  const [estadosTurnos, setEstadosTurnos] = useState<Record<number, string>>({
    0: 'solicitado',
    1: 'solicitado',
  })

  const [botonActivo, setBotonActivo] = useState<ButtonInfo | null>(null)
  const [showOptions, setShowOptions] = useState<number | null>(null)

  const index = turnos.findIndex(t => t.title === turnos[0].title)
  const estadoActual = estadosTurnos[index] ?? 'solicitado'
  const colorActual = coloresEstados[estadoActual] ?? '#FFFFFF'

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
          <CreateAppointment turnos={turnos[1]} type={tipoForm} component='calendar' name='Ana' onClose={() => {
            setBotonActivo(null)
            setTipoForm('create')
          }}></CreateAppointment>
        </div>
      )}

      {tipo === 'view' && mostarInfoTurno && (
        <div>
          <Appointment component='calendar' turnos={turnos[1]} type='view' onClose={() => setInfoTurno(false)}></Appointment>
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