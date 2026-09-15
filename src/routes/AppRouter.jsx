import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import PQRList from "../pages/PQRList";

import MainLayout from "../layouts/MainLayout";

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
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
                        element={<div>Registrar PQR</div>}
                    />

                    <Route
                        path="/pqr/:id"
                        element={<div>Detalle de PQR</div>}
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