import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import "../styles/css/Layout.css";

const MainLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="app-layout">
            <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

            <div className="app-body">
                <Sidebar isOpen={sidebarOpen} />
                
                {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>}

                <main className={`app-content ${sidebarOpen ? "content-expanded" : "content-collapsed"}`}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;