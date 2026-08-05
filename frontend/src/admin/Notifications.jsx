import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";

import AdminSidebar from "../components/AdminSidebar";
import AdminTopbar from "../components/AdminTopbar";

import "../styles/admin.css";

export default function Notifications() {
  const [notifications, setNotifications] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications =
    async () => {
      try {
        setLoading(true);

        const { data } =
          await api.get(
            "/notifications"
          );

        setNotifications(
          data || []
        );
      } catch (error) {
        toast.error(
          error.response?.data
            ?.message ||
            "Unable to load notifications"
        );
      } finally {
        setLoading(false);
      }
    };

  const filteredNotifications =
    useMemo(() => {
      return notifications.filter(
        (notification) =>
          notification.title
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            ) ||
          notification.message
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            )
      );
    }, [notifications, search]);

  const unreadCount =
    notifications.filter(
      (n) => !n.isRead
    ).length;

  const readCount =
    notifications.filter(
      (n) => n.isRead
    ).length;

  const markAsRead =
    async (id) => {
      try {
        await api.put(
          `/notifications/${id}/read`
        );

        toast.success(
          "Notification marked as read"
        );

        fetchNotifications();
      } catch (error) {
        toast.error(
          error.response?.data
            ?.message ||
            "Something went wrong"
        );
      }
    };

  const deleteNotification =
    async (id) => {
      if (
        !window.confirm(
          "Delete notification?"
        )
      )
        return;

      try {
        await api.delete(
          `/notifications/${id}`
        );

        toast.success(
          "Notification deleted"
        );

        fetchNotifications();
      } catch (error) {
        toast.error(
          error.response?.data
            ?.message ||
            "Unable to delete notification"
        );
      }
    };
  if (loading) {
    return (
      <div className="admin-layout">
        <AdminSidebar />

        <div className="admin-content">
          <AdminTopbar />

          <div
            style={{
              padding: 40,
              fontSize: 20,
              fontWeight: 600,
            }}
          >
            Loading Notifications...
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
            <h1>Notifications 🔔</h1>

            <p>
              View and manage all marketplace
              notifications from one place.
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
          <div className="dashboard-stat-card">
            <div className="dashboard-stat-icon">
              🔔
            </div>

            <div className="dashboard-stat-content">
              <span>Total</span>
              <h2>
                {notifications.length}
              </h2>
              <small>
                Notifications
              </small>
            </div>
          </div>

          <div className="dashboard-stat-card">
            <div className="dashboard-stat-icon">
              📩
            </div>

            <div className="dashboard-stat-content">
              <span>Unread</span>
              <h2>{unreadCount}</h2>
              <small>
                Need Attention
              </small>
            </div>
          </div>

          <div className="dashboard-stat-card">
            <div className="dashboard-stat-icon">
              ✅
            </div>

            <div className="dashboard-stat-content">
              <span>Read</span>
              <h2>{readCount}</h2>
              <small>
                Completed
              </small>
            </div>
          </div>

          <div className="dashboard-stat-card">
            <div className="dashboard-stat-icon">
              📅
            </div>

            <div className="dashboard-stat-content">
              <span>Today</span>
              <h2>
                {new Date().getDate()}
              </h2>
              <small>
                Current Date
              </small>
            </div>
          </div>
        </div>

        <div className="admin-card">
          <div className="table-toolbar">
            <input
              className="table-search"
              placeholder="Search notifications..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
            />
          </div>

          <div className="table-container">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Message</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th width="170">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredNotifications.length ===
                0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      style={{
                        textAlign:
                          "center",
                      }}
                    >
                      No Notifications
                      Found
                    </td>
                  </tr>
                ) : (
                  filteredNotifications.map(
                    (
                      notification
                    ) => (
                      <tr
                        key={
                          notification._id
                        }
                      >
                        <td>
                          <strong>
                            {
                              notification.title
                            }
                          </strong>
                        </td>

                        <td>
                          {
                            notification.message
                          }
                        </td>

                        <td
                          style={{
                            textTransform:
                              "capitalize",
                          }}
                        >
                          {
                            notification.type
                          }
                        </td>

                        <td>
                          <span
                            className={`status-badge ${
                              notification.isRead
                                ? "status-approved"
                                : "status-pending"
                            }`}
                          >
                            {notification.isRead
                              ? "Read"
                              : "Unread"}
                          </span>
                        </td>

                        <td>
                          {new Date(
                            notification.createdAt
                          ).toLocaleString()}
                        </td>

                        <td className="action-buttons">
                          {!notification.isRead && (
                            <button
                              className="edit-btn"
                              type="button"
                              onClick={() =>
                                markAsRead(
                                  notification._id
                                )
                              }
                            >
                              Mark Read
                            </button>
                          )}

                          <button
                            className="delete-btn"
                            type="button"
                            onClick={() =>
                              deleteNotification(
                                notification._id
                              )
                            }
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    )
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}