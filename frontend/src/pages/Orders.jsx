import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FaBoxOpen,
  FaMapMarkerAlt,
  FaCreditCard,
  FaEye,
  FaTruck,
  FaCheckCircle,
  FaClock,
} from "react-icons/fa";

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
      const { data } = await api.get("/orders/my-orders");
      setOrders(data.data || []);
    } catch (err) {
      toast.error("Unable to load your orders");
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status = "") =>
    status.toLowerCase().replace(/\s/g, "");

  const getStatusIcon = (status = "") => {
    switch (status.toLowerCase()) {
      case "delivered":
        return <FaCheckCircle />;
      case "shipped":
        return <FaTruck />;
      case "processing":
        return <FaClock />;
      default:
        return <FaBoxOpen />;
    }
  };

  if (loading) {
    return (
      <div className="orders-loading">
        <div className="loader"></div>
        <h2>Loading your orders...</h2>
      </div>
    );
  }

  return (
    <div className="orders-page">

      <div className="orders-top">

        <div>
          <h1>My Orders</h1>

          <p>
            Track your purchases, payment status
            and delivery progress.
          </p>
        </div>

        <div className="orders-count">
          {orders.length}
          <span>Orders</span>
        </div>

      </div>

      {orders.length === 0 ? (

        <div className="empty-orders">

          <FaBoxOpen />

          <h2>No Orders Yet</h2>

          <p>
            Looks like you haven't placed
            your first order.
          </p>

          <Link
            to="/products"
            className="shop-btn"
          >
            Start Shopping
          </Link>

        </div>

      ) : (

        orders.map((order) => (

          <div
            className="order-card"
            key={order._id}
          >
            <div className="order-header">

              <div>

                <span className="order-id">
                  Order #{order._id.slice(-8).toUpperCase()}
                </span>

                <p className="order-date">
                  Placed on{" "}
                  {new Date(order.createdAt).toLocaleDateString(
                    "en-IN",
                    {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    }
                  )}
                </p>

              </div>

              <div className="order-badges">

                <span
                  className={`status-badge ${getStatusClass(
                    order.orderStatus
                  )}`}
                >
                  {getStatusIcon(order.orderStatus)}
                  <span>{order.orderStatus}</span>
                </span>

                <span
                  className={`payment-badge ${getStatusClass(
                    order.paymentStatus
                  )}`}
                >
                  <FaCreditCard />
                  <span>{order.paymentStatus}</span>
                </span>

              </div>

            </div>

            <div className="products-list">

              {order.items.map((item) => (

                <div
                  className="product-card-order"
                  key={item._id}
                >

                  <img
                    src={
                      item.product.images?.length
                        ? `http://localhost:5000${item.product.images[0]}`
                        : "https://placehold.co/120x120?text=TechKart"
                    }
                    alt={item.product.name}
                  />

                  <div className="product-details">

                    <h3>{item.product.name}</h3>

                    <p>
                      Quantity:
                      <strong> {item.quantity}</strong>
                    </p>

                    <p>
                      Price:
                      <strong>
                        {" "}
                        ₹{item.price.toLocaleString("en-IN")}
                      </strong>
                    </p>

                  </div>

                  <div className="product-total">
                    ₹
                    {(item.price * item.quantity).toLocaleString(
                      "en-IN"
                    )}
                  </div>

                </div>

              ))}

            </div>

            <div className="order-middle">

              <div className="shipping-card">

                <h3>
                  <FaMapMarkerAlt />
                  Shipping Address
                </h3>

                <p>
                  <strong>
                    {order.shippingAddress.fullName}
                  </strong>
                </p>

                <p>{order.shippingAddress.phone}</p>

                <p>{order.shippingAddress.address}</p>

                <p>
                  {order.shippingAddress.city},{" "}
                  {order.shippingAddress.state}
                </p>

                <p>
                  {order.shippingAddress.pincode}
                </p>

              </div>
              <div className="summary-card">

                <h3>
                  <FaCreditCard />
                  Order Summary
                </h3>

                <div className="summary-row">
                  <span>Payment Method</span>
                  <strong>{order.paymentMethod}</strong>
                </div>

                <div className="summary-row">
                  <span>Payment Status</span>
                  <strong>{order.paymentStatus}</strong>
                </div>

                <div className="summary-row">
                  <span>Order Status</span>
                  <strong>{order.orderStatus}</strong>
                </div>

                <div className="summary-row total-row">
                  <span>Total Amount</span>
                  <strong>
                    ₹{order.totalAmount.toLocaleString("en-IN")}
                  </strong>
                </div>

              </div>

            </div>

            <div className="order-progress">

              <div
                className={`progress-step ${
                  ["processing", "shipped", "delivered"].includes(
                    order.orderStatus.toLowerCase()
                  )
                    ? "active"
                    : ""
                }`}
              >
                <div className="step-circle">
                  1
                </div>

                <span>
                  Processing
                </span>

              </div>

              <div
                className={`progress-step ${
                  ["shipped", "delivered"].includes(
                    order.orderStatus.toLowerCase()
                  )
                    ? "active"
                    : ""
                }`}
              >

                <div className="step-circle">
                  2
                </div>

                <span>
                  Shipped
                </span>

              </div>

              <div
                className={`progress-step ${
                  order.orderStatus.toLowerCase() ===
                  "delivered"
                    ? "active"
                    : ""
                }`}
              >

                <div className="step-circle">
                  3
                </div>

                <span>
                  Delivered
                </span>

              </div>

            </div>

            <div className="order-footer"></div>
              <div className="footer-left">

                <div className="grand-total">

                  <span className="total-label">
                    Total
                  </span>

                  <span className="total-price">
                    ₹{order.totalAmount.toLocaleString("en-IN")}
                  </span>

                </div>

              </div>

              <div className="footer-actions">

                <Link
                  to={`/orders/${order._id}`}
                  className="view-btn"
                >
                  <FaEye />
                  <span>View Details</span>
                </Link>

                {["Pending", "Processing"].includes(
                  order.orderStatus
                ) && (

                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() =>
                      toast(
                        "Cancel order feature coming soon."
                      )
                    }
                  >
                    Cancel Order
                  </button>

                )}

              </div>

            </div>

        ))

      )}

    </div>
  );
}