import { useEffect, useState } from "react";
import {
    getPQR,
    searchPQRByRadicado,
} from "../services/pqrService";
import DataTable from "../components/common/DataTable";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import Input from "../components/common/Input";

const PQRList = () => {
    const [pqr, setPqr] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [filters, setFilters] = useState({
        tipo: "",
        estado: "",
        prioridad: "",
        categoria: "",
        radicado: "",
    });

    const [appliedFilters, setAppliedFilters] = useState({
        tipo: "",
        estado: "",
        prioridad: "",
        categoria: "",
        radicado: "",
    });

    const [page, setPage] = useState(1);
    const [limit] = useState(10);

    const [total, setTotal] = useState(0);

    const loadPQR = async () => {
        try {
            setLoading(true);
            setError("");

            // Si existe búsqueda por radicado,
            // utilizamos el endpoint específico.
            if (appliedFilters.radicado.trim()) {
                const data = await searchPQRByRadicado(
                    appliedFilters.radicado.trim()
                );

                // El endpoint puede devolver una PQR individual
                // o una estructura diferente.
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

            const params = {
                page,
                limit,
            };

            if (appliedFilters.tipo) {
                params.tipo = appliedFilters.tipo;
            }

            if (appliedFilters.estado) {
                params.estado = appliedFilters.estado;
            }

            if (appliedFilters.prioridad) {
                params.prioridad = appliedFilters.prioridad;
            }

            if (appliedFilters.categoria.trim()) {
                params.categoria = appliedFilters.categoria.trim();
            }

            const response = await getPQR(params);

            /*
             * Actualmente getPQR() devuelve directamente
             * response.data.data.
             */
            if (Array.isArray(response)) {
                setPqr(response);
                setTotal(response.length);
            } else {
                setPqr([]);
                setTotal(0);
            }
        } catch (err) {
            console.error(err);

            setPqr([]);
            setTotal(0);

            setError(
                err.response?.data?.mensaje ||
                err.response?.data?.detail ||
                "No fue posible cargar las PQR."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPQR();
    }, [page, appliedFilters]);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFilters((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const handleApplyFilters = (event) => {
        event.preventDefault();

        setPage(1);
        setAppliedFilters(filters);
    };

    const handleClearFilters = () => {
        const emptyFilters = {
            tipo: "",
            estado: "",
            prioridad: "",
            categoria: "",
            radicado: "",
        };

        setFilters(emptyFilters);
        setAppliedFilters(emptyFilters);
        setPage(1);
    };

    const handlePreviousPage = () => {
        if (page > 1) {
            setPage((current) => current - 1);
        }
    };

    const handleNextPage = () => {
        if (pqr.length === limit) {
            setPage((current) => current + 1);
        }
    };

    const columns = [
        {
            key: "radicado",
            label: "Radicado",
        },
        {
            key: "tipo",
            label: "Tipo",
        },
        {
            key: "titulo",
            label: "Título",
        },
        {
            key: "prioridad",
            label: "Prioridad",
            render: (row) => (
                <Badge
                    value={row.prioridad}
                    type="prioridad"
                />
            ),
        },
        {
            key: "estado",
            label: "Estado",
            render: (row) => (
                <Badge
                    value={row.estado}
                    type="estado"
                />
            ),
        },
        {
            key: "categoria",
            label: "Categoría",
            render: (row) => row.categoria || "Sin categoría",
        },
    ];

    return (
        <section>
            <h2>PQR</h2>

            <form onSubmit={handleApplyFilters}>
                <Input
                    label="Radicado"
                    name="radicado"
                    value={filters.radicado}
                    placeholder="Ej. PQR-2026-000007"
                    onChange={handleChange}
                />

                <div className="form-field">
                    <label htmlFor="tipo">
                        Tipo
                    </label>

                    <select
                        id="tipo"
                        name="tipo"
                        value={filters.tipo}
                        onChange={handleChange}
                    >
                        <option value="">
                            Todos
                        </option>

                        <option value="peticion">
                            Petición
                        </option>

                        <option value="queja">
                            Queja
                        </option>

                        <option value="reclamo">
                            Reclamo
                        </option>
                    </select>
                </div>

                <div className="form-field">
                    <label htmlFor="estado">
                        Estado
                    </label>

                    <select
                        id="estado"
                        name="estado"
                        value={filters.estado}
                        onChange={handleChange}
                    >
                        <option value="">
                            Todos
                        </option>

                        <option value="recibida">
                            Recibida
                        </option>

                        <option value="en_gestion">
                            En gestión
                        </option>

                        <option value="resuelta">
                            Resuelta
                        </option>

                        <option value="cerrada">
                            Cerrada
                        </option>
                    </select>
                </div>

                <div className="form-field">
                    <label htmlFor="prioridad">
                        Prioridad
                    </label>

                    <select
                        id="prioridad"
                        name="prioridad"
                        value={filters.prioridad}
                        onChange={handleChange}
                    >
                        <option value="">
                            Todas
                        </option>

                        <option value="baja">
                            Baja
                        </option>

                        <option value="media">
                            Media
                        </option>

                        <option value="alta">
                            Alta
                        </option>

                        <option value="urgente">
                            Urgente
                        </option>
                    </select>
                </div>

                <Input
                    label="Categoría"
                    name="categoria"
                    value={filters.categoria}
                    placeholder="Ej. Atención"
                    onChange={handleChange}
                />

                <div>
                    <Button type="submit">
                        Aplicar filtros
                    </Button>

                    <Button
                        type="button"
                        variant="secondary"
                        onClick={handleClearFilters}
                    >
                        Limpiar
                    </Button>
                </div>
            </form>

            {error && (
                <p>
                    {error}
                </p>
            )}

            <DataTable
                columns={columns}
                data={pqr}
                loading={loading}
                emptyMessage="No hay PQR que coincidan con los filtros."
            />

            {!loading && !appliedFilters.radicado && (
                <div>
                    <p>
                        Página {page}
                        {total > 0 && ` — ${total} registros`}
                    </p>

                    <Button
                        type="button"
                        variant="secondary"
                        disabled={page === 1}
                        onClick={handlePreviousPage}
                    >
                        Anterior
                    </Button>

                    <Button
                        type="button"
                        variant="secondary"
                        disabled={pqr.length < limit}
                        onClick={handleNextPage}
                    >
                        Siguiente
                    </Button>
                </div>
            )}
        </section>
    );
};

export default PQRList;