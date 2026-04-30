import style from "./deleteConfirmCard.module.css"

type Prop = {
    component: string
    onClose: () => void
    onAcceptButtonClick: () => void
    loading?: boolean
}
export default function DeleteConfirmCard({ component, onClose, onAcceptButtonClick, loading }: Prop) {
    return (
        <div className={style.firstContainerProperties}>
            <div className={style.deleteConfirmCardContainerProperties}>
                <div>
                    <h3>Seguro/a de que desea eliminar {component}. No se podrá reevertir la acción</h3>
                </div>
                <div className={style.buttonsContainerProperties}>
                    <button onClick={() => onAcceptButtonClick()} className={style.acceptButtonProperties} disabled={loading}>
                        {loading ? 'Eliminando...' : 'Aceptar'}
                    </button>
                    <button onClick={() => onClose()} className={style.cancelButtonProperties}>Cancelar</button>
                </div>
            </div>
        </div>
    )
}