import style from '../Buttons.module.css';

type Props = {
    content: string;
    linkTo?: string;
}

export default function PanelButton({content, linkTo}: Props) {
    return(
        <a className={style.panelButton} href={linkTo}>
            <h6>{content}</h6>
        </a>
    )
}