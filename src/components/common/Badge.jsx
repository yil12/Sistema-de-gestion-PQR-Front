import "../../styles/css/Badge.css";

const Badge = ({ value, type = "default" }) => {
    const normalizedValue = String(value ?? "").toLowerCase();

    const labels = {
        recibida: "Recibida",
        en_gestion: "En gestión",
        resuelta: "Resuelta",
        cerrada: "Cerrada",

        baja: "Baja",
        media: "Media",
        alta: "Alta",
        urgente: "Urgente",

        agente: "Agente",
        supervisor: "Supervisor",
        administrador: "Administrador",
    };

    const label = labels[normalizedValue] ?? value;

    return (
        <span
            className={`badge badge-${type}-${normalizedValue}`}
        >
            {label}
        </span>
    );
};

export default Badge;