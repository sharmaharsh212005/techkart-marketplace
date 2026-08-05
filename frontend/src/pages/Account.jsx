import {
    FaUserCircle,
    FaBoxOpen,
    FaHeart,
    FaShoppingCart,
    FaStar,
    FaEnvelope,
    FaCog,
    FaSignOutAlt
} from "react-icons/fa";

import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/admin.css";
import "../styles/account.css";

export default function Account() {

    const { user, logout } = useAuth();

    const greeting = () => {
        const hour = new Date().getHours();

        if (hour < 12) return "Good Morning";
        if (hour < 17) return "Good Afternoon";
        return "Good Evening";
    };

    const cards = [
        {
            icon: "📦",
            title: "Orders",
            desc: "Track all your purchases",
            link: "/orders",
            color: "#2563eb"
        },
        {
            icon: "❤️",
            title: "Wishlist",
            desc: "Products you've saved",
            link: "/wishlist",
            color: "#ec4899"
        },
        {
            icon: "🛒",
            title: "Cart",
            desc: "Items ready to checkout",
            link: "/cart",
            color: "#16a34a"
        },
        {
            icon: "⭐",
            title: "Reviews",
            desc: "Manage your reviews",
            link: "/reviews",
            color: "#f59e0b"
        },
        {
            icon: "💬",
            title: "Enquiries",
            desc: "Your conversations",
            link: "/my-enquiries",
            color: "#ef4444"
        },
        {
            icon: "⚙️",
            title: "Settings",
            desc: "Manage your account",
            link: "/account/settings",
            color: "#8b5cf6"
        }
    ];

    return (

        <div className="admin-layout">

            <aside className="admin-sidebar customer-sidebar">

                <div className="admin-logo">
                    <h2>My Account</h2>
                    <span>Customer Dashboard</span>
                </div>

                <div className="account-user">

                    {user?.profileImage ? (
                        <img
                            src={`http://localhost:5000${user.profileImage}`}
                            alt={user.name}
                            className="account-avatar-image"
                        />
                    ) : (
                        <FaUserCircle className="account-avatar" />
                    )}

                    <h2>{user?.name}</h2>

                    <p>{user?.email}</p>

                </div>

                <nav>

                    <Link to="/account">
                        👤 Dashboard
                    </Link>

                    <Link to="/orders">
                        📦 My Orders
                    </Link>

                    <Link to="/wishlist">
                        ❤️ Wishlist
                    </Link>

                    <Link to="/cart">
                        🛒 Cart
                    </Link>

                    <Link to="/reviews">
                        ⭐ Reviews
                    </Link>

                    <Link to="/my-enquiries">
                        💬 Enquiries
                    </Link>

                    <Link to="/account/settings">
                        ⚙️ Settings
                    </Link>

                    <button
                        className="admin-btn-danger"
                        onClick={logout}
                    >
                        <FaSignOutAlt />
                        Logout
                    </button>

                </nav>

            </aside>

            <div className="admin-content">

                <header className="admin-topbar">

                    <div>

                        <h2>Customer Dashboard</h2>

                        <p>
                            Welcome back, {user?.name}
                        </p>

                    </div>

                    <div className="admin-user">

                        <span>
                            Customer
                        </span>

                    </div>

                </header>

                <div className="dashboard-header">

                    <div>

                        <h1>
                            {greeting()} 👋
                        </h1>

                        <p>
                            Manage your orders, wishlist, reviews,
                            enquiries and account settings.
                        </p>

                    </div>

                    <div className="dashboard-date">

                        {new Date().toLocaleDateString(
                            "en-IN",
                            {
                                weekday: "long",
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                            }
                        )}

                    </div>

                </div>

                <div className="dashboard-grid">
{cards.map((card) => (

    <Link
        key={card.title}
        to={card.link}
        className="dashboard-stat-card"
    >

        <div
            className="dashboard-stat-icon"
            style={{
                background: card.color,
            }}
        >
            {card.icon}
        </div>

        <div className="dashboard-stat-content">

            <span>
                {card.title}
            </span>

            <small>
                {card.desc}
            </small>

        </div>

    </Link>

))}

</div>

</div>

</div>

);
}