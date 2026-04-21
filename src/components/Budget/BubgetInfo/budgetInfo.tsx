import type { BudgetResponseDTO } from '../../../types/budgets.types';
import styles from './bungetInfo.module.css';

type Archivo = {
    nombre: string;
    estado: string;
}

type Prop = {
    budgets: BudgetResponseDTO[]
}

export default function BudgetInfo({ budgets }: Prop) {
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
                    </tr>
                </thead>
                <tbody className={styles.tableBodyProperties}>
                    {budgets.map(budget => (
                        <tr className={styles.tableTrPropertiesTbody}>
                        <td>
                            <span style={{ backgroundColor: '#FFFEFB', height: '40px', display: 'flex', alignItems: 'center', padding: '10px', margin: '0px', width: '150px', borderTopLeftRadius: '10px', borderBottomLeftRadius: '10px' }}>
                                <a href={''} target='_blank' rel='noreferrer'>
                                    <img src='/icons/fileIcon.png' /> {budget.fileUrl}</a>
                            </span>
                        </td>
                        <td>{budget.date}</td>
                        <td>{budget.patientFullName}</td>
                        <td><span className={styles.stateProperties} style={{ backgroundColor: coloresEstado[budget.status.toLowerCase()] ?? '#888', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px', margin: '0px', width: '150px', marginRight: '10px' }}>Enviado</span></td>
                    </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}