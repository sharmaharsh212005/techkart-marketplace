import { FaStore, FaSignOutAlt, FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function VendorTopbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <header
            style={{
                height: "80px",
                background: "#182235",
                borderBottom: "1px solid rgba(255,255,255,.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 32px",
                position: "sticky",
                top: 0,
                zIndex: 100,
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                }}
            >
                <div
                    style={{
                        width: "52px",
                        height: "52px",
                        borderRadius: "14px",
                        background: "linear-gradient(135deg,#3b82f6,#2563eb)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        fontSize: "22px",
                    }}
                >
                    <FaStore />
                </div>

                <div>
                    <h2
                        style={{
                            color: "#fff",
                            margin: 0,
                            fontSize: "24px",
                            fontWeight: 700,
                        }}
                    >
                        Vendor Dashboard
                    </h2>

                    <span
                        style={{
                            color: "#94a3b8",
                            fontSize: "14px",
                        }}
                    >
                        Manage your store and products
                    </span>
                </div>
            </div>

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "18px",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        background: "#111827",
                        border: "1px solid rgba(255,255,255,.08)",
                        padding: "10px 18px",
                        borderRadius: "14px",
                    }}
                >
                    <FaUserCircle
                        style={{
                            color: "#60a5fa",
                            fontSize: "32px",
                        }}
                    />

                    <div>
                        <div
                            style={{
                                color: "#fff",
                                fontWeight: 700,
                                fontSize: "15px",
                            }}
                        >
                            {user?.shopName || "Vendor Store"}
                        </div>

                        <div
                            style={{
                                color: "#94a3b8",
                                fontSize: "13px",
                            }}
                        >
                            {user?.name}
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    style={{
                        background: "#ef4444",
                        color: "#fff",
                        border: "none",
                        padding: "12px 22px",
                        borderRadius: "12px",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        cursor: "pointer",
                        fontWeight: 600,
                        fontSize: "15px",
                    }}
                >
                    <FaSignOutAlt />
                    Logout
                </button>
            </div>
        </header>
    );
}