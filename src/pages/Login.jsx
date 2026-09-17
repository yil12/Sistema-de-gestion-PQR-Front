import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import Toast from "../components/common/Toast";

import "../styles/css/Login.css";

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);

    
    const [toast, setToast] = useState({
        show: false,
        mensaje: "",
        tipo: "success",
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        
        if (!emailRegex.test(form.email)) {
            setToast({
                show: true,
                mensaje: "Ingrese un correo electrónico válido.",
                tipo: "error",
            });
            return;
        }

        try {
            setLoading(true);
            await login(form.email, form.password);
            
            
            setToast({
                show: true,
                mensaje: "¡Inicio de sesión exitoso! Redirigiendo...",
                tipo: "success",
            });

            
            setTimeout(() => {
                navigate("/pqr");
            }, 1500);

        } catch (err) {
            console.error(err);
            
            setToast({
                show: true,
                mensaje: err.response?.data?.detail || err.response?.data?.mensaje || "Credenciales incorrectas.",
                tipo: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            
            {toast.show && (
                <Toast
                    tipo={toast.tipo}
                    mensaje={toast.mensaje}
                    onClose={() => setToast((prev) => ({ ...prev, show: false }))}
                    duracion={4000}
                />
            )}

            <div className="login-shell">
                
                <aside className="login-panel">
                    <div className="login-logos">
                        <div className="login-brand-seal">
                            <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="32" cy="32" r="30" fill="none" stroke="#a9b7c6" strokeWidth="0.6" opacity="0.5" />
                                <circle cx="32" cy="32" r="25" fill="none" stroke="#f2f0ea" strokeWidth="0.8" />
                                <text
                                    x="32" y="37"
                                    textAnchor="middle"
                                    fontFamily="'Source Serif 4', Georgia, serif"
                                    fontSize="15"
                                    fontWeight="600"
                                    letterSpacing="0.8"
                                    fill="#f2f0ea"
                                >
                                    PQR
                                </text>
                                <circle cx="32" cy="10" r="1.6" fill="#b8791e" />
                            </svg>
                        </div>
                    </div>

                    <h1>Acceso interno</h1>

                    <p>
                        Ingresa con tus credenciales institucionales para
                        gestionar las PQR asignadas a tu área.
                    </p>

                    <div className="login-restricted">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="5" y="10" width="14" height="10" rx="2"
                                stroke="currentColor" strokeWidth="1.6" />
                            <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor"
                                strokeWidth="1.6" strokeLinecap="round" />
                        </svg>
                        Acceso restringido a personal autorizado
                    </div>
                </aside>

                {/* Panel derecho: formulario */}
                <section className="login-content">
                    <div className="login-header">
                        <h2>Bienvenido de nuevo</h2>
                        <p>Inicia sesión para continuar</p>
                    </div>

                    <form className="login-form-content" onSubmit={handleSubmit}>
                        <Input
                            label="Correo electrónico"
                            name="email"
                            type="email"
                            value={form.email}
                            placeholder="correo@ejemplo.com"
                            required
                            onChange={handleChange}
                        />

                        <Input
                            label="Contraseña"
                            name="password"
                            type="password"
                            value={form.password}
                            placeholder="Ingresa tu contraseña"
                            required
                            onChange={handleChange}
                        />

                        <div className="forgot-password">
                            <a href="/">¿Olvidaste tu contraseña?</a>
                        </div>

                        

                        <Button
                            type="submit"
                            variant="ink"
                            disabled={loading}
                            block
                        >
                            {loading ? "Iniciando sesión..." : "Iniciar sesión"}
                        </Button>
                    </form>

                    <div className="login-back">
                        <a href="/">← Volver al portal público</a>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Login;