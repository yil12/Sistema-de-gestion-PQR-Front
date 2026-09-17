import { useEffect, useState } from "react";
import { getSolicitante } from "../services/solicitanteService";
import DataTable from "../components/common/DataTable";
import Button from "../components/common/Button";
import Toast from "../components/common/Toast";
import SolicitanteFormModal from "../components/common/SolicitanteFormModal";
import "../styles/css/SolicitanteList.css";

const SolicitantesList = () => {
    const [solicitantes, setSolicitantes] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [toast, setToast] = useState({
        show: false,
        mensaje: "",
        tipo: "success",
    });

    const [mostrarFormulario, setMostrarFormulario] = useState(false);

    const cargarSolicitantes = async () => {
        try {
            setLoading(true);
            const data = await getSolicitante();
            setSolicitantes(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
            
            const mensajeError = 
                err.response?.data?.detail || 
                err.response?.data?.mensaje || 
                "No fue posible cargar los solicitantes.";
            
            setToast({
                show: true,
                mensaje: mensajeError,
                tipo: "error",
            });
            setSolicitantes([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarSolicitantes();
    }, []);

    const handleCreated = () => {
        setMostrarFormulario(false);
        
        setToast({
            show: true,
            mensaje: "Solicitante registrado exitosamente.",
            tipo: "success",
        });
        
        cargarSolicitantes();
    };

    const columns = [
        { key: "nombre", label: "Nombre" },
        { key: "apellido", label: "Apellido" },
        { key: "email", label: "Correo" },
        { key: "telefono", label: "Teléfono" },
    ];

    return (
        <div className="solicitantes-list-container">
            {toast.show && (
                <Toast
                    tipo={toast.tipo}
                    mensaje={toast.mensaje}
                    onClose={() => setToast((prev) => ({ ...prev, show: false }))}
                    duracion={4000}
                />
            )}

            <div className="solicitantes-list-header">
                <h2>Solicitantes</h2>
                <Button type="button" variant="primary" onClick={() => setMostrarFormulario(true)}>
                    + Registrar solicitante
                </Button>
            </div>

            <DataTable
                columns={columns}
                data={solicitantes}
                loading={loading}
                emptyMessage="No hay solicitantes registrados"
            />

            {mostrarFormulario && (
                <SolicitanteFormModal
                    onClose={() => setMostrarFormulario(false)}
                    onCreated={handleCreated}
                />
            )}
        </div>
    );
};

export default SolicitantesList;