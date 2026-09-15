const Input = ({
    label,
    name,
    type = "text",
    value = "",
    placeholder = "",
    required = false,
    disabled = false,
    error = "",
    onChange,
}) => {
    return (
        <div className="form-field">
            {label && (
                <label htmlFor={name}>
                    {label}
                </label>
            )}

            <input
                id={name}
                name={name}
                type={type}
                value={value}
                placeholder={placeholder}
                required={required}
                disabled={disabled}
                onChange={onChange}
                className={error ? "input-error" : ""}
            />

            {error && (
                <span className="form-error">
                    {error}
                </span>
            )}
        </div>
    );
};

export default Input;