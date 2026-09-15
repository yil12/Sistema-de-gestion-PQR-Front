import { NavLink } from "react-router-dom";

const Sidebar = () => {
    return (
        <aside className="app-sidebar">
            <nav>
                <NavLink to="/pqr">
                    PQR
                </NavLink>

                <NavLink to="/pqr/nueva">
                    Nueva PQR
                </NavLink>

                <NavLink to="/dashboard">
                    Dashboard
                </NavLink>
            </nav>
        </aside>
    );
};

export default Sidebar;