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
import { statisticsService } from "../../services/statistics.service";
import type { StatisticsResponseDTO } from "../../types/statistics.types";
import { NavLink } from "react-router-dom";

export default function Estadisticas() {
  const [stats, setStats] = useState<StatisticsResponseDTO | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeFilter, setActiveFilter] = useState<"ciudad" | "origen" | "motivo" | "turno">("origen");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [drillDown, setDrillDown] = useState<{ title: string; ids: number[] } | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await statisticsService.getDashboardStats(startDate, endDate);
      setStats(data);
    } catch (error) {
      console.error("Error fetching statistics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleFilterDates = () => {
      fetchStats();
  };

  const handleClearDates = () => {
      setStartDate("");
      setEndDate("");
      setTimeout(() => fetchStats(), 100);
  };

  const handleChartClick = (data: any, titlePrefix: string) => {
      if (data && data.payload && data.payload.referenceIds && data.payload.referenceIds.length > 0) {
          setDrillDown({
              title: `${titlePrefix}: ${data.name}`,
              ids: data.payload.referenceIds
          });
      } else if (data && data.referenceIds && data.referenceIds.length > 0) {
          setDrillDown({
            title: `${titlePrefix}: ${data.name}`,
            ids: data.referenceIds
        });
      }
  };

  if (loading && !stats) {
    return (
      <main className={style.main}>
        <WelcomeText sectionText={"Cargando estadísticas..."} className={"darkStyle"} />
      </main>
    );
  }

  if (!stats) {
    return (
      <main className={style.main}>
        <WelcomeText sectionText={"Error al cargar las estadísticas."} className={"darkStyle"} />
      </main>
    );
  }

  const COLORS = ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444", "#a855f7", "#ec4899", "#14b8a6", "#64748b"];

  const patientsByOrigin = stats.patients?.patientsByOrigin || [];
  const patientsByCity = stats.patients?.patientsByCity || [];
  const patientsByReason = stats.patients?.patientsByReason || [];
  const patientsByAppointmentStatus = stats.patients?.patientsByAppointmentStatus || [];

  let activeDemographicList = patientsByOrigin;
  if (activeFilter === "ciudad") activeDemographicList = patientsByCity;
  if (activeFilter === "motivo") activeDemographicList = patientsByReason;
  if (activeFilter === "turno") activeDemographicList = patientsByAppointmentStatus;

  const demographicData = activeDemographicList.map(item => ({
      name: item.label,
      value: item.count || item.percentage || 0,
      referenceIds: item.referenceIds
  }));

  const debtorsData = [
      { name: 'Al día', value: stats.patients?.totalNonDebtors || 0 },
      { name: 'Deudores', value: stats.patients?.totalDebtors || 0 }
  ];

  const financialBalanceData = [
      { name: 'Pesos (ARS)', Ingresos: stats.financial?.currentPeriodIncomePesos || 0, Egresos: stats.financial?.currentPeriodExpensesPesos || 0 },
      { name: 'Dólares (USD)', Ingresos: stats.financial?.currentPeriodIncomeDollars || 0, Egresos: stats.financial?.currentPeriodExpensesDollars || 0 }
  ];

  const incomeBreakdownData = (stats.financial?.incomeBreakdown || []).map(item => ({
      name: item.label,
      value: item.amount || 0,
      referenceIds: item.referenceIds
  }));

  const expensesBreakdownData = (stats.financial?.expensesBreakdown || []).map(item => ({
      name: item.label,
      value: item.amount || 0,
      referenceIds: item.referenceIds
  }));

  const formatCurrency = (value: any) => {
      const numericValue = Number(value);
      if (isNaN(numericValue)) return "$0,00";
      return `$${numericValue.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`;
  };

  return (
    <main className={style.main}>
      <WelcomeText sectionText={"Acá las estadísticas generales de la clínica."} className={"darkStyle"} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <NavLink to={'/pacientes'} style={{ textDecoration: 'none' }}>
            <p style={{ cursor: 'pointer', color: 'var(--neutral-4)'}}>← Volver a la sección pacientes</p>
          </NavLink>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input 
                  type="date" 
                  value={startDate} 
                  onChange={(e) => setStartDate(e.target.value)} 
                  style={{ padding: '8px', borderRadius: '5px', border: 'none', background: 'var(--blue-2)', color: 'white' }}
              />
              <span style={{ color: 'var(--neutral-4)' }}>hasta</span>
              <input 
                  type="date" 
                  value={endDate} 
                  onChange={(e) => setEndDate(e.target.value)} 
                  style={{ padding: '8px', borderRadius: '5px', border: 'none', background: 'var(--blue-2)', color: 'white' }}
              />
              <button 
                  onClick={handleFilterDates} 
                  style={{ padding: '8px 15px', borderRadius: '5px', border: 'none', background: 'var(--primary)', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}>
                  Filtrar
              </button>
              <button 
                  onClick={handleClearDates} 
                  style={{ padding: '8px 15px', borderRadius: '5px', border: '1px solid var(--neutral-4)', background: 'transparent', color: 'var(--neutral-4)', cursor: 'pointer' }}>
                  Limpiar
              </button>
          </div>
      </div>

      <div className={style.dashboardContainer} style={{ marginTop: '20px' }}>
        <section className={style.topSection}>
          <div className={style.summaryCards}>
            <div className={style.card}>
              <h3>Total Pacientes</h3>
              <h2>{stats.patients?.totalPatients || 0}</h2>
            </div>
            <div className={style.card}>
              <h3>Implantes del Mes</h3>
              <h2>{stats?.implantsThisMonth || 0}</h2>
            </div>
            <div className={style.card} style={{ borderLeft: '4px solid #22c55e' }}>
              <h3>Ganancia Neta (ARS)</h3>
              <h2>{formatCurrency(stats.financial?.netProfitPesos)}</h2>
            </div>
            <div className={style.card} style={{ borderLeft: '4px solid #3b82f6' }}>
              <h3>Ganancia Neta (USD)</h3>
              <h2>{formatCurrency(stats.financial?.netProfitDollars)}</h2>
            </div>
          </div>

          <div className={style.demographicsContainer}>
            <div className={style.filters}>
              <h4>Distribución de Pacientes</h4>
              <div className={style.filterOptions} style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                <button className={activeFilter === "origen" ? style.activeBtn : ""} onClick={() => setActiveFilter("origen")}>Origen</button>
                <button className={activeFilter === "ciudad" ? style.activeBtn : ""} onClick={() => setActiveFilter("ciudad")}>Localidad</button>
                <button className={activeFilter === "motivo" ? style.activeBtn : ""} onClick={() => setActiveFilter("motivo")}>Motivo C.</button>
                <button className={activeFilter === "turno" ? style.activeBtn : ""} onClick={() => setActiveFilter("turno")}>Estado Turno</button>
              </div>
            </div>

            <div className={style.graphBox}>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={demographicData}
                    cx="50%" cy="50%" outerRadius={80}
                    dataKey="value" nameKey="name"
                    onClick={(data) => handleChartClick(data, "Pacientes por " + activeFilter)}
                    style={{ cursor: 'pointer' }}
                  >
                    {demographicData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        <section className={style.chartsGrid}>
          <div className={style.chartCard}>
            <h4>Estado de Cuenta de Pacientes</h4>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={debtorsData}
                  cx="50%" cy="50%" innerRadius={60} outerRadius={80}
                  dataKey="value" nameKey="name"
                >
                  <Cell fill="#22c55e" /> 
                  <Cell fill="#ef4444" /> 
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className={style.chartCard}>
            <h4>Desglose de Ingresos (MP)</h4>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={incomeBreakdownData}
                  cx="50%" cy="50%" outerRadius={80}
                  dataKey="value" nameKey="name"
                  onClick={(data) => handleChartClick(data, "Ingresos")}
                  style={{ cursor: 'pointer' }}
                >
                  {incomeBreakdownData.map((_, index) => (
                    <Cell key={`cell-inc-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={formatCurrency} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className={style.chartCard}>
            <h4>Desglose de Egresos (MP)</h4>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={expensesBreakdownData}
                  cx="50%" cy="50%" outerRadius={80}
                  dataKey="value" nameKey="name"
                  onClick={(data) => handleChartClick(data, "Egresos")}
                  style={{ cursor: 'pointer' }}
                >
                  {expensesBreakdownData.map((_, index) => (
                    <Cell key={`cell-exp-${index}`} fill={COLORS[(index + 3) % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={formatCurrency} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className={style.chartCard} style={{ gridColumn: "1 / -1" }}>
            <h4>Balance (Ingresos vs Egresos)</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={financialBalanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="name" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip formatter={formatCurrency} contentStyle={{ backgroundColor: "#1e293b", border: "none", borderRadius: "5px" }} />
                <Legend />
                <Bar dataKey="Ingresos" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Egresos" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      {drillDown && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }} onClick={() => setDrillDown(null)}>
              <div style={{ background: 'var(--blue-2)', padding: '25px', borderRadius: '10px', width: '400px', maxHeight: '70vh', overflowY: 'auto', color: 'white' }} onClick={e => e.stopPropagation()}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--neutral-4)', paddingBottom: '10px', marginBottom: '15px' }}>
                      <h3 style={{ margin: 0 }}>{drillDown.title}</h3>
                      <button onClick={() => setDrillDown(null)} style={{ background: 'none', border: 'none', color: 'var(--red)', fontSize: '18px', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
                  </div>
                  <p style={{ fontSize: '14px', color: 'var(--neutral-4)', marginBottom: '15px' }}>
                      A continuación, los IDs de los registros que componen esta estadística:
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {drillDown.ids.map(id => (
                          <span key={id} style={{ background: 'var(--blue-4)', padding: '5px 10px', borderRadius: '5px', fontSize: '13px' }}>
                              ID: #{id}
                          </span>
                      ))}
                  </div>
                  {drillDown.ids.length === 0 && <p>No hay registros para mostrar.</p>}
              </div>
          </div>
      )}
    </main>
  );
}