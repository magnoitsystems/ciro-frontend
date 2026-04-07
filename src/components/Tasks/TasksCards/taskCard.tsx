import { useState } from 'react';
import styles from './taskCard.module.css'

//va a recibir las tareas

type BotonInfo = {
    tipo: string;
    subtipo?: string;
}

type Prop = {
    task: {
        cliente: string;
        fecha: Date;
        estado: string;
        prioridad: string;
    }
    onBotonClick: (boton: BotonInfo) => void
}

const coloresPrioridad: Record<string, string> = {
    alta: '#EB0C0C',
    media: '#FFFF00',
    baja: '#29C41B',
}

export default function TaskCard({ task, onBotonClick }: Prop) {
    const color = coloresPrioridad[task.prioridad.toLocaleLowerCase()] ?? '#FFFFFF'
    const [estado, setEstado] = useState('Pendiente'); 

    return (
        <div className={styles.cardContainerProperties}>
            <div className={styles.barraColor} style={{ backgroundColor: color }}></div>
            <div className={styles.containerProperties}>
                <div className={styles.infoContainerProperties}>
                    <h3>Pedir informacion al paciente {task.cliente}</h3>
                    <h3>{task.fecha.toLocaleDateString()}</h3>
                </div>
                <div className={styles.buttonsContainerProperties}>
                    <div className={styles.selectProperties}>
                        <select value={estado} onChange={(e) => setEstado(e.target.value)}>
                            <option value={''}>Seleccione un estado</option>
                            <option value="Pendiente">Pendiente</option>
                            <option value="En proceso">En proceso</option>
                            <option value="Finalizada">Finalizada</option>
                        </select>
                    </div>
                    <div className={styles.buttonsProperties}>
                        <button onClick={() => onBotonClick({ tipo: 'edit'})}><img src='./icons/editIcon.png' width={20} height={20}></img></button>
                        <button onClick={() => onBotonClick({tipo: 'show'})}><img src='./icons/plus.png' width={20} height={20}></img></button>
                        <button><img src='./icons/deudas.png'></img></button>
                    </div>
                </div>
            </div>
            <div className={styles.barraColor} style={{ backgroundColor: color }}></div>
        </div>
    );
}