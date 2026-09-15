import api from "./api";

export const login = async (email, password) => {
    const response = await api.post("/api/auth/login", {
        email,
        password,
    });

    return response.data;
};

export const logout = () => {
    localStorage.removeItem("access_token");
};

export const getToken = () => {
    return localStorage.getItem("access_token");
};