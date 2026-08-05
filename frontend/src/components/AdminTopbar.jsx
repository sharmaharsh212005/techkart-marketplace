import { useAuth } from "../context/AuthContext";
import "./../styles/admin.css";

export default function AdminTopbar() {
  const { user } = useAuth();

  return (
    <header className="admin-topbar">

      <div>
        <h2>Dashboard</h2>
        <p>Welcome back, {user?.name}</p>
      </div>

      <div className="admin-user">
        <span>{user?.role}</span>
      </div>

    </header>
  );
}