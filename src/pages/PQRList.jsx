import { useEffect, useState } from "react";
import { getPQR } from "../services/pqrService";
import DataTable from "../components/common/DataTable";
import Badge from "../components/common/Badge";

const PQRList = () => {
    const [pqr, setPqr] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadPQR = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getPQR();

                setPqr(data);
            } catch (err) {
                console.error(err);
                setError("No fue posible cargar las PQR.");
            } finally {
                setLoading(false);
            }
        };

        loadPQR();
    }, []);

    const columns = [
        {
            key: "radicado",
            label: "Radicado",
        },
        {
            key: "tipo",
            label: "Tipo",
        },
        {
            key: "titulo",
            label: "Título",
        },
        {
            key: "prioridad",
            label: "Prioridad",
            render: (row) => (
                <Badge
                    value={row.prioridad}
                    type="prioridad"
                />
            ),
        },
        {
            key: "estado",
            label: "Estado",
            render: (row) => (
                <Badge
                    value={row.estado}
                    type="estado"
                />
            ),
        },
    ];

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <section>
            <h2>PQR</h2>

            <DataTable
                columns={columns}
                data={pqr}
                loading={loading}
                emptyMessage="No hay PQR registradas."
            />
        </section>
    );
};

export default PQRList;