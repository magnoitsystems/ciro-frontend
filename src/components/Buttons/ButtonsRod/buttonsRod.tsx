import styles from './buttonsRod.module.css';
import type { ButtonInfo } from '../../../types/buttonInfo'

type Prop = {
    onBotonClick: (boton: ButtonInfo | null) => void
}

export default function ButtonsRod({ onBotonClick, botonActivo }: Prop & { botonActivo: ButtonInfo | null }) {
    const toggle = (boton: ButtonInfo) => {
        if (botonActivo?.tipo === boton.tipo && botonActivo?.subtipo === boton.subtipo) {
            onBotonClick(null) // cierra si ya está activo
        } else {
            onBotonClick(boton) // abre si no está activo
        }
    }
    return (
        <div className={styles.buttonsContainerProperties}>
            <div className={styles.newAppointment}>
                <button onClick={() => {toggle({tipo: 'form', subtipo: 'form'});}}>+</button>
            </div>
            <div className={styles.buttonsSectionProperties}>
                <button onClick={() => {toggle({tipo: 'label', subtipo: 'label'});}}><img src='/icons/label.png'></img></button>
                <button onClick={() => {toggle({tipo: 'calendar', subtipo: 'calendar'});}}><img src='/icons/calendar.png'></img></button>
                <button onClick={() => {toggle({tipo: 'info', subtipo: 'setting'});}}><img src='/icons/settings.png'></img></button>
                <button onClick={() => {toggle({tipo: 'info', subtipo: 'info'});}}><img src='/icons/info.png'></img></button>
            </div>
        </div>
    )
}