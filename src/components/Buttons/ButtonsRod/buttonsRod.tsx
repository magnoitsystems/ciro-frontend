import { useState } from 'react';
import styles from './buttonsRod.module.css';

export default function ButtonsRod() {
    return (
        <div className={styles.buttonsContainerProperties}>
            <div className={styles.newAppointment}>
                <button>+</button>
            </div>
            <div className={styles.buttonsSectionProperties}>
                <button><img src='/icons/label.png'></img></button>
                <button><img src='/icons/calendar.png'></img></button>
                <button><img src='/icons/settings.png'></img></button>
                <button><img src='/icons/info.png'></img></button>
            </div>
        </div>
    )
}