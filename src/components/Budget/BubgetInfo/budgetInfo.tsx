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
        'ACEPTADO_PARCIALMENTE': '#29C41B',
        'ACEPTADO': '#29C41B',
        'RECHAZADO': '#EB0C0C',
        'SIN_ENVIAR': '#EB0C0C',
        'SIN_HACER': '#EB0C0C',
        'EN PROCESO': '#FFFF00',
        'PENDIENTE_DE_RESPUESTA': '#FFFF00',
    };

    const estado: Record<string, string> = {
        'ENVIADO': 'Enviado',
        'ACEPTADO_PARCIALMENTE': 'Aceptado parcialmente',
        'ACEPTADO': 'Aceptado',
        'RECHAZADO': 'Rechazado',
        'SIN_ENVIAR': 'Sin enviar',
        'SIN_HACER': 'Sin hacer',
        'EN PROCESO': 'En proceso',
        'PENDIENTE_DE_RESPUESTA': 'Pendiente',
    };

    return (
        <div style={{ height: '100%', width: '100%' }}>
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
                        <tr key={budget.id} className={styles.tableTrPropertiesTbody}>
                            <td>
                                <span style={{ backgroundColor: '#FFFEFB', height: '45px', display: 'flex', alignItems: 'center', padding: '10px', margin: '0px', width: '155px', borderTopLeftRadius: '5px', borderBottomLeftRadius: '5px', color: 'black', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    <a href={budget.fileUrl || '#'} target='_blank' rel='noreferrer' style={{textDecoration: 'none', color: 'inherit'}}>
                                        <img src='/icons/fileIcon.png' style={{marginRight: '5px'}} /> 
                                        {budget.title}
                                    </a>
                                </span>
                            </td>
                            <td>{budget.date}</td>
                            <td>{budget.patientFullName}</td>
                            <td><span className={styles.stateProperties} style={{ backgroundColor: coloresEstado[budget.status] ?? '#888', height: '25px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px', margin: '0px', width: '150px', marginRight: '10px' }}>{estado[budget.status] ?? budget.status}</span></td>
                            <td><button className={styles.buttonProperties} onClick={() => onDeletelick(budget.id)}><img src='/icons/trash.png'></img></button></td>
                            <td><button className={styles.buttonProperties} onClick={() => onEditBudget(budget.id)}><img src='/icons/editGrey.png'></img></button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}