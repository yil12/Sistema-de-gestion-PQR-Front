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
        <div>
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
            >
                <option value="">{placeholder}</option>

                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>

            {error && <p>{error}</p>}
        </div>
    );
};

export default Select;