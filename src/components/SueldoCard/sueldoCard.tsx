import { useState } from "react";
import style from './SueldoCard.module.css'

export default function SueldoCard() {
    const [selected, setSelected] = useState(false);
    const [estado, setEstado] = useState("pago");

    return (
        <main
            className={`${style.sueldo} ${selected ? style.active : ""}`}
            onClick={() => setSelected(!selected)}
        >
            <div>Agostina Bidegain</div>
            <h6>27/05/26</h6>
            <h6>Transferencia</h6>
            <h6>1.500.000</h6>
            <h6>$</h6>
            <h6>Milagros Alvarez</h6>

            <select
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                className={`${style.select} ${
                    estado === "pago" ? style.pago : style.nopago
                }`}
            >
                <option value="pago">Pago</option>
                <option value="nopago">No pago</option>
            </select>

            {/* Botón eliminar */}
            {selected && (
                <button
                    className={style.delete}
                    onClick={(e) => {
                        e.stopPropagation();
                        console.log("Eliminar sueldo");
                    }}
                >
                    Eliminar
                </button>
            )}
        </main>
    )
}