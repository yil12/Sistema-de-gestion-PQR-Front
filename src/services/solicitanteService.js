import api from "./api";

export const getSolicitante = async () => {
    const response = await api.get("/api/solicitantes");
        return response.data;
};

export const createSolicitante = async (payload) => {
    const response = await api.post("/api/solicitantes", payload);
    return response.data;
};

export const getSolicitanteByDocumento = async (email) => {
    const response = await api.get(`/api/solicitantes/documento/${documento}`);
    return response.data;
};
