import style from '../Buttons.module.css';

type Props = {
    content: string;
}

export default function PanelButton({content}: Props) {
    return(
        <button className={style.panelButton}>
            <h6>{content}</h6>
        </button>
    )
}