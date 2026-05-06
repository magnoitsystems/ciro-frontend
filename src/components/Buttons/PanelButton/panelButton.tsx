import { Link } from 'react-router-dom';
import style from '../Buttons.module.css';

type Props = {
    content: string;
    linkTo?: string;
}

export default function PanelButton({content, linkTo}: Props) {
    return(
        <Link className={style.panelButton} to={linkTo || '#'}>
            <h6>{content}</h6>
        </Link>
    )
}