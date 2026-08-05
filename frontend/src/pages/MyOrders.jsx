import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Eye,
  ShoppingBag,
  Package,
  CreditCard,
  Download
} from "lucide-react";
import api from "../api/axios";
import "../styles/orders.css";

export default function MyOrders() {

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {

        try {

            const { data } = await api.get(
                "/orders/my-orders"
            );

            setOrders(data.data || []);

        } catch (err) {

            console.error(err);

        } finally {

            setLoading(false);

        }

    };

    const formatDate = (date) => {

        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "long",
                year: "numeric",
            }
        );

    };

    const formatPrice = (value) => {

        return `₹${Number(value || 0).toLocaleString(
            "en-IN"
        )}`;

    };

    const downloadInvoice = async (id) => {
        try {

            const response = await api.get(
                `/invoice/${id}`,
                {
                    responseType: "blob",
                    headers: {
                        Accept: "application/pdf",
                    },
                }
            );

            const blob = new Blob(
                [response.data],
                {
                    type: "application/pdf",
                }
            );

            const blobUrl = window.URL.createObjectURL(blob);

            const link = document.createElement("a");

            link.href = blobUrl;
            link.download = `Invoice-${id}.pdf`;

            document.body.appendChild(link);

            link.click();

            document.body.removeChild(link);

            setTimeout(() => {
                window.URL.revokeObjectURL(blobUrl);
            }, 100);

        } catch (error) {

            console.error("Invoice Download Error:", error);

            if (error.response) {
                console.log(error.response.status);
                console.log(error.response.data);
            }

            alert("Unable to download invoice.");
        }
    };

    if (loading) {

        return (

            <div className="orders-page">

                <div className="orders-header">

                    <div>

                        <h1>My Orders</h1>

                        <p>
                            Loading your orders...
                        </p>

                    </div>

                </div>

                <div className="orders-grid">

                    {[1,2,3].map((item)=>(

                        <div
                            key={item}
                            className="order-card loading-card"
                        >

                            <div className="loading-box title"/>

                            <div className="loading-box line"/>

                            <div className="loading-box line"/>

                            <div className="loading-box button"/>

                        </div>

                    ))}

                </div>

            </div>

        );

    }

    if (!orders.length) {

        return (

            <div className="orders-empty">

                <ShoppingBag size={90} />

                <h2>No Orders Yet</h2>

                <p>
                    Looks like you haven't placed
                    your first order.
                </p>

                <Link
                    to="/products"
                    className="shop-btn"
                >
                    Continue Shopping
                </Link>

            </div>

        );

    }

    return (

        <div className="orders-page">
            <div className="orders-header">

                <div className="header-left">

                    <h1>My Orders</h1>

                    <p>
                        Track your purchases and delivery status.
                    </p>

                </div>

                <div className="orders-counter">

                    <Package size={30} />

                    <div>

                        <span>
                            {orders.length}
                        </span>

                        <small>
                            {orders.length > 1
                                ? "Orders"
                                : "Order"}
                        </small>

                    </div>

                </div>

            </div>

            <div className="orders-grid">

                {orders.map((order) => (

                    <div
                        key={order._id}
                        className="order-card"
                    >

                        {/* ===========================
                           CARD HEADER
                        =========================== */}

                        <div className="card-header">

                            <div className="card-left">

                                <h2>

                                    Order #

                                    {order._id
                                        .slice(-8)
                                        .toUpperCase()}

                                </h2>

                                <span className="order-date">

                                    Placed on{" "}

                                    {formatDate(
                                        order.createdAt
                                    )}

                                </span>

                            </div>

                            <div className="card-right">

                                <Link
                                    to={`/orders/${order._id}`}
                                    className="view-btn"
                                >

                                    <Eye size={18} />

                                    View Details

                                </Link>

                            </div>

                        </div>

                        {/* ===========================
                           STATUS BADGES
                        =========================== */}

                        <div className="order-status-row">

                            <div
                                className={`status-pill ${order.orderStatus
                                    .toLowerCase()
                                    .replace(/\s/g, "-")}`}
                            >

                                {order.orderStatus}

                            </div>

                            <div
                                className={`payment-pill ${order.paymentStatus
                                    .toLowerCase()
                                    .replace(/\s/g, "-")}`}
                            >

                                <CreditCard size={15} />

                                {order.paymentStatus}

                            </div>

                        </div>

                        {/* ===========================
                           TIMELINE
                        =========================== */}

                        <div className="order-progress">

                            <div
                                className={`progress-step ${
                                    [
                                        "Pending",
                                        "Processing",
                                        "Shipped",
                                        "Delivered",
                                    ].includes(
                                        order.orderStatus
                                    )
                                            ? "active"
                                            : ""
                                }`}
                            >
                                Pending
                            </div>

                            <div
                                className={`progress-step ${
                                    [
                                        "Processing",
                                        "Shipped",
                                        "Delivered",
                                    ].includes(
                                        order.orderStatus
                                    )
                                            ? "active"
                                            : ""
                                }`}
                            >
                                Processing
                            </div>

                            <div
                                className={`progress-step ${
                                    [
                                        "Shipped",
                                        "Delivered",
                                    ].includes(
                                        order.orderStatus
                                    )
                                            ? "active"
                                            : ""
                                }`}
                            >
                                Shipped
                            </div>

                            <div
                                className={`progress-step ${
                                    order.orderStatus ===
                                    "Delivered"
                                        ? "active"
                                        : ""
                                }`}
                            >
                                Delivered
                            </div>

                        </div>

                        {/* ===========================
                           PRODUCTS
                        =========================== */}

                        <div className="order-products">

                            {order.items.map((item) => (
                                <div
                                    key={item._id}
                                    className="order-product"
                                >

                                    <div className="product-image">

                                        <img
                                            src={
                                                item.product?.images?.[0]
                                                    ? `http://localhost:5000${item.product.images[0]}`
                                                    : "/placeholder.png"
                                            }
                                            alt={
                                                item.product?.name ||
                                                "Product"
                                            }
                                        />

                                    </div>

                                    <div className="product-content">

                                        <h3>

                                            {item.product?.name ||
                                                "Product Removed"}

                                        </h3>

                                        <div className="product-details">

                                            <span>

                                                Qty

                                                <strong>

                                                    {item.quantity}

                                                </strong>

                                            </span>

                                            <span>

                                                Price

                                                <strong>

                                                    {formatPrice(
                                                        item.price
                                                    )}

                                                </strong>

                                            </span>

                                        </div>

                                    </div>

                                    <div className="product-price">

                                        {formatPrice(
                                            item.price *
                                            item.quantity
                                        )}

                                    </div>

                                </div>

                            ))}

                        </div>

                        {/* ======================
                            ORDER SUMMARY
                        ====================== */}

                        <div className="summary-card">

                            <div className="summary-row">

                                <span>

                                    Payment Method

                                </span>

                                <strong>

                                    {order.paymentMethod}

                                </strong>

                            </div>

                            <div className="summary-row">

                                <span>

                                    Shipping

                                </span>

                                <strong>

                                    {order.shippingAddress?.city},{" "}
                                    {order.shippingAddress?.state}

                                </strong>

                            </div>

                            <div className="summary-row">

                                <span>

                                    Items

                                </span>

                                <strong>

                                    {order.items.length}

                                </strong>

                            </div>

                            <div className="summary-row total">

                                <span>

                                    Total Amount

                                </span>

                                <strong>

                                    {formatPrice(
                                        order.totalAmount
                                    )}

                                </strong>

                            </div>

                        </div>

                        {/* ======================
                            CARD FOOTER
                        ====================== */}

                        <div className="card-footer">

                            <button
                                className="invoice-btn"
                                onClick={() =>
                                    downloadInvoice(
                                        order._id
                                    )
                                }
                            >

                                <Download size={18} />

                                Download Invoice

                            </button>

                        </div>

                    </div>

                ))}

            </div>

            <div className="support-card">

                <div>

                    <h3>

                        Need help with your order?

                    </h3>

                    <p>

                        Our support team is available to help
                        with returns, cancellations and
                        delivery updates.

                    </p>

                </div>

                <Link
                    to="/contact"
                    className="support-btn"
                >

                    Contact Support

                </Link>

            </div>

        </div>

    );

}