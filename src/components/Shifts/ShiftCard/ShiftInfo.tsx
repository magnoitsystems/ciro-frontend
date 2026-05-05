import type { ShiftResponseDTO } from '../../../types/clinical.types'
import styles from './shiftInfo.module.css'
type Prop = {
    shifts: ShiftResponseDTO[]
    onDeletelick: (id: number) => void
}
export default function ShiftInfo({ shifts, onDeletelick }: Prop) {
     return (
        <div style={{ height: '100vh', width: '80%' }}>
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
                            <td><span style={{ backgroundColor: '#FFFEFB', height: '45px', display: 'flex', alignItems: 'center', padding: '10px', margin: '0px', width: '155px', borderTopLeftRadius: '5px', borderBottomLeftRadius: '5px', color: 'black', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{shift.doctorFullName}</span></td>
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