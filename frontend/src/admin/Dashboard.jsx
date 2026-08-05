import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";
import AdminSidebar from "../components/AdminSidebar";
import AdminTopbar from "../components/AdminTopbar";
import "../styles/admin.css";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

export default function Dashboard() {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const { data } = await api.get("/dashboard/admin");
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

  const greeting = useMemo(() => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  }, []);

  const cards = dashboard
    ? [
        {
          title: "Revenue",
          value: `₹${dashboard.totalRevenue.toLocaleString()}`,
          icon: "💰",
          route: "/admin/reports",
          color: "#16a34a",
        },
        {
          title: "Orders",
          value: dashboard.totalOrders,
          icon: "🛒",
          route: "/admin/orders",
          color: "#2563eb",
        },
        {
          title: "Products",
          value: dashboard.totalProducts,
          icon: "📦",
          route: "/admin/products",
          color: "#f59e0b",
        },
        {
          title: "Customers",
          value: dashboard.totalCustomers,
          icon: "👥",
          route: "/admin/users",
          color: "#8b5cf6",
        },
        {
          title: "Vendors",
          value: dashboard.totalVendors,
          icon: "🏪",
          route: "/admin/vendors",
          color: "#06b6d4",
        },
        {
          title: "Categories",
          value: dashboard.totalCategories,
          icon: "📂",
          route: "/admin/categories",
          color: "#ec4899",
        },
        {
          title: "Coupons",
          value: dashboard.totalCoupons,
          icon: "🎟",
          route: "/admin/coupons",
          color: "#22c55e",
        },
        {
          title: "Enquiries",
          value: dashboard.totalEnquiries,
          icon: "💬",
          route: "/admin/enquiries",
          color: "#ef4444",
        },
      ]
    : [];

  if (loading) {
    return (
      <div className="admin-layout">
        <AdminSidebar />
        <div className="admin-content">
          <AdminTopbar />
          <div className="dashboard-loader">
            <h2>Loading Dashboard...</h2>
          </div>
        </div>
      </div>
    );
  }

  const chartData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Revenue",
        data: dashboard.monthlyRevenue,
        borderColor: "#4f8cff",
        backgroundColor: "rgba(79,140,255,.15)",
        fill: true,
        borderWidth: 3,
        tension: 0.4,
        pointRadius: 4,
      },
    ],
  };
return (
  <div className="admin-layout">
    <AdminSidebar />

    <div className="admin-content">
      <AdminTopbar />

      <div className="dashboard-header">
        <div>
          <h1>
            {greeting} 👋
          </h1>

          <p>
            Welcome back to TechKart Admin Dashboard
          </p>
        </div>

        <div className="dashboard-date">
          {new Date().toLocaleDateString("en-IN", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </div>
      </div>

      <div className="dashboard-grid">

        {cards.map((card) => (

          <div
            key={card.title}
            className="dashboard-stat-card"
            onClick={() => navigate(card.route)}
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

              <span>{card.title}</span>

              <h2>{card.value}</h2>

              <small>View Details →</small>

            </div>

          </div>

        ))}

      </div>

      <div className="quick-actions">

        <button
          onClick={() => navigate("/admin/products")}
        >
          ➕ Product
        </button>

        <button
          onClick={() => navigate("/admin/categories")}
        >
          📂 Category
        </button>

        <button
          onClick={() => navigate("/admin/vendors")}
        >
          🏪 Vendor
        </button>

        <button
          onClick={() => navigate("/admin/coupons")}
        >
          🎟 Coupon
        </button>

        <button
          onClick={() => navigate("/admin/cms")}
        >
          📄 CMS
        </button>

        <button
          onClick={() => navigate("/admin/reports")}
        >
          📈 Reports
        </button>

      </div>

      <div className="dashboard-middle">

        <div className="dashboard-chart">

          <div className="widget-header">

            <h3>Monthly Revenue</h3>

            <button
              onClick={() => navigate("/admin/reports")}
            >
              View Report
            </button>

          </div>

          <Line
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  display: false,
                },
              },
            }}
          />

        </div>

        <div className="dashboard-status">

          <div className="widget-header">
            <h3>Order Status</h3>
          </div>

          <div className="status-box pending">

            <span>Pending</span>

            <strong>
              {dashboard.pendingOrders}
            </strong>

          </div>

          <div className="status-box delivered">

            <span>Delivered</span>

            <strong>
              {dashboard.deliveredOrders}
            </strong>

          </div>

          <div className="status-box cancelled">

            <span>Cancelled</span>

            <strong>
              {dashboard.cancelledOrders}
            </strong>

          </div>

        </div>

      </div>
      <div className="dashboard-bottom">

        <div className="dashboard-widget">

          <div className="widget-header">

            <h3>Recent Orders</h3>

            <button
              onClick={() => navigate("/admin/orders")}
            >
              View All
            </button>

          </div>

          <table className="orders-table">

            <thead>

              <tr>
                <th>Customer</th>
                <th>Total</th>
                <th>Status</th>
              </tr>

            </thead>

            <tbody>

              {dashboard.recentOrders.length > 0 ? (

                dashboard.recentOrders.map((order) => (

                  <tr
                    key={order._id}
                    className="clickable-row"
                    onClick={() =>
                      navigate("/admin/orders")
                    }
                  >

                    <td>{order.user?.name}</td>

                    <td>
                      ₹{order.totalAmount.toLocaleString()}
                    </td>

                    <td>

                      <span
                        className={`status-badge ${order.orderStatus.toLowerCase()}`}
                      >
                        {order.orderStatus}
                      </span>

                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td colSpan="3">
                    No Orders Found
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

        <div className="dashboard-widget">

          <div className="widget-header">

            <h3>Low Stock Products</h3>

            <button
              onClick={() =>
                navigate("/admin/products")
              }
            >
              View All
            </button>

          </div>

          <table className="orders-table">

            <thead>

              <tr>

                <th>Product</th>

                <th>Stock</th>

              </tr>

            </thead>

            <tbody>

              {dashboard.lowStockProducts.length > 0 ? (

                dashboard.lowStockProducts.map(
                  (product) => (

                    <tr
                      key={product._id}
                      className="clickable-row"
                      onClick={() =>
                        navigate("/admin/products")
                      }
                    >

                      <td>{product.name}</td>

                      <td>

                        <span className="low-stock">

                          {product.stock}

                        </span>

                      </td>

                    </tr>

                  )
                )

              ) : (

                <tr>

                  <td colSpan="2">

                    No Low Stock Products

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

      <div className="dashboard-extra">

        <div className="dashboard-widget">

          <div className="widget-header">

            <h3>Quick Overview</h3>

          </div>

          <div className="overview-grid">

            <div className="overview-card">

              <h4>Products</h4>

              <span>
                {dashboard.totalProducts}
              </span>

            </div>

            <div className="overview-card">

              <h4>Orders</h4>

              <span>
                {dashboard.totalOrders}
              </span>

            </div>

            <div className="overview-card">

              <h4>Customers</h4>

              <span>
                {dashboard.totalCustomers}
              </span>

            </div>

            <div className="overview-card">

              <h4>Revenue</h4>

              <span>
                ₹
                {dashboard.totalRevenue.toLocaleString()}
              </span>

            </div>

          </div>

        </div>

        <div className="dashboard-widget">

          <div className="widget-header">

            <h3>Admin Shortcuts</h3>

          </div>

          <div className="shortcut-list">

            <button
              onClick={() =>
                navigate("/admin/products")
              }
            >
              📦 Manage Products
            </button>

            <button
              onClick={() =>
                navigate("/admin/orders")
              }
            >
              🛒 Manage Orders
            </button>

            <button
              onClick={() =>
                navigate("/admin/vendors")
              }
            >
              🏪 Manage Vendors
            </button>

            <button
              onClick={() =>
                navigate("/admin/users")
              }
            >
              👥 Manage Users
            </button>

            <button
              onClick={() =>
                navigate("/admin/activity")
              }
            >
              📝 Activity Logs
            </button>

            <button
              onClick={() =>
                navigate("/admin/reports")
              }
            >
              📈 Reports
            </button>

          </div>

        </div>

      </div>

    </div>

  </div>

);
}