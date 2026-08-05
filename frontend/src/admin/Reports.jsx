import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";

import AdminSidebar from "../components/AdminSidebar";
import AdminTopbar from "../components/AdminTopbar";

import "../styles/admin.css";

import {
  FaBoxOpen,
  FaShoppingCart,
  FaUsers,
  FaStore,
  FaDownload,
} from "react-icons/fa";

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

export default function Reports() {
  const [analytics, setAnalytics] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const { data } = await api.get(
        "/reports/analytics"
      );

      setAnalytics(data.data);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to load reports"
      );
    } finally {
      setLoading(false);
    }
  };

  const download = async (type) => {
    try {
      const response = await api.get(
        `/reports/${type}`,
        {
          responseType: "blob",
        }
      );

      const url =
        window.URL.createObjectURL(
          new Blob([response.data])
        );

      const link =
        document.createElement("a");

      link.href = url;

      link.download = `${type}-report.csv`;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);

      toast.success(
        "Report downloaded"
      );
    } catch {
      toast.error(
        "Unable to download report"
      );
    }
  };

  const statCards = analytics
    ? [
        {
          title: "Revenue",
          value: `₹${analytics.revenue.toLocaleString()}`,
          icon: "💰",
          color: "#16a34a",
        },
        {
          title: "Orders",
          value: analytics.totalOrders,
          icon: "🛒",
          color: "#2563eb",
        },
        {
          title: "Products",
          value: analytics.totalProducts,
          icon: "📦",
          color: "#f59e0b",
        },
        {
          title: "Customers",
          value: analytics.totalUsers,
          icon: "👥",
          color: "#8b5cf6",
        },
      ]
    : [];

  const chartData = useMemo(() => {
    if (!analytics)
      return null;

    return {
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

          data:
            analytics.monthlyRevenue,

          borderColor: "#4f8cff",

          backgroundColor:
            "rgba(79,140,255,.18)",

          fill: true,

          borderWidth: 3,

          tension: .4,
        },
      ],
    };
  }, [analytics]);

  if (loading) {
    return (
      <div className="admin-layout">
        <AdminSidebar />

        <div className="admin-content">

          <AdminTopbar />

          <div className="dashboard-loader">

            <h2>
              Loading Reports...
            </h2>

          </div>

        </div>

      </div>
    );
  }
  return (
    <div className="admin-layout">
      <AdminSidebar />

      <div className="admin-content">
        <AdminTopbar />

        <div className="dashboard-header">
          <div>
            <h1>Reports & Analytics 📊</h1>

            <p>
              Monitor revenue, products, vendors and
              marketplace performance.
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
          {statCards.map((card) => (
            <div
              key={card.title}
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
                <span>{card.title}</span>

                <h2>{card.value}</h2>

                <small>Marketplace Analytics</small>
              </div>
            </div>
          ))}
        </div>

        <div className="dashboard-middle">
          <div className="dashboard-chart">
            <div className="widget-header">
              <h3>Revenue Overview</h3>
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

          <div className="dashboard-widget">
            <div className="widget-header">
              <h3>Top Products</h3>
            </div>

            <table className="orders-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Sold</th>
                </tr>
              </thead>

              <tbody>
                {analytics.topProducts.length ? (
                  analytics.topProducts.map(
                    (product) => (
                      <tr key={product._id}>
                        <td>{product.name}</td>

                        <td>
                          {product.sold}
                        </td>
                      </tr>
                    )
                  )
                ) : (
                  <tr>
                    <td colSpan="2">
                      No Products
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="dashboard-bottom">
          <div className="dashboard-widget">
            <div className="widget-header">
              <h3>Top Vendors</h3>
            </div>

            <table className="orders-table">
              <thead>
                <tr>
                  <th>Vendor</th>
                  <th>Rating</th>
                </tr>
              </thead>

              <tbody>
                {analytics.topVendors.length ? (
                  analytics.topVendors.map(
                    (vendor) => (
                      <tr key={vendor._id}>
                        <td>
                          {vendor.shopName ||
                            vendor.name}
                        </td>

                        <td>
                          ⭐{" "}
                          {vendor.shopRating.toFixed(
                            1
                          )}
                        </td>
                      </tr>
                    )
                  )
                ) : (
                  <tr>
                    <td colSpan="2">
                      No Vendors
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="dashboard-widget">
            <div className="widget-header">
              <h3>Export Reports</h3>
            </div>

            <div className="report-grid">
              <div className="report-card">
                <div className="report-icon">
                  <FaBoxOpen />
                </div>

                <h3>Products Report</h3>

                <p>
                  Download complete product catalogue.
                </p>

                <button
                  className="admin-btn"
                  onClick={() =>
                    download("products")
                  }
                >
                  <FaDownload />
                  Download CSV
                </button>
              </div>

              <div className="report-card">
                <div className="report-icon">
                  <FaShoppingCart />
                </div>

                <h3>Orders Report</h3>

                <p>
                  Export all marketplace orders.
                </p>

                <button
                  className="admin-btn"
                  onClick={() =>
                    download("orders")
                  }
                >
                  <FaDownload />
                  Download CSV
                </button>
              </div>

              <div className="report-card">
                <div className="report-icon">
                  <FaUsers />
                </div>

                <h3>Users Report</h3>

                <p>
                  Download customer information.
                </p>

                <button
                  className="admin-btn"
                  onClick={() =>
                    download("users")
                  }
                >
                  <FaDownload />
                  Download CSV
                </button>
              </div>

              <div className="report-card">
                <div className="report-icon">
                  <FaStore />
                </div>

                <h3>Vendors Report</h3>

                <p>
                  Export vendor details.
                </p>

                <button
                  className="admin-btn"
                  onClick={() =>
                    download("vendors")
                  }
                >
                  <FaDownload />
                  Download CSV
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}