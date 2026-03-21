import style from './WelcomeText.module.css';

type Props = {
    sectionText: string;
    className:string;
}

export default function WelcomeText({sectionText, className}: Props) {
    return(
        <main className={style[className]}>
            <h6>Buen día, Ciro</h6>
            <h3>{sectionText}</h3>
        </main>
    )
}