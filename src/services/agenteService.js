import api from "./api";

// Listar agentes
export const getAgentes = async () => {
    const response = await api.get("/api/agentes");
        return response.data;
};

export const responderPQR = async (pqrId, respuesta) => {
    const response = await api.post(`/api/pqr/${pqrId}/respuesta`, { respuesta });
    return response.data;
};

export const createAgente = async (payload) => {
    const response = await api.post("/api/agentes", payload);
    return response.data;
};