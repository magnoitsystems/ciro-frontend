import style from './WelcomeText.module.css';
import { authService } from '../../services/auth.service'; 

type Props = {
    sectionText: string;
    className: string;
}

export default function WelcomeText({sectionText, className}: Props) {
    const userName = authService.getUserName();

    return(
        <main className={style[className]}>
            <h6>Buen día, {userName}</h6>
            <h3>{sectionText}</h3>
        </main>
    )
}