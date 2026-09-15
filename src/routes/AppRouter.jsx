import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

import Login from "../pages/Login";
import PQRList from "../pages/PQRList";
import PQRCreate from "../pages/PQRCreate";
import PQRDetail from "../pages/PQRDetail";

import MainLayout from "../layouts/MainLayout";

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/login"
                    element={<Login />}
                />
                <Route element={<MainLayout />}>
                    <Route
                        path="/"
                        element={<Navigate to="/pqr" replace />}
                    />

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
                        element={<div>Dashboard</div>}
                    />
                </Route>

                <Route
                    path="*"
                    element={<div>Página no encontrada</div>}
                />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;