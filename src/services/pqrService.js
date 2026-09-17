import api from "./api";

// Crear una nueva PQR
export const createPQR = async (pqrData) => {
    const response = await api.post("/api/pqr", pqrData);

    return response.data;
};

// Listar PQR
export const getPQR = async (params = {}) => {
    const response = await api.get("/api/pqr", {
        params,
    });

    return response.data.data;
};

// Buscar una PQR por número de radicado
export const searchPQRByRadicado = async (radicado) => {
    const response = await api.get("/api/pqr/buscar", {
        params: {
            radicado,
        },
    });

    return response.data.data;
};


// Obtener una PQR por ID
export const getPQRById = async (id) => {
    const response = await api.get(`/api/pqr/${id}`);

    return response.data.data;
};


// Actualizar el estado de una PQR
export const updatePQRStatus = async (id, estado) => {
    const response = await api.patch(`/api/pqr/${id}/estado`, {
        estado,
    });

    return response.data.data;
};

export const getPQRStatistics = async () => {
    const response = await api.get("/api/pqr/estadisticas");
    return response.data.data;
};

// Buscar por radicado PQR 
export const searchPublicPQRByRadicado = async (radicado) => {
    const response = await api.get("/api/pqr/buscar-publica", {
        params: { radicado },
    });

    return response.data.data;
};

// asignar agente a PQR
export const assignAgent = async (pqrId, agenteId) => {
    const response = await api.patch(`/api/pqr/${pqrId}/asignar`, { agente_id: agenteId });
    return response.data;
};