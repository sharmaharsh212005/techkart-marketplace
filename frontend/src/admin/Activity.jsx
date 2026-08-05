import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";

import AdminSidebar from "../components/AdminSidebar";
import AdminTopbar from "../components/AdminTopbar";

import "../styles/admin.css";

export default function Activity() {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const { data } = await api.get("/activity");
      setActivities(data.data);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to load activity logs"
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

                <h1>Activity Logs</h1>

                <p>
                    Monitor administrator, vendor and system activities across the marketplace.
                </p>

            </div>

        </div>

        <div className="table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Action</th>
                <th>Description</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {activities.length === 0 ? (
                <tr>
                  <td colSpan="5">
                    No activity found.
                  </td>
                </tr>
              ) : (
                activities.map((activity) => (
                  <tr key={activity._id}>
                    <td>{activity.user?.name || "-"}</td>

                    <td>{activity.role}</td>

                    <td>{activity.action}</td>

                    <td>{activity.description}</td>

                    <td>
                      {new Date(
                        activity.createdAt
                      ).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}