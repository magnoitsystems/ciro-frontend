import style from './PacientCard.module.css'
import {NavLink} from "react-router-dom";

type Props = {
    id: number;
    nombre: string;
    dni: string;
    onView: () => void;
    onEdit: () => void;
    attachments: boolean;
}

export default function PacientCard({ id, nombre, dni, onView, onEdit, attachments }: Props) {
    
    const getInitials = (nombreCompleto?: string) => {
        if (!nombreCompleto || typeof nombreCompleto !== 'string') return "??";
        const partes = nombreCompleto.trim().split(" ").filter(Boolean); 
        if (partes.length === 0) return "??";
        if (partes.length === 1) return partes[0][0].toUpperCase();
        
        const primera = partes[0][0];
        const ultima = partes[partes.length - 1][0];
        return (primera + ultima).toUpperCase();
    };

    const displayName = nombre || "Paciente sin nombre";
    const displayDni = dni || "Sin DNI";

    return(
        <main className={style.main}>
            <div className={style.information}>
                <div className={style.profileImage}>
                    <h1>{getInitials(nombre)}</h1>
                </div>
                <div>
                    <h5>{displayName}</h5>
                    <h6>D.N.I: {displayDni}</h6>
                </div>
            </div>

            {attachments && (
                <div className={style.attachments}>
                    <NavLink to={`/cuentacorriente/${id}`}>
                        <img src={'/icons/cash.png'} alt={'cash image'}/>
                    </NavLink>

                    <img src={'/icons/editGrey.png'} alt={'editGrey image'} onClick={(e) => { e.stopPropagation(); onEdit(); }} />
                    <img src={'/icons/eye.png'} alt={'eye image'} onClick={(e) => { e.stopPropagation(); onView(); }} />
                </div>
            )}
        </main>
    )
}