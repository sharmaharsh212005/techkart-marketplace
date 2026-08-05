import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";

import AdminSidebar from "../components/AdminSidebar";
import AdminTopbar from "../components/AdminTopbar";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import "../styles/admin.css";

const initialForm = {
  code: "",
  description: "",
  discountType: "percentage",
  discountValue: "",
  minimumAmount: "",
  maximumDiscount: "",
  usageLimit: "",
  expiryDate: "",
};

export default function Coupons() {
  const [coupons, setCoupons] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [form, setForm] =
    useState(initialForm);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const { data } =
        await api.get("/coupons");

      setCoupons(data.data || []);
    } catch {
      toast.error(
        "Failed to fetch coupons"
      );
    }
  };

  const filteredCoupons =
    useMemo(() => {
      return coupons.filter(
        (coupon) =>
          coupon.code
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            ) ||
          coupon.description
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            )
      );
    }, [coupons, search]);

  const changeHandler = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]:
        e.target.value,
    }));
  };

  const submitHandler =
    async (e) => {
      e.preventDefault();

      try {
        setLoading(true);

        await api.post(
          "/coupons",
          form
        );

        toast.success(
          "Coupon Created"
        );

        setForm(initialForm);

        fetchCoupons();
      } catch (err) {
        toast.error(
          err.response?.data
            ?.message ||
            "Unable to create coupon"
        );
      } finally {
        setLoading(false);
      }
    };

  const deleteCoupon =
    async (id) => {
      if (
        !window.confirm(
          "Delete this coupon?"
        )
      )
        return;

      try {
        await api.delete(
          `/coupons/${id}`
        );

        toast.success(
          "Coupon Deleted"
        );

        fetchCoupons();
      } catch {
        toast.error(
          "Unable to delete coupon"
        );
      }
    };

  const activeCoupons =
    coupons.filter(
      (c) => c.isActive
    ).length;

  const expiredCoupons =
    coupons.filter(
      (c) =>
        new Date(c.expiryDate) <
        new Date()
    ).length;
  return (
    <div className="admin-layout">
      <AdminSidebar />

      <div className="admin-content">
        <AdminTopbar />

        <div className="dashboard-header">
          <div>
            <h1>Coupons & Offers 🎟️</h1>

            <p>
              Create and manage discount coupons for your marketplace.
            </p>
          </div>

          <div className="dashboard-date">
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-stat-card">
            <div className="dashboard-stat-icon">🎟️</div>

            <div className="dashboard-stat-content">
              <span>Total Coupons</span>
              <h2>{coupons.length}</h2>
              <small>Available Coupons</small>
            </div>
          </div>

          <div className="dashboard-stat-card">
            <div className="dashboard-stat-icon">✅</div>

            <div className="dashboard-stat-content">
              <span>Active</span>
              <h2>{activeCoupons}</h2>
              <small>Currently Running</small>
            </div>
          </div>

          <div className="dashboard-stat-card">
            <div className="dashboard-stat-icon">⌛</div>

            <div className="dashboard-stat-content">
              <span>Expired</span>
              <h2>{expiredCoupons}</h2>
              <small>Expired Offers</small>
            </div>
          </div>

          <div className="dashboard-stat-card">
            <div className="dashboard-stat-icon">💰</div>

            <div className="dashboard-stat-content">
              <span>Discount Type</span>
              <h2>{form.discountType}</h2>
              <small>Current Selection</small>
            </div>
          </div>
        </div>

        <div className="admin-card">
          <h3 style={{ marginBottom: 20 }}>
            Create Coupon
          </h3>

          <form
            className="admin-form"
            onSubmit={submitHandler}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2,1fr)",
                gap: 20,
              }}
            >
              <div className="admin-group">
                <label>Coupon Code</label>

                <input
                  className="admin-input"
                  name="code"
                  value={form.code}
                  onChange={changeHandler}
                  required
                />
              </div>

              <div className="admin-group">
                <label>Description</label>

                <input
                  className="admin-input"
                  name="description"
                  value={form.description}
                  onChange={changeHandler}
                />
              </div>

              <div className="admin-group">
                <label>Discount Type</label>

                <select
                  className="admin-input"
                  name="discountType"
                  value={form.discountType}
                  onChange={changeHandler}
                >
                  <option value="percentage">
                    Percentage
                  </option>

                  <option value="fixed">
                    Fixed Amount
                  </option>
                </select>
              </div>

              <div className="admin-group">
                <label>Discount Value</label>

                <input
                  className="admin-input"
                  type="number"
                  name="discountValue"
                  value={form.discountValue}
                  onChange={changeHandler}
                />
              </div>

              <div className="admin-group">
                <label>Minimum Order</label>

                <input
                  className="admin-input"
                  type="number"
                  name="minimumAmount"
                  value={form.minimumAmount}
                  onChange={changeHandler}
                />
              </div>

              <div className="admin-group">
                <label>Maximum Discount</label>

                <input
                  className="admin-input"
                  type="number"
                  name="maximumDiscount"
                  value={form.maximumDiscount}
                  onChange={changeHandler}
                />
              </div>

              <div className="admin-group">
                <label>Usage Limit</label>

                <input
                  className="admin-input"
                  type="number"
                  name="usageLimit"
                  value={form.usageLimit}
                  onChange={changeHandler}
                />
              </div>

              <div className="admin-group">

                  <label>Expiry Date</label>

                  <DatePicker
                      selected={
                          form.expiryDate
                              ? new Date(form.expiryDate)
                              : null
                      }
                      onChange={(date) =>
                          setForm((prev) => ({
                              ...prev,
                              expiryDate: date
                                  ? date.toISOString().split("T")[0]
                                  : ""
                          }))
                      }
                      dateFormat="dd/MM/yyyy"
                      placeholderText="Select expiry date"
                      className="admin-input coupon-date-picker"
                      minDate={new Date()}
                  />

              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: 25,
              }}
            >
              <button
                className="primary-btn"
                disabled={loading}
              >
                {loading
                  ? "Creating..."
                  : "Create Coupon"}
              </button>
            </div>
          </form>
        </div>

        <div className="admin-card">
          <div className="table-toolbar">
            <input
              className="table-search"
              placeholder="Search Coupon..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />
          </div>

          <table className="orders-table">
            <thead>
              <tr>
                <th>Coupon</th>
                <th>Discount</th>
                <th>Expiry</th>
                <th>Status</th>
                <th width="120">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredCoupons.length ===
              0 ? (
                <tr>
                  <td
                    colSpan="5"
                    style={{
                      textAlign: "center",
                    }}
                  >
                    No Coupons Found
                  </td>
                </tr>
              ) : (
                filteredCoupons.map(
                  (coupon) => (
                    <tr key={coupon._id}>
                      <td>
                        <strong>
                          {coupon.code}
                        </strong>

                        <br />

                        <small>
                          {
                            coupon.description
                          }
                        </small>
                      </td>

                      <td>
                        {coupon.discountType ===
                        "percentage"
                          ? `${coupon.discountValue}%`
                          : `₹${coupon.discountValue}`}
                      </td>

                      <td>
                        {new Date(
                          coupon.expiryDate
                        ).toLocaleDateString()}
                      </td>

                      <td>
                        <span
                          className={`status-badge ${
                            coupon.isActive
                              ? "status-approved"
                              : "status-pending"
                          }`}
                        >
                          {coupon.isActive
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </td>

                      <td className="action-buttons">
                        <button
                          className="delete-btn"
                          onClick={() =>
                            deleteCoupon(
                              coupon._id
                            )
                          }
                          type="button"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  )
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}