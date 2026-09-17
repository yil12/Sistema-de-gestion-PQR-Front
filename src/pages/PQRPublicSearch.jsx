import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { searchPublicPQRByRadicado } from "../services/pqrService";
import Toast from "../components/common/Toast";
import "../styles/css/PQRPublicSearch.css";

const ESTADO_VARIANTS = {
    pending: ["pendiente", "radicada", "radicado", "asignada", "recibida"],
    progress: ["en_proceso", "en_tramite", "en_revision", "en_curso", "en_gestion"],
    resolved: ["resuelta", "cerrada", "aprobada", "finalizada"],
    rejected: ["rechazada", "cancelada", "negada"],
};

const getEstadoVariant = (estado) => {
    const normalizado = (estado || "").toLowerCase();
    for (const [variante, valores] of Object.entries(ESTADO_VARIANTS)) {
        if (valores.includes(normalizado)) return variante;
    }
    return "pending";
};

const PQRPublicSearch = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [radicado, setRadicado] = useState("");
    const [pqr, setPqr] = useState(null);
    const [loading, setLoading] = useState(false);

    const [toast, setToast] = useState({
        show: false,
        mensaje: "",
        tipo: "error", 
    });

    const consultarPQR = async (numeroRadicado) => {
        const numero = numeroRadicado.trim();

        if (!numero) {
            setToast({
                show: true,
                mensaje: "Por favor, ingresa un número de radicado.",
                tipo: "warning",
            });
            setPqr(null);
            return;
        }

        try {
            setLoading(true);
            setPqr(null);

            const data = await searchPublicPQRByRadicado(numero);
            setPqr(data);
            
            

        } catch (err) {
            const mensaje =
                err.response?.data?.detail ||
                err.response?.data?.mensaje ||
                "No se encontró una PQR con el número de radicado indicado.";

            setToast({
                show: true,
                mensaje: mensaje,
                tipo: "error",
            });
            setPqr(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const radicadoUrl = searchParams.get("radicado");
        if (radicadoUrl) {
            setRadicado(radicadoUrl);
            consultarPQR(radicadoUrl);
        }
    }, [searchParams]);

    const handleSubmit = (e) => {
        e.preventDefault();
        consultarPQR(radicado);
    };

    const formatearEstado = (estado) => {
        if (!estado) return "";
        return estado.replaceAll("_", " ").replace(/\b\w/g, (letra) => letra.toUpperCase());
    };

    const formatearTipo = (tipo) => {
        if (!tipo) return "";
        return tipo.replaceAll("_", " ").replace(/\b\w/g, (letra) => letra.toUpperCase());
    };

    const formatearPrioridad = (prioridad) => {
        if (!prioridad) return "";
        return prioridad.replaceAll("_", " ").replace(/\b\w/g, (letra) => letra.toUpperCase());
    };

    const formatearFecha = (fecha) => {
        if (!fecha) return "No disponible";
        return new Date(fecha).toLocaleDateString("es-CO", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    const formatearFechaHora = (fecha) => {
        if (!fecha) return "No disponible";
        return new Date(fecha).toLocaleString("es-CO", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <main className="pqr-public-search-page">
            {toast.show && (
                <Toast
                    tipo={toast.tipo}
                    mensaje={toast.mensaje}
                    onClose={() => setToast((prev) => ({ ...prev, show: false }))}
                    duracion={4000}
                />
            )}

            <header className="pqr-public-search-header">
                <div className="pqr-public-search-brand">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" strokeWidth="1.8" />
                        <path d="M20 20l-4.8-4.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                    Portal PQR
                </div>
                <h1>Consultar PQR</h1>
                <p>
                    Consulta el estado y seguimiento de tu petición, queja o reclamo utilizando el número de radicado.
                </p>
            </header>

            <section className="pqr-public-search-form-container">
                <form className="pqr-public-search-form" onSubmit={handleSubmit}>
                    <div className="pqr-public-search-field">
                        <label htmlFor="radicado">Número de radicado</label>
                        <input
                            id="radicado"
                            type="text"
                            value={radicado}
                            onChange={(e) => setRadicado(e.target.value)}
                            placeholder="Ej: PQR-2026-000051"
                            autoComplete="off"
                        />
                    </div>
                    <button type="submit" disabled={loading}>
                        {loading ? "Consultando..." : "Consultar PQR"}
                    </button>
                </form>
            </section>

            {pqr && (
                <section className="pqr-public-result">
                    <header className="pqr-public-result-header">
                        <div>
                            <span className="pqr-public-result-id">Número de radicado</span>
                            <h2>{pqr.radicado}</h2>
                        </div>
                        <div className={`pqr-public-status pqr-public-status--${getEstadoVariant(pqr.estado)}`}>
                            <span className="pqr-public-status-dot" />
                            {formatearEstado(pqr.estado)}
                        </div>
                    </header>

                    <div className="pqr-public-info">
                        <div className="pqr-public-info-item">
                            <span className="pqr-public-info-label">Tipo</span>
                            <strong className="pqr-public-info-value">{formatearTipo(pqr.tipo)}</strong>
                        </div>
                        <div className="pqr-public-info-item">
                            <span className="pqr-public-info-label">Categoría</span>
                            <strong className="pqr-public-info-value">{pqr.categoria || "No especificada"}</strong>
                        </div>
                        <div className="pqr-public-info-item">
                            <span className="pqr-public-info-label">Prioridad</span>
                            <strong className="pqr-public-info-value">{formatearPrioridad(pqr.prioridad)}</strong>
                        </div>
                        <div className="pqr-public-info-item">
                            <span className="pqr-public-info-label">Fecha de registro</span>
                            <strong className="pqr-public-info-value">{formatearFecha(pqr.created_at)}</strong>
                        </div>
                    </div>

                    <section className="pqr-public-description">
                        <h3 className="pqr-public-section-title">Detalle de la solicitud</h3>
                        <h4 className="pqr-public-description-title">{pqr.titulo}</h4>
                        <p className="pqr-public-description-text">{pqr.descripcion}</p>
                    </section>

                    <section className="pqr-public-history">
                        <h3 className="pqr-public-section-title">Historial de seguimiento</h3>
                        {pqr.historial?.length > 0 ? (
                            <div className="pqr-public-history-list">
                                {pqr.historial.map((seguimiento) => (
                                    <article key={seguimiento.id} className="pqr-public-history-item">
                                        <div className="pqr-public-history-marker" />
                                        <div className="pqr-public-history-content">
                                            <div className="pqr-public-history-head">
                                                <strong className="pqr-public-history-action">
                                                    {formatearTipo(seguimiento.tipo_accion)}
                                                </strong>
                                                <span className="pqr-public-history-date">
                                                    {formatearFechaHora(seguimiento.fecha_registro)}
                                                </span>
                                            </div>
                                            <p className="pqr-public-history-description">
                                                {seguimiento.descripcion}
                                            </p>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        ) : (
                            <p className="pqr-public-history-empty">
                                Esta PQR aún no tiene seguimientos registrados.
                            </p>
                        )}
                    </section>
                </section>
            )}

            <footer className="pqr-public-search-footer">
                <button type="button" onClick={() => navigate("/")}>
                    Volver al inicio
                </button>
            </footer>
        </main>
    );
};

export default PQRPublicSearch;