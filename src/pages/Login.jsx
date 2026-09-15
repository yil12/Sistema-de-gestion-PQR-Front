import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Input from "../components/common/Input";
import Button from "../components/common/Button";

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");

        if (!form.email || !form.password) {
            setError("Ingrese correo y contraseña.");
            return;
        }

        try {
            setLoading(true);

            await login(form.email, form.password);

            navigate("/pqr");
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.detail ||
                "Credenciales incorrectas."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <section>
            <h2>Iniciar sesión</h2>

            <form onSubmit={handleSubmit}>
                <Input
                    label="Correo electrónico"
                    name="email"
                    type="email"
                    value={form.email}
                    placeholder="Ingrese su correo"
                    required
                    onChange={handleChange}
                />

                <Input
                    label="Contraseña"
                    name="password"
                    type="password"
                    value={form.password}
                    placeholder="Ingrese su contraseña"
                    required
                    onChange={handleChange}
                />

                {error && (
                    <p>{error}</p>
                )}

                <Button
                    type="submit"
                    disabled={loading}
                >
                    {loading ? "Ingresando..." : "Iniciar sesión"}
                </Button>
            </form>
        </section>
    );
};

export default Login;