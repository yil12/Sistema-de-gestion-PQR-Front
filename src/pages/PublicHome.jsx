import { useNavigate } from "react-router-dom";
import "../styles/css/PublicHome.css";

const PublicHome = () => {
    const navigate = useNavigate();

    return (
        <main className="public-home-page">

            <div className="public-home-shell">

                {/* Panel izquierdo: membrete institucional */}
                <aside className="public-home-panel">

                    <div className="public-home-mark">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2L21 6.5V11C21 16 17.5 20.5 12 22C6.5 20.5 3 16 3 11V6.5L12 2Z"
                                stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                            <path d="M8.5 12L11 14.5L16 9" stroke="currentColor" strokeWidth="1.6"
                                strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span>Portal PQR</span>
                    </div>

                    <h1>Tu petición, con seguimiento real</h1>

                    <p>
                        Registra una petición, queja o reclamo y consulta su
                        estado en cualquier momento, con tu número de radicado.
                    </p>

                    <div className="public-home-ticket">
                        <div>
                            <span className="public-home-ticket-label">Radicado</span>
                            <span className="public-home-ticket-value">No. 2026-014820</span>
                        </div>
                        <span className="public-home-ticket-dot" />
                    </div>

                </aside>

                {/* Panel derecho: acciones */}
                <section className="public-home-content">

                    <nav className="public-home-actions" aria-label="Acciones principales">

                        <button
                            type="button"
                            className="public-home-action public-home-action-register"
                            onClick={() => navigate("/pqr/crear")}
                        >
                            <span className="public-home-action-icon">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9l-5-6Z"
                                        stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                                    <path d="M14 3v5a1 1 0 0 0 1 1h5" stroke="currentColor" strokeWidth="1.6"
                                        strokeLinejoin="round" />
                                    <path d="M12 12v6M9 15h6" stroke="currentColor" strokeWidth="1.6"
                                        strokeLinecap="round" />
                                </svg>
                            </span>

                            <span>
                                <span className="public-home-action-title">Registrar una PQR</span>
                                <span className="public-home-action-description">
                                    Cuéntanos tu petición, queja o reclamo y recibe un
                                    número de radicado al instante.
                                </span>
                            </span>

                            <svg className="public-home-action-arrow" viewBox="0 0 24 24" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="1.8"
                                    strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>

                        <button
                            type="button"
                            className="public-home-action public-home-action-consult"
                            onClick={() => navigate("/pqr/consultar")}
                        >
                            <span className="public-home-action-icon">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" strokeWidth="1.6" />
                                    <path d="M20 20l-4.8-4.8" stroke="currentColor" strokeWidth="1.6"
                                        strokeLinecap="round" />
                                </svg>
                            </span>

                            <span>
                                <span className="public-home-action-title">Consultar una PQR</span>
                                <span className="public-home-action-description">
                                    Ingresa tu número de radicado y revisa en qué va
                                    tu solicitud.
                                </span>
                            </span>

                            <svg className="public-home-action-arrow" viewBox="0 0 24 24" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="1.8"
                                    strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>

                    </nav>

                    <div className="public-home-agent">
                        <span>¿Eres agente interno?</span>

                        <button
                            type="button"
                            onClick={() => navigate("/login")}
                        >
                            Iniciar sesión
                        </button>
                    </div>

                </section>

            </div>

            <footer className="public-home-footer">
                Sistema de Gestión de Peticiones, Quejas y Reclamos
            </footer>

        </main>
    );
};

export default PublicHome;