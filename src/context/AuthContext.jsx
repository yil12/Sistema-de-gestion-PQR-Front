import { createContext, useContext, useState } from "react";
import { login as loginRequest, logout as logoutRequest } from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(
        localStorage.getItem("access_token")
    );

    const login = async (email, password) => {
        const data = await loginRequest(email, password);

        localStorage.setItem("access_token", data.access_token);
        setToken(data.access_token);

        return data;
    };

    const logout = () => {
        logoutRequest();
        setToken(null);
    };

    const isAuthenticated = Boolean(token);

    return (
        <AuthContext.Provider
            value={{
                token,
                isAuthenticated,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth debe utilizarse dentro de un AuthProvider"
        );
    }

    return context;
};