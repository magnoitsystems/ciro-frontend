import style from '../Buttons.module.css';

type Props = {
    text: string;
    onClick?: () => void;
    type?: "button" | "submit";
    variant: "primary" | "secondary";
}

export default function LightGreyButton({ text, onClick, type = "button", variant }: Props) {
    return (
        <button
            className={`${style.lightGreyButton} ${style[variant]}`}
            onClick={onClick}
            type={type}
        >
            <h6>{text}</h6>
        </button>
    )
}