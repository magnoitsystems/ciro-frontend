import type { BudgetResponseDTO } from '../../../types/budgets.types';
import styles from './bungetInfo.module.css';

type Prop = {
    budgets: BudgetResponseDTO[]
    onDeletelick: (id: number) => void
    onEditBudget: (id: number) => void

}

export default function BudgetInfo({ budgets, onDeletelick, onEditBudget }: Prop) {
    const coloresEstado: Record<string, string> = {
        'ENVIADO': '#29C41B',
        'PENDIENTE': '#EB0C0C',
        'EN PROCESO': '#FFFF00',
    }

    return (
        <div style={{ height: '100%' }}>
            <table className={styles.tableContainerPropeties}>
                <thead className={styles.tableHeaderProperties}>
                    <tr className={styles.tableTrProperties}>
                        <th>Archivo</th>
                        <th>Fecha de carga</th>
                        <th>Paciente destinatario</th>
                        <th>Estado</th>
                        <th>Eliminar</th>
                        <th>Modificar</th>
                    </tr>
                </thead>
                <tbody className={styles.tableBodyProperties}>
                    {budgets.map(budget => (
                        <tr className={styles.tableTrPropertiesTbody}>
                            <td>
                                <span style={{ backgroundColor: '#FFFEFB', height: '30px', display: 'flex', alignItems: 'center', padding: '10px', margin: '0px', width: '150px', borderTopLeftRadius: '10px', borderBottomLeftRadius: '10px', color: 'black' }}>
                                    <a href={''} target='_blank' rel='noreferrer'>
                                        <img src='/icons/fileIcon.png' /> {budget.title}</a>
                                </span>
                            </td>
                            <td>{budget.date}</td>
                            <td>{budget.patientFullName}</td>
                            <td><span className={styles.stateProperties} style={{ backgroundColor: coloresEstado[budget.status] ?? '#888', height: '25px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px', margin: '0px', width: '150px', marginRight: '10px' }}>Enviado</span></td>
                            <td><button className={styles.buttonProperties} onClick={() => onDeletelick(budget.id)}><img src='/icons/trash.png'></img></button></td>
                            <td><button className={styles.buttonProperties} onClick={() => onEditBudget(budget.id)}><img src='/icons/editGrey.png'></img></button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}