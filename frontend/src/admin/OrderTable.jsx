import React, { useMemo, useState } from "react";

export default function OrderTable({
  loading,
  orders,
  onView,
}) {
  const [currentPage, setCurrentPage] =
    useState(1);

  const rowsPerPage = 10;

  const totalPages = Math.ceil(
    orders.length / rowsPerPage
  );

  const paginatedOrders = useMemo(() => {
    const start =
      (currentPage - 1) * rowsPerPage;

    return orders.slice(
      start,
      start + rowsPerPage
    );
  }, [orders, currentPage]);

  if (loading) {
    return (
      <div className="table-container">
        <h3
          style={{
            textAlign: "center",
            padding: "40px",
          }}
        >
          Loading Orders...
        </h3>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="table-container">
        <h3
          style={{
            textAlign: "center",
            padding: "40px",
          }}
        >
          No Orders Found
        </h3>
      </div>
    );
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Delivered":
        return "status delivered";

      case "Processing":
        return "status processing";

      case "Shipped":
        return "status shipped";

      case "Cancelled":
        return "status cancelled";

      default:
        return "status pending";
    }
  };
  return (
    <div className="table-container">
      <table className="orders-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Total</th>
            <th>Items</th>
            <th>Payment</th>
            <th>Status</th>
            <th>Date</th>
            <th style={{ textAlign: "center" }}>
              Action
            </th>
          </tr>
        </thead>

        <tbody>
          {paginatedOrders.map((order) => (
            <tr key={order._id}>
              <td>
                <strong>
                  #{order._id.slice(-8)}
                </strong>
              </td>

              <td>
                <div className="customer-info">
                  <strong>
                    {order.user?.name ||
                      "Unknown User"}
                  </strong>

                  <br />

                  <small>
                    {order.user?.email}
                  </small>
                </div>
              </td>

              <td>
                <strong>
                  ₹
                  {Number(
                    order.totalAmount
                  ).toLocaleString()}
                </strong>
              </td>

              <td>
                {order.items?.length || 0}
              </td>

              <td>
                <span
                  className={
                    order.paymentStatus ===
                    "Paid"
                      ? "status delivered"
                      : "status pending"
                  }
                >
                  {order.paymentStatus}
                </span>
              </td>

              <td>
                <span
                  className={getStatusClass(
                    order.orderStatus
                  )}
                >
                  {order.orderStatus}
                </span>
              </td>

              <td>
                {new Date(
                  order.createdAt
                ).toLocaleDateString(
                  "en-IN"
                )}
              </td>

              <td
                style={{
                  textAlign: "center",
                }}
              >
                <button
                  className="edit-btn"
                  onClick={() =>
                    onView(order)
                  }
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button
          className="pagination-btn"
          disabled={currentPage === 1}
          onClick={() =>
            setCurrentPage(
              currentPage - 1
            )
          }
        >
          Previous
        </button>

        <span className="pagination-info">
          Page {currentPage} of{" "}
          {totalPages}
        </span>

        <button
          className="pagination-btn"
          disabled={
            currentPage === totalPages
          }
          onClick={() =>
            setCurrentPage(
              currentPage + 1
            )
          }
        >
          Next
        </button>
      </div>
    </div>
  );
}