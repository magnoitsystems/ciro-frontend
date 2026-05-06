import { useEffect, useState } from 'react'
import { shiftService } from '../../services/shift.service'
import type { ShiftResponseDTO } from '../../types/clinical.types'
import type { UserResponseDTO } from '../../types/users.types'
import styles from './shift.module.css'
import ShiftInfo from './ShiftCard/ShiftInfo'
import { useNavigate } from 'react-router-dom'
import { userService } from '../../services/user.service'

type Prop = {
    shifts: ShiftResponseDTO[]
    doctors: UserResponseDTO[]
    doctor: number
}

export default function Shift({ shifts, doctors, doctor }: Prop) {
    const navigate = useNavigate();
    const [doctorShift, setDoctorShift] = useState<UserResponseDTO | null>(null);
    const deleteShift = (id: number) => {
        shiftService.delete(id)
            .then(() => {
                console.log(`Turno con id ${id} eliminado exitosamente`);
                navigate('/shifts'); 
            })
            .catch(error => {
                console.error(`Error al eliminar el turno con id ${id}:`, error);
            });
    }

    useEffect(() => {
        userService.getAllUsers()
            .then(users => {
                const doctorInfo = users.find(user => user.id === doctor);
                if (doctorInfo) {
                    setDoctorShift(doctorInfo);
                }
            })
            .catch(error => {
                console.error('Error al obtener los usuarios:', error);
            });
    }, [shifts])
    return (
        <div className={styles.shiftContainer}>
             <h3>Turnos del/la especialista: {doctorShift?.name}</h3>
            <ShiftInfo shifts={shifts} onDeletelick={deleteShift} />
        </div>
    )
}