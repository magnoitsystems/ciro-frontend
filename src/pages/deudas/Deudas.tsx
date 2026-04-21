import style from './Deudas.module.css';
import WelcomeText from "../../components/WelcomeText/welcomeText.tsx";
import DeudaCard from "../../components/DeudaCard/deudaCard.tsx";
import { useState, useEffect } from "react";
import { patientService } from '../../services/patient.service';
import type { PatientDebtorDTO } from '../../types/patients.types.ts';

export default function Deudas() {
    
    const [deudores, setDeudores] = useState<PatientDebtorDTO[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDeudores = async () => {
            try {
                setIsLoading(true);
                const data = await patientService.getDebtorPatients();
                setDeudores(data);
            } catch (error) {
                console.error("Error al cargar los deudores:", error);
                alert("Ocurrió un error al cargar la lista de deudores. Por favor, intentá de nuevo.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchDeudores();
    }, []);

    return(
        <main className={style.main}>
            <WelcomeText
                sectionText={'Acá el listado de deudores.'}
                className={'darkStyle'}
            />

            <div className={style.cardsContainer}>
                <div className={style.columnNames}>
                    <p>Nombre y apellido</p>
                    <p>D.N.I del paciente</p>
                    <p>Deuda en dólares</p>
                    <p>Deuda en pesos</p>
                </div>

                {isLoading ? (
                    <p style={{ padding: '20px' }}>Cargando listado de deudores...</p>
                ) : deudores.length > 0 ? (
                    deudores.map((deudor) => (
                        <DeudaCard 
                            key={deudor.id} 
                            deudor={deudor} 
                        />
                    ))
                ) : (
                    <p style={{ padding: '20px' }}>¡Excelente! No hay pacientes con deudas registradas.</p>
                )}
            </div>
        </main>
    )
}