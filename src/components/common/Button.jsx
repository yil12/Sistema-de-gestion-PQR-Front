import "../../styles/css/Button.css";

const Button = ({
    children,
    type = "button",
    variant = "primary",
    size = "md", 
    block = false,
    disabled = false,
    onClick,
}) => {
    const classNames = [
        "btn",
        `btn-${variant}`,
        size !== "md" ? `btn-${size}` : "",
        block ? "btn-block" : ""
    ].filter(Boolean).join(" ");

    return (
        <button
            type={type}
            className={classNames}
            disabled={disabled}
            onClick={onClick}
        >
            {children}
        </button>
    );
};

export default Button;