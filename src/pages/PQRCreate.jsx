import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPQR } from "../services/pqrService";
import Input from "../components/common/Input";
import Button from "../components/common/Button";

const PQRCreate = () => {
    const navigate = useNavigate();

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
    const [errorGeneral, setErrorGeneral] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(null);

    const handleSolicitanteChange = (event) => {
        const { name, value } = event.target;

        setForm((current) => ({
            ...current,
            solicitante: {
                ...current.solicitante,
                [name]: value,
            },
        }));

        setErrors((current) => ({
            ...current,
            [name]: "",
        }));
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((current) => ({
            ...current,
            [name]: value,
        }));

        setErrors((current) => ({
            ...current,
            [name]: "",
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        const {
            nombre,
            apellido,
            tipo_documento,
            numero_documento,
            email,
            telefono,
        } = form.solicitante;

        if (!nombre.trim()) {
            newErrors.nombre = "El nombre es obligatorio.";
        }

        if (!apellido.trim()) {
            newErrors.apellido = "El apellido es obligatorio.";
        }

        if (!tipo_documento) {
            newErrors.tipo_documento =
                "Seleccione el tipo de documento.";
        }

        if (!numero_documento.trim()) {
            newErrors.numero_documento =
                "El número de documento es obligatorio.";
        }

        if (!email.trim()) {
            newErrors.email = "El correo electrónico es obligatorio.";
        } else if (!/^\S+@\S+\.\S+$/.test(email)) {
            newErrors.email =
                "Ingrese un correo electrónico válido.";
        }

        if (!telefono.trim()) {
            newErrors.telefono =
                "El teléfono es obligatorio.";
        }

        if (!form.tipo) {
            newErrors.tipo = "Seleccione el tipo de PQR.";
        }

        if (!form.titulo.trim()) {
            newErrors.titulo = "El título es obligatorio.";
        } else if (form.titulo.trim().length < 5) {
            newErrors.titulo =
                "El título debe tener al menos 5 caracteres.";
        }

        if (!form.descripcion.trim()) {
            newErrors.descripcion =
                "La descripción es obligatoria.";
        } else if (form.descripcion.trim().length < 10) {
            newErrors.descripcion =
                "La descripción debe tener al menos 10 caracteres.";
        }

        if (!form.prioridad) {
            newErrors.prioridad =
                "Seleccione la prioridad.";
        }

        if (!form.canal) {
            newErrors.canal =
                "Seleccione el canal.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setErrorGeneral("");
        setSuccess(null);

        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);

            const response = await createPQR({
                ...form,
                solicitante: {
                    ...form.solicitante,
                    nombre: form.solicitante.nombre.trim(),
                    apellido: form.solicitante.apellido.trim(),
                    numero_documento:
                        form.solicitante.numero_documento.trim(),
                    email: form.solicitante.email.trim(),
                    telefono: form.solicitante.telefono.trim(),
                },
                titulo: form.titulo.trim(),
                descripcion: form.descripcion.trim(),
                categoria: form.categoria.trim() || null,
            });

            /*
             * El backend responde con:
             *
             * {
             *   exito: true,
             *   mensaje: "...",
             *   data: {...}
             * }
             */
            const pqrCreada = response?.data;

            setSuccess(pqrCreada);

        } catch (err) {
            console.error(err);

            const backendErrors = err.response?.data;

            if (Array.isArray(backendErrors?.detail)) {
                setErrorGeneral(
                    backendErrors.detail
                        .map((item) => item.msg)
                        .join(" ")
                );
            } else {
                setErrorGeneral(
                    backendErrors?.mensaje ||
                    backendErrors?.detail ||
                    "No fue posible registrar la PQR."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    const handleNewPQR = () => {
        setSuccess(null);

        setForm({
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

        setErrors({});
        setErrorGeneral("");
    };

    if (success) {
        return (
            <section>
                <h2>PQR registrada correctamente</h2>

                <p>
                    {responseMessage(success)}
                </p>

                <div>
                    <strong>
                        Número de radicado:
                    </strong>

                    <p>
                        {success.radicado}
                    </p>
                </div>

                <Button
                    type="button"
                    onClick={() => navigate("/pqr")}
                >
                    Ver PQR
                </Button>

                <Button
                    type="button"
                    variant="secondary"
                    onClick={handleNewPQR}
                >
                    Registrar otra PQR
                </Button>
            </section>
        );
    }

    return (
        <section>
            <h2>Registrar nueva PQR</h2>

            {errorGeneral && (
                <p>
                    {errorGeneral}
                </p>
            )}

            <form onSubmit={handleSubmit}>

                <h3>Datos del solicitante</h3>

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

                <div className="form-field">
                    <label htmlFor="tipo_documento">
                        Tipo de documento
                    </label>

                    <select
                        id="tipo_documento"
                        name="tipo_documento"
                        value={form.solicitante.tipo_documento}
                        onChange={handleSolicitanteChange}
                    >
                        <option value="CC">
                            Cédula de ciudadanía
                        </option>

                        <option value="CE">
                            Cédula de extranjería
                        </option>

                        <option value="TI">
                            Tarjeta de identidad
                        </option>

                        <option value="PAS">
                            Pasaporte
                        </option>
                    </select>

                    {errors.tipo_documento && (
                        <span className="form-error">
                            {errors.tipo_documento}
                        </span>
                    )}
                </div>

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

                <h3>Información de la PQR</h3>

                <div className="form-field">
                    <label htmlFor="tipo">
                        Tipo de PQR
                    </label>

                    <select
                        id="tipo"
                        name="tipo"
                        value={form.tipo}
                        onChange={handleChange}
                    >
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

                    {errors.tipo && (
                        <span className="form-error">
                            {errors.tipo}
                        </span>
                    )}
                </div>

                <Input
                    label="Título"
                    name="titulo"
                    value={form.titulo}
                    placeholder="Ingrese el título de la PQR"
                    required
                    error={errors.titulo}
                    onChange={handleChange}
                />

                <div className="form-field">
                    <label htmlFor="descripcion">
                        Descripción
                    </label>

                    <textarea
                        id="descripcion"
                        name="descripcion"
                        value={form.descripcion}
                        placeholder="Describa detalladamente la solicitud"
                        rows="6"
                        onChange={handleChange}
                    />

                    {errors.descripcion && (
                        <span className="form-error">
                            {errors.descripcion}
                        </span>
                    )}
                </div>

                <Input
                    label="Categoría"
                    name="categoria"
                    value={form.categoria}
                    placeholder="Ej. Atención al usuario"
                    onChange={handleChange}
                />

                <div className="form-field">
                    <label htmlFor="prioridad">
                        Prioridad
                    </label>

                    <select
                        id="prioridad"
                        name="prioridad"
                        value={form.prioridad}
                        onChange={handleChange}
                    >
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

                    {errors.prioridad && (
                        <span className="form-error">
                            {errors.prioridad}
                        </span>
                    )}
                </div>

                <div className="form-field">
                    <label htmlFor="canal">
                        Canal
                    </label>

                    <select
                        id="canal"
                        name="canal"
                        value={form.canal}
                        onChange={handleChange}
                    >
                        <option value="web">
                            Web
                        </option>
                    </select>

                    {errors.canal && (
                        <span className="form-error">
                            {errors.canal}
                        </span>
                    )}
                </div>

                <div>
                    <Button
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Registrando..."
                            : "Registrar PQR"}
                    </Button>

                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => navigate("/pqr")}
                    >
                        Cancelar
                    </Button>
                </div>
            </form>
        </section>
    );
};

const responseMessage = (data) => {
    return data?.radicado
        ? "La PQR fue registrada correctamente."
        : "La PQR fue registrada correctamente.";
};

export default PQRCreate;