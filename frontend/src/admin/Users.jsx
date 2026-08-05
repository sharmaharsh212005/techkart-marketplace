import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";
import AdminSidebar from "../components/AdminSidebar";
import AdminTopbar from "../components/AdminTopbar";
import UserTable from "./UserTable";
import "../styles/admin.css";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const res = await api.get("/users");

      setUsers(res.data.data || []);
    } catch (err) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    try {
      await api.delete(`/users/${id}`);

      toast.success("User deleted");

      fetchUsers();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Delete failed"
      );
    }
  };

  const changeRole = async (id, role) => {
    try {
      await api.put(`/users/${id}/role`, {
        role,
      });

      toast.success("Role updated");

      fetchUsers();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Update failed"
      );
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <div className="admin-content">
        <AdminTopbar />

        <div className="dashboard-header">

            <div>

                <h1>User Management</h1>

                <p>
                    Manage registered users, roles and marketplace access.
                </p>

            </div>

        </div>

        {loading ? (
          <div className="empty">Loading...</div>
        ) : (
          <UserTable
            users={users}
            onDelete={deleteUser}
            onRoleChange={changeRole}
          />
        )}
      </div>
    </div>
  );
}