import styles from './help.module.css';

export default function Help() {
    return (
        <div className={styles.helpContainerProperties}>
            <p>Aquellos turnos que tenganel icono <img src="./icons/plus.png"></img> indica que el turno no cuenta con notas al momento,
                de lo contrario se mostrara <img src="./icons/seeMoreIcon.png"></img></p>

            <p><img src="./icons/editIcon.png"></img> Para editar el turno</p>

            <p><img src="./icons/refreshIcon.png"></img> Para cambiar el estado del turno</p>

        </div>
    )
}