import style from './CajaRegister.module.css';

export default function CajaRegister() {
    return(
        <main className={style.main}>
            <h6 className={style.movimiento}>Entrada</h6>
            <h6>Transferencia</h6>
            <h6>Juan Perez Proveedor</h6>
            <h6>Si</h6>
            <h6>Dr. José Rivera</h6>
            <h6>Monto</h6>
            <h6>Moneda</h6>
            <div>
                <img src={'/icons/calculator.png'}/>
                <img src={'/icons/document.png'}/>
            </div>
        </main>
    )
}