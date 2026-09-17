import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";

import Login from "../pages/Login";

import PQRList from "../pages/PQRList";
import PQRCreate from "../pages/PQRCreate";
import PQRDetail from "../pages/PQRDetail";
import Dashboard from "../pages/Dashboard";
import Agent from "../pages/AgentList";
import Solicitante from "../pages/SolicitanteList";



import MainLayout from "../layouts/MainLayout";

import PublicHome from "../pages/PublicHome";
import PQRPublicCreate from "../pages/PQRPublicCreate";
import PQRPublicSearch from "../pages/PQRPublicSearch";

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>

                {/* =========================
                    INICIO PÚBLICO
                ========================== */}

                <Route
                    path="/"
                    element={<PublicHome />}
                />

                {/* =========================
                    RUTAS PÚBLICAS
                ========================== */}

                <Route
                    path="/pqr/crear"
                    element={<PQRPublicCreate />}
                />

                <Route
                    path="/pqr/consultar"
                    element={<PQRPublicSearch />}
                />

                {/* =========================
                    AUTENTICACIÓN
                ========================== */}

                <Route
                    path="/login"
                    element={<Login />}
                />

                {/* =========================
                    RUTAS INTERNAS
                ========================== */}

                <Route element={<MainLayout />}>

                    <Route
                        path="/pqr"
                        element={<PQRList />}
                    />

                    <Route
                        path="/pqr/nueva"
                        element={<PQRCreate />}
                    />

                    <Route
                        path="/pqr/:id"
                        element={<PQRDetail />}
                    />

                    <Route
                        path="/dashboard"
                        element={<Dashboard />}
                    />

                    <Route
                        path="/agente"
                        element={<Agent />}
                    />

                    <Route
                        path="/solicitante"
                        element={<Solicitante />}
                    />

                </Route>

                {/* =========================
                    404
                ========================== */}

                <Route
                    path="*"
                    element={
                        <div>
                            Página no encontrada
                        </div>
                    }
                />

            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;