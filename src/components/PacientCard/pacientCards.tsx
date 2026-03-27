import style from './PacientCard.module.css'
import {NavLink} from "react-router-dom";

export default function PacientCard() {
    return(
        <main className={style.main}>
            <div className={style.information}>
                <div className={style.profileImage}>
                    <h1>AB</h1>
                </div>

                <div>
                    <h5>Agostina Bidegain</h5>
                    <h6>D.N:I: 46185819</h6>
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