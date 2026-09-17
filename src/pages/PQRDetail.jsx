import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getSeguimientos } from "../services/seguimientoService";
import { getPQRById, updatePQRStatus, assignAgent } from "../services/pqrService";
import { getAgentes, responderPQR } from "../services/agenteService";
import Button from "../components/common/Button";
import Toast from "../components/common/Toast";
import "../styles/css/PQRDetail.css";

const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

const ESTADO_ORDER = ["recibida", "en_gestion", "resuelta", "cerrada"];

const ESTADO_META = {
    recibida: { label: "Recibida", color: "#14314f" },
    en_gestion: { label: "En gestión", color: "#96620f" },
    resuelta: { label: "Resuelta", color: "#3d6b52" },
    cerrada: { label: "Cerrada", color: "#5b6472" },
};

const ESTADO_OPTIONS = [
    { value: "", label: "Selecciona un estado..." },
    { value: "recibida", label: "Recibida" },
    { value: "en_gestion", label: "En gestión" },
    { value: "resuelta", label: "Resuelta" },
    { value: "cerrada", label: "Cerrada" },
];

const formatShortDate = (date) => {
    if (!date) return "No disponible";
    const d = new Date(date);
    return `${d.getDate()} ${MESES[d.getMonth()]} ${d.getFullYear()}`;
};

const formatEventDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    let hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, "0");
    const suffix = hours >= 12 ? "p.m." : "a.m.";
    hours = hours % 12 || 12;
    return `${d.getDate()} ${MESES[d.getMonth()]}, ${hours}:${minutes} ${suffix}`;
};

const formatRelative = (date) => {
    if (!date) return "";
    const diffMs = Date.now() - new Date(date).getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return "hace instantes";
    if (diffMin < 60) return `hace ${diffMin} min`;
    const diffHrs = Math.floor(diffMin / 60);
    if (diffHrs < 24) return `hace ${diffHrs} h`;
    const diffDays = Math.floor(diffHrs / 24);
    return `hace ${diffDays} d`;
};

const PQRDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [pqr, setPqr] = useState(null);
    const [loading, setLoading] = useState(true);
    const [seguimientos, setSeguimientos] = useState([]);
    const [historialAbierto, setHistorialAbierto] = useState(true);

    const [toast, setToast] = useState({
        show: false,
        mensaje: "",
        tipo: "success", 
    });

    const [nuevoEstado, setNuevoEstado] = useState("");
    const [actualizandoEstado, setActualizandoEstado] = useState(false);

    const [agentes, setAgentes] = useState([]);
    const [cargandoAgentes, setCargandoAgentes] = useState(false);
    const [agenteSeleccionado, setAgenteSeleccionado] = useState("");
    const [asignando, setAsignando] = useState(false);
    const [mostrarAsignacion, setMostrarAsignacion] = useState(false);

    const [mostrarRespuesta, setMostrarRespuesta] = useState(false);
    const [mensajeRespuesta, setMensajeRespuesta] = useState("");
    const [enviandoRespuesta, setEnviandoRespuesta] = useState(false);

    useEffect(() => {
        const loadPQR = async () => {
            try {
                setLoading(true);
                const data = await getPQRById(id);
                const historial = await getSeguimientos(id);
                setPqr(data);
                setSeguimientos(Array.isArray(historial) ? historial : []);
            } catch (err) {
                setToast({
                    show: true,
                    mensaje: err.response?.data?.mensaje || err.response?.data?.detail || "No fue posible cargar la PQR.",
                    tipo: "error",
                });
            } finally {
                setLoading(false);
            }
        };
        loadPQR();
    }, [id]);

    const cargarAgentes = async () => {
        try {
            setCargandoAgentes(true);
            const data = await getAgentes();
            setAgentes(Array.isArray(data) ? data : []);
        } catch (err) {
            setToast({
                show: true,
                mensaje: err.response?.data?.mensaje || err.response?.data?.detail || "No fue posible cargar la lista de agentes.",
                tipo: "error",
            });
        } finally {
            setCargandoAgentes(false);
        }
    };

    useEffect(() => {
        if (pqr && !pqr.agente_asignado_id && agentes.length === 0) {
            cargarAgentes();
        }
    }, [pqr]);

    const handleAsignar = async () => {
        if (!agenteSeleccionado) return;

        try {
            setAsignando(true);
            await assignAgent(pqr.id, agenteSeleccionado);

            const pqrActualizada = await getPQRById(id);
            setPqr(pqrActualizada);

            const historial = await getSeguimientos(pqr.id);
            setSeguimientos(Array.isArray(historial) ? historial : []);

            setAgenteSeleccionado("");
            setMostrarAsignacion(false);
            
            setToast({ show: true, mensaje: "Agente asignado correctamente.", tipo: "success" });
        } catch (err) {
            setToast({
                show: true,
                mensaje: err.response?.data?.mensaje || err.response?.data?.detail || "No fue posible asignar el agente.",
                tipo: "error",
            });
        } finally {
            setAsignando(false);
        }
    };

    const handleUpdateStatus = async () => {
        if (!nuevoEstado || nuevoEstado === pqr.estado) return;

        try {
            setActualizandoEstado(true);
            await updatePQRStatus(pqr.id, nuevoEstado);
            
            const pqrActualizada = await getPQRById(pqr.id);
            setPqr(pqrActualizada);
            setNuevoEstado("");
            
            const historial = await getSeguimientos(pqr.id);
            setSeguimientos(Array.isArray(historial) ? historial : []);
            
            setToast({ show: true, mensaje: "Estado actualizado correctamente.", tipo: "success" });
        } catch (error) {
            setToast({
                show: true,
                mensaje: error.response?.data?.mensaje || error.response?.data?.detail || "No fue posible actualizar el estado.",
                tipo: "error",
            });
        } finally {
            setActualizandoEstado(false);
        }
    };

    const handleEnviarRespuesta = async () => {
        if (!mensajeRespuesta.trim()) return;

        try {
            setEnviandoRespuesta(true);
            await responderPQR(pqr.id, mensajeRespuesta.trim());

            const pqrActualizada = await getPQRById(pqr.id);
            setPqr(pqrActualizada);

            const historial = await getSeguimientos(pqr.id);
            setSeguimientos(Array.isArray(historial) ? historial : []);

            setMensajeRespuesta("");
            setMostrarRespuesta(false);
            setHistorialAbierto(true);
            
            setToast({ show: true, mensaje: "Respuesta enviada correctamente.", tipo: "success" });
        } catch (err) {
            setToast({
                show: true,
                mensaje: err.response?.data?.mensaje || err.response?.data?.detail || "No fue posible enviar la respuesta.",
                tipo: "error",
            });
        } finally {
            setEnviandoRespuesta(false);
        }
    };

    if (loading) {
        return <div className="pqr-detail-message"><p>Cargando información de la PQR...</p></div>;
    }

    if (!pqr) {
        return (
            <div className="pqr-detail-message">
                <p>No se encontró la PQR o no tienes permisos para verla.</p>
                <Button type="button" variant="secondary" onClick={() => navigate("/pqr")}>
                    Volver al listado
                </Button>
            </div>
        );
    }

    const estadoStr = (pqr.estado || "recibida").toLowerCase();
    const estadoActualMeta = ESTADO_META[estadoStr] || { label: estadoStr, color: "#5b6472" };
    const currentIndex = ESTADO_ORDER.indexOf(estadoStr);

    const solicitanteNombre = pqr.solicitante
        ? `${pqr.solicitante.nombre ?? ""} ${pqr.solicitante.apellido ?? ""}`.trim()
        : "";
    const solicitanteCorreo = pqr.solicitante?.email;
    const solicitanteTelefono = pqr.solicitante?.telefono;

    const agenteNombre = pqr.agente_asignado?.nombre
        || (pqr.agente_asignado_id ? `Agente #${pqr.agente_asignado_id}` : "Sin asignar");

    return (
        <div className="pqr-detail-container">
            {toast.show && (
                <Toast
                    tipo={toast.tipo}
                    mensaje={toast.mensaje}
                    onClose={() => setToast((prev) => ({ ...prev, show: false }))}
                    duracion={4000}
                />
            )}

            <button type="button" className="pqr-back-link" onClick={() => navigate("/pqr")}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="16" height="16">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                Volver
            </button>

            {/* Tarjeta de encabezado del caso */}
            <div className="pqr-case-header" style={{ borderLeftColor: estadoActualMeta.color }}>
                <span className="pqr-case-id">CASO {pqr.radicado}</span>
                <span className="pqr-case-status" style={{ color: estadoActualMeta.color }}>
                    <span className="pqr-case-status-dot" style={{ backgroundColor: estadoActualMeta.color }} />
                    {estadoActualMeta.label ? estadoActualMeta.label.toUpperCase() : "ESTADO"}
                </span>
                <h1>{pqr.titulo}</h1>
                <p className="pqr-case-meta">
                    Creado el {formatShortDate(pqr.created_at)} · Actualizado {formatRelative(pqr.updated_at)}
                </p>
            </div>

            <h2 className="pqr-section-label">Estado del caso</h2>
            <div className="pqr-stepper-track">
                {ESTADO_ORDER.map((key, index) => {
                    const meta = ESTADO_META[key];
                    const isDone = index < currentIndex;
                    const isCurrent = index === currentIndex;
                    return (
                        <div className="pqr-stepper-step" key={key}>
                            <div
                                className={`pqr-stepper-circle ${isDone ? "is-done" : ""} ${isCurrent ? "is-current" : ""}`}
                                style={isCurrent ? { backgroundColor: meta.color, borderColor: meta.color } : undefined}
                            >
                                {isDone ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" width="13" height="13">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                    </svg>
                                ) : isCurrent ? (
                                    <span className="pqr-stepper-dot" />
                                ) : null}
                            </div>
                            <span className={`pqr-stepper-label ${isCurrent ? "is-current" : ""}`} style={isCurrent ? { color: meta.color } : undefined}>
                                {meta.label}
                            </span>
                            {index < ESTADO_ORDER.length - 1 && (
                                <span className={`pqr-stepper-line ${isDone ? "is-done" : ""}`} />
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Acciones */}
            <div className="pqr-card">
                <h3>Acciones</h3>

                {pqr.estado === "cerrada" ? (
                    <p className="pqr-closed-notice">
                        Esta PQR está cerrada y no admite cambios de estado.
                    </p>
                ) : (
                    <div className="pqr-status-control">
                        <select
                            className="pqr-native-select"
                            value={nuevoEstado}
                            onChange={(e) => setNuevoEstado(e.target.value)}
                        >
                            {ESTADO_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>

                        <Button
                            type="button"
                            variant="primary"
                            onClick={handleUpdateStatus}
                            disabled={actualizandoEstado || !nuevoEstado || nuevoEstado === pqr.estado}
                        >
                            {actualizandoEstado ? "Actualizando..." : "Actualizar estado"}
                        </Button>
                    </div>
                )}
            </div>

            {/* Detalles del caso */}
            <h2 className="pqr-section-label">Detalles del caso</h2>

            <div className="pqr-card">
                <h3>Descripción</h3>
                <p className="pqr-description-box">{pqr.descripcion}</p>

                {pqr.estado === "cerrada" ? (
                    <p className="pqr-description-box" style={{ color: "var(--brand-text-faint)", fontStyle: "italic" }}>
                        Esta PQR está cerrada y no admite nuevas respuestas.
                    </p>
                ) : !mostrarRespuesta ? (
                    <button
                        type="button"
                        className="pqr-reassign-link pqr-respond-trigger"
                        onClick={() => setMostrarRespuesta(true)}
                    >
                        Responder
                    </button>
                ) : (
                    <div className="pqr-response-form">
                        <textarea
                            className="pqr-native-textarea"
                            rows={4}
                            placeholder="Escribe la respuesta para el solicitante..."
                            value={mensajeRespuesta}
                            onChange={(e) => setMensajeRespuesta(e.target.value)}
                        />

                        <div className="pqr-response-actions">
                            <button
                                type="button"
                                className="pqr-reassign-link"
                                onClick={() => {
                                    setMostrarRespuesta(false);
                                    setMensajeRespuesta("");
                                }}
                            >
                                Cancelar
                            </button>

                            <Button
                                type="button"
                                variant="primary"
                                onClick={handleEnviarRespuesta}
                                disabled={enviandoRespuesta || !mensajeRespuesta.trim()}
                            >
                                {enviandoRespuesta ? "Enviando..." : "Enviar respuesta"}
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            <div className="pqr-two-col">
                <div className="pqr-card">
                    <h3>Solicitante</h3>
                    <div className="pqr-field">
                        <span className="pqr-field-label">Nombre</span>
                        <span className="pqr-field-value">{solicitanteNombre || pqr.solicitante_id || "No disponible"}</span>
                    </div>
                    {solicitanteCorreo && (
                        <div className="pqr-field">
                            <span className="pqr-field-label">Correo</span>
                            <span className="pqr-field-value">{solicitanteCorreo}</span>
                        </div>
                    )}
                    {solicitanteTelefono && (
                        <div className="pqr-field">
                            <span className="pqr-field-label">Teléfono</span>
                            <span className="pqr-field-value">{solicitanteTelefono}</span>
                        </div>
                    )}
                </div>

                <div className="pqr-card">
                    <h3>Asignación</h3>

                    {pqr.agente_asignado_id && !mostrarAsignacion ? (
                        <>
                            <div className="pqr-field">
                                <span className="pqr-field-label">Agente responsable</span>
                                <span className="pqr-field-value">{agenteNombre}</span>
                            </div>

                            <button
                                type="button"
                                className="pqr-reassign-link"
                                onClick={() => {
                                    setMostrarAsignacion(true);
                                    if (agentes.length === 0) cargarAgentes();
                                }}
                            >
                                Reasignar agente
                            </button>
                        </>
                    ) : (
                        <>
                            {!pqr.agente_asignado_id && (
                                <div className="pqr-field">
                                    <span className="pqr-field-label">Agente responsable</span>
                                    <span className="pqr-field-value pqr-field-empty">Sin asignar</span>
                                </div>
                            )}

                            <div className="pqr-status-control">
                                <select
                                    className="pqr-native-select"
                                    value={agenteSeleccionado}
                                    onChange={(e) => setAgenteSeleccionado(e.target.value)}
                                    disabled={cargandoAgentes}
                                >
                                    <option value="">
                                        {cargandoAgentes ? "Cargando agentes..." : "Selecciona un agente..."}
                                    </option>
                                    {(agentes || []).map((agente) => (
                                        <option key={agente.id} value={agente.id}>
                                            {agente.nombre ? `${agente.nombre}` : `Agente #${agente.id}`}
                                        </option>
                                    ))}
                                </select>

                                <Button
                                    type="button"
                                    variant="primary"
                                    onClick={handleAsignar}
                                    disabled={asignando || !agenteSeleccionado}
                                >
                                    {asignando ? "Asignando..." : "Asignar"}
                                </Button>
                            </div>

                            {mostrarAsignacion && (
                                <button
                                    type="button"
                                    className="pqr-reassign-link"
                                    onClick={() => {
                                        setMostrarAsignacion(false);
                                        setAgenteSeleccionado("");
                                    }}
                                >
                                    Cancelar
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Historial colapsable */}
            <div className="pqr-card">
                <button
                    type="button"
                    className="pqr-historial-toggle"
                    onClick={() => setHistorialAbierto((current) => !current)}
                >
                    <h3>Historial · {seguimientos.length} eventos</h3>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        width="16"
                        height="16"
                        className={`pqr-historial-chevron ${historialAbierto ? "is-open" : ""}`}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                </button>

                {historialAbierto && (
                    !seguimientos.length ? (
                        <p className="pqr-empty">No hay seguimientos registrados aún.</p>
                    ) : (
                        <div className="pqr-historial-list">
                            {(seguimientos || []).map((seg) => (
                                <div key={seg.id} className="pqr-historial-item">
                                    <p className="pqr-historial-item-head">
                                        <strong>{seg.tipo_accion}</strong> {formatEventDate(seg.fecha_registro)}
                                    </p>
                                    <p className="pqr-historial-item-desc">{seg.descripcion}</p>
                                </div>
                            ))}
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default PQRDetail;