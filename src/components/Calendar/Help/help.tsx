import styles from './help.module.css';

type Prop = {
    type: 'setting' | 'info';
    component: string;
}

export default function Help({ type, component }: Prop) {
    return (
        type == 'setting' ? (
            <div className={styles.helpContainerProperties}>
                <p>Aquellos {component === 'calendar' ? 'turnos' : 'tareas'} que tengan el icono <img src="./icons/plus.png"></img> indica que el {component === 'calendar' ? 'turno' : 'tarea'} no cuenta con notas al momento,
                    de lo contrario se mostrara <img src="./icons/seeMoreIcon.png"></img></p>

                <p><img src="./icons/editIcon.png"></img> Para editar {component === 'calendar' ? 'el turno' : 'la tarea'}</p>

                <p><img src="./icons/refreshIcon.png"></img> Para cambiar el estado {component === 'calendar' ? 'del turno' : 'de la tarea'}</p>
            </div>
        ) : type == 'info' ? (
            <div className={styles.helpContainerProperties}>
                <form className={styles.formContainerProperties}>
                    <div className={styles.inputAndLabelProperties}>
                        <label>Ver {component === 'calendar' ? 'turnos' : 'tareas'} de</label>
                        <select>
                            //recorrer todos los especialistas que haya
                            <option>Seleccione un especialista</option>
                        </select>
                    </div>
                    <button><img src='./icons/search.png'></img></button>
                </form>
                <div className={styles.buttonProperties}>
                    <button>Ver {component === 'calendar' ? 'turnos' : 'tareas'} de todos los doctores</button>
                </div>
            </div>
        ) : null
    )
}