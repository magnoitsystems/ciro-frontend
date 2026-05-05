import { useEffect, useState } from 'react';
import styles from './help.module.css';
import type { UserResponseDTO } from '../../../types/users.types';
import { userService } from '../../../services/user.service';
import { shiftService } from '../../../services/shift.service';
import type { ShiftResponseDTO } from '../../../types/clinical.types';

type Prop = {
    type: 'setting' | 'info' | 'label' | 'calendar';
    component: string;
    onShiftsFound?: (shifts: ShiftResponseDTO[]) => void;
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
                if (onShiftsFound) onShiftsFound(shifts) 
            })
            .catch(error => {
                console.error('Error fetching shifts:', error);
            });
        console.log(shiftService.getByDoctorId(doctor))
        console.log(shifts)
    }

    return (
        <>
            {type == 'setting' ? (
                <div className={styles.helpContainerProperties}>
                    <p>Aquellos {component === 'calendar' ? 'turnos' : 'tareas'} que tengan el icono <img src="./icons/plus.png"></img> indica que el {component === 'calendar' ? 'turno' : 'tarea'} no cuenta con notas al momento,
                        de lo contrario se mostrara <img src="./icons/seeMoreIcon.png"></img></p>

                    <p><img src="./icons/editIcon.png"></img> Para editar {component === 'calendar' ? 'el turno' : 'la tarea'}</p>

                    <p><img src="./icons/refreshIcon.png"></img> Para cambiar el estado {component === 'calendar' ? 'del turno' : 'de la tarea'}</p>
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
                        <button>Ver {component === 'calendar' ? 'turnos' : 'tareas'} de todos los doctores</button>
                    </div>
                </div>
            ) : type == 'label' ? (
                component === 'calendar' && (
                    <div className={styles.helpContainerProperties}>
                        <span><img src="./icons/confirmado.png" width="20px"></img> Significa que el turno está ASIGNADO</span>
                        <span><img src="./icons/descartado.png" width="20px"></img> Significa que el turno está REQUERIDO</span>
                    </div>
                )
            ) : null}
        </>
    )
}