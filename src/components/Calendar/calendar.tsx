/* eslint-disable @typescript-eslint/no-explicit-any */
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

export default function CalendarioMedico() {

  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date | null>(new Date());
  const [tipo, setTipo] = useState<'view' | 'confirm'>('view');
  const [tipoForm, setTipoForm] = useState<'create' | 'edit'>('create');
  
  const [mostarInfoTurno, setInfoTurno] = useState(false);
  const [turnoSeleccionado, setTurnoSeleccionado] = useState<ShiftResponseDTO | null>(null); 

  const [showForm, setShowForm] = useState(false);
  const [turnos, setTurnos] = useState<ShiftResponseDTO[]>([]);
  const [turnoConfirmado, setTurnoConfirmado] = useState<ShiftResponseDTO | null>(null);
  
  const [dateCalendar, setDateCalendar] = useState<Date>(new Date());

  const fetchTurnos = () => {
    shiftService.getAll()
      .then(fetchedTurnos => setTurnos(fetchedTurnos))
      .catch(error => console.error('Error fetching turnos:', error));
  }

  useEffect(() => {
    fetchTurnos();
  }, [])

  const coloresEstados: Record<string, string> = {
    'REQUIRED': '#FF2600',   // Rojo
    'ASSIGNED': '#77FF00',   // Verde
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

      {tipo === 'view' && mostarInfoTurno && turnoSeleccionado && (
        <Appointment 
          component='calendar' 
          turnos={[turnoSeleccionado]} 
          type='view' 
          onClose={() => { setInfoTurno(false); setTurnoSeleccionado(null); }} 
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
              dayHeaderContent={(args) => (
                <div className={styles.diaHeader}>
                  <span>{args.text}</span>
                  <button onClick={() => {
                    setShowForm(true)
                    setTipoForm('create')
                    setDateCalendar(args.date)
                  }}>+</button>
                </div>
              )}
              eventContent={(eventInfo) => {
                const eventId = Number(eventInfo.event.id);
                const barColor = eventInfo.event.extendedProps.barColor; 
                
                return (
                  <div className={styles.evento}>
                    <div className={styles.barraColor} style={{ backgroundColor: barColor }}></div>
                    <div className={styles.container}>
                      <div className={styles.mainInfoProperties}>
                        <span>{eventInfo.timeText}</span>
                        <span style={{ backgroundColor: barColor }}>{eventInfo.event.title}</span>
                      </div>
                      <div className={styles.buttonsProperties}>
                        <button onClick={() => { 
                            setTipo('view'); 
                            setTurnoSeleccionado(eventInfo.event.extendedProps.turnoCompleto);
                            setInfoTurno(true); 
                        }}>
                          <img src='/icons/seeMoreIcon.png' />
                        </button>
                        <button onClick={() => { setBotonActivo({ tipo: 'form', subtipo: 'form' }); setTipoForm('edit') }}>
                          <img src='/icons/editIcon.png' />
                        </button>
                        <button><img src='/icons/refreshIcon.png' onClick={() => { setShowOptions(showOptions === eventId ? null : eventId) }} /></button>
                      </div>
                    </div>
                    <div className={styles.barraColor} style={{ backgroundColor: barColor }}></div>
                    
                    {showOptions === eventId && (
                      <select style={{position: 'absolute', zIndex: 10}}>
                        <option value="confirmado">Confirmado</option>
                        <option value="solicitado">Solicitado</option>
                        <option value="descartado">Descartado</option>
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