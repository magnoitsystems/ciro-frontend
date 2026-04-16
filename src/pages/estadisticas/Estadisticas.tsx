import style from './Estadisticas.module.css';
import WelcomeText from "../../components/WelcomeText/welcomeText.tsx";
import PacientCard from "../../components/PacientCard/pacientCards.tsx";
import {useState} from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

type Paciente = {
    id: number;
    nombre: string;
    tipoDocumento: string;
    numeroDocumento: string;
    fechaNacimiento: string;

    telefono: string;
    direccion: string;
    localidad: string;
    obraSocial: string;

    secretaria: string;
    observaciones: string;
    comoNosConocio: string;
};

export default function Estadisticas() {
    const pacientes: Paciente[] = [
        {
            id: 1,
            nombre: "Agostina Bidegain",
            tipoDocumento: "DNI",
            numeroDocumento: "46185819",
            fechaNacimiento: "1998-05-27",

            telefono: "2494567890",
            direccion: "Av. Colón 123",
            localidad: "Tandil",
            obraSocial: "OSDE",

            secretaria: "Milagros Alvarez",
            observaciones: "Paciente con tratamiento en curso. Buena evolución.",
            comoNosConocio: "Instagram"
        },
        {
            id: 2,
            nombre: "Juan Pérez",
            tipoDocumento: "DNI",
            numeroDocumento: "30123456",
            fechaNacimiento: "1985-09-12",

            telefono: "2494123456",
            direccion: "San Martín 456",
            localidad: "Tandil",
            obraSocial: "IOMA",

            secretaria: "Lucía Fernández",
            observaciones: "Primera consulta realizada. Estudios pendientes.",
            comoNosConocio: "Recomendación"
        },
        {
            id: 3,
            nombre: "María López",
            tipoDocumento: "DNI",
            numeroDocumento: "28999888",
            fechaNacimiento: "1990-03-22",

            telefono: "2494987654",
            direccion: "Belgrano 789",
            localidad: "Azul",
            obraSocial: "Swiss Medical",

            secretaria: "Carla Gómez",
            observaciones: "Control mensual. Sin complicaciones.",
            comoNosConocio: "Facebook"
        },
        {
            id: 4,
            nombre: "Carlos Gómez",
            tipoDocumento: "DNI",
            numeroDocumento: "33444555",
            fechaNacimiento: "1978-11-02",

            telefono: "2494332211",
            direccion: "Rivadavia 321",
            localidad: "Olavarría",
            obraSocial: "Particular",

            secretaria: "Milagros Alvarez",
            observaciones: "Paciente derivado. Requiere seguimiento.",
            comoNosConocio: "Sitio Web"
        },
        {
            id: 5,
            nombre: "Lucía Martínez",
            tipoDocumento: "DNI",
            numeroDocumento: "35222111",
            fechaNacimiento: "1995-07-18",

            telefono: "2494556677",
            direccion: "España 654",
            localidad: "Tandil",
            obraSocial: "Avalian",

            secretaria: "Lucía Fernández",
            observaciones: "Turnos frecuentes. Muy puntual.",
            comoNosConocio: "Tik Tok"
        }
    ];

    const [activeFilter, setActiveFilter] = useState<"obraSocial" | "localidad" | "comoNosConocio">("obraSocial");

    const getChartData = () => {
        const counts: Record<string, number> = {};

        pacientes.forEach((p) => {
            const key = p[activeFilter];

            if (!counts[key]) counts[key] = 0;
            counts[key]++;
        });

        return Object.entries(counts).map(([name, value]) => ({
            name,
            value
        }));
    };

    const chartData = getChartData();
    const COLORS = ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444", "#a855f7"];

    return(
        <main className={style.main}>
            <WelcomeText
                sectionText={'Acá las estadísticas de los pacientes.'}
                className={'darkStyle'}
            />

            <div className={style.contentContainer}>
                <div className={style.patients}>
                    {pacientes.map((p) => (
                        <PacientCard
                            key={p.id}
                            nombre={p.nombre}
                            dni={p.numeroDocumento}
                            onDelete={() => {
                            }}
                            onView={() => {
                            }}
                            onEdit={() => {
                            }}
                        />
                    ))}
                </div>

                <div className={style.filters}>
                    <h4>Filtrar por</h4>

                    <div className={style.filterOptions}>
                        <button onClick={() => setActiveFilter("obraSocial")}>
                            Obra social
                        </button>

                        <button onClick={() => setActiveFilter("localidad")}>
                            Localidad
                        </button>

                        <button onClick={() => setActiveFilter("comoNosConocio")}>
                            Cómo nos conoció
                        </button>
                    </div>

                    <div className={style.appliedFilters}>
                        <span>Filtro activo:</span>
                        <strong>{activeFilter}</strong>
                    </div>
                </div>

                <div className={style.graph}>
                    <h4>Distribución por {activeFilter}</h4>

                    <PieChart width={300} height={300}>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            dataKey="value"
                            nameKey="name"
                        >
                            {chartData.map((_, index) => (
                                <Cell key={index} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>

                        <Tooltip />
                        <Legend />
                    </PieChart>
                </div>
            </div>
        </main>
    )
}