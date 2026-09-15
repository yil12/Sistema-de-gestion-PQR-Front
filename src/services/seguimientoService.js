import api from "./api";

// Registrar seguimiento de una PQR
export const createSeguimiento = async (id, seguimientoData) => {
    const response = await api.post(
        `/api/pqr/${id}/seguimiento`,
        seguimientoData
    );

    return response.data;
};

// Obtener seguimientos de una PQR
export const getSeguimientos = async (id) => {
    const response = await api.get(`/api/pqr/${id}/seguimiento`);

    return response.data;
};