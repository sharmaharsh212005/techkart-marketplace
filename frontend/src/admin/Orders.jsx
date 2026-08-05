import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";

import AdminSidebar from "../components/AdminSidebar";
import AdminTopbar from "../components/AdminTopbar";
import OrderTable from "./OrderTable";
import OrderDetailModal from "./OrderDetailModal";

import "../styles/admin.css";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);

  const [selectedOrder, setSelectedOrder] =
    useState(null);

  const [showModal, setShowModal] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get("/orders");

      setOrders(data.data || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to fetch orders"
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const customer =
        order.user?.name || "";

      const id =
        order._id || "";

      const matchesSearch =
        customer
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        id
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" ||
        order.orderStatus ===
          statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [
    orders,
    search,
    statusFilter,
  ]);

  const updateStatus = async (
    id,
    payload
  ) => {
    try {
      await api.put(
        `/orders/${id}/status`,
        payload
      );

      toast.success(
        "Order updated"
      );

      fetchOrders();

      if (
        selectedOrder?._id === id
      ) {
        setSelectedOrder({
          ...selectedOrder,
          ...payload,
        });
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to update order"
      );
    }
  };

  const deleteOrder = async (
    id
  ) => {
    if (
      !window.confirm(
        "Delete this order?"
      )
    )
      return;

    try {
      await api.delete(
        `/orders/${id}`
      );

      toast.success(
        "Order deleted"
      );

      fetchOrders();

      setShowModal(false);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to delete order"
      );
    }
  };

  const viewOrder = (
    order
  ) => {
    setSelectedOrder(order);

    setShowModal(true);
  };
  return (
    <div className="admin-layout">
      <AdminSidebar />

      <div className="admin-content">
        <AdminTopbar />

        <div className="dashboard-header">
          <div>
            <h1>Order Management 📦</h1>

            <p>
              Track, manage and update marketplace
              orders efficiently.
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
          <div className="dashboard-stat-card">
            <div className="dashboard-stat-icon">
              📦
            </div>

            <div className="dashboard-stat-content">
              <span>Total Orders</span>

              <h2>{orders.length}</h2>

              <small>All Orders</small>
            </div>
          </div>

          <div className="dashboard-stat-card">
            <div className="dashboard-stat-icon">
              🚚
            </div>

            <div className="dashboard-stat-content">
              <span>Delivered</span>

              <h2>
                {
                  orders.filter(
                    (o) =>
                      o.orderStatus ===
                      "Delivered"
                  ).length
                }
              </h2>

              <small>Completed</small>
            </div>
          </div>

          <div className="dashboard-stat-card">
            <div className="dashboard-stat-icon">
              ⏳
            </div>

            <div className="dashboard-stat-content">
              <span>Pending</span>

              <h2>
                {
                  orders.filter(
                    (o) =>
                      o.orderStatus ===
                      "Pending"
                  ).length
                }
              </h2>

              <small>Awaiting Processing</small>
            </div>
          </div>

          <div className="dashboard-stat-card">
            <div className="dashboard-stat-icon">
              ❌
            </div>

            <div className="dashboard-stat-content">
              <span>Cancelled</span>

              <h2>
                {
                  orders.filter(
                    (o) =>
                      o.orderStatus ===
                      "Cancelled"
                  ).length
                }
              </h2>

              <small>Cancelled Orders</small>
            </div>
          </div>
        </div>

        <div className="table-toolbar">
          <input
            type="text"
            className="table-search"
            placeholder="Search by Order ID or Customer..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          <select
            className="table-filter"
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
          >
            <option>All</option>
            <option>Pending</option>
            <option>Processing</option>
            <option>Shipped</option>
            <option>Delivered</option>
            <option>Cancelled</option>
          </select>
        </div>

        <OrderTable
          loading={loading}
          orders={filteredOrders}
          onView={viewOrder}
        />

        <OrderDetailModal
          show={showModal}
          order={selectedOrder}
          onClose={() =>
            setShowModal(false)
          }
          onUpdateStatus={updateStatus}
          onDelete={deleteOrder}
        />
      </div>
    </div>
  );
}