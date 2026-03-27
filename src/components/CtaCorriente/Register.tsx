import style from './CtaCorriente.module.css';

export default function Register() {
    return (
        <main className={style.register}>
            <div className={style.referenceColor}>.</div>
            <h6>27/05/26</h6>
            <h6>Comprobante</h6>
            <h6>$</h6>
            <h6>345.666,00</h6>
            <h6>544.322,89</h6>
            <img src={'/icons/document.png'}/>
        </main>
    )
}