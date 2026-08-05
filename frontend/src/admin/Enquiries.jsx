import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";

import AdminSidebar from "../components/AdminSidebar";
import AdminTopbar from "../components/AdminTopbar";

import "../styles/admin.css";

export default function AdminEnquiries() {

  const [enquiries, setEnquiries] = useState([]);
  const [status, setStatus] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    try {

      const { data } = await api.get("/enquiries/admin");

      setEnquiries(data.data || []);

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Unable to load enquiries"
      );

    }
  };

  const deleteEnquiry = async (id) => {

      if (!window.confirm("Delete this enquiry?")) {
          return;
      }

      try {

          await api.delete(`/enquiries/${id}`);

          toast.success("Enquiry deleted successfully");

          fetchEnquiries();

      } catch (error) {

          toast.error(
              error.response?.data?.message ||
              "Unable to delete enquiry"
          );

      }

  };

  const filtered = useMemo(() => {

    let data = [...enquiries];

    if (status !== "All") {
      data = data.filter(
        (item) => item.status === status
      );
    }

    if (search.trim()) {

        const value = search.trim().toLowerCase();

        data = data.filter((item) => {

            const customer =
                `${item.customer?.name || ""} ${item.customer?.email || ""}`.toLowerCase();

            const vendor =
                `${item.vendor?.shopName || ""} ${item.vendor?.name || ""}`.toLowerCase();

            const product =
                `${item.product?.name || ""}`.toLowerCase();

            const subject =
                `${item.subject || ""}`.toLowerCase();

            return (

                customer.includes(value) ||

                vendor.includes(value) ||

                product.includes(value) ||

                subject.includes(value)

            );

        });

    }

    return data;

  }, [enquiries, status, search]);

  const pending = enquiries.filter(
    (e) => e.status === "Pending"
  ).length;

  const replied = enquiries.filter(
    (e) => e.status === "Replied"
  ).length;

  const closed = enquiries.filter(
    (e) => e.status === "Closed"
  ).length;

  return (

    <div className="admin-layout">

      <AdminSidebar />

      <div className="admin-content">

        <AdminTopbar />

        <div className="dashboard-header">

          <div>

            <h1>
              Customer Enquiries 📩
            </h1>

            <p>
              Manage customer enquiries and monitor vendor responses.
            </p>

          </div>

          <div className="dashboard-date">

            {new Date().toLocaleDateString(
              "en-IN",
              {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric"
              }
            )}

          </div>

        </div>

        <div className="dashboard-grid">

          <div className="dashboard-stat-card">

            <div className="dashboard-stat-icon">
              📩
            </div>

            <div className="dashboard-stat-content">

              <span>Total</span>

              <h2>{enquiries.length}</h2>

              <small>All Enquiries</small>

            </div>

          </div>

          <div className="dashboard-stat-card">

            <div className="dashboard-stat-icon">
              ⏳
            </div>

            <div className="dashboard-stat-content">

              <span>Pending</span>

              <h2>{pending}</h2>

              <small>Awaiting Reply</small>

            </div>

          </div>

          <div className="dashboard-stat-card">

            <div className="dashboard-stat-icon">
              💬
            </div>

            <div className="dashboard-stat-content">

              <span>Replied</span>

              <h2>{replied}</h2>

              <small>Vendor Replied</small>

            </div>

          </div>

          <div className="dashboard-stat-card">

            <div className="dashboard-stat-icon">
              ✅
            </div>

            <div className="dashboard-stat-content">

              <span>Closed</span>

              <h2>{closed}</h2>

              <small>Completed</small>

            </div>

          </div>

        </div>

        <div className="admin-card">

          <div
            style={{
              display: "flex",
              gap: "16px",
              marginBottom: "24px",
              flexWrap: "wrap"
            }}
          >

            <input
              className="table-search"
              placeholder="Search customer, vendor, product or subject..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

            <select
              className="admin-input"
              value={status}
              onChange={(e) =>
                setStatus(e.target.value)
              }
              style={{
                maxWidth: "220px"
              }}
            >

              <option value="All">
                All Status
              </option>

              <option value="Pending">
                Pending
              </option>

              <option value="Replied">
                Replied
              </option>

              <option value="Closed">
                Closed
              </option>

            </select>

          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "24px"
            }}
          >
            {filtered.length === 0 ? (

              <div className="empty">
                No enquiries found.
              </div>

            ) : (

              filtered.map((item) => (

                <div
                  key={item._id}
                  className="admin-card"
                  style={{
                    padding: "28px",
                    borderRadius: "18px",
                    display: "grid",
                    gridTemplateColumns: "110px 1fr 360px",
                    gap: "28px",
                    alignItems: "flex-start"
                  }}
                >

                  {/* Product Image */}

                  <div>

                    {item.product?.images?.length > 0 ? (

                      <img
                        src={`http://localhost:5000${item.product.images[0]}`}
                        alt={item.product?.name}
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "contain",
                          background: "#fff",
                          borderRadius: "14px",
                          padding: "10px",
                          border: "1px solid rgba(255,255,255,.08)"
                        }}
                      />

                    ) : (

                      <div
                        style={{
                          width: "100px",
                          height: "100px",
                          borderRadius: "14px",
                          background: "#1e293b"
                        }}
                      />

                    )}

                  </div>

                  {/* Details */}

                  <div>

                    <h3
                      style={{
                        color: "#fff",
                        marginBottom: "16px"
                      }}
                    >
                      {item.product?.name}
                    </h3>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "18px",
                        marginBottom: "20px"
                      }}
                    >

                      <div>

                        <div
                          style={{
                            color: "#60a5fa",
                            fontWeight: 600
                          }}
                        >
                          Customer
                        </div>

                        <div
                          style={{
                            color: "#fff",
                            marginTop: "6px"
                          }}
                        >
                          {item.customer?.name}
                        </div>

                        <small
                          style={{
                            color: "#94a3b8"
                          }}
                        >
                          {item.customer?.email}
                        </small>

                      </div>

                      <div>

                        <div
                          style={{
                            color: "#60a5fa",
                            fontWeight: 600
                          }}
                        >
                          Vendor
                        </div>

                        <div
                          style={{
                            color: "#fff",
                            marginTop: "6px"
                          }}
                        >
                          {item.vendor?.shopName ||
                            item.vendor?.name}
                        </div>

                        <small
                          style={{
                            color: "#94a3b8"
                          }}
                        >
                          {item.vendor?.email}
                        </small>

                      </div>

                    </div>

                    <div
                      style={{
                        marginBottom: "20px"
                      }}
                    >

                      <span
                        style={{
                          display: "inline-block",
                          background: "#2563eb",
                          color: "#fff",
                          padding: "8px 16px",
                          borderRadius: "999px",
                          fontWeight: 600
                        }}
                      >
                        {item.subject}
                      </span>

                    </div>

                    <div
                      style={{
                        background: "#111827",
                        border: "1px solid rgba(255,255,255,.08)",
                        borderRadius: "14px",
                        padding: "18px"
                      }}
                    >

                      <div
                        style={{
                          color: "#60a5fa",
                          fontWeight: 700,
                          marginBottom: "10px"
                        }}
                      >
                        Customer Message
                      </div>

                      <div
                        style={{
                          color: "#cbd5e1",
                          whiteSpace: "pre-wrap",
                          lineHeight: "1.7"
                        }}
                      >
                        {item.message}
                      </div>

                    </div>

                  </div>

                  {/* Reply Section */}

                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "20px"
                      }}
                    >

                      <span
                        style={{
                          padding: "8px 18px",
                          borderRadius: "999px",
                          color: "#fff",
                          fontWeight: 600,
                          background:
                            item.status === "Pending"
                              ? "#f59e0b"
                              : item.status === "Replied"
                              ? "#22c55e"
                              : "#64748b"
                        }}
                      >
                        {item.status}
                      </span>

                      <small
                        style={{
                          color: "#94a3b8"
                        }}
                      >
                        {new Date(
                          item.createdAt
                        ).toLocaleDateString()}
                      </small>

                    </div>

                    {item.vendorReply ? (

                      <>

                        <div
                          style={{
                            color: "#22c55e",
                            fontWeight: 700,
                            marginBottom: "12px"
                          }}
                        >
                          Vendor Reply
                        </div>

                        <div
                          style={{
                            background: "#111827",
                            border: "1px solid rgba(255,255,255,.08)",
                            borderRadius: "14px",
                            padding: "18px",
                            color: "#cbd5e1",
                            minHeight: "170px",
                            whiteSpace: "pre-wrap",
                            lineHeight: "1.7"
                          }}
                        >
                          {item.vendorReply}
                        </div>

                      </>

                    ) : (

                      <div
                        style={{
                          background: "#111827",
                          border: "1px dashed rgba(255,255,255,.12)",
                          borderRadius: "14px",
                          padding: "26px",
                          textAlign: "center",
                          color: "#94a3b8",
                          minHeight: "170px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                      >
                        Vendor has not replied yet.
                      </div>

                    )}

                    <div
                      style={{
                        marginTop: "18px",
                        display: "flex",
                        justifyContent: "flex-end"
                      }}
                    >

                      <button
                          className="delete-btn"
                          onClick={() => deleteEnquiry(item._id)}
                      >
                          Delete Enquiry
                      </button>

                    </div>

                  </div>

                </div>

              ))

            )}
          </div>

        </div>

      </div>

    </div>

  );

}