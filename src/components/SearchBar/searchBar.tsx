import style from './SearchBar.module.css';

type Props = {
    text: string;
}

export default function SearchBar({text}: Props) {
    return (
        <main className={style.main}>
            <h6>{text}</h6>
            <img src={'/icons/search.png'}/>
        </main>
    )
}