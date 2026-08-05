import { NavLink } from "react-router-dom";
import "../styles/admin.css";

export default function VendorSidebar() {
  return (
    <aside className="admin-sidebar">
      <div className="admin-logo">
        <h2>TechKart</h2>
        <span>Vendor Panel</span>
      </div>

      <nav>
        <NavLink
          to="/vendor"
          end
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          📊 Dashboard
        </NavLink>

        <NavLink
          to="/vendor/products"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          📦 My Products
        </NavLink>

        <NavLink
          to="/vendor/orders"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          🛒 Orders
        </NavLink>

        <NavLink
          to="/vendor/questions"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          ❓ Product Questions
        </NavLink>

        <NavLink
          to="/vendor/enquiries"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          💬 Customer Enquiries
        </NavLink>

        <NavLink
          to="/vendor/profile"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          👤 Shop Profile
        </NavLink>

        <NavLink
            to="/vendor/reviews"
            className={({ isActive }) =>
                isActive ? "active" : ""
            }
        >
            ⭐ Customer Reviews
        </NavLink>
        
      </nav>
    </aside>
  );
}