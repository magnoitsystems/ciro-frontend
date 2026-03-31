import style from './SearchBar.module.css';

type Props = {
    text: string;
    value: string;
    onChange: (value: string) => void;
}

export default function SearchBar({ text, value, onChange }: Props) {
    return (
        <div className={style.main}>
            <input
                type="text"
                placeholder={text}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={style.input}
            />
            <img src={'/icons/search.png'} />
        </div>
    )
}