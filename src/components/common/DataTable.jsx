import "../../styles/css/DataTable.css";

const DataTable = ({
    title = "",
    columns = [],
    data = [],
    loading = false,
    emptyMessage = "No hay registros disponibles",
    selectable = false,
    selectedRows = [],
    onRowSelect,
    isTableView = true,
    onToggleView,
    onEdit,
    onDelete,
}) => {
    const handleSelect = (row) => {
        if (onRowSelect) onRowSelect(row);
    };

    const handleSelectAll = () => {
        if (onRowSelect) {
            const allSelected = selectedRows.length === data.length && data.length > 0;
            const newSelection = allSelected ? [] : [...data];
            onRowSelect(null, newSelection);
        }
    };

    if (loading) {
        return <p className="data-table-message">Cargando datos...</p>;
    }

    if (!data.length) {
        return <p className="data-table-message">{emptyMessage}</p>;
    }

    return (
        <div className="data-table-wrapper">
            {(title || onToggleView) && (
                <div className="data-table-header">
                    {title && <h2 className="data-table-title">{title}</h2>}
                    {onToggleView && (
                        <button
                            className="data-table-switcher-btn"
                            onClick={onToggleView}
                            title={isTableView ? "Ver como tarjetas" : "Ver como tabla"}
                        >
                            {isTableView ? (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                </svg>
                            )}
                        </button>
                    )}
                </div>
            )}

            {/* VISTA DE TABLA */}
            {isTableView ? (
                <div className="data-table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                {selectable && (
                                    <th className="data-table-select-col">
                                        <input
                                            type="checkbox"
                                            checked={selectedRows.length === data.length && data.length > 0}
                                            onChange={handleSelectAll}
                                        />
                                    </th>
                                )}
                                {columns.map((column) => (
                                    <th key={column.key}>{column.label}</th>
                                ))}
                                {(onEdit || onDelete) && <th className="data-table-actions-col">Acciones</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((row) => (
                                <tr 
                                    key={row.id} 
                                    className={selectable && selectedRows.some((r) => r.id === row.id) ? "selected" : ""}
                                >
                                    {selectable && (
                                        <td className="data-table-select-col">
                                            <input
                                                type="checkbox"
                                                checked={selectedRows.some((r) => r.id === row.id)}
                                                onChange={(e) => {
                                                    e.stopPropagation();
                                                    handleSelect(row);
                                                }}
                                            />
                                        </td>
                                    )}
                                    {columns.map((column) => (
                                        <td key={column.key}>
                                            {column.render ? column.render(row) : row[column.key]}
                                        </td>
                                    ))}
                                    {(onEdit || onDelete) && (
                                        <td className="data-table-actions-col">
                                            <div className="data-table-actions">
                                                {onEdit && (
                                                    <button className="btn-action btn-edit" onClick={() => onEdit(row)}>
                                                        Editar
                                                    </button>
                                                )}
                                                {onDelete && (
                                                    <button className="btn-action btn-delete" onClick={() => onDelete(row)}>
                                                        Eliminar
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="data-cards-container">
                    {data.map((row) => (
                        <div 
                            key={row.id} 
                            className={`data-card-item ${selectable && selectedRows.some((r) => r.id === row.id) ? "selected" : ""}`}
                            onClick={() => selectable && handleSelect(row)}
                        >
                            {selectable && (
                                <div className="data-card-select">
                                    <input
                                        type="checkbox"
                                        checked={selectedRows.some((r) => r.id === row.id)}
                                        onChange={(e) => {
                                            e.stopPropagation();
                                            handleSelect(row);
                                        }}
                                    />
                                </div>
                            )}
                            
                            <div className="data-card-content">
                                {columns.map((column) => (
                                    <p key={column.key} className="data-card-row">
                                        <span className="data-card-label">{column.label}:</span>
                                        <span className="data-card-value">
                                            {column.render ? column.render(row) : row[column.key]}
                                        </span>
                                    </p>
                                ))}
                            </div>

                            {(onEdit || onDelete) && (
                                <div className="data-card-actions">
                                    {onEdit && (
                                        <button className="btn-action btn-edit" onClick={(e) => { e.stopPropagation(); onEdit(row); }}>
                                            Editar
                                        </button>
                                    )}
                                    {onDelete && (
                                        <button className="btn-action btn-delete" onClick={(e) => { e.stopPropagation(); onDelete(row); }}>
                                            Eliminar
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DataTable;