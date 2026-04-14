import style from './CtaCorriente.module.css';

type Props = {
    type: 'Recibo' | 'Comprobante';
}

export default function Register({type}: Props) {
    return (
        <main className={style.register}>
            <div className={style[type]}>{type}</div>
            <h6>27/05/26</h6>
            <h6>345.666,00</h6>
            <h6>345.666,00</h6>
            <h6>144.322,89</h6>
            <h6>222.359,90</h6>
        </main>
    )
}