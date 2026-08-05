import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";

import "../styles/admin.css";

export default function MyEnquiries() {

    const [enquiries, setEnquiries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        fetchEnquiries();

    }, []);

    const fetchEnquiries = async () => {

        try {

            const { data } = await api.get(
                "/enquiries/my"
            );

            setEnquiries(data.data || []);

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Unable to load enquiries"
            );

        } finally {

            setLoading(false);

        }

    };

    const closeEnquiry = async (id) => {

        if (
            !window.confirm(
                "Close this enquiry?"
            )
        )
            return;

        try {

            await api.patch(
                `/enquiries/${id}/close`
            );

            toast.success(
                "Enquiry closed successfully"
            );

            fetchEnquiries();

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Unable to close enquiry"
            );

        }

    };

    return (

        <div
            className="container"
            style={{
                maxWidth: "1400px",
                paddingTop: "40px",
                paddingBottom: "40px"
            }}
        >

            <div
                style={{
                    marginBottom: "32px"
                }}
            >

                <h1
                    style={{
                        color: "#fff",
                        marginBottom: "10px"
                    }}
                >
                    My Enquiries
                </h1>

                <p
                    style={{
                        color: "#94a3b8"
                    }}
                >
                    Track your conversations with sellers and view their replies.
                </p>

            </div>

            {loading ? (

                <div className="empty">
                    Loading enquiries...
                </div>

            ) : enquiries.length === 0 ? (

                <div className="empty">
                    You haven't made any enquiries yet.
                </div>

            ) : (

                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "24px"
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
                                gridTemplateColumns: "110px 1fr 340px",
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
                                        marginBottom: "18px"
                                    }}
                                >

                                    <div
                                        style={{
                                            color: "#60a5fa",
                                            fontWeight: 600
                                        }}
                                    >
                                        Seller
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

                                <span
                                    style={{
                                        display: "inline-block",
                                        background: "#2563eb",
                                        color: "#fff",
                                        padding: "8px 16px",
                                        borderRadius: "999px",
                                        fontWeight: 600,
                                        marginBottom: "20px"
                                    }}
                                >
                                    {item.subject}
                                </span>

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
                                            marginBottom: "12px"
                                        }}
                                    >
                                        Your Message
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

                            {/* Reply */}

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
                                            Seller Reply
                                        </div>

                                        <div
                                            style={{
                                                background: "#111827",
                                                border: "1px solid rgba(255,255,255,.08)",
                                                borderRadius: "14px",
                                                padding: "18px",
                                                minHeight: "180px",
                                                color: "#cbd5e1",
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
                                            padding: "28px",
                                            minHeight: "180px",
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            textAlign: "center",
                                            color: "#94a3b8"
                                        }}
                                    >
                                        The seller hasn't replied yet.
                                    </div>

                                )}

                                {item.status !== "Closed" && (

                                    <button
                                        className="delete-btn"
                                        style={{
                                            width: "100%",
                                            marginTop: "20px"
                                        }}
                                        onClick={() =>
                                            closeEnquiry(item._id)
                                        }
                                    >
                                        Close Enquiry
                                    </button>

                                )}

                            </div>

                        </div>

                    ))}
                </div>

            )}

        </div>

    );

}