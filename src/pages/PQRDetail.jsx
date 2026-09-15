import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    getSeguimientos,
} from "../services/seguimientoService";

import { getPQRById, updatePQRStatus, } from "../services/pqrService";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import Select from "../components/common/Select";

const PQRDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [pqr, setPqr] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [seguimientos, setSeguimientos] = useState([]);
    const [nuevoEstado, setNuevoEstado] = useState("");
    const [actualizandoEstado, setActualizandoEstado] = useState(false);

    useEffect(() => {
        const loadPQR = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getPQRById(id);
                const historial = await getSeguimientos(id);

                setPqr(data);
                setSeguimientos(historial);
            } catch (err) {
                console.error(err);

                setError(
                    err.response?.data?.mensaje ||
                    err.response?.data?.detail ||
                    "No fue posible cargar la PQR."
                );
            } finally {
                setLoading(false);
            }
        };

        loadPQR();
    }, [id]);

    const handleUpdateStatus = async () => {
        if (!nuevoEstado || nuevoEstado === pqr.estado) {
            return;
        }

        try {
            setActualizandoEstado(true);

            const response = await updatePQRStatus(pqr.id, nuevoEstado);

            console.log("Respuesta actualización:", response);

            setPqr(response);
            setNuevoEstado("");

            const historial = await getSeguimientos(pqr.id);
            setSeguimientos(historial);
        } catch(error) {
            const mensaje =
                error.response?.data?.mensaje ||
                "No fue posible actualizar el estado.";

            alert(mensaje);
        } finally {
            setActualizandoEstado(false);
        }
    };

    const formatDate = (date) => {
        if (!date) {
            return "No disponible";
        }

        return new Date(date).toLocaleString("es-CO");
    };

    if (loading) {
        return <p>Cargando información de la PQR...</p>;
    }

    if (error) {
        return (
            <section>
                <p>{error}</p>

                <Button
                    type="button"
                    variant="secondary"
                    onClick={() => navigate("/pqr")}
                >
                    Volver a PQR
                </Button>
            </section>
        );
    }

    if (!pqr) {
        return (
            <section>
                <p>No se encontró la PQR.</p>

                <Button
                    type="button"
                    variant="secondary"
                    onClick={() => navigate("/pqr")}
                >
                    Volver a PQR
                </Button>
            </section>
        );
    }

    return (
        <section>
            <div>
                <Button
                    type="button"
                    variant="secondary"
                    onClick={() => navigate("/pqr")}
                >
                    ← Volver
                </Button>
            </div>

            <h2>Detalle de PQR</h2>

            <div>
                <h3>Información general</h3>

                <p>
                    <strong>Radicado:</strong>{" "}
                    {pqr.radicado}
                </p>

                <p>
                    <strong>Tipo:</strong>{" "}
                    {pqr.tipo}
                </p>

                <p>
                    <strong>Título:</strong>{" "}
                    {pqr.titulo}
                </p>

                <p>
                    <strong>Categoría:</strong>{" "}
                    {pqr.categoria || "Sin categoría"}
                </p>

                <p>
                    <strong>Canal:</strong>{" "}
                    {pqr.canal}
                </p>

                <p>
                    <strong>Fecha de creación:</strong>{" "}
                    {formatDate(pqr.created_at)}
                </p>

                <p>
                    <strong>Última actualización:</strong>{" "}
                    {formatDate(pqr.updated_at)}
                </p>
            </div>

            <div>
                <h3>Descripción</h3>

                <p>
                    {pqr.descripcion}
                </p>
            </div>

            <div>
                <h3>Estado y prioridad</h3>

                <p>
                    <strong>Estado:</strong>{" "}
                    <Badge
                        value={pqr.estado}
                        type="estado"
                    />
                </p>

                <Select
                    label="Cambiar estado"
                    name="nuevoEstado"
                    value={nuevoEstado}
                    onChange={(e) => setNuevoEstado(e.target.value)}
                    options={[
                        { value: "recibida", label: "Recibida" },
                        { value: "en_gestion", label: "En gestión" },
                        { value: "resuelta", label: "Resuelta" },
                        { value: "cerrada", label: "Cerrada" },
                    ]}
                />

                <Button
                    type="button"
                    onClick={handleUpdateStatus}
                    disabled={
                        actualizandoEstado ||
                        !nuevoEstado ||
                        nuevoEstado === pqr.estado
                    }
                >
                    {actualizandoEstado ? "Actualizando..." : "Actualizar estado"}
                </Button>

                <p>
                    <strong>Prioridad:</strong>{" "}
                    <Badge
                        value={pqr.prioridad}
                        type="prioridad"
                    />
                </p>
            </div>

            <div>
                <h3>Asignación</h3>

                <p>
                    <strong>Solicitante ID:</strong>{" "}
                    {pqr.solicitante_id}
                </p>

                <p>
                    <strong>Agente asignado:</strong>{" "}
                    {pqr.agente_asignado_id
                        ? pqr.agente_asignado_id
                        : "Sin asignar"}
                </p>
            </div>
            <div>
                <h3>Historial de seguimiento</h3>

                {!seguimientos.length ? (
                    <p>
                        No hay seguimientos registrados.
                    </p>
                ) : (
                    <div>
                        {seguimientos.map((seguimiento) => (
                            <article key={seguimiento.id}>
                                <p>
                                    <strong>
                                        {seguimiento.tipo_accion}
                                    </strong>
                                </p>

                                <p>
                                    {seguimiento.descripcion}
                                </p>

                                <p>
                                    Fecha:{" "}
                                    {formatDate(
                                        seguimiento.fecha_registro
                                    )}
                                </p>

                                <p>
                                    Agente:{" "}
                                    {seguimiento.agente_id
                                        ? seguimiento.agente_id
                                        : "Sistema"}
                                </p>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default PQRDetail;