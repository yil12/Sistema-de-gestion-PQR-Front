import { useEffect, useState } from "react";
import Button from "../common/Button";
import { createSolicitante } from "../../services/solicitanteService";
import "../../styles/css/SolicitanteFormModal.css";

const soloNumeros = (value) => value.replace(/\D/g, "");

const TIPO_DOCUMENTO_OPTIONS = [
    { value: "CC", label: "Cédula de ciudadanía" },
    { value: "CE", label: "Cédula de extranjería" },
    { value: "TI", label: "Tarjeta de identidad" },
    { value: "PA", label: "Pasaporte" },
    { value: "NIT", label: "NIT" },
];

const SolicitanteFormModal = ({ onClose, onCreated }) => {
    const [tipoDocumento, setTipoDocumento] = useState("CC");
    const [numeroDocumento, setNumeroDocumento] = useState("");
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [email, setEmail] = useState("");
    const [telefono, setTelefono] = useState("");
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

        if (!numeroDocumento.trim() || !nombre.trim() || !email.trim()) {
            setError("Completa al menos el documento, el nombre y el correo.");
            return;
        }

        try {
            setGuardando(true);
            setError("");
            await createSolicitante({
                tipo_documento: tipoDocumento,
                numero_documento: numeroDocumento.trim(),
                nombre: nombre.trim(),
                apellido: apellido.trim(),
                email: email.trim(),
                telefono: telefono.trim(),
            });
            onCreated();
        } catch (err) {
            setError(err.response?.data?.mensaje || "No fue posible registrar el solicitante.");
        } finally {
            setGuardando(false);
        }
    };

    return (
        <div
            className="solicitante-modal-overlay"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="solicitante-modal" role="dialog" aria-modal="true" aria-labelledby="solicitante-modal-title">
                <div className="solicitante-modal-header">
                    <h3 id="solicitante-modal-title">Nuevo solicitante</h3>
                    <button type="button" className="solicitante-modal-close" onClick={onClose} aria-label="Cerrar">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" width="18" height="18">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form className="solicitante-modal-form" onSubmit={handleSubmit}>
                    <div className="solicitante-form-row">
                        <label className="solicitante-form-field solicitante-form-field-tipo">
                            <span className="solicitante-form-label">Tipo de documento</span>
                            <select
                                className="solicitante-form-input"
                                value={tipoDocumento}
                                onChange={(e) => setTipoDocumento(e.target.value)}
                            >
                                {TIPO_DOCUMENTO_OPTIONS.map((opt) => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </label>

                        <label className="solicitante-form-field solicitante-form-field-numero">
                            <span className="solicitante-form-label">Número de documento</span>
                            <input
                                type="text"
                                inputMode="numeric"
                                className="solicitante-form-input"
                                value={numeroDocumento}
                                onChange={(e) => setNumeroDocumento(soloNumeros(e.target.value))}
                                placeholder="1000000000"
                            />
                        </label>
                    </div>

                    <label className="solicitante-form-field">
                        <span className="solicitante-form-label">Nombre</span>
                        <input
                            type="text"
                            className="solicitante-form-input"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            placeholder="Nombre"
                        />
                    </label>

                    <label className="solicitante-form-field">
                        <span className="solicitante-form-label">Apellido</span>
                        <input
                            type="text"
                            className="solicitante-form-input"
                            value={apellido}
                            onChange={(e) => setApellido(e.target.value)}
                            placeholder="Apellido"
                        />
                    </label>

                    <label className="solicitante-form-field">
                        <span className="solicitante-form-label">Correo electrónico</span>
                        <input
                            type="email"
                            className="solicitante-form-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="nombre@correo.com"
                        />
                    </label>

                    <label className="solicitante-form-field">
                        <span className="solicitante-form-label">Teléfono</span>
                        <input
                            type="tel"
                            inputMode="numeric"
                            className="solicitante-form-input"
                            value={telefono}
                            onChange={(e) => setTelefono(soloNumeros(e.target.value))}
                            placeholder="3000000000"
                        />
                    </label>

                    {error && <p className="solicitante-form-error">{error}</p>}

                    <div className="solicitante-modal-actions">
                        <button type="button" className="solicitante-link-btn" onClick={onClose}>
                            Cancelar
                        </button>
                        <Button type="submit" variant="primary" disabled={guardando}>
                            {guardando ? "Guardando..." : "Registrar solicitante"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SolicitanteFormModal;