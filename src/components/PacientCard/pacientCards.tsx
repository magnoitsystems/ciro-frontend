import style from './PacientCard.module.css'
import {NavLink} from "react-router-dom";

type Props = {
    id: number;
    nombre: string;
    dni: string;
    onDelete: () => void;
    onView: () => void;
    onEdit: () => void;
    attachments: boolean;
}

export default function PacientCard({ id, nombre, dni, onDelete, onView, onEdit, attachments }: Props) {
    const getInitials = (nombreCompleto: string) => {
        const partes = nombreCompleto.trim().split(" ");
        if (partes.length === 1) return partes[0][0].toUpperCase();
        const primera = partes[0][0];
        const ultima = partes[partes.length - 1][0];
        return (primera + ultima).toUpperCase();
    };

    return(
        <main className={style.main}>
            <div className={style.information}>
                <div className={style.profileImage}>
                    <h1>{getInitials(nombre)}</h1>
                </div>
                <div>
                    <h5>{nombre}</h5>
                    <h6>D.N.I: {dni}</h6>
                </div>
            </div>

            {attachments && (
                <div className={style.attachments}>
                    <NavLink to={`/cuentacorriente/${id}`}>
                        <img src={'/icons/cash.png'} alt={'cash image'}/>
                    </NavLink>

                    <img src={'/icons/trash.png'} alt={'trash image'} onClick={(e) => { e.stopPropagation(); onDelete(); }} />
                    <img src={'/icons/editGrey.png'} alt={'editGrey image'} onClick={(e) => { e.stopPropagation(); onEdit(); }} />
                    <img src={'/icons/eye.png'} alt={'eye image'} onClick={(e) => { e.stopPropagation(); onView(); }} />
                </div>
            )}
        </main>
    )
}