import style from './NewProvForm.module.css';

type Props = {
    placeholder: string;
    type: string;
    className: string;
}

export default function ProvInput({ placeholder, type, className }: Props) {
    return (
        <main className={style.holeInput}>
            <h6>{placeholder}</h6>
            <input placeholder={placeholder} type={type} className={style[className]}/>
        </main>
    )
}