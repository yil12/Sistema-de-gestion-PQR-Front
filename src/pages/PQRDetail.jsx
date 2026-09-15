import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPQRById } from "../services/pqrService";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";

const PQRDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [pqr, setPqr] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadPQR = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getPQRById(id);

                setPqr(data);
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
        </section>
    );
};

export default PQRDetail;