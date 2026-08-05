import { NavLink } from "react-router-dom";
import "../styles/admin.css";

export default function AdminSidebar() {
  return (
    <aside className="admin-sidebar">
      <h2>Admin Panel</h2>

      <nav>
        <NavLink
          to="/admin"
          end
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
        >
          📊 Dashboard
        </NavLink>

        <NavLink
          to="/admin/products"
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
        >
          📦 Products
        </NavLink>

        <NavLink
          to="/admin/categories"
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
        >
          📂 Categories
        </NavLink>

        <NavLink
          to="/admin/orders"
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
        >
          🛒 Orders
        </NavLink>

        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
        >
          👥 Users
        </NavLink>

        <NavLink
          to="/admin/vendors"
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
        >
          🏪 Vendors
        </NavLink>

        <NavLink
          to="/admin/reviews"
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
        >
          ⭐ Reviews
        </NavLink>

        <NavLink
          to="/admin/questions"
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
        >
          ❓ Product Questions
        </NavLink>

        <NavLink
          to="/admin/enquiries"
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
        >
          💬 Enquiries
        </NavLink>

        <NavLink
          to="/admin/coupons"
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
        >
          🎟 Coupons
        </NavLink>

        <NavLink
          to="/admin/cms"
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
        >
          📄 CMS Pages
        </NavLink>

        <NavLink
          to="/admin/settings"
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
        >
          ⚙️ Website Settings
        </NavLink>

        <NavLink
          to="/admin/reports"
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
        >
          📈 Reports
        </NavLink>

        <NavLink
          to="/admin/notifications"
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
        >
          🔔 Notifications
        </NavLink>

        <NavLink
          to="/admin/activity"
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
        >
          📝 Activity Logs
        </NavLink>
      </nav>
    </aside>
  );
}