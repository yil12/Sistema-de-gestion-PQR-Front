import { useEffect, useState } from "react";
import Button from "../common/Button";
import { createAgente } from "../../services/agenteService";
import "../../styles/css/AgentFormModal.css";

const ROL_OPTIONS = [
    { value: "1", label: "Agente" },
    { value: "2", label: "Supervisor" },
    { value: "3", label: "Administrador" },
];

const AgenteFormModal = ({ onClose, onCreated }) => {
    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rolId, setRolId] = useState("1");
    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [onClose]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!nombre.trim() || !email.trim() || !password.trim()) {
            setError("Completa nombre, correo y contraseña.");
            return;
        }

        try {
            setGuardando(true);
            setError("");
            await createAgente({
                nombre: nombre.trim(),
                email: email.trim(),
                password,
                rol_id: Number(rolId),
            });
            onCreated();
        } catch (err) {
            setError(err.response?.data?.mensaje || "No fue posible crear el agente.");
        } finally {
            setGuardando(false);
        }
    };

    return (
        <div
            className="agente-modal-overlay"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="agente-modal" role="dialog" aria-modal="true" aria-labelledby="agente-modal-title">
                <div className="agente-modal-header">
                    <h3 id="agente-modal-title">Nuevo agente</h3>
                    <button type="button" className="agente-modal-close" onClick={onClose} aria-label="Cerrar">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" width="18" height="18">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form className="agente-modal-form" onSubmit={handleSubmit}>
                    <label className="agente-form-field">
                        <span className="agente-form-label">Nombre completo</span>
                        <input
                            type="text"
                            className="agente-form-input"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            placeholder="Nombre y apellido"
                        />
                    </label>

                    <label className="agente-form-field">
                        <span className="agente-form-label">Correo electrónico</span>
                        <input
                            type="email"
                            className="agente-form-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="nombre@empresa.com"
                        />
                    </label>

                    <label className="agente-form-field">
                        <span className="agente-form-label">Contraseña</span>
                        <input
                            type="password"
                            className="agente-form-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                        />
                    </label>

                    <label className="agente-form-field">
                        <span className="agente-form-label">Rol</span>
                        <select
                            className="agente-form-input"
                            value={rolId}
                            onChange={(e) => setRolId(e.target.value)}
                        >
                            {ROL_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </label>

                    {error && <p className="agente-form-error">{error}</p>}

                    <div className="agente-modal-actions">
                        <button type="button" className="agente-link-btn" onClick={onClose}>
                            Cancelar
                        </button>
                        <Button type="submit" variant="primary" disabled={guardando}>
                            {guardando ? "Creando..." : "Crear agente"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AgenteFormModal;