import style from '../Buttons.module.css';

type Props = {
    text: string;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function GreenFormButton({ text, onClick }: Props) {
    return(
        <button
            className={style.greenFormButton}
            onClick={onClick}
            type="button"
        >
            <h6>{text}</h6>
        </button>
    )
}