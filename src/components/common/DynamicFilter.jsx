import { useEffect, useRef, useState } from "react";
import Button from "./Button";
import "../../styles/css/DynamicFilter.css";

const availableFields = [
    { value: "tipo", label: "Tipo de PQR", type: "select", options: ["peticion", "queja", "reclamo"] },
    { value: "estado", label: "Estado", type: "select", options: ["recibida", "en_gestion", "resuelta", "cerrada"] },
    { value: "prioridad", label: "Prioridad", type: "select", options: ["baja", "media", "alta", "urgente"] },
    { value: "categoria", label: "Categoría", type: "text" },
    { value: "radicado", label: "Radicado", type: "text" },
];

const formatOption = (value) => value.charAt(0).toUpperCase() + value.slice(1).replace("_", " ");

const DynamicFilter = ({ onApplyFilters, initialFilters = {} }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedField, setSelectedField] = useState(availableFields[0].value);
    const [activeFilters, setActiveFilters] = useState(initialFilters);
    const [search, setSearch] = useState("");

    const wrapperRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        setSearch("");
    }, [selectedField]);

    
    useEffect(() => {
        setActiveFilters(initialFilters);
    }, [initialFilters]);

    const activeCount = Object.values(activeFilters).filter((v) => v !== "" && v !== undefined).length;

    const currentField = availableFields.find((f) => f.value === selectedField);

    const handleSelectOption = (fieldValue, option) => {
        setActiveFilters((current) => {
            const next = { ...current };
            if (next[fieldValue] === option) {
                delete next[fieldValue];
            } else {
                next[fieldValue] = option;
            }
            return next;
        });
    };

    const handleTextChange = (fieldValue, value) => {
        setActiveFilters((current) => {
            const next = { ...current };
            if (value.trim() === "") {
                delete next[fieldValue];
            } else {
                next[fieldValue] = value;
            }
            return next;
        });
    };

    const handleClearField = (fieldValue) => {
        setActiveFilters((current) => {
            const next = { ...current };
            delete next[fieldValue];
            return next;
        });
    };

    const handleClearAll = () => {
        setActiveFilters({});
        onApplyFilters({});
    };

    const handleApply = () => {
        onApplyFilters(activeFilters);
        setIsOpen(false);
    };

    const renderRightPane = () => {
        if (!currentField) return null;

        if (currentField.type === "select") {
            const filteredOptions = currentField.options.filter((opt) =>
                formatOption(opt).toLowerCase().includes(search.toLowerCase())
            );

            return (
                <>
                    <div className="filter-search">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" width="16" height="16">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M18 10.5a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder={`Buscar ${currentField.label.toLowerCase()}`}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="filter-options-list">
                        {filteredOptions.length === 0 && (
                            <p className="filter-no-results">Sin resultados</p>
                        )}
                        {filteredOptions.map((opt) => (
                            <label key={opt} className="filter-option-row">
                                <input
                                    type="checkbox"
                                    checked={activeFilters[selectedField] === opt}
                                    onChange={() => handleSelectOption(selectedField, opt)}
                                />
                                <span>{formatOption(opt)}</span>
                            </label>
                        ))}
                    </div>
                </>
            );
        }

        return (
            <div className="filter-search filter-search-standalone">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" width="16" height="16">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M18 10.5a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z" />
                </svg>
                <input
                    type="text"
                    placeholder={`Escribe el ${currentField.label.toLowerCase()}`}
                    value={activeFilters[selectedField] || ""}
                    onChange={(e) => handleTextChange(selectedField, e.target.value)}
                />
            </div>
        );
    };

    return (
        <div className="dynamic-filter" ref={wrapperRef}>
            <button
                type="button"
                className={`filter-trigger-btn ${isOpen ? "is-open" : ""} ${activeCount > 0 ? "has-active" : ""}`}
                onClick={() => setIsOpen((prev) => !prev)}
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" width="16" height="16">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M6.75 12h10.5m-7.5 5.25h4.5" />
                </svg>
                Filtro
                {activeCount > 0 && <span className="filter-count-badge">{activeCount}</span>}
            </button>

            {isOpen && (
                <div className="filter-popover">
                    <div className="filter-popover-body">
                        <div className="filter-popover-left">
                            {availableFields.map((field) => (
                                <button
                                    key={field.value}
                                    type="button"
                                    className={`filter-field-item ${selectedField === field.value ? "is-active" : ""}`}
                                    onClick={() => setSelectedField(field.value)}
                                >
                                    {field.label}
                                    {activeFilters[field.value] && <span className="filter-field-dot" />}
                                </button>
                            ))}
                        </div>

                        <div className="filter-popover-right">{renderRightPane()}</div>
                    </div>

                    <div className="filter-popover-footer">
                        <button type="button" className="filter-clear-all" onClick={handleClearAll}>
                            Borrar todo
                        </button>

                        <div className="filter-footer-right">
                            {activeFilters[selectedField] !== undefined && (
                                <button
                                    type="button"
                                    className="filter-clear-field"
                                    onClick={() => handleClearField(selectedField)}
                                >
                                    Borrar
                                </button>
                            )}
                            <Button type="button" variant="primary" size="sm" onClick={handleApply}>
                                Aplicar filtros
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DynamicFilter;
