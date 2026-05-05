import { shiftService } from '../../services/shift.service'
import type { ShiftResponseDTO } from '../../types/clinical.types'
import type { UserResponseDTO } from '../../types/users.types'
import styles from './shift.module.css'
import ShiftInfo from './ShiftCard/ShiftInfo'
import { useNavigate } from 'react-router-dom'

type Prop = {
    shifts: ShiftResponseDTO[]
    doctors: UserResponseDTO[]
    doctor: number
}

export default function Shift({ shifts, doctors, doctor }: Prop) {
    const navigate = useNavigate();
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
    return (
        <div className={styles.shiftContainer}>
             <h3>Turnos del doctor: {doctors.find(d => d.id === doctor)?.name}</h3>
            <ShiftInfo shifts={shifts} onDeletelick={deleteShift} />
        </div>
    )
}