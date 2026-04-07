import styles from './bungetInfo.module.css';

type Archivo = {
    nombre: string;
    estado: string;
}

type Prop = {
    archivo: Archivo;
}

export default function BudgetInfo({ archivo }: Prop) {
    const coloresEstado: Record<string, string> = {
        'enviado': '#29C41B',
        'pendiente': '#EB0C0C',
        'en proceso': '#FFFF00',
    }

    return (
        <div style={{ height: '100%' }}>
            <table className={styles.tableContainerPropeties}>
                <thead className={styles.tableHeaderProperties}>
                    <tr className={styles.tableTrProperties}>
                        <th>Archivo</th>
                        <th>Paciente destinatario</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody className={styles.tableBodyProperties}>
                    <tr className={styles.tableTrPropertiesTbody}>
                        <td>
                            <span style={{ backgroundColor: '#FFFEFB', height: '40px', display: 'flex', alignItems: 'center', padding: '10px', margin: '0px', width: '220px', borderTopLeftRadius: '10px', borderBottomLeftRadius: '10px' }}>
                                <a href={''} target='_blank' rel='noreferrer'>
                                    <img src='/icons/fileIcon.png' /> {archivo.nombre}</a>
                            </span>
                        </td>
                        <td>Juan Pérez</td>
                        <td><span className={styles.stateProperties} style={{ backgroundColor: coloresEstado[archivo.estado.toLowerCase()] ?? '#888', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px', margin: '0px', width: '180px', marginRight: '10px' }}>Enviado</span></td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}