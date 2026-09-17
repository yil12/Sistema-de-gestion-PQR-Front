import { createContext, useContext, useEffect, useState } from "react";
import {
    login as loginRequest,
    logout as logoutRequest,
    getCurrentUser,
} from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(
        localStorage.getItem("access_token")
    );

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            if (!token) {
                setUser(null);
                setLoading(false);
                return;
            }

            try {
                const currentUser = await getCurrentUser();

                setUser(currentUser);
            } catch (error) {
                console.error(
                    "Error al obtener el usuario autenticado:",
                    error
                );

                localStorage.removeItem("access_token");
                setToken(null);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, [token]);

    const login = async (email, password) => {
        const data = await loginRequest(email, password);

        localStorage.setItem("access_token", data.access_token);

        setToken(data.access_token);

        const currentUser = await getCurrentUser();

        setUser(currentUser);

        return data;
    };

    const logout = () => {
        logoutRequest();

        localStorage.removeItem("access_token");

        setToken(null);
        setUser(null);
    };

    const isAuthenticated = Boolean(token) && Boolean(user);

    return (
        <AuthContext.Provider
            value={{
                token,
                user,
                isAuthenticated,
                loading,
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