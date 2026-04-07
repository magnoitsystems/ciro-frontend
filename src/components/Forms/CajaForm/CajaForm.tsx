import { useState } from "react";
import style from './CajaForm.module.css';
import ProvInput from "../NewProvForm/ProvInput.tsx";
import GreenFormButton from "../../Buttons/GreenFormButton/greenFormButton.tsx";

export function ReporteCaja() {

    const [tipo, setTipo] = useState("");
    const [rango, setRango] = useState("");

    const handleSubmit = () => {
        if (!tipo || !rango) {
            alert("Completá los campos");
            return;
        }

        console.log("Reporte caja:", { tipo, rango });
    };

    return (
        <div className={style.reportForm}>

            <ProvInput
                placeholder="Tipo de reporte"
                as="select"
                className="inputBoxDefault"
                value={tipo}
                onChange={(e) => {
                    setTipo(e.target.value);
                    setRango("");
                }}
                options={[
                    { value: "diario", label: "Diario" },
                    { value: "semanal", label: "Semanal" },
                    { value: "mensual", label: "Mensual" },
                    { value: "anual", label: "Anual" }
                ]}
            />

            {tipo === "diario" && (
                <ProvInput
                    placeholder="Seleccionar día"
                    type="date"
                    className="inputBoxDefault"
                    value={rango}
                    onChange={(e) => setRango(e.target.value)}
                />
            )}

            {tipo === "semanal" && (
                <ProvInput
                    placeholder="Seleccionar semana"
                    type="week"
                    className="inputBoxDefault"
                    value={rango}
                    onChange={(e) => setRango(e.target.value)}
                />
            )}

            {tipo === "mensual" && (
                <ProvInput
                    placeholder="Seleccionar mes"
                    type="month"
                    className="inputBoxDefault"
                    value={rango}
                    onChange={(e) => setRango(e.target.value)}
                />
            )}

            {tipo === "anual" && (
                <ProvInput
                    placeholder="Seleccionar año"
                    type="number"
                    className="inputBoxDefault"
                    value={rango}
                    onChange={(e) => setRango(e.target.value)}
                />
            )}

            <GreenFormButton
                text="Generar reporte"
                onClick={handleSubmit}
            />
        </div>
    );
}