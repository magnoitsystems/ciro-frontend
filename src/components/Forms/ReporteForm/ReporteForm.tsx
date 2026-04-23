import { useState, useEffect } from "react";
import ProvInput from "../NewProvForm/ProvInput.tsx";
import GreenFormButton from "../../Buttons/GreenFormButton/greenFormButton.tsx";

interface ReporteFormProps {
    onGenerate: (period: string, date?: string) => void;
}

export default function ReporteForm({ onGenerate }: ReporteFormProps) {

    const [tipo, setTipo] = useState("");
    const [rango, setRango] = useState("");
    const [mensajeError, setMensajeError] = useState("");

    useEffect(() => {
        if (mensajeError) {
            const timer = setTimeout(() => setMensajeError(""), 3000);
            return () => clearTimeout(timer);
        }
    }, [mensajeError]);

    const handleSubmit = () => {
        if (!tipo || !rango) {
            setMensajeError("Por favor, completá todos los campos para generar el reporte.");
            return;
        }

        setMensajeError(""); 
        onGenerate(tipo, rango);
    };

    return(
        <div style={{display: "flex", flexDirection: "column", gap: "20px"}}>

            {mensajeError && (
                <div style={{
                    padding: "12px 16px",
                    backgroundColor: "#fee2e2", 
                    color: "#991b1b", 
                    borderRadius: "8px",
                    border: "1px solid #f87171",
                    textAlign: "center",
                    fontWeight: "500",
                    fontSize: "14px",
                    transition: "all 0.3s ease"
                }}>
                    {mensajeError}
                </div>
            )}

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
                    { value: "DAY", label: "Diario" },
                    { value: "WEEK", label: "Semanal" },
                    { value: "MONTH", label: "Mensual" },
                ]}
            />

            {tipo === "DAY" && (
                <ProvInput
                    placeholder="Seleccionar día"
                    type="date"
                    className="inputBoxDefault"
                    value={rango}
                    onChange={(e) => setRango(e.target.value)}
                />
            )}

            {tipo === "WEEK" && (
                <ProvInput
                    placeholder="Seleccionar semana"
                    type="week"
                    className="inputBoxDefault"
                    value={rango}
                    onChange={(e) => setRango(e.target.value)}
                />
            )}

            {tipo === "MONTH" && (
                <ProvInput
                    placeholder="Seleccionar mes"
                    type="month"
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
    )
}