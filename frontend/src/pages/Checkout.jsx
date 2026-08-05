import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";
import "../styles/checkout.css";

const IMAGE_BASE_URL = "http://localhost:5000";

export default function Checkout() {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  const [shipping, setShipping] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [paymentMethod, setPaymentMethod] = useState(
    "Cash on Delivery"
  );

  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [coupon, setCoupon] = useState(null);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const { data } = await api.get("/cart");
      setCart(data.data?.items || []);
    } catch (error) {
      toast.error("Unable to load cart");
    }
  };

  const handleChange = (e) => {
    setShipping((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const subtotal = useMemo(() => {
    return cart.reduce(
      (sum, item) =>
        sum + item.product.price * item.quantity,
      0
    );
  }, [cart]);

  const finalTotal = subtotal - discount;

  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      return toast.error("Enter coupon code");
    }

    try {
      const { data } = await api.post(
        "/coupons/validate",
        {
          code: couponCode,
          total: subtotal,
        }
      );

      setCoupon(data.coupon);
      setDiscount(data.discount);

      toast.success("Coupon Applied Successfully");
    } catch (error) {
      setCoupon(null);
      setDiscount(0);

      toast.error(
        error.response?.data?.message ||
          "Invalid Coupon"
      );
    }
  };

  const placeOrder = async () => {
    if (
      !shipping.fullName ||
      !shipping.phone ||
      !shipping.address ||
      !shipping.city ||
      !shipping.state ||
      !shipping.pincode
    ) {
      return toast.error(
        "Please fill all shipping details."
      );
    }

    try {
      setLoading(true);

      await api.post("/orders", {
        items: cart.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
        })),
        shippingAddress: shipping,
        paymentMethod,
        coupon: coupon?._id || null,
        discount,
        totalAmount: finalTotal,
      });

      toast.success("Order placed successfully");
      navigate("/orders");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to place order"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <div className="checkout-container">
      {/* ================= LEFT ================= */}

      <div className="checkout-left">

        <div className="checkout-card">

          <div className="checkout-section-header">
            <h2>🚚 Shipping Information</h2>
            <p>Enter your delivery details</p>
          </div>

          <div className="checkout-form">

            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="fullName"
                placeholder="John Doe"
                value={shipping.fullName}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phone"
                placeholder="+91 9876543210"
                value={shipping.phone}
                onChange={handleChange}
              />
            </div>

            <div className="form-group full-width">
              <label>Address</label>
              <textarea
                rows={4}
                name="address"
                placeholder="House No, Street, Landmark"
                value={shipping.address}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                name="city"
                placeholder="Jaipur"
                value={shipping.city}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>State</label>
              <input
                type="text"
                name="state"
                placeholder="Rajasthan"
                value={shipping.state}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Pincode</label>
              <input
                type="text"
                name="pincode"
                placeholder="302001"
                value={shipping.pincode}
                onChange={handleChange}
              />
            </div>

          </div>

        </div>

        <div className="checkout-card secure-card">

          <h3>🔒 Secure Checkout</h3>

          <ul>
            <li>100% Secure Payments</li>
            <li>Easy Returns Available</li>
            <li>Genuine Marketplace Products</li>
            <li>Fast Delivery Across India</li>
          </ul>

        </div>

      </div>

      {/* ================= RIGHT ================= */}

      <div className="checkout-right">

        <div className="checkout-card">

          <div className="checkout-section-header">
            <h2>🛒 Order Summary</h2>
          </div>

          {cart.map((item) => (

            <div
              key={item.product._id}
              className="checkout-product"
            >

              <img
                src={
                  item.product.images?.length
                    ? `${IMAGE_BASE_URL}${item.product.images[0]}`
                    : "https://placehold.co/120x120?text=TechKart"
                }
                alt={item.product.name}
              />

              <div className="checkout-product-info">

                <h4>{item.product.name}</h4>

                <p>
                  Qty: <strong>{item.quantity}</strong>
                </p>

                <strong>
                  ₹
                  {(
                    item.product.price *
                    item.quantity
                  ).toLocaleString("en-IN")}
                </strong>

              </div>

            </div>

          ))}

          <hr className="checkout-divider" />
          {/* ================= Coupon ================= */}

          <div className="coupon-section">

            <label>Coupon Code</label>

            <div className="coupon-row">

              <input
                type="text"
                placeholder="Enter Coupon Code"
                value={couponCode}
                onChange={(e) =>
                  setCouponCode(
                    e.target.value.toUpperCase()
                  )
                }
              />

              <button
                type="button"
                className="coupon-btn"
                onClick={applyCoupon}
              >
                Apply
              </button>

            </div>

            {coupon && (
              <div className="coupon-success">
                ✅ {coupon.code} applied successfully
              </div>
            )}

          </div>

          {/* ================= Price Summary ================= */}

          <div className="summary-box">

            <div className="summary-row">
              <span>Subtotal</span>
              <strong>
                ₹{subtotal.toLocaleString("en-IN")}
              </strong>
            </div>

            <div className="summary-row">
              <span>Discount</span>
              <strong className="discount-text">
                -₹{discount.toLocaleString("en-IN")}
              </strong>
            </div>

            <div className="summary-row">
              <span>Shipping</span>
              <strong className="free-text">
                FREE
              </strong>
            </div>

            <div className="summary-row total-row">
              <span>Grand Total</span>
              <strong>
                ₹{finalTotal.toLocaleString("en-IN")}
              </strong>
            </div>

          </div>

        </div>

        {/* ================= Payment ================= */}

        <div className="checkout-card">

          <div className="checkout-section-header">
            <h2>💳 Payment Method</h2>
          </div>

          {[
            "Cash on Delivery",
            "UPI",
            "Credit Card",
            "Debit Card",
          ].map((method) => (

            <label
              key={method}
              className={`payment-card ${
                paymentMethod === method
                  ? "active-payment"
                  : ""
              }`}
            >

              <input
                type="radio"
                value={method}
                checked={paymentMethod === method}
                onChange={(e) =>
                  setPaymentMethod(
                    e.target.value
                  )
                }
              />

              <span>{method}</span>

            </label>

          ))}

        </div>
        {/* ================= Delivery ================= */}

        <div className="checkout-card delivery-card">

          <div className="checkout-section-header">
            <h2>🚚 Delivery Details</h2>
          </div>

          <div className="delivery-info">

            <div className="delivery-item">
              <span>Estimated Delivery</span>
              <strong>3 - 5 Business Days</strong>
            </div>

            <div className="delivery-item">
              <span>Shipping Charges</span>
              <strong className="free-text">
                FREE
              </strong>
            </div>

            <div className="delivery-item">
              <span>Payment Mode</span>
              <strong>{paymentMethod}</strong>
            </div>

          </div>

        </div>

        {/* ================= Place Order ================= */}

        <button
          className="place-order-btn"
          onClick={placeOrder}
          disabled={loading || cart.length === 0}
        >
          {loading
            ? "Placing Order..."
            : `Place Order • ₹${finalTotal.toLocaleString(
                "en-IN"
              )}`}
        </button>

        <p className="checkout-note">
          By placing this order you agree to our
          Terms & Conditions and Privacy Policy.
        </p>

      </div>

    </div>

  </div>
);
}