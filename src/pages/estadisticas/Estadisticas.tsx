/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import style from "./Estadisticas.module.css";
import WelcomeText from "../../components/WelcomeText/welcomeText.tsx";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { statisticsService } from "../../services/statistics.service"; // Ajusta el path si es necesario
import type { StatisticsResponseDTO } from "../../types/statistics.types"; // Ajusta el path si es necesario

export default function Estadisticas() {
  const [stats, setStats] = useState<StatisticsResponseDTO | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeFilter, setActiveFilter] = useState<"ciudad" | "origen">(
    "origen",
  );

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await statisticsService.getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error("Error fetching statistics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <main className={style.main}>
        <WelcomeText
          sectionText={"Cargando estadísticas..."}
          className={"darkStyle"}
        />
      </main>
    );
  }

  if (!stats) {
    return (
      <main className={style.main}>
        <WelcomeText
          sectionText={"Error al cargar las estadísticas."}
          className={"darkStyle"}
        />
      </main>
    );
  }

  const COLORS = [
    "#3b82f6",
    "#22c55e",
    "#f59e0b",
    "#ef4444",
    "#a855f7",
    "#ec4899",
    "#14b8a6",
  ];

  // Extraemos las listas de forma segura. Si stats.patients es undefined, usamos un array vacío []
    const patientsByOrigin = stats.patients?.patientsByOrigin || [];
    const patientsByCity = stats.patients?.patientsByCity || [];

    // 1. Datos para el gráfico de Demografía
    const activeDemographicList = activeFilter === "origen" ? patientsByOrigin : patientsByCity;
    const demographicData = activeDemographicList.map(item => ({
        name: item.label,
        value: item.count || item.percentage || 0
    }));

    // 2. Datos para Deudores vs No Deudores (si no hay datos, mostramos 0)
    const debtorsData = [
        { name: 'Al día', value: stats.patients?.totalNonDebtors || 0 },
        { name: 'Deudores', value: stats.patients?.totalDebtors || 0 }
    ];

    // 3. Datos Financieros (Ingresos vs Egresos del Mes)
    const financialBalanceData = [
        { name: 'Pesos (ARS)', Ingresos: stats.financial?.currentMonthIncomePesos || 0, Egresos: stats.financial?.currentMonthExpensesPesos || 0 },
        { name: 'Dólares (USD)', Ingresos: stats.financial?.currentMonthIncomeDollars || 0, Egresos: stats.financial?.currentMonthExpensesDollars || 0 }
    ];

    // 4. Datos Financieros (Desglose de ingresos)
    const incomeBreakdownList = stats.financial?.incomeBreakdown || [];
    const incomeBreakdownData = incomeBreakdownList.map(item => ({
        name: item.label,
        value: item.amount || 0
    }));

    // Formateador de moneda para tooltips (con la corrección de TypeScript)
    const formatCurrency = (value: any) => {
        const numericValue = Number(value);
        if (isNaN(numericValue)) return "$0,00";
        return `$${numericValue.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`;
    };

  return (
    <main className={style.main}>
      <WelcomeText
        sectionText={"Acá las estadísticas generales de la clínica."}
        className={"darkStyle"}
      />

      <div className={style.dashboardContainer}>
        {/* FILA 1: TARJETAS DE RESUMEN Y DEMOGRAFÍA */}
        <section className={style.topSection}>
          <div className={style.summaryCards}>
            <div className={style.card}>
              <h3>Total Pacientes</h3>
              <h2>{stats.patients.totalPatients}</h2>
            </div>
            <div className={style.card}>
              <h3>Implantes del Mes</h3>
              <h2>{stats.implantsThisMonth}</h2>
            </div>
          </div>

          <div className={style.demographicsContainer}>
            <div className={style.filters}>
              <h4>Distribución de Pacientes</h4>
              <div className={style.filterOptions}>
                <button
                  className={activeFilter === "origen" ? style.activeBtn : ""}
                  onClick={() => setActiveFilter("origen")}
                >
                  Por Origen
                </button>
                <button
                  className={activeFilter === "ciudad" ? style.activeBtn : ""}
                  onClick={() => setActiveFilter("ciudad")}
                >
                  Por Localidad
                </button>
              </div>
            </div>

            <div className={style.graphBox}>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={demographicData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    nameKey="name"
                  >
                    {demographicData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* FILA 2: DEUDORES Y FINANZAS */}
        <section className={style.chartsGrid}>
          {/* Gráfico de Deudores */}
          <div className={style.chartCard}>
            <h4>Estado de Cuenta de Pacientes</h4>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={debtorsData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  dataKey="value"
                  nameKey="name"
                >
                  <Cell fill="#22c55e" /> {/* Verde para Al día */}
                  <Cell fill="#ef4444" /> {/* Rojo para Deudores */}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfico de Desglose de Ingresos */}
          <div className={style.chartCard}>
            <h4>Desglose de Ingresos</h4>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={incomeBreakdownData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  nameKey="name"
                >
                  {incomeBreakdownData.map((_, index) => (
                    <Cell
                      key={`cell-inc-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={formatCurrency} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfico de Barras: Ingresos vs Egresos */}
          <div className={style.chartCard} style={{ gridColumn: "1 / -1" }}>
            <h4>Balance del Mes (Ingresos vs Egresos)</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={financialBalanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="name" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip
                  formatter={formatCurrency}
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "none",
                    borderRadius: "5px",
                  }}
                />
                <Legend />
                <Bar dataKey="Ingresos" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Egresos" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </main>
  );
}
