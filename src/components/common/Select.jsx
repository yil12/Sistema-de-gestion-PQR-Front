import "../../styles/css/Select.css"

const Select = ({
    label,
    name,
    value,
    options = [],
    placeholder = "Seleccionar",
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
                    {required && " *"}
                </label>
            )}

            <select
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                disabled={disabled}
                className={error ? "input-error" : ""} 
            >
                <option value="">{placeholder}</option>

                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && <span className="form-error">{error}</span>}
        </div>
    );
};

export default Select;