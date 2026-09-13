import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import {
  FaShoppingBag,
  FaBoxOpen,
  FaCreditCard,
  FaEye,
  FaTruck,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaArrowRight,
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
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Unable to load your orders"
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================
     HELPERS
  ========================================= */

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatPrice = (value) => {
    return `₹${Number(value || 0).toLocaleString("en-IN")}`;
  };

  const getImageUrl = (image) => {
    if (!image) {
      return "https://placehold.co/120x120/111827/ffffff?text=TK";
    }

    if (image.startsWith("http")) {
      return image;
    }

    const baseURL =
      import.meta.env.VITE_API_URL ||
      "http://localhost:5000/api";

    return `${baseURL.replace(/\/api\/?$/, "")}${image}`;
  };

  const getStatusClass = (status = "") => {
    return status.toLowerCase().replace(/\s/g, "-");
  };

  const getStatusIcon = (status = "") => {
    switch (status.toLowerCase()) {
      case "delivered":
        return <FaCheckCircle />;

      case "shipped":
        return <FaTruck />;

      case "processing":
        return <FaClock />;

      case "cancelled":
        return <FaTimesCircle />;

      default:
        return <FaBoxOpen />;
    }
  };

  const getStatusStep = (status = "") => {
    switch (status.toLowerCase()) {
      case "pending":
        return 0;

      case "processing":
        return 1;

      case "shipped":
        return 2;

      case "delivered":
        return 3;

      default:
        return -1;
    }
  };

  /* =========================================
     CANCEL ORDER
  ========================================= */

  const cancelOrder = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmed) return;

    try {
      await api.put(`/orders/${id}/cancel`);

      toast.success("Order cancelled successfully");

      fetchOrders();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to cancel order"
      );
    }
  };

  /* =========================================
     LOADING
  ========================================= */

  if (loading) {
    return (
      <div className="orders-page">
        <div className="orders-container">
          <div className="orders-header">
            <div className="orders-title-wrap">
              <div className="orders-title-icon">
                <FaShoppingBag />
              </div>

              <div>
                <h1>My Orders</h1>
                <p>
                  Track your purchases and delivery status.
                </p>
              </div>
            </div>
          </div>

          <div className="orders-loading-grid">
            {[1, 2].map((item) => (
              <div
                className="order-skeleton"
                key={item}
              >
                <div className="skeleton skeleton-title"></div>
                <div className="skeleton skeleton-line"></div>
                <div className="skeleton skeleton-line"></div>
                <div className="skeleton skeleton-product"></div>
                <div className="skeleton skeleton-product"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* =========================================
     EMPTY ORDERS
  ========================================= */

  if (!orders.length) {
    return (
      <div className="orders-page">
        <div className="orders-container">
          <div className="orders-empty">
            <div className="empty-icon">
              <FaShoppingBag />
            </div>

            <h1>No Orders Yet</h1>

            <p>
              Looks like you haven't placed your first
              order yet.
            </p>

            <Link
              to="/products"
              className="shop-btn"
            >
              Start Shopping
              <FaArrowRight />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="orders-container">

        {/* =====================================
            PAGE HEADER
        ====================================== */}

        <div className="orders-header">

          <div className="orders-title-wrap">

            <div className="orders-title-icon">
              <FaShoppingBag />
            </div>

            <div>
              <h1>My Orders</h1>

              <p>
                Track your purchases and delivery status.
              </p>
            </div>

          </div>

          <div className="orders-counter">

            <FaBoxOpen />

            <div>
              <strong>{orders.length}</strong>

              <span>
                {orders.length === 1
                  ? "Total Order"
                  : "Total Orders"}
              </span>
            </div>

          </div>

        </div>

        {/* =====================================
            ORDERS
        ====================================== */}

        <div className="orders-list">

          {orders.map((order) => {

            const currentStep = getStatusStep(
              order.orderStatus
            );

            const totalItems =
              order.items?.reduce(
                (sum, item) =>
                  sum + Number(item.quantity || 0),
                0
              ) || 0;

            const status =
              order.orderStatus || "Pending";

            const paymentStatus =
              order.paymentStatus || "Pending";

            return (
              <article
                className="order-card"
                key={order._id}
              >

                {/* =================================
                    ORDER HEADER
                ================================== */}

                <div className="order-card-header">

                  <div className="order-main-info">

                    <h2>
                      Order #
                      {order._id
                        ?.slice(-8)
                        .toUpperCase()}
                    </h2>

                    <p>
                      Placed on{" "}
                      <strong>
                        {formatDate(
                          order.createdAt
                        )}
                      </strong>

                      {order.createdAt && (
                        <>
                          {", "}
                          {new Date(
                            order.createdAt
                          ).toLocaleTimeString(
                            "en-IN",
                            {
                              hour: "numeric",
                              minute: "2-digit",
                            }
                          )}
                        </>
                      )}
                    </p>

                  </div>

                  <div className="order-header-right">

                    <div className="order-badges">

                      <span
                        className={`status-pill ${getStatusClass(
                          status
                        )}`}
                      >
                        {getStatusIcon(status)}
                        {status}
                      </span>

                      <span
                        className={`payment-pill ${getStatusClass(
                          paymentStatus
                        )}`}
                      >
                        <FaCreditCard />
                        {paymentStatus}
                      </span>

                    </div>

                    <Link
                      to={`/orders/${order._id}`}
                      className="view-details-btn"
                    >
                      <FaEye />
                      <span>View Details</span>
                      <FaArrowRight />
                    </Link>

                  </div>

                </div>

                {/* =================================
                    PROGRESS TRACKER
                ================================== */}

                {status.toLowerCase() !==
                  "cancelled" && (
                  <div className="order-timeline">

                    <div className="timeline-line">

                      <div
                        className="timeline-line-active"
                        style={{
                          width:
                            currentStep <= 0
                              ? "0%"
                              : `${
                                  (currentStep / 3) *
                                  100
                                }%`,
                        }}
                      />

                    </div>

                    {[
                      {
                        label: "Pending",
                        icon: <FaBoxOpen />,
                      },
                      {
                        label: "Processing",
                        icon: <FaClock />,
                      },
                      {
                        label: "Shipped",
                        icon: <FaTruck />,
                      },
                      {
                        label: "Delivered",
                        icon: <FaCheckCircle />,
                      },
                    ].map((step, index) => {

                      const completed =
                        index <= currentStep;

                      const current =
                        index === currentStep;

                      return (
                        <div
                          className={`timeline-step ${
                            completed
                              ? "completed"
                              : ""
                          } ${
                            current
                              ? "current"
                              : ""
                          }`}
                          key={step.label}
                        >

                          <div className="timeline-circle">

                            {completed ? (
                              index <
                                currentStep ? (
                                <FaCheckCircle />
                              ) : (
                                step.icon
                              )
                            ) : (
                              <span>
                                {index + 1}
                              </span>
                            )}

                          </div>

                          <span>
                            {step.label}
                          </span>

                        </div>
                      );
                    })}

                  </div>
                )}

                {/* =================================
                    CANCELLED
                ================================== */}

                {status.toLowerCase() ===
                  "cancelled" && (
                  <div className="cancelled-banner">

                    <FaTimesCircle />

                    <div>
                      <strong>
                        Order Cancelled
                      </strong>

                      <span>
                        This order has been cancelled.
                      </span>
                    </div>

                  </div>
                )}

                {/* =================================
                    PRODUCTS
                ================================== */}

                <div className="order-products">

                  {order.items?.map((item) => {

                    const product = item.product;

                    const itemTotal =
                      Number(item.price || 0) *
                      Number(item.quantity || 0);

                    return (
                      <div
                        className="order-product"
                        key={item._id}
                      >

                        {/* IMAGE */}

                        <div className="product-thumbnail">

                          <img
                            src={getImageUrl(
                              product?.images?.[0]
                            )}
                            alt={
                              product?.name ||
                              "Product"
                            }
                            onError={(e) => {
                              e.currentTarget.src =
                                "https://placehold.co/120x120/111827/ffffff?text=TK";
                            }}
                          />

                        </div>

                        {/* NAME + QUANTITY */}

                        <div className="product-details">

                          <h3>
                            {product?.name ||
                              "Product"}
                          </h3>

                          <div className="product-quantity">
                            Qty:{" "}
                            <strong>
                              {item.quantity}
                            </strong>
                          </div>

                        </div>

                        {/* PRICE */}

                        <div className="product-price">

                          <span>
                            {formatPrice(
                              itemTotal
                            )}
                          </span>

                          {Number(
                            item.quantity || 0
                          ) > 1 && (
                            <small>
                              {formatPrice(
                                item.price
                              )} each
                            </small>
                          )}

                        </div>

                      </div>
                    );
                  })}

                </div>

                {/* =================================
                    FOOTER
                ================================== */}

                <div className="order-card-footer">

                  <div className="footer-summary">

                    <div>
                      <span>
                        Total Items
                      </span>

                      <strong>
                        {totalItems}
                      </strong>
                    </div>

                    <div className="total-amount">

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

                  <div className="footer-actions">

                    {status.toLowerCase() ===
                      "pending" && (
                      <button
                        type="button"
                        className="cancel-order-btn"
                        onClick={() =>
                          cancelOrder(
                            order._id
                          )
                        }
                      >
                        <FaTimesCircle />
                        Cancel Order
                      </button>
                    )}

                    <Link
                      to={`/orders/${order._id}`}
                      className="mobile-details-btn"
                    >
                      View Details
                      <FaArrowRight />
                    </Link>

                  </div>

                </div>

              </article>
            );
          })}

        </div>
      </div>
    </div>
  );
}