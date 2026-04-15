import style from './TaskSummery.module.css';

interface Props {
    title: string;
}

export default function TaskSummery({ title }: Props) {
    return(
        <main className={style.task}>
            <div className={style.state}>
                <h6>Pendiente</h6>
            </div>
            <h5>{title}</h5>
        </main>
    )
}