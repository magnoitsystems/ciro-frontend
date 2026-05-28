import {useEffect, useState } from 'react'
import type { ShiftResponseDTO } from '../../../types/clinical.types'
import styles from './ShiftInfo.module.css'
import type { UserResponseDTO } from '../../../types/users.types'
import { userService } from '../../../services/user.service'

type Prop = {
    shifts: ShiftResponseDTO[]
    onDeletelick: (id: number) => void
    onClose: () => void
}

export default function ShiftInfo({ shifts, onDeletelick, onClose }: Prop) {
    const [user, setUser] = useState<UserResponseDTO | null>(null);

    useEffect(() => {
        userService.getAllUsers()
            .then(users => {
                const doctorInfo = users.find(user => user.id === shifts[0].doctorId);
                if (doctorInfo) {
                    setUser(doctorInfo);
                }
            })
            .catch(error => {
                console.error('Error al obtener los usuarios:', error);
            });
    }, [shifts]);
    return (
        <div style={{ height: '100vh', width: '90%' }}>
            <button className={styles.closeButton} onClick={() => onClose()}>
                X
            </button>
            <table className={styles.tableContainerPropeties}>
                <thead className={styles.tableHeaderProperties}>
                    <tr className={styles.tableTrProperties}>
                        <th>Especialista</th>
                        <th>Fecha</th>
                        <th>Paciente</th>
                        <th>Descripción</th>
                        <th>Eliminar</th>
                    </tr>
                </thead>
                <tbody className={styles.tableBodyProperties}>
                    {shifts.map(shift => (
                        <tr key={shift.id} className={styles.tableTrPropertiesTbody}>
                            <td><span style={{ backgroundColor: user?.color, height: '45px', display: 'flex', alignItems: 'center', padding: '10px', margin: '0px', width: '155px', borderTopLeftRadius: '5px', borderBottomLeftRadius: '5px', color: 'black', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{shift.doctorFullName}</span></td>
                            <td>{shift.shiftDate.slice(0, 10)}</td>
                            <td>{shift.patientFullName}</td>
                            <td><span className={styles.stateProperties}>{shift.noteDescription}</span></td>
                            <td><button className={styles.buttonProperties} onClick={() => onDeletelick(shift.id)}><img src='/icons/trash.png'></img></button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}