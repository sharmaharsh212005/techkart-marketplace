import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
    FaSearch,
    FaShoppingCart,
    FaHeart,
    FaUserCircle,
    FaBoxOpen,
    FaBars,
    FaTimes,
    FaStore,
    FaUserShield
} from "react-icons/fa";

import { useAuth } from "../context/AuthContext";
import NotificationBell from "./NotificationBell";
import "../styles/navbar.css";

export default function Navbar() {

    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [search, setSearch] = useState("");
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const handleSearch = () => {
        const value = search.trim();

        if (!value) {
            navigate("/products");
            return;
        }

        navigate(`/products?search=${encodeURIComponent(value)}`);
    };

    return (
        <header className="navbar">

            <div className="navbar-container">

                <Link
                    to="/"
                    className="logo"
                >
                    <span>Tech</span>Kart
                </Link>

                <button
                    className="mobile-toggle"
                    onClick={() => setMobileOpen(!mobileOpen)}
                >
                    {
                        mobileOpen
                            ? <FaTimes />
                            : <FaBars />
                    }
                </button>

                <nav
                    className={`nav-links ${mobileOpen ? "show-nav" : ""}`}
                >

                    <NavLink to="/">
                        Home
                    </NavLink>

                    <NavLink to="/products">
                        Products
                    </NavLink>

                    <NavLink to="/categories">
                        Categories
                    </NavLink>

                    <NavLink to="/offers">
                        Offers
                    </NavLink>

                    <NavLink to="/contact-us">
                        Contact
                    </NavLink>

                </nav>

                <div className="nav-search">

                    <button
                        className="search-btn"
                        onClick={handleSearch}
                    >
                        <FaSearch />
                    </button>

                    <input
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleSearch();
                            }
                        }}
                    />

                </div>

                <div className="nav-actions">

                    {
                        user?.role === "admin" &&
                        <NotificationBell />
                    }

                    {
                        user?.role === "customer" &&
                        <>
                            <NavLink
                                to="/wishlist"
                                className="icon-btn"
                                title="Wishlist"
                            >
                                <FaHeart />
                            </NavLink>

                            <NavLink
                                to="/cart"
                                className="icon-btn"
                                title="Cart"
                            >
                                <FaShoppingCart />
                            </NavLink>

                            <NavLink
                                to="/orders"
                                className="icon-btn"
                                title="My Orders"
                            >
                                <FaBoxOpen />
                            </NavLink>
                        </>
                    }

                    {
                        user?.role === "vendor" &&
                        <NavLink
                            to="/vendor"
                            className="dashboard-btn vendor-btn"
                        >
                            <FaStore />
                            <span>
                                Vendor Dashboard
                            </span>
                        </NavLink>
                    }

                    {
                        user?.role === "admin" &&
                        <NavLink
                            to="/admin"
                            className="dashboard-btn admin-btn"
                        >
                            <FaUserShield />
                            <span>
                                Admin Dashboard
                            </span>
                        </NavLink>
                    }
                    {
                        user ? (
                            <>

                                {user.role === "customer" ? (

                                    <Link
                                        to="/account"
                                        className="user-menu"
                                        title="My Account"
                                    >

                                    <div className="user-avatar">
                                        {user.profileImage ? (
                                            <img
                                                src={`http://localhost:5000${user.profileImage}`}
                                                alt={user.name}
                                                className="navbar-avatar-image"
                                            />
                                        ) : (
                                            <FaUserCircle />
                                        )}
                                    </div>

                                        <div className="user-info">

                                            <span className="welcome">
                                                Welcome
                                            </span>

                                            <span className="username">
                                                {user.name}
                                            </span>

                                            <span className="user-role">
                                                Customer
                                            </span>

                                        </div>

                                    </Link>

                                ) : (

                                    <div className="user-menu">

                                        <div className="user-avatar">
                                            <FaUserCircle />
                                        </div>

                                        <div className="user-info">

                                            <span className="welcome">
                                                Welcome
                                            </span>

                                            <span className="username">
                                                {user.name}
                                            </span>

                                            <span className="user-role">
                                                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                            </span>

                                        </div>

                                    </div>

                                )}

                                <button
                                    className="logout-btn"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>

                            </>
                        ) : (

                            <div className="auth-buttons">

                                <Link to="/login">
                                    Login
                                </Link>

                                <Link
                                    to="/register"
                                    className="register-btn"
                                >
                                    Register
                                </Link>

                            </div>

                        )
                    }

                </div>

            </div>

        </header>
    );
}