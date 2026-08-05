import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";

import VendorSidebar from "./VendorSidebar";
import VendorTopbar from "./VendorTopbar";

import "../styles/admin.css";

export default function VendorDashboard() {

    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {

        try {

            const { data } = await api.get(
                "/dashboard/vendor"
            );

            setDashboard(data.data);

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Unable to load dashboard"
            );

        } finally {

            setLoading(false);

        }

    };

    if (loading) {

        return (

            <div className="admin-layout">

                <VendorSidebar />

                <div className="admin-content">

                    <VendorTopbar />

                    <div className="empty">

                        Loading Dashboard...

                    </div>

                </div>

            </div>

        );

    }

    return (

        <div className="admin-layout">

            <VendorSidebar />

            <div className="admin-content">

                <VendorTopbar />

                {/* Header */}

                <div className="dashboard-header">

                    <div>

                        <h1>

                            Vendor Dashboard 📊

                        </h1>

                        <p>

                            Welcome back! Here's your business overview.

                        </p>

                    </div>

                    <div className="dashboard-date">

                        {new Date().toLocaleDateString(
                            "en-IN",
                            {
                                weekday: "long",
                                day: "numeric",
                                month: "long",
                                year: "numeric"
                            }
                        )}

                    </div>

                </div>

                {/* Stats */}

                <div className="dashboard-grid">

                    <div className="dashboard-stat-card">

                        <div className="dashboard-stat-icon">
                            💰
                        </div>

                        <div className="dashboard-stat-content">

                            <span>Total Revenue</span>

                            <h2>

                                ₹{Number(
                                    dashboard.revenue || 0
                                ).toLocaleString()}

                            </h2>

                            <small>
                                Lifetime Revenue
                            </small>

                        </div>

                    </div>

                    <div className="dashboard-stat-card">

                        <div className="dashboard-stat-icon">
                            📦
                        </div>

                        <div className="dashboard-stat-content">

                            <span>Total Products</span>

                            <h2>

                                {
                                    dashboard.totalProducts ??
                                    dashboard.products ??
                                    0
                                }

                            </h2>

                            <small>
                                Active Listings
                            </small>

                        </div>

                    </div>

                    <div className="dashboard-stat-card">

                        <div className="dashboard-stat-icon">
                            🛒
                        </div>

                        <div className="dashboard-stat-content">

                            <span>Total Orders</span>

                            <h2>

                                {
                                    dashboard.totalOrders ??
                                    dashboard.orders ??
                                    0
                                }

                            </h2>

                            <small>
                                Orders Received
                            </small>

                        </div>

                    </div>

                    <div className="dashboard-stat-card">

                        <div className="dashboard-stat-icon">
                            ⏳
                        </div>

                        <div className="dashboard-stat-content">

                            <span>Pending Orders</span>

                            <h2>

                                {dashboard.pendingOrders || 0}

                            </h2>

                            <small>

                                Requires Action

                            </small>

                        </div>

                    </div>

                </div>

                {/* Main Content */}

                <div

                    style={{
                        display: "grid",
                        gridTemplateColumns: "2fr 1fr",
                        gap: "24px",
                        marginTop: "30px"
                    }}

                >
                    {/* Recent Orders */}

                    <div className="admin-card">

                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: "20px"
                            }}
                        >

                            <h3
                                style={{
                                    margin: 0,
                                    color: "#fff"
                                }}
                            >
                                Recent Orders
                            </h3>

                            <span
                                style={{
                                    color: "#94a3b8"
                                }}
                            >
                                {dashboard.recentOrders?.length || 0} Orders
                            </span>

                        </div>

                        <div className="table-container">

                            <table className="orders-table">

                                <thead>

                                    <tr>

                                        <th>Customer</th>

                                        <th>Total</th>

                                        <th>Status</th>

                                        <th>Date</th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {dashboard.recentOrders?.length ? (

                                        dashboard.recentOrders.map((order) => (

                                            <tr key={order._id}>

                                                <td>

                                                    <strong>

                                                        {order.user?.name || "Customer"}

                                                    </strong>

                                                    <br />

                                                    <small
                                                        style={{
                                                            color: "#94a3b8"
                                                        }}
                                                    >
                                                        {order.user?.email}
                                                    </small>

                                                </td>

                                                <td>

                                                    ₹
                                                    {Number(
                                                        order.totalAmount || 0
                                                    ).toLocaleString()}

                                                </td>

                                                <td>

                                                    <span
                                                        className={`status-badge ${
                                                            order.orderStatus === "Pending"
                                                                ? "status-pending"
                                                                : order.orderStatus === "Delivered"
                                                                ? "status-approved"
                                                                : "status-processing"
                                                        }`}
                                                    >
                                                        {order.orderStatus}
                                                    </span>

                                                </td>

                                                <td>

                                                    {new Date(
                                                        order.createdAt
                                                    ).toLocaleDateString()}

                                                </td>

                                            </tr>

                                        ))

                                    ) : (

                                        <tr>

                                            <td
                                                colSpan="4"
                                                style={{
                                                    textAlign: "center",
                                                    padding: "40px"
                                                }}
                                            >
                                                No recent orders found.
                                            </td>

                                        </tr>

                                    )}

                                </tbody>

                            </table>

                        </div>

                    </div>

                    {/* Right Panel */}

                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "24px"
                        }}
                    >
                        {/* Business Overview */}

                        <div className="admin-card">

                            <h3
                                style={{
                                    marginBottom: "20px",
                                    color: "#fff"
                                }}
                            >
                                Business Overview
                            </h3>

                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "20px"
                                }}
                            >

                                {/* Revenue */}

                                <div>

                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            marginBottom: "8px"
                                        }}
                                    >
                                        <span>Total Revenue</span>

                                        <strong>
                                            ₹
                                            {Number(
                                                dashboard.revenue || 0
                                            ).toLocaleString()}
                                        </strong>

                                    </div>

                                    <div
                                        style={{
                                            height: "8px",
                                            background: "#1e293b",
                                            borderRadius: "20px",
                                            overflow: "hidden"
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                background: "#3b82f6"
                                            }}
                                        />
                                    </div>

                                </div>

                                {/* Pending Orders */}

                                <div>

                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            marginBottom: "8px"
                                        }}
                                    >
                                        <span>Pending Orders</span>

                                        <strong>
                                            {dashboard.pendingOrders || 0}
                                        </strong>

                                    </div>

                                    <div
                                        style={{
                                            height: "8px",
                                            background: "#1e293b",
                                            borderRadius: "20px",
                                            overflow: "hidden"
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: `${
                                                    (dashboard.totalOrders ??
                                                        dashboard.orders)
                                                        ? (
                                                            (dashboard.pendingOrders || 0) /
                                                            (dashboard.totalOrders ??
                                                                dashboard.orders)
                                                        ) * 100
                                                        : 0
                                                }%`,
                                                height: "100%",
                                                background: "#f59e0b"
                                            }}
                                        />
                                    </div>

                                </div>

                                {/* Products */}

                                <div>

                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            marginBottom: "8px"
                                        }}
                                    >

                                        <span>Products Listed</span>

                                        <strong>
                                            {
                                                dashboard.totalProducts ??
                                                dashboard.products ??
                                                0
                                            }
                                        </strong>

                                    </div>

                                    <div
                                        style={{
                                            height: "8px",
                                            background: "#1e293b",
                                            borderRadius: "20px",
                                            overflow: "hidden"
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                background: "#22c55e"
                                            }}
                                        />
                                    </div>

                                </div>

                            </div>

                        </div>

                        {/* Quick Tips */}

                        <div className="admin-card">

                            <h3
                                style={{
                                    marginBottom: "20px",
                                    color: "#fff"
                                }}
                            >
                                Quick Tips
                            </h3>

                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "18px",
                                    color: "#cbd5e1",
                                    lineHeight: "1.7"
                                }}
                            >

                                <div>
                                    📦 Keep your product stock updated regularly.
                                </div>

                                <div>
                                    🚚 Process pending orders quickly to improve customer satisfaction.
                                </div>

                                <div>
                                    ⭐ Reply to reviews and customer questions promptly.
                                </div>

                                <div>
                                    💬 Check customer enquiries daily to avoid missed sales.
                                </div>

                            </div>

                        </div>

                    </div>

                </div>
                {/* Performance Summary */}

                <div
                    style={{
                        marginTop: "30px"
                    }}
                >

                    <div className="admin-card">

                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                flexWrap: "wrap",
                                gap: "20px"
                            }}
                        >

                            <div>

                                <h3
                                    style={{
                                        marginBottom: "8px",
                                        color: "#fff"
                                    }}
                                >
                                    Performance Summary
                                </h3>

                                <p
                                    style={{
                                        color: "#94a3b8",
                                        margin: 0,
                                        lineHeight: "1.7"
                                    }}
                                >
                                    Keep your inventory updated, fulfil orders
                                    quickly and respond to customers to grow
                                    your store.
                                </p>

                            </div>

                            <div
                                style={{
                                    display: "flex",
                                    gap: "18px",
                                    flexWrap: "wrap"
                                }}
                            >

                                <div
                                    style={{
                                        background: "#111827",
                                        padding: "18px 24px",
                                        borderRadius: "14px",
                                        minWidth: "150px",
                                        textAlign: "center"
                                    }}
                                >

                                    <div
                                        style={{
                                            color: "#94a3b8",
                                            marginBottom: "6px"
                                        }}
                                    >
                                        Revenue
                                    </div>

                                    <h3
                                        style={{
                                            color: "#22c55e",
                                            margin: 0
                                        }}
                                    >
                                        ₹
                                        {Number(
                                            dashboard.revenue || 0
                                        ).toLocaleString()}
                                    </h3>

                                </div>

                                <div
                                    style={{
                                        background: "#111827",
                                        padding: "18px 24px",
                                        borderRadius: "14px",
                                        minWidth: "150px",
                                        textAlign: "center"
                                    }}
                                >

                                    <div
                                        style={{
                                            color: "#94a3b8",
                                            marginBottom: "6px"
                                        }}
                                    >
                                        Orders
                                    </div>

                                    <h3
                                        style={{
                                            color: "#3b82f6",
                                            margin: 0
                                        }}
                                    >
                                        {
                                            dashboard.totalOrders ??
                                            dashboard.orders ??
                                            0
                                        }
                                    </h3>

                                </div>

                                <div
                                    style={{
                                        background: "#111827",
                                        padding: "18px 24px",
                                        borderRadius: "14px",
                                        minWidth: "150px",
                                        textAlign: "center"
                                    }}
                                >

                                    <div
                                        style={{
                                            color: "#94a3b8",
                                            marginBottom: "6px"
                                        }}
                                    >
                                        Products
                                    </div>

                                    <h3
                                        style={{
                                            color: "#f59e0b",
                                            margin: 0
                                        }}
                                    >
                                        {
                                            dashboard.totalProducts ??
                                            dashboard.products ??
                                            0
                                        }
                                    </h3>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}