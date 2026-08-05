import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";

import AdminSidebar from "../components/AdminSidebar";
import AdminTopbar from "../components/AdminTopbar";
import VendorTable from "./VendorTable";

import "../styles/admin.css";

export default function Vendors() {
  const [vendors, setVendors] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      setLoading(true);

      const { data } =
        await api.get("/users/vendors");

      setVendors(data.data || []);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to load vendors"
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredVendors =
    useMemo(() => {
      return vendors.filter(
        (vendor) => {
          const keyword =
            search.toLowerCase();

          const matchesSearch =
            vendor.name
              ?.toLowerCase()
              .includes(keyword) ||
            vendor.email
              ?.toLowerCase()
              .includes(keyword) ||
            vendor.shopName
              ?.toLowerCase()
              .includes(keyword);

          const matchesStatus =
            statusFilter === "All" ||
            vendor.vendorStatus ===
              statusFilter;

          return (
            matchesSearch &&
            matchesStatus
          );
        }
      );
    }, [
      vendors,
      search,
      statusFilter,
    ]);

  const approveVendor =
    async (id) => {
      if (
        !window.confirm(
          "Approve this vendor?"
        )
      )
        return;

      try {
        await api.put(
          `/users/vendors/${id}/approve`
        );

        toast.success(
          "Vendor approved"
        );

        fetchVendors();
      } catch (err) {
        toast.error(
          err.response?.data
            ?.message ||
            "Approval failed"
        );
      }
    };

  const rejectVendor =
    async (id) => {
      if (
        !window.confirm(
          "Reject this vendor?"
        )
      )
        return;

      try {
        await api.put(
          `/users/vendors/${id}/reject`
        );

        toast.success(
          "Vendor rejected"
        );

        fetchVendors();
      } catch (err) {
        toast.error(
          err.response?.data
            ?.message ||
            "Rejection failed"
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
            <h1>Vendor Management 🏪</h1>

            <p>
              Review, approve and manage marketplace
              vendors.
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
              🏪
            </div>

            <div className="dashboard-stat-content">
              <span>Total Vendors</span>

              <h2>{vendors.length}</h2>

              <small>Registered</small>
            </div>
          </div>

          <div className="dashboard-stat-card">
            <div className="dashboard-stat-icon">
              ✅
            </div>

            <div className="dashboard-stat-content">
              <span>Approved</span>

              <h2>
                {
                  vendors.filter(
                    (v) =>
                      v.vendorStatus ===
                      "Approved"
                  ).length
                }
              </h2>

              <small>Active Vendors</small>
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
                  vendors.filter(
                    (v) =>
                      v.vendorStatus ===
                      "Pending"
                  ).length
                }
              </h2>

              <small>Awaiting Approval</small>
            </div>
          </div>

          <div className="dashboard-stat-card">
            <div className="dashboard-stat-icon">
              ❌
            </div>

            <div className="dashboard-stat-content">
              <span>Rejected</span>

              <h2>
                {
                  vendors.filter(
                    (v) =>
                      v.vendorStatus ===
                      "Rejected"
                  ).length
                }
              </h2>

              <small>Rejected Vendors</small>
            </div>
          </div>
        </div>

        <div className="table-toolbar">
          <input
            type="text"
            className="table-search"
            placeholder="Search vendor, email or shop..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          <select
            className="table-filter"
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value
              )
            }
          >
            <option value="All">
              All Vendors
            </option>

            <option value="Approved">
              Approved
            </option>

            <option value="Pending">
              Pending
            </option>

            <option value="Rejected">
              Rejected
            </option>
          </select>
        </div>

        {loading ? (
          <div className="empty">
            Loading Vendors...
          </div>
        ) : (
          <VendorTable
            vendors={filteredVendors}
            onApprove={
              approveVendor
            }
            onReject={
              rejectVendor
            }
          />
        )}
      </div>
    </div>
  );
}