import { useEffect, useState } from 'react';
import styles from './help.module.css';
import type { UserResponseDTO } from '../../../types/users.types';
import { userService } from '../../../services/user.service';
import { shiftService } from '../../../services/shift.service';
import type { ShiftResponseDTO } from '../../../types/clinical.types';

type Prop = {
    type: 'setting' | 'info' | 'label' | 'calendar';
    component: string;
    onShiftsFound?: (shifts: ShiftResponseDTO[], doctor: number) => void;
}

export default function Help({ type, component, onShiftsFound }: Prop) {
    const [doctors, setDoctors] = useState<UserResponseDTO[]>([]);
    const [doctor, setDoctor] = useState(-1);
    const [shifts, setShifts] = useState<ShiftResponseDTO[]>([]);

    // Fetch doctors 
    useEffect(() => {
        userService.getAllUsers()
            .then(users => {
                setDoctors(users)
            })
            .catch(error => {
                console.error('Error fetching users:', error);
            });
    }, []);

    // Fetch shifts for selected doctor
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!doctor || doctor === -1) {
            console.error('No doctor selected');
            return;
        }
        console.log(doctor)
        shiftService.getByDoctorId(doctor)
            .then(shifts => {
                console.log('Shifts recibidos:', shifts)
                console.log('Cantidad:', shifts.length)
                setShifts(shifts)
                if (onShiftsFound) onShiftsFound(shifts, doctor)
            })
            .catch(error => {
                console.error('Error fetching shifts:', error);
            });
        console.log(shiftService.getByDoctorId(doctor))
        console.log(shifts)
    }

    const handleViewAllShifts = () => {
        shiftService.getAll()
            .then(shifts => {
                setShifts(shifts);
                if (onShiftsFound) onShiftsFound(shifts, -1);
            })
            .catch(error => {
                console.error('Error fetching all shifts:', error);
            });
    }

    return (
        <>
            {type == 'setting' ? (
                <div className={styles.helpContainerProperties}>
                    <p>{component === 'calendar' ? 'Aquellos turnos que tengan el icono' : 'El icono'} <img src="./icons/plus.png"></img>  {component === 'calendar' ? 'indica que el turno no cuenta con notas al momento' : 'se utilizará para poder ver la información adicional que posea la tareas'} ,
                        {component === 'calendar' && 'de lo contrario se mostrara'} {component === 'calendar' && <img src="./icons/seeMoreIcon.png"></img>}</p>
                    
                    {component === 'task' && (
                        <p><img src="./icons/deudas.png"></img> Para marcar como prioritaria una tarea</p>
                    )}

                    <p><img src="./icons/editIcon.png"></img> Para editar {component === 'calendar' ? 'el turno' : 'la tarea'}</p>
                    {component === 'calendar' && (
                        <p><img src="./icons/refreshIcon.png"></img> Para cambiar el estado del turno</p>
                    )}

                </div>
            ) : type == 'info' ? (
                <div className={styles.helpContainerProperties}>
                    <form onSubmit={handleSubmit} className={styles.formContainerProperties}>
                        <div className={styles.inputAndLabelProperties}>
                            <label>Ver {component === 'calendar' ? 'turnos' : 'tareas'} de</label>
                            <select value={doctor} onChange={(e) => setDoctor(parseInt(e.target.value))}>
                                <option value="">Seleccionar doctor</option>
                                {doctors.map(doctor => (
                                    <option key={doctor.id} value={doctor.id}>
                                        {doctor.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button><img src='./icons/search.png'></img></button>
                    </form>
                    <div className={styles.buttonProperties}>
                        <button onClick={handleViewAllShifts}>Ver {component === 'calendar' ? 'turnos' : 'tareas'} de todos los doctores</button>
                    </div>
                </div>
            ) : type == 'label' ? (
                component === 'calendar' ? (
                    <div className={styles.helpContainerProperties}>
                        <span><img src="./icons/confirmado.png" width="20px"></img> Significa que el turno está ASIGNADO</span>
                        <span><img src="./icons/descartado.png" width="20px"></img> Significa que el turno está REQUERIDO</span>
                    </div>
                ) : (
                    component === 'task' && (
                        <div className={styles.helpContainerProperties}>
                            <span><img src="./icons/confirmado.png" width="20px"></img> Significa que la tarea tiene prioridad BAJA</span>
                            <span><img src="./icons/sinAvisar.png" width="20px"></img> Significa que la tarea tiene prioridad MEDIA</span>
                            <span><img src="./icons/descartado.png" width="20px"></img> Significa que la tarea tiene prioridad ALTA</span>
                        </div>
                    )
                )
            ) : null}
        </>
    )
}