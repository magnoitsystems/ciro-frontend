import style from './Deudas.module.css';
import WelcomeText from "../../components/WelcomeText/welcomeText.tsx";
import DeudaCard from "../../components/DeudaCard/deudaCard.tsx";
import { useState, useEffect } from "react";
import { patientService } from '../../services/patient.service';
import { userService } from '../../services/user.service';
import type { PatientDebtorDTO } from '../../types/currentAccount.types.ts';
import type { UserResponseDTO } from '../../types/users.types.ts'; 

type DebtStatusFilter = 'ALL' | 'ONLY_DEBT' | 'ONLY_OVERDUE';

export default function Deudas() {
    
    const [deudores, setDeudores] = useState<PatientDebtorDTO[]>([]);
    const [doctores, setDoctores] = useState<UserResponseDTO[]>([]);
    const [selectedDoctor, setSelectedDoctor] = useState<number | "ALL">("ALL");
    const [statusFilter, setStatusFilter] = useState<DebtStatusFilter>('ALL');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDoctores = async () => {
            try {
                const users = await userService.getAllUsers();
                setDoctores(users);
            } catch (error) {
                console.error("Error al cargar los doctores:", error);
            }
        };
        fetchDoctores();
    }, []);

    useEffect(() => {
        const fetchDeudores = async () => {
            try {
                setIsLoading(true);
                let data;
                
                if (selectedDoctor === "ALL") {
                    data = await patientService.getDebtorPatients();
                } else {
                    data = await patientService.getDebtorPatientsByDoctor(selectedDoctor);
                }
                
                setDeudores(data);
            } catch (error) {
                console.error("Error al cargar los deudores:", error);
                alert("Ocurrió un error al cargar la lista de deudores. Por favor, intentá de nuevo.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchDeudores();
    }, [selectedDoctor]); 

    const filteredDeudores = deudores.filter((deudor) => {
        if (statusFilter === 'ONLY_OVERDUE') {
            return deudor.overdue === true;
        }
        if (statusFilter === 'ONLY_DEBT') {
            return deudor.overdue === false; 
        }
        return true;
    });

    return(
        <main className={style.main}>
            <WelcomeText
                sectionText={'Acá el listado de deudores.'}
                className={'darkStyle'}
            />

            <div className={style.filterContainer}>
                {/* Filtro Profesional */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label htmlFor="doctorFilter" className={style.filterLabel}>Filtrar por profesional:</label>
                    <select 
                        id="doctorFilter" 
                        className={style.doctorSelect}
                        value={selectedDoctor} 
                        onChange={(e) => {
                            const val = e.target.value;
                            setSelectedDoctor(val === "ALL" ? "ALL" : Number(val));
                        }}
                    >
                        <option value="ALL">Todos los doctores</option>
                        {doctores.map(doc => (
                            <option key={doc.id} value={doc.id}>
                                Dr/a. {doc.name} {doc.lastname}
                            </option>
                        ))}
                    </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label htmlFor="statusFilter" className={style.filterLabel}>Filtrar por condición:</label>
                    <select 
                        id="statusFilter" 
                        className={style.doctorSelect} 
                        value={statusFilter} 
                        onChange={(e) => setStatusFilter(e.target.value as DebtStatusFilter)}
                    >
                        <option value="ALL">Todos (Deuda y Vencidos)</option>
                        <option value="ONLY_DEBT">Solo Al Día (Con Deuda)</option>
                        <option value="ONLY_OVERDUE">Solo Vencidos (En Rojo)</option>
                    </select>
                </div>
            </div>

            <div className={style.cardsContainer}>
                <div className={style.columnNames}>
                    <p>Nombre y apellido</p>
                    <p>D.N.I del paciente</p>
                    <p>Deuda en dólares</p>
                    <p>Deuda en pesos</p>
                </div>

                {isLoading ? (
                    <p style={{ padding: '20px', color: 'var(--neutral-1)' }}>Cargando listado de deudores...</p>
                ) : filteredDeudores.length > 0 ? (
                    filteredDeudores.map((deudor) => (
                        <DeudaCard 
                            key={deudor.id} 
                            deudor={deudor} 
                        />
                    ))
                ) : (
                    <p style={{ padding: '20px', color: 'var(--neutral-1)' }}>
                        {statusFilter === 'ALL' 
                            ? `¡Excelente! No hay pacientes con deudas registradas ${selectedDoctor !== "ALL" ? "con este profesional" : ""}.`
                            : statusFilter === 'ONLY_OVERDUE'
                            ? "No hay pacientes con comprobantes vencidos para este criterio."
                            : "No hay pacientes con deudas vigentes al día para este criterio."
                        }
                    </p>
                )}
            </div>
        </main>
    )
}