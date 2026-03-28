import styles from './taskCard.module.css'

//va a recibir las tareas

export default function TaskCard() {
    return (
        <div className={styles.cardContainerProperties}>
            <div className={styles.infoContainerProperties}>
                <h3>Pedir informacion al paciente Milagros Alvarez</h3>
                <h3>27/03/26</h3>
            </div>
            <div className={styles.buttonsContainerProperties}>
                <div className={styles.selectProperties}>
                    <select>
                        <option>Pendientes</option>
                    </select>
                </div>
                <div className={styles.buttonsProperties}>
                    <button><img src='./icons/editIcon.png' width={20} height={20}></img></button>
                    <button><img src='./icons/plus.png' width={20} height={20}></img></button>
                    <button><img src='./icons/deudas.png'></img></button>
                </div>
            </div>
        </div>
    );
}