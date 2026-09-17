import "../styles/css/Dashboard.css";
import { useEffect, useState } from "react";
import {
    BarChart,
    Bar,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { getPQRStatistics } from "../services/pqrService";
import Toast from "../components/common/Toast";

const ESTADO_COLOR = {
    Recibidas: "#14314f",
    "En gestión": "#96620f",
    Resueltas: "#3d6b52",
    Cerradas: "#8b93a0",
};

const PRIORIDAD_CONFIG = [
    { key: "urgente", label: "Urgente", color: "#b3261e" },
    { key: "alta", label: "Alta", color: "#96620f" },
    { key: "media", label: "Media", color: "#14314f" },
    { key: "baja", label: "Baja", color: "#8b93a0" },
];

const TIPO_CONFIG = [
    { key: "peticion", label: "Peticiones", color: "#14314f" },
    { key: "queja", label: "Quejas", color: "#96620f" },
    { key: "reclamo", label: "Reclamos", color: "#b3261e" },
];

const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const item = payload[0];
    return (
        <div className="dashboard-tooltip">
            <span className="dashboard-tooltip-label">{item.payload.estado}</span>
            <span className="dashboard-tooltip-value">{item.value}</span>
        </div>
    );
};

const Dashboard = () => {
    const [estadisticas, setEstadisticas] = useState(null);
    const [cargando, setCargando] = useState(true);

    const [toast, setToast] = useState({
        show: false,
        mensaje: "",
        tipo: "success",
    });

    useEffect(() => {
        const cargarEstadisticas = async () => {
            try {
                setCargando(true);
                const data = await getPQRStatistics();
                setEstadisticas(data);
            } catch (error) {
                console.error("Error al cargar estadísticas:", error);

                const mensajeError =
                    error.response?.data?.detail ||
                    error.response?.data?.mensaje ||
                    "No fue posible cargar las estadísticas.";

                setToast({
                    show: true,
                    mensaje: mensajeError,
                    tipo: "error",
                });
            } finally {
                setCargando(false);
            }
        };

        cargarEstadisticas();
    }, []);

    if (cargando) {
        return <p className="dashboard-message">Cargando estadísticas...</p>;
    }


    if (!estadisticas) {
        return <p className="dashboard-message">No hay estadísticas disponibles.</p>;
    }

    const datosPorEstado = [
        { estado: "Recibidas", cantidad: estadisticas.por_estado.recibida ?? 0 },
        { estado: "En gestión", cantidad: estadisticas.por_estado.en_gestion ?? 0 },
        { estado: "Resueltas", cantidad: estadisticas.por_estado.resuelta ?? 0 },
        { estado: "Cerradas", cantidad: estadisticas.por_estado.cerrada ?? 0 },
    ];

    const totalPrioridad = PRIORIDAD_CONFIG.reduce(
        (sum, p) => sum + (estadisticas.por_prioridad[p.key] ?? 0),
        0
    );

    const totalTipo = TIPO_CONFIG.reduce(
        (sum, t) => sum + (estadisticas.por_tipo[t.key] ?? 0),
        0
    );

    const kpis = [
        { label: "Total de PQR", value: estadisticas.total },
        { label: "Recibidas", value: estadisticas.por_estado.recibida ?? 0 },
        { label: "En gestión", value: estadisticas.por_estado.en_gestion ?? 0 },
        { label: "Resueltas", value: estadisticas.por_estado.resuelta ?? 0 },
        { label: "Cerradas", value: estadisticas.por_estado.cerrada ?? 0 },
    ];

    return (
        <div className="dashboard">
            {toast.show && (
                <Toast
                    tipo={toast.tipo}
                    mensaje={toast.mensaje}
                    onClose={() => setToast((prev) => ({ ...prev, show: false }))}
                    duracion={4000}
                />
            )}

            {/* Encabezado */}
            <div className="dashboard-header">
                <h1>Panel de control</h1>
                <p>Resumen general del sistema de gestión de PQR</p>
            </div>

            {/* Franja de indicadores */}
            <section className="dashboard-kpis">
                {kpis.map((kpi) => (
                    <div className="dashboard-kpi" key={kpi.label}>
                        <span className="dashboard-kpi-label">{kpi.label}</span>
                        <span className="dashboard-kpi-value">{kpi.value}</span>
                    </div>
                ))}
            </section>

            {/* Fila principal: estado + prioridad */}
            <div className="dashboard-row">
                <section className="dashboard-panel dashboard-panel-chart">
                    <h2>PQR por estado</h2>
                    <div className="dashboard-chart">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={datosPorEstado} barCategoryGap="28%">
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2ded2" vertical={false} />
                                <XAxis
                                    dataKey="estado"
                                    tick={{ fill: "#5b6472", fontSize: 13 }}
                                    axisLine={{ stroke: "#e2ded2" }}
                                    tickLine={false}
                                />
                                <YAxis
                                    allowDecimals={false}
                                    tick={{ fill: "#5b6472", fontSize: 12 }}
                                    axisLine={false}
                                    tickLine={false}
                                    width={32}
                                />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f1efe9" }} />
                                <Bar dataKey="cantidad" name="Cantidad" radius={[3, 3, 0, 0]} maxBarSize={56}>
                                    {datosPorEstado.map((entry) => (
                                        <Cell key={entry.estado} fill={ESTADO_COLOR[entry.estado]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </section>

                <section className="dashboard-panel dashboard-panel-priority">
                    <h2>PQR por prioridad</h2>
                    <div className="dashboard-priority-list">
                        {PRIORIDAD_CONFIG.map((p) => {
                            const value = estadisticas.por_prioridad[p.key] ?? 0;
                            const pct = totalPrioridad > 0 ? (value / totalPrioridad) * 100 : 0;
                            return (
                                <div className="dashboard-priority-row" key={p.key}>
                                    <div className="dashboard-priority-top">
                                        <span className="dashboard-priority-label">{p.label}</span>
                                        <span className="dashboard-priority-value">{value}</span>
                                    </div>
                                    <div className="dashboard-priority-track">
                                        <div
                                            className="dashboard-priority-fill"
                                            style={{ width: `${pct}%`, backgroundColor: p.color }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>
            </div>

            {/* PQR por tipo */}
            <section className="dashboard-panel">
                <h2>PQR por tipo</h2>
                <div className="dashboard-type-bar">
                    {TIPO_CONFIG.map((t) => {
                        const value = estadisticas.por_tipo[t.key] ?? 0;
                        const pct = totalTipo > 0 ? (value / totalTipo) * 100 : 0;
                        if (pct === 0) return null;
                        return (
                            <div
                                key={t.key}
                                className="dashboard-type-segment"
                                style={{ width: `${pct}%`, backgroundColor: t.color }}
                                title={`${t.label}: ${value}`}
                            />
                        );
                    })}
                </div>
                <ul className="dashboard-type-legend">
                    {TIPO_CONFIG.map((t) => {
                        const value = estadisticas.por_tipo[t.key] ?? 0;
                        const pct = totalTipo > 0 ? Math.round((value / totalTipo) * 100) : 0;
                        return (
                            <li key={t.key}>
                                <span className="dashboard-type-dot" style={{ backgroundColor: t.color }} />
                                <span className="dashboard-type-name">{t.label}</span>
                                <span className="dashboard-type-value">{value}</span>
                                <span className="dashboard-type-pct">{pct}%</span>
                            </li>
                        );
                    })}
                </ul>
            </section>
        </div>
    );
};

export default Dashboard;