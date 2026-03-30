import style from './PacientCard.module.css'
import {NavLink} from "react-router-dom";

type Props = {
    nombre: string;
    dni: string;
}

export default function PacientCard({ nombre, dni }: Props) {
    return(
        <main className={style.main}>
            <div className={style.information}>
                <div className={style.profileImage}>
                    <h1>AB</h1>
                </div>

                <div>
                    <h5>{nombre}</h5>
                    <h6>D.N.I: {dni}</h6>
                </div>
            </div>

            <div className={style.attachments}>
                <NavLink to={'/cuentacorriente'}>
                    <img src={'/icons/cash.png'} alt={'cash image'}/>
                </NavLink>

                <img src={'/icons/trash.png'} alt={'trash image'}/>
                <img src={'/icons/editGrey.png'} alt={'editGrey image'}/>
                <img src={'/icons/eye.png'} alt={'eye image'}/>
            </div>
        </main>
    )
}