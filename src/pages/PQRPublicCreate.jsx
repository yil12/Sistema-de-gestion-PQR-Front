import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPQR } from "../services/pqrService";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import Select from "../components/common/Select";
import Toast from "../components/common/Toast";
import "../styles/css/PQRPublicCreate.css";

const STEP_SOLICITANTE = 1;
const STEP_PQR = 2;

const PQRPublicCreate = () => {
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
        setSuccess(null);

        const solicitanteOk = validateSolicitante();
        const pqrOk = validatePQR();

        if (!solicitanteOk) {
            setStep(STEP_SOLICITANTE);
            return;
        }
        if (!pqrOk) {
            setStep(STEP_PQR);
            return;
        }

        try {
            setLoading(true);

            const response = await createPQR({
                ...form,
                canal: "web",
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
            console.error("Error al registrar PQR pública:", err);

            const backendErrors = err.response?.data;
            let mensajeError = "No fue posible registrar la PQR. Intente nuevamente más tarde.";

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



    const renderToast = () =>
        toast.show ? (
            <Toast
                tipo={toast.tipo}
                mensaje={toast.mensaje}
                onClose={() => setToast((prev) => ({ ...prev, show: false }))}
                duracion={5000}
            />
        ) : null;

    if (success) {
        return (
            <div className="pqr-public-page">
                {renderToast()}
                <div className="pqr-public-success">
                    <div className="pqr-success-icon">✓</div>
                    <h1>¡Solicitud radicada!</h1>
                    <p className="pqr-success-description">
                        Tu PQR fue registrada correctamente. Guarda tu número de radicado para consultar el estado de tu solicitud.
                    </p>

                    <div className="pqr-radicado-box">
                        <span>Número de radicado</span>
                        <strong>{success.radicado}</strong>
                    </div>

                    <div className="pqr-success-actions">
                        <Button
                            type="button"
                            variant="primary"
                            onClick={() => navigate(`/pqr/consultar?radicado=${success.radicado}`)}
                        >
                            Consultar estado
                        </Button>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={handleNewPQR}
                        >
                            Registrar otra PQR
                        </Button>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => navigate("/")}
                        >
                            Volver al inicio
                        </Button>
                    </div>
                </div>
            </div>
        );
    }


    return (
        <div className="pqr-public-page">
            {renderToast()}

            <div className="pqr-public-header">
                <div className="pqr-public-brand">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L21 6.5V11C21 16 17.5 20.5 12 22C6.5 20.5 3 16 3 11V6.5L12 2Z"
                            stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                        <path d="M8.5 12L11 14.5L16 9" stroke="currentColor" strokeWidth="1.6"
                            strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Portal PQR
                </div>
                <h1>Registrar una PQR</h1>
                <p>
                    Cuéntanos qué necesitas. Registraremos tu solicitud y te entregaremos un número de radicado para consultar su estado.
                </p>
            </div>

            <div className="pqr-public-stepper">
                <button
                    type="button"
                    className={`pqr-public-step ${step === STEP_SOLICITANTE ? "is-active" : ""} ${maxStepReached > STEP_SOLICITANTE ? "is-done" : ""}`}
                    onClick={() => goToStep(STEP_SOLICITANTE)}
                >
                    <span className="pqr-public-step-index">
                        {maxStepReached > STEP_SOLICITANTE && step !== STEP_SOLICITANTE ? "✓" : "1"}
                    </span>
                    <span>Tus datos</span>
                </button>

                <span className={`pqr-public-step-divider ${maxStepReached > STEP_SOLICITANTE ? "is-done" : ""}`} />

                <button
                    type="button"
                    className={`pqr-public-step ${step === STEP_PQR ? "is-active" : ""}`}
                    disabled={maxStepReached < STEP_PQR}
                    onClick={() => goToStep(STEP_PQR)}
                >
                    <span className="pqr-public-step-index">2</span>
                    <span>Tu solicitud</span>
                </button>
            </div>


            <form className="pqr-public-form" onSubmit={handleSubmit}>
                {step === STEP_SOLICITANTE && (
                    <section className="pqr-public-section">
                        <div className="pqr-public-section-header">
                            <h2>Tus datos</h2>
                            <p>Necesitamos esta información para identificar tu solicitud y poder contactarte si es necesario.</p>
                        </div>

                        <div className="form-grid">
                            <Input label="Nombre" name="nombre" value={form.solicitante.nombre} placeholder="Ingresa tu nombre" required error={errors.nombre} onChange={handleSolicitanteChange} />
                            <Input label="Apellido" name="apellido" value={form.solicitante.apellido} placeholder="Ingresa tu apellido" required error={errors.apellido} onChange={handleSolicitanteChange} />

                            <Select
                                label="Tipo de documento" name="tipo_documento" value={form.solicitante.tipo_documento} required error={errors.tipo_documento} onChange={handleSolicitanteChange}
                                options={[
                                    { value: "CC", label: "Cédula de ciudadanía" },
                                    { value: "CE", label: "Cédula de extranjería" },
                                    { value: "TI", label: "Tarjeta de identidad" },
                                    { value: "PAS", label: "Pasaporte" },
                                ]}
                            />

                            <Input label="Número de documento" inputMode="numeric" name="numero_documento" value={form.solicitante.numero_documento} placeholder="Ingresa tu número" required error={errors.numero_documento} onChange={handleSolicitanteChange} />
                            <Input label="Correo electrónico" name="email" type="email" value={form.solicitante.email} placeholder="correo@ejemplo.com" required error={errors.email} onChange={handleSolicitanteChange} />
                            <Input label="Teléfono" inputMode="numeric" name="telefono" type="tel" value={form.solicitante.telefono} placeholder="3001234567" required error={errors.telefono} onChange={handleSolicitanteChange} />
                        </div>

                        <div className="pqr-public-actions">
                            <Button type="button" variant="primary" onClick={handleNext}>Continuar</Button>
                            <Button type="button" variant="secondary" onClick={() => navigate("/pqr/consultar")}>Consultar una PQR</Button>
                            <Button type="button" variant="secondary" onClick={() => navigate("/")}>Volver al inicio</Button>
                        </div>
                    </section>
                )}

                {step === STEP_PQR && (
                    <section className="pqr-public-section">
                        <div className="pqr-public-section-header">
                            <h2>Cuéntanos qué necesitas</h2>
                            <p>Describe tu solicitud con el mayor detalle posible.</p>
                        </div>

                        <div className="form-grid">
                            <Select
                                label="Tipo de PQR" name="tipo" value={form.tipo} required error={errors.tipo} onChange={handleChange}
                                options={[
                                    { value: "peticion", label: "Petición" },
                                    { value: "queja", label: "Queja" },
                                    { value: "reclamo", label: "Reclamo" },
                                ]}
                            />

                            <Select
                                label="Prioridad" name="prioridad" value={form.prioridad} required error={errors.prioridad} onChange={handleChange}
                                options={[
                                    { value: "baja", label: "Baja" },
                                    { value: "media", label: "Media" },
                                    { value: "alta", label: "Alta" },
                                    { value: "urgente", label: "Urgente" },
                                ]}
                            />

                            <Input label="Título" name="titulo" value={form.titulo} placeholder="Ej. Solicitud de información" required error={errors.titulo} onChange={handleChange} />
                            <Input label="Categoría" name="categoria" value={form.categoria} placeholder="Ej. Atención al usuario" error={errors.categoria} onChange={handleChange} />

                            <div className="form-field full-width">
                                <label htmlFor="descripcion">Describe tu solicitud <span className="required">*</span></label>
                                <textarea
                                    id="descripcion" name="descripcion" value={form.descripcion}
                                    placeholder="Cuéntanos qué ocurrió o qué necesitas solicitar..."
                                    rows="6" className={`form-textarea ${errors.descripcion ? "has-error" : ""}`}
                                    onChange={handleChange}
                                />
                                {errors.descripcion && <span className="form-error">{errors.descripcion}</span>}
                            </div>
                        </div>

                        <div className="pqr-public-actions">
                            <Button type="button" variant="secondary" onClick={handleBack}>Atrás</Button>
                            <Button type="submit" variant="primary" disabled={loading}>
                                {loading ? "Registrando..." : "Radicar solicitud"}
                            </Button>
                        </div>
                    </section>
                )}
            </form>

            <div className="pqr-public-footer">
                <button type="button" onClick={() => navigate("/pqr/consultar")}>
                    ¿Ya tienes un número de radicado? Consulta tu PQR
                </button>
            </div>
        </div>
    );
};

export default PQRPublicCreate;