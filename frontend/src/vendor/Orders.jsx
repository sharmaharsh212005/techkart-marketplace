import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";
import VendorSidebar from "./VendorSidebar";
import VendorTopbar from "./VendorTopbar";
import "../styles/admin.css";

export default function VendorOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get("/orders/vendor");
      setOrders(data.data || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to fetch orders"
      );
    }
  };

  return (
    <div className="admin-layout">
      <VendorSidebar />

      <div className="admin-content">
        <VendorTopbar />

        <div className="admin-header">
          <h2>Vendor Orders</h2>
        </div>

        <table className="orders-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Products</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order.user?.name}</td>

                <td>
                  {order.items
                    .filter(
                      (item) =>
                        item.vendor?._id ===
                        localStorage.getItem("userId")
                    )
                    .map((item) => (
                      <div key={item._id}>
                        {item.product?.name} × {item.quantity}
                      </div>
                    ))}
                </td>

                <td>₹{order.totalAmount}</td>

                <td>{order.paymentStatus}</td>

                <td>{order.orderStatus}</td>

                <td>
                  {new Date(
                    order.createdAt
                  ).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}