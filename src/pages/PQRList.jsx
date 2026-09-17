import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPQR, searchPQRByRadicado } from "../services/pqrService";
import DataTable from "../components/common/DataTable";
import PQRBoard from "../components/common/PQRBoard";
import Button from "../components/common/Button";
import Badge from "../components/common/Badge";
import DynamicFilter from "../components/common/DynamicFilter";
import Toast from "../components/common/Toast";
import "../styles/css/PQRList.css";

const EMPTY_FILTERS = { tipo: "", estado: "", prioridad: "", categoria: "", radicado: "" };

const PQRList = () => {
    const navigate = useNavigate();

    const [viewMode, setViewMode] = useState("board");

    const [pqr, setPqr] = useState([]);
    const [loading, setLoading] = useState(true);

    const [toast, setToast] = useState({
        show: false,
        mensaje: "",
        tipo: "success",
    });

    const [appliedFilters, setAppliedFilters] = useState(EMPTY_FILTERS);

    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [total, setTotal] = useState(0);

    const loadPQR = async () => {
        try {
            setLoading(true);

            if (appliedFilters.radicado?.trim()) {
                const data = await searchPQRByRadicado(appliedFilters.radicado.trim());
                if (Array.isArray(data)) {
                    setPqr(data);
                    setTotal(data.length);
                } else if (data) {
                    setPqr([data]);
                    setTotal(1);
                } else {
                    setPqr([]);
                    setTotal(0);
                }
                return;
            }

            const fetchLimit = viewMode === "board" ? 100 : limit;
            const fetchPage = viewMode === "board" ? 1 : page;

            const params = {
                page: fetchPage,
                limit: fetchLimit
            };

            if (appliedFilters.tipo) params.tipo = appliedFilters.tipo;
            if (appliedFilters.estado) params.estado = appliedFilters.estado;
            if (appliedFilters.prioridad) params.prioridad = appliedFilters.prioridad;
            if (appliedFilters.categoria?.trim()) params.categoria = appliedFilters.categoria.trim();

            const response = await getPQR(params);

            let dataArray = [];
            let totalCount = 0;

            if (Array.isArray(response)) {
                dataArray = response;
                totalCount = response.length;
            } else if (response && response.data && Array.isArray(response.data)) {
                dataArray = response.data;
                totalCount = response.total || response.data.length;
            }

            setPqr(dataArray);
            setTotal(totalCount);

        } catch (err) {
            console.error(err);
            setPqr([]);
            setTotal(0);
            
            setToast({
                show: true,
                mensaje: err.response?.data?.mensaje || err.response?.data?.detail || "No fue posible cargar las PQR.",
                tipo: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (viewMode === "board") {
            setPage(1);
        }
        loadPQR();
    }, [page, appliedFilters, viewMode]);

    const handlePreviousPage = () => {
        if (page > 1) setPage((current) => current - 1);
    };

    const handleNextPage = () => {
        if (pqr.length === limit) setPage((current) => current + 1);
    };

    const handleApplyDynamicFilters = (dynamicFilters) => {
        setPage(1);
        setAppliedFilters({ ...EMPTY_FILTERS, ...dynamicFilters });
    };

    const columns = [
        { key: "radicado", label: "Radicado" },
        { key: "tipo", label: "Tipo", render: (row) => row.tipo.charAt(0).toUpperCase() + row.tipo.slice(1) },
        { key: "titulo", label: "Título" },
        { key: "prioridad", label: "Prioridad", render: (row) => <Badge value={row.prioridad} type="prioridad" /> },
        { key: "estado", label: "Estado", render: (row) => <Badge value={row.estado} type="estado" /> },
        { key: "categoria", label: "Categoría", render: (row) => row.categoria || "Sin categoría" },
        {
            key: "acciones",
            label: "Acciones",
            render: (row) => (
                <Button type="button" variant="outline" size="sm" onClick={() => navigate(`/pqr/${row.id}`)}>
                    Ver detalle
                </Button>
            ),
        },
    ];

    return (
        <div className="pqr-list-container">
            {toast.show && (
                <Toast
                    tipo={toast.tipo}
                    mensaje={toast.mensaje}
                    onClose={() => setToast((prev) => ({ ...prev, show: false }))}
                    duracion={4000}
                />
            )}

            {/* Barra de acciones superior */}
            <div className="pqr-action-bar">
                <div className="pqr-list-main-header">
                    <h2>Gestión de PQR</h2>
                </div>
                <div className="pqr-list-actions">
                    <DynamicFilter
                        onApplyFilters={handleApplyDynamicFilters}
                        initialFilters={appliedFilters}
                    />

                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setViewMode(viewMode === "table" ? "board" : "table")}
                    >
                        {viewMode === "table" ? (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="16" height="16" style={{ marginRight: "6px" }}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                                </svg>
                                Vista Tablero
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="16" height="16" style={{ marginRight: "6px" }}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                </svg>
                                Vista Tabla
                            </>
                        )}
                    </Button>

                    <Button variant="primary" size="sm" onClick={() => navigate("/pqr/nueva")}>
                        + Nueva PQR
                    </Button>
                </div>
            </div>


            {/* Renderizado condicional de vistas */}
            {viewMode === "table" ? (
                <>
                    <DataTable
                        columns={columns}
                        data={pqr}
                        loading={loading}
                        emptyMessage="No hay PQR que coincidan con los filtros."
                    />

                    {/* Paginación (solo tiene sentido en vista tabla) */}
                    {!loading && !appliedFilters.radicado && total > 0 && (
                        <div className="pqr-pagination">
                            <span className="pqr-pagination-info">
                                Página {page} — Mostrando {pqr.length} de {total} registros
                            </span>
                            <div className="pqr-pagination-actions">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    size="sm"
                                    disabled={page === 1}
                                    onClick={handlePreviousPage}
                                >
                                    Anterior
                                </Button>
                                <Button
                                    type="button"
                                    variant="secondary"
                                    size="sm"
                                    disabled={pqr.length < limit}
                                    onClick={handleNextPage}
                                >
                                    Siguiente
                                </Button>
                            </div>
                        </div>
                    )}
                </>
            ) : (
                // Vista Tablero (Kanban)
                <PQRBoard data={pqr} onEdit={(pqrItem) => navigate(`/pqr/${pqrItem.id}`)} />
            )}
        </div>
    );
};

export default PQRList;