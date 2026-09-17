import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPQR } from "../services/pqrService";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import Select from "../components/common/Select";
import Toast from "../components/common/Toast";
import "../styles/css/PQRCreate.css";

const STEP_SOLICITANTE = 1;
const STEP_PQR = 2;

const PQRCreate = () => {
    const navigate = useNavigate();

    const [step, setStep] = useState(STEP_SOLICITANTE);
    const [maxStepReached, setMaxStepReached] = useState(STEP_SOLICITANTE);

    const [form, setForm] = useState({
        solicitante: {
            nombre: "",
            apellido: "",
            tipo_documento: "CC",
            numero_documento: "",
            email: "",
            telefono: "",
        },
        tipo: "peticion",
        titulo: "",
        descripcion: "",
        categoria: "",
        prioridad: "media",
        canal: "web",
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(null);

    const [toast, setToast] = useState({
        show: false,
        mensaje: "",
        tipo: "success",
    });

    const handleSolicitanteChange = (event) => {
        const { name, value } = event.target;
        setForm((current) => ({
            ...current,
            solicitante: { ...current.solicitante, [name]: value },
        }));
        setErrors((current) => ({ ...current, [name]: "" }));
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((current) => ({ ...current, [name]: value }));
        setErrors((current) => ({ ...current, [name]: "" }));
    };

    const validateSolicitante = () => {
        const newErrors = {};
        const { nombre, apellido, tipo_documento, numero_documento, email, telefono } = form.solicitante;

        if (!nombre.trim()) newErrors.nombre = "El nombre es obligatorio.";
        if (!apellido.trim()) newErrors.apellido = "El apellido es obligatorio.";
        if (!tipo_documento) newErrors.tipo_documento = "Seleccione el tipo de documento.";
        if (!numero_documento.trim()) newErrors.numero_documento = "El número de documento es obligatorio.";
        if (!email.trim()) newErrors.email = "El correo electrónico es obligatorio.";
        else if (!/^\S+@\S+\.\S+$/.test(email)) newErrors.email = "Ingrese un correo electrónico válido.";
        if (!telefono.trim()) newErrors.telefono = "El teléfono es obligatorio.";

        setErrors((current) => ({ ...current, ...newErrors }));
        return Object.keys(newErrors).length === 0;
    };

    const validatePQR = () => {
        const newErrors = {};

        if (!form.tipo) newErrors.tipo = "Seleccione el tipo de PQR.";
        if (!form.titulo.trim()) newErrors.titulo = "El título es obligatorio.";
        else if (form.titulo.trim().length < 5) newErrors.titulo = "El título debe tener al menos 5 caracteres.";
        if (!form.descripcion.trim()) newErrors.descripcion = "La descripción es obligatoria.";
        else if (form.descripcion.trim().length < 10) newErrors.descripcion = "La descripción debe tener al menos 10 caracteres.";
        if (!form.prioridad) newErrors.prioridad = "Seleccione la prioridad.";
        if (!form.canal) newErrors.canal = "Seleccione el canal.";

        setErrors((current) => ({ ...current, ...newErrors }));
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateSolicitante()) {
            setMaxStepReached((current) => Math.max(current, STEP_PQR));
            setStep(STEP_PQR);
        }
    };

    const handleBack = () => {
        setStep(STEP_SOLICITANTE);
    };

    const goToStep = (target) => {
        if (target <= maxStepReached) setStep(target);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        const solicitanteOk = validateSolicitante();
        const pqrOk = validatePQR();
        
        if (!solicitanteOk) {
            setStep(STEP_SOLICITANTE);
            return;
        }
        if (!pqrOk) return;

        try {
            setLoading(true);
            const response = await createPQR({
                ...form,
                solicitante: {
                    ...form.solicitante,
                    nombre: form.solicitante.nombre.trim(),
                    apellido: form.solicitante.apellido.trim(),
                    numero_documento: form.solicitante.numero_documento.trim(),
                    email: form.solicitante.email.trim(),
                    telefono: form.solicitante.telefono.trim(),
                },
                titulo: form.titulo.trim(),
                descripcion: form.descripcion.trim(),
                categoria: form.categoria.trim() || null,
            });

            const pqrCreada = response?.data || response; 
            setSuccess(pqrCreada);
            
        } catch (err) {
            console.error("Error al crear PQR:", err);
            
            const backendErrors = err.response?.data;
            let mensajeError = "No fue posible registrar la PQR. Intente nuevamente.";

            if (Array.isArray(backendErrors?.detail)) {
                mensajeError = backendErrors.detail
                    .map((item) => item.msg || item.message || "Error de validación")
                    .join(" ");
            } else {
                mensajeError = backendErrors?.mensaje || backendErrors?.detail || mensajeError;
            }

            setToast({
                show: true,
                mensaje: mensajeError,
                tipo: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleNewPQR = () => {
        setSuccess(null);
        setStep(STEP_SOLICITANTE);
        setMaxStepReached(STEP_SOLICITANTE);
        setForm({
            solicitante: { nombre: "", apellido: "", tipo_documento: "CC", numero_documento: "", email: "", telefono: "" },
            tipo: "peticion",
            titulo: "",
            descripcion: "",
            categoria: "",
            prioridad: "media",
            canal: "web",
        });
        setErrors({});
        setToast({ show: false, mensaje: "", tipo: "success" });
    };

    if (success) {
        return (
            <div className="pqr-success-container">
                {toast.show && (
                    <Toast
                        tipo={toast.tipo}
                        mensaje={toast.mensaje}
                        onClose={() => setToast((prev) => ({ ...prev, show: false }))}
                        duracion={5000}
                    />
                )}
                
                <div className="pqr-success-content">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="48" height="48" style={{ color: "var(--brand-green, #3d6b52)", marginBottom: "16px" }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h2>PQR registrada correctamente</h2>
                    <p>Guarda este número de radicado para hacerle seguimiento a tu solicitud.</p>

                    <div className="pqr-radicado-box">
                        <span className="pqr-radicado-label">Número de radicado</span>
                        <p className="pqr-radicado-value">{success.radicado}</p>
                    </div>

                    <div className="pqr-success-actions">
                        <Button type="button" variant="primary" onClick={() => navigate("/pqr")}>
                            Ir al listado
                        </Button>
                        <Button type="button" variant="secondary" onClick={handleNewPQR}>
                            Registrar otra PQR
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    // VISTA DEL FORMULARIO
    return (
        <div className="pqr-create-container">
            {toast.show && (
                <Toast
                    tipo={toast.tipo}
                    mensaje={toast.mensaje}
                    onClose={() => setToast((prev) => ({ ...prev, show: false }))}
                    duracion={5000}
                />
            )}

            <h2>Registrar nueva PQR</h2>

            {/* INDICADOR DE PASOS */}
            <div className="pqr-stepper">
                <button
                    type="button"
                    className={`pqr-step ${step === STEP_SOLICITANTE ? "is-active" : ""} ${maxStepReached > STEP_SOLICITANTE ? "is-done" : ""}`}
                    onClick={() => goToStep(STEP_SOLICITANTE)}
                >
                    <span className="pqr-step-index">
                        {maxStepReached > STEP_SOLICITANTE && step !== STEP_SOLICITANTE ? (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" width="12" height="12">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                        ) : (
                            "1"
                        )}
                    </span>
                    <span className="pqr-step-label">Datos del solicitante</span>
                </button>

                <span className={`pqr-step-divider ${maxStepReached > STEP_SOLICITANTE ? "is-done" : ""}`} />

                <button
                    type="button"
                    className={`pqr-step ${step === STEP_PQR ? "is-active" : ""}`}
                    disabled={maxStepReached < STEP_PQR}
                    onClick={() => goToStep(STEP_PQR)}
                >
                    <span className="pqr-step-index">2</span>
                    <span className="pqr-step-label">Información de la PQR</span>
                </button>
            </div>

            <form className="pqr-form" onSubmit={handleSubmit}>
                {/* PASO 1: DATOS DEL SOLICITANTE */}
                {step === STEP_SOLICITANTE && (
                    <div className="form-section">
                        <h3>Datos del solicitante</h3>

                        <div className="form-grid">
                            <Input
                                label="Nombre"
                                name="nombre"
                                value={form.solicitante.nombre}
                                placeholder="Ingrese el nombre"
                                required
                                error={errors.nombre}
                                onChange={handleSolicitanteChange}
                            />

                            <Input
                                label="Apellido"
                                name="apellido"
                                value={form.solicitante.apellido}
                                placeholder="Ingrese el apellido"
                                required
                                error={errors.apellido}
                                onChange={handleSolicitanteChange}
                            />

                            <Select
                                label="Tipo de documento"
                                name="tipo_documento"
                                value={form.solicitante.tipo_documento}
                                required
                                error={errors.tipo_documento}
                                onChange={handleSolicitanteChange}
                                options={[
                                    { value: "CC", label: "Cédula de ciudadanía" },
                                    { value: "CE", label: "Cédula de extranjería" },
                                    { value: "TI", label: "Tarjeta de identidad" },
                                    { value: "PAS", label: "Pasaporte" },
                                ]}
                            />

                            <Input
                                label="Número de documento"
                                name="numero_documento"
                                value={form.solicitante.numero_documento}
                                placeholder="Ingrese el número"
                                required
                                error={errors.numero_documento}
                                onChange={handleSolicitanteChange}
                            />

                            <Input
                                label="Correo electrónico"
                                name="email"
                                type="email"
                                value={form.solicitante.email}
                                placeholder="correo@ejemplo.com"
                                required
                                error={errors.email}
                                onChange={handleSolicitanteChange}
                            />

                            <Input
                                label="Teléfono"
                                name="telefono"
                                type="tel"
                                value={form.solicitante.telefono}
                                placeholder="3001234567"
                                required
                                error={errors.telefono}
                                onChange={handleSolicitanteChange}
                            />
                        </div>

                        <div className="pqr-form-actions">
                            <Button type="button" variant="primary" onClick={handleNext}>
                                Continuar
                            </Button>
                            <Button type="button" variant="secondary" onClick={() => navigate("/pqr")}>
                                Cancelar
                            </Button>
                        </div>
                    </div>
                )}

                {/* PASO 2: INFORMACIÓN DE LA PQR */}
                {step === STEP_PQR && (
                    <div className="form-section">
                        <h3>Información de la PQR</h3>

                        <div className="form-grid">
                            <Select
                                label="Tipo de PQR"
                                name="tipo"
                                value={form.tipo}
                                required
                                error={errors.tipo}
                                onChange={handleChange}
                                options={[
                                    { value: "peticion", label: "Petición" },
                                    { value: "queja", label: "Queja" },
                                    { value: "reclamo", label: "Reclamo" },
                                ]}
                            />

                            <Select
                                label="Prioridad"
                                name="prioridad"
                                value={form.prioridad}
                                required
                                error={errors.prioridad}
                                onChange={handleChange}
                                options={[
                                    { value: "baja", label: "Baja" },
                                    { value: "media", label: "Media" },
                                    { value: "alta", label: "Alta" },
                                    { value: "urgente", label: "Urgente" },
                                ]}
                            />

                            <Input
                                label="Título"
                                name="titulo"
                                value={form.titulo}
                                placeholder="Ingrese el título de la PQR"
                                required
                                error={errors.titulo}
                                onChange={handleChange}
                            />

                            <Input
                                label="Categoría"
                                name="categoria"
                                value={form.categoria}
                                placeholder="Ej. Atención al usuario"
                                error={errors.categoria}
                                onChange={handleChange}
                            />

                            <Select
                                label="Canal"
                                name="canal"
                                value={form.canal}
                                required
                                error={errors.canal}
                                onChange={handleChange}
                                options={[
                                    { value: "web", label: "Web" },
                                    { value: "email", label: "Email" },
                                    { value: "presencial", label: "Presencial" },
                                ]}
                            />

                            <div className="form-field full-width">
                                <label htmlFor="descripcion">Descripción <span className="required">*</span></label>
                                <textarea
                                    id="descripcion"
                                    name="descripcion"
                                    value={form.descripcion}
                                    placeholder="Describa detalladamente la solicitud"
                                    rows="5"
                                    className={`form-textarea ${errors.descripcion ? "has-error" : ""}`}
                                    onChange={handleChange}
                                />
                                {errors.descripcion && <span className="form-error">{errors.descripcion}</span>}
                            </div>
                        </div>

                        <div className="pqr-form-actions">
                            <Button type="submit" variant="primary" disabled={loading}>
                                {loading ? "Registrando..." : "Registrar PQR"}
                            </Button>
                            <Button type="button" variant="secondary" onClick={handleBack}>
                                Atrás
                            </Button>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
};

export default PQRCreate;