import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";

const MainLayout = () => {
    return (
        <div className="app-layout">
            <Header />

            <div className="app-body">
                <Sidebar />

                <main className="app-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;