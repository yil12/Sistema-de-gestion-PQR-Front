const DataTable = ({
    columns = [],
    data = [],
    loading = false,
    emptyMessage = "No hay registros disponibles",
}) => {
    if (loading) {
        return <p>Cargando...</p>;
    }

    if (!data.length) {
        return <p>{emptyMessage}</p>;
    }

    return (
        <table>
            <thead>
                <tr>
                    {columns.map((column) => (
                        <th key={column.key}>
                            {column.label}
                        </th>
                    ))}
                </tr>
            </thead>

            <tbody>
                {data.map((row, index) => (
                    <tr key={row.id ?? index}>
                        {columns.map((column) => (
                            <td key={column.key}>
                                {column.render
                                    ? column.render(row)
                                    : row[column.key]}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default DataTable;