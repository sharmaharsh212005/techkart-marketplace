import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";

import VendorSidebar from "./VendorSidebar";
import VendorTopbar from "./VendorTopbar";

import "../styles/admin.css";
import "../styles/adminProducts.css";

export default function VendorEnquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState({});

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    try {
      const { data } = await api.get("/enquiries/vendor");
      setEnquiries(data.data || []);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Unable to fetch enquiries"
      );
    } finally {
      setLoading(false);
    }
  };

    const deleteEnquiry = async (id) => {

    if (!window.confirm("Are you sure you want to delete this enquiry?")) {
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

  const sendReply = async (id) => {
    if (!reply[id]?.trim()) {
      toast.error("Reply cannot be empty");
      return;
    }

    try {
      await api.patch(`/enquiries/${id}/reply`, {
        vendorReply: reply[id],
      });

      toast.success("Reply sent successfully");

      setReply((prev) => ({
        ...prev,
        [id]: "",
      }));

      fetchEnquiries();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Unable to send reply"
      );
    }
  };

  return (
    <div className="admin-layout">
      <VendorSidebar />

      <div className="admin-content">
        <VendorTopbar />

        <div className="page-header">
          <div>
            <h2>Customer Enquiries</h2>

            <p
              style={{
                color: "#94a3b8",
                marginTop: "8px",
              }}
            >
              Respond to customer questions about your
              products.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="empty">
            Loading enquiries...
          </div>
        ) : enquiries.length === 0 ? (
          <div className="empty">
            No customer enquiries found.
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "24px",
            }}
          >
            {enquiries.map((item) => (
              <div
                key={item._id}
                className="admin-card"
                style={{
                  padding: "28px",
                  borderRadius: "18px",
                  display: "grid",
                  gridTemplateColumns: "110px 1fr 360px",
                  gap: "28px",
                  alignItems: "flex-start",
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
                        border: "1px solid rgba(255,255,255,.08)",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "100px",
                        height: "100px",
                        borderRadius: "14px",
                        background: "#1e293b",
                      }}
                    />
                  )}
                </div>

                {/* Product Details */}

                <div>
                  <h3
                    style={{
                      color: "#fff",
                      marginBottom: "16px",
                    }}
                  >
                    {item.product?.name}
                  </h3>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                      marginBottom: "20px",
                    }}
                  >
                    <div>
                      <strong
                        style={{
                          color: "#60a5fa",
                        }}
                      >
                        Customer
                      </strong>

                      <div
                        style={{
                          color: "#cbd5e1",
                          marginTop: "4px",
                        }}
                      >
                        {item.customer?.name}
                      </div>

                      <small
                        style={{
                          color: "#94a3b8",
                        }}
                      >
                        {item.customer?.email}
                      </small>
                    </div>

                    <div>
                      <strong
                        style={{
                          color: "#60a5fa",
                        }}
                      >
                        Subject
                      </strong>

                      <div
                        style={{
                          marginTop: "8px",
                          display: "inline-block",
                          padding: "8px 16px",
                          borderRadius: "999px",
                          background: "#1d4ed8",
                          color: "#fff",
                          fontWeight: 600,
                        }}
                      >
                        {item.subject}
                      </div>
                    </div>
                  </div>

                  {/* Customer Message */}

                  <div
                    style={{
                      background: "#111827",
                      border: "1px solid rgba(255,255,255,.08)",
                      borderRadius: "14px",
                      padding: "18px",
                    }}
                  >
                    <div
                      style={{
                        color: "#60a5fa",
                        fontWeight: 700,
                        marginBottom: "12px",
                      }}
                    >
                      Customer Message
                    </div>

                    <div
                      style={{
                        color: "#cbd5e1",
                        whiteSpace: "pre-wrap",
                        lineHeight: "1.7",
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
                      marginBottom: "20px",
                    }}
                  >
                    <span
                      style={{
                        padding: "8px 18px",
                        borderRadius: "999px",
                        fontWeight: 600,
                        color: "#fff",
                        background:
                          item.status === "Pending"
                            ? "#f59e0b"
                            : item.status === "Replied"
                            ? "#22c55e"
                            : "#64748b",
                      }}
                    >
                      {item.status}
                    </span>

                    <small
                      style={{
                        color: "#94a3b8",
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
                          marginBottom: "12px",
                        }}
                      >
                        Your Reply
                      </div>

                      <div
                        style={{
                          background: "#111827",
                          border: "1px solid rgba(255,255,255,.08)",
                          borderRadius: "14px",
                          padding: "18px",
                          minHeight: "170px",
                          color: "#cbd5e1",
                          whiteSpace: "pre-wrap",
                          lineHeight: "1.7",
                        }}
                      >
                        {item.vendorReply}
                      </div>
                    </>
                  ) : (
                    <>
                      <div
                        style={{
                          color: "#60a5fa",
                          fontWeight: 700,
                          marginBottom: "12px",
                        }}
                      >
                        Write Reply
                      </div>

                      <textarea
                        rows={7}
                        placeholder="Write a professional reply to the customer..."
                        value={reply[item._id] || ""}
                        onChange={(e) =>
                          setReply({
                            ...reply,
                            [item._id]:
                              e.target.value,
                          })
                        }
                        style={{
                          width: "100%",
                          resize: "vertical",
                          minHeight: "170px",
                          background: "#111827",
                          border:
                            "1px solid rgba(255,255,255,.08)",
                          borderRadius: "14px",
                          padding: "16px",
                          color: "#fff",
                          outline: "none",
                          fontSize: "15px",
                          lineHeight: "1.6",
                        }}
                      />

                      <button
                        className="primary-btn"
                        style={{
                          width: "100%",
                          marginTop: "18px",
                          height: "48px",
                          fontWeight: 600,
                        }}
                        onClick={() =>
                          sendReply(item._id)
                        }
                      >
                        Send Reply
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}