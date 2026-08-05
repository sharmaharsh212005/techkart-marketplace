import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FaBell } from "react-icons/fa";
import api from "../api/axios";
import "../styles/notificationBell.css";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchNotifications();

    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  const fetchNotifications = async () => {
    try {
      const [{ data }, { data: countData }] =
        await Promise.all([
          api.get("/notifications"),
          api.get("/notifications/count"),
        ]);

      setNotifications(data.slice(0, 5));
      setCount(countData.count);
    } catch (error) {
      console.error(error);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      fetchNotifications();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      className="notification-wrapper"
      ref={dropdownRef}
    >
      <button
        className="icon-btn notification-btn"
        onClick={() => setOpen(!open)}
      >
        <FaBell />

        {count > 0 && (
          <span className="notification-badge">
            {count > 99 ? "99+" : count}
          </span>
        )}
      </button>

      {open && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h4>Notifications</h4>
            <span>{count} unread</span>
          </div>

          {notifications.length === 0 ? (
            <div className="notification-empty">
              No Notifications
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification._id}
                className={`notification-item ${
                  notification.isRead
                    ? ""
                    : "unread"
                }`}
              >
                <div>
                  <strong>
                    {notification.title}
                  </strong>

                  <p>{notification.message}</p>

                  <small>
                    {new Date(
                      notification.createdAt
                    ).toLocaleString()}
                  </small>
                </div>

                {!notification.isRead && (
                  <button
                    className="notification-read"
                    onClick={() =>
                      markAsRead(notification._id)
                    }
                  >
                    ✓
                  </button>
                )}
              </div>
            ))
          )}

          <Link
            to="/admin/notifications"
            className="notification-footer"
            onClick={() => setOpen(false)}
          >
            View All Notifications
          </Link>
        </div>
      )}
    </div>
  );
}