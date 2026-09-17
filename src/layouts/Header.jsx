import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/css/Header.css";

const Header = ({ onMenuToggle }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const userName = user?.nombre || "Usuario";
    const userRole = user?.rol || "Sin rol";
    const userEmail = user?.email || "";

    const getInitials = (name) => {
        if (!name) return "U";

        return name
            .trim()
            .split(/\s+/)
            .map((word) => word[0])
            .join("")
            .substring(0, 2)
            .toUpperCase();
    };

    const userInitials = getInitials(userName);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === "Escape") setIsDropdownOpen(false);
        };

        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, []);

    const handleLogout = () => {
        setIsDropdownOpen(false);
        logout();
        navigate("/");
    };

    return (
        <header className="app-header">
            <div className="app-header-brand">
                <button
                    className="mobile-menu-toggle"
                    onClick={onMenuToggle}
                    aria-label="Abrir menú"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                        />
                    </svg>
                </button>

                <div className="app-header-brand-icon">
                    PQR
                </div>

                <h3>Sistema de Gestión PQR</h3>
            </div>

            {/* Usuario */}
            <div className="app-header-user" ref={dropdownRef}>
                <button
                    type="button"
                    className="user-info-wrapper"
                    onClick={() => setIsDropdownOpen((current) => !current)}
                    aria-haspopup="true"
                    aria-expanded={isDropdownOpen}
                >
                    <div className="user-avatar" title={userName}>
                        {userInitials}
                    </div>

                    <div className="user-info">
                        <span className="user-name">{userName}</span>
                    </div>

                    <span className={`user-dropdown-icon ${isDropdownOpen ? "rotated" : ""}`}>
                        ▼
                    </span>
                </button>

                {/* Dropdown */}
                {isDropdownOpen && (
                    <div className="user-dropdown-menu" role="menu">

                        <div className="dropdown-user-info">
                            <div className="dropdown-user-avatar">
                                {userInitials}
                            </div>

                            <div className="dropdown-user-details">
                                <span className="dropdown-user-role">
                                    {userEmail}
                                </span>

                                <span className="dropdown-user-role">
                                    {userRole}
                                </span>
                            </div>
                        </div>

                        {/* Separador */}
                        <div className="dropdown-divider"></div>

                        {/* Cerrar sesión */}
                        <button
                            type="button"
                            className="dropdown-item logout-btn"
                            onClick={handleLogout}
                            role="menuitem"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                width="18"
                                height="18"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                                />
                            </svg>

                            Cerrar Sesión
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;