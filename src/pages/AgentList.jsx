import { useEffect, useState } from "react";
import { getAgentes } from "../services/agenteService";
import DataTable from "../components/common/DataTable";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import Toast from "../components/common/Toast";
import AgenteFormModal from "../components/common/AgentFormModal";
import "../styles/css/AgentList.css";

const ROL_KEYS = {
    1: "agente",
    2: "supervisor",
    3: "administrador",
};

const AgentesList = () => {
    const [agentes, setAgentes] = useState([]);
    const [loading, setLoading] = useState(true);

    const [toast, setToast] = useState({
        show: false,
        mensaje: "",
        tipo: "success",
    });

    const [mostrarFormulario, setMostrarFormulario] = useState(false);

    const cargarAgentes = async () => {
        try {
            setLoading(true);
            const data = await getAgentes();
            setAgentes(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);

            const mensajeError =
                err.response?.data?.detail ||
                err.response?.data?.mensaje ||
                "No fue posible cargar la lista de agentes.";

            setToast({
                show: true,
                mensaje: mensajeError,
                tipo: "error",
            });
            setAgentes([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarAgentes();
    }, []);

    const handleCreated = () => {
        setMostrarFormulario(false);
        setToast({
            show: true,
            mensaje: "Agente creado exitosamente.",
            tipo: "success",
        });
        cargarAgentes();
    };

    const columns = [
        { key: "nombre", label: "Nombre" },
        { key: "email", label: "Correo" },
        {
            key: "rol_id",
            label: "Rol",
            render: (row) => <Badge value={ROL_KEYS[row.rol_id] || "agente"} type="rol" />,
        },
    ];

    return (
        <div className="agentes-list-container">
            {toast.show && (
                <Toast
                    tipo={toast.tipo}
                    mensaje={toast.mensaje}
                    onClose={() => setToast((prev) => ({ ...prev, show: false }))}
                    duracion={4000}
                />
            )}

            <div className="agentes-list-header">
                <h2>Agentes</h2>
                <Button type="button" variant="primary" onClick={() => setMostrarFormulario(true)}>
                    + Crear agente
                </Button>
            </div>

            <DataTable
                columns={columns}
                data={agentes}
                loading={loading}
                emptyMessage="No hay agentes registrados"
            />

            {mostrarFormulario && (
                <AgenteFormModal
                    onClose={() => setMostrarFormulario(false)}
                    onCreated={handleCreated}
                />
            )}
        </div>
    );
};

export default AgentesList;