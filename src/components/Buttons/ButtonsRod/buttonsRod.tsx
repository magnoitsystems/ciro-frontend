import { useState } from 'react';
import styles from './buttonsRod.module.css';

type BotonInfo = {
    tipo: string;
    subtipo?: string;
}

type Prop = {
    onBotonClick: (boton: BotonInfo) => void
}

export default function ButtonsRod({ onBotonClick }: Prop) {
    return (
        <div className={styles.buttonsContainerProperties}>
            <div className={styles.newAppointment}>
                <button>+</button>
            </div>
            <div className={styles.buttonsSectionProperties}>
                <button><img src='/icons/label.png'></img></button>
                <button><img src='/icons/calendar.png'></img></button>
                <button onClick={() => {onBotonClick({tipo: 'info', subtipo: 'setting'});}}><img src='/icons/settings.png'></img></button>
                <button><img src='/icons/info.png'></img></button>
            </div>
        </div>
    )
}