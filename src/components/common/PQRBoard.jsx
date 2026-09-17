import { useNavigate } from "react-router-dom";
import Badge from "./Badge";
import "../../styles/css/PQRBoard.css";

const PQRBoard = ({ data = [], onEdit }) => {
    const navigate = useNavigate();

    const columns = [
        {
            id: "recibida",
            title: "Recibidas",
            color: "#e0e7ff",
            textColor: "#3730a3"
        },
        {
            id: "en_gestion",
            title: "En gestión",
            color: "#fef3c7",
            textColor: "#92400e"
        },
        {
            id: "resuelta",
            title: "Resueltas",
            color: "#d1fae5",
            textColor: "#065f46"
        },
        {
            id: "cerrada",
            title: "Cerradas",
            color: "#f3f4f6",
            textColor: "#475569"
        },
    ];

    const groupedPQR = columns.reduce((acc, column) => {
        acc[column.id] = data.filter(pqr => pqr.estado === column.id);
        return acc;
    }, {});

    const formatDate = (date) => {
        if (!date) return "";
        return new Date(date).toLocaleDateString("es-CO", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        });
    };



    return (
        <div className="kanban-board">
            {columns.map((column) => (
                <div key={column.id} className="kanban-column">
                    {/* Header de la columna */}
                    <div className="kanban-column-header">
                        <h3 className="kanban-column-title">{column.title}</h3>
                        <span
                            className="kanban-column-count"
                            style={{
                                backgroundColor: column.color,
                                color: column.textColor
                            }}
                        >
                            {groupedPQR[column.id].length}
                        </span>
                    </div>

                    {/* Tarjetas de la columna */}
                    <div className="kanban-cards-container">
                        {groupedPQR[column.id].length > 0 ? (
                            groupedPQR[column.id].map((pqr) => (
                                <div
                                    key={pqr.id}
                                    className="kanban-card"
                                    onClick={() => navigate(`/pqr/${pqr.id}`)}
                                >
                                    {/* Badge de prioridad */}
                                    <div className="kanban-card-header">
                                        <Badge
                                            value={pqr.prioridad}
                                            type="prioridad"
                                        />
                                        {onEdit && (
                                            <button
                                                className="kanban-card-edit"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onEdit(pqr);
                                                }}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="16" height="16">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>

                                    {/* Título y descripción */}
                                    <h4 className="kanban-card-title">{pqr.titulo}</h4>

                                    {/* Meta información */}
                                    <div className="kanban-card-meta">
                                        <div className="kanban-card-info">
                                            <span className="kanban-label">Radicado:</span>
                                            <span className="kanban-value">{pqr.radicado}</span>
                                        </div>
                                        <div className="kanban-card-info">
                                            <span className="kanban-label">Tipo:</span>
                                            <span className="kanban-value">{pqr.tipo}</span>
                                        </div>
                                        {pqr.categoria && (
                                            <div className="kanban-card-info">
                                                <span className="kanban-label">Categoría:</span>
                                                <span className="kanban-value">{pqr.categoria}</span>
                                            </div>
                                        )}
                                        <div className="kanban-card-info">
                                            <span className="kanban-label">Creada:</span>
                                            <span className="kanban-value">{formatDate(pqr.created_at)}</span>
                                        </div>
                                    </div>

                                    {pqr.agente_asignado_id && (
                                        <div className="kanban-card-footer">
                                            <span className="pqr-field-label">Usuario</span>
                                            <span className="kanban-assignee">
                                                {pqr.solicitante
                                                    ? `${pqr.solicitante.nombre} ${pqr.solicitante.apellido ?? ""}`.trim()
                                                    : "No disponible"
                                                }
                                            </span>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="kanban-empty-column">
                                <p>Sin PQR</p>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default PQRBoard;