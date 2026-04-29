import { useState } from "react";
import style from './CajaForm.module.css';
import ProvInput from "../NewProvForm/ProvInput.tsx";
import GreenFormButton from "../../Buttons/GreenFormButton/greenFormButton.tsx";
import type { ReportPeriod } from "../../../types/enums.types.ts";

type Props = {
    onGenerate: (period: ReportPeriod) => void;
}

export function ReporteCaja({ onGenerate }: Props) {
    const [period, setPeriod] = useState<ReportPeriod>("MONTH");

    const handleSubmit = () => {
        onGenerate(period);
    };

    return (
        <div className={style.reportForm}>
            <ProvInput
                placeholder="Período del reporte"
                as="select"
                className="inputBoxDefault"
                value={period}
                onChange={(e) => setPeriod(e.target.value as ReportPeriod)}
                options={[
                    { value: "DAY", label: "Hoy" },
                    { value: "WEEK", label: "Esta Semana" },
                    { value: "MONTH", label: "Este Mes" }
                ]}
            />

            <GreenFormButton
                text="Descargar PDF"
                onClick={handleSubmit}
            />
        </div>
    );
}