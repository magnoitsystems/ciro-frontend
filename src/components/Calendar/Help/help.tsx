import styles from './help.module.css';

type Prop = {
    type: 'setting' | 'info';
}

export default function Help({ type }: Prop) {
    return (
        type == 'setting' ? (
            <div className={styles.helpContainerProperties}>
                <p>Aquellos turnos que tenganel icono <img src="./icons/plus.png"></img> indica que el turno no cuenta con notas al momento,
                    de lo contrario se mostrara <img src="./icons/seeMoreIcon.png"></img></p>

                <p><img src="./icons/editIcon.png"></img> Para editar el turno</p>

                <p><img src="./icons/refreshIcon.png"></img> Para cambiar el estado del turno</p>
            </div>
        ) : (
            <div className={styles.helpContainerProperties}>
                <form className={styles.formContainerProperties}>
                    <div className={styles.inputAndLabelProperties}>
                        <label>Ver turnos de</label>
                        <select>
                        //recorrer todos los especialistas que haya
                            <option>Seleccione un especialista</option>
                        </select>
                    </div>
                    <button><img src='./icons/search.png'></img></button>
                </form>
                <div className={styles.buttonProperties}>
                    <button>Ver turnos de todos los doctores</button>
                </div>
            </div>
        )
    )
}