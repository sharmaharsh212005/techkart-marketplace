import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";
import "../styles/cart.css";

export default function Cart() {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/cart");

      setCart(data.data?.items || []);
    } catch (error) {
      console.log(error);
      toast.error("Unable to load cart");
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;

    try {
      await api.put("/cart", {
        product: productId,
        quantity
      });

      fetchCart();
    } catch (error) {
      toast.error("Unable to update quantity");
    }
  };

  const removeItem = async (productId) => {
    try {
      await api.delete(`/cart/${productId}`);

      toast.success("Item removed");

      fetchCart();
    } catch (error) {
      toast.error("Unable to remove item");
    }
  };

  const subtotal = cart.reduce(
    (total, item) =>
      total + item.product.price * item.quantity,
    0
  );

  if (loading) {
    return (
      <div className="container">
        <h2 style={{ color: "#fff", textAlign: "center" }}>
          Loading Cart...
        </h2>
      </div>
    );
  }

  return (
    <div className="container cart-page">

      <h1>Your Cart</h1>

      {cart.length === 0 ? (
        <div className="empty-cart">

          <h2>Your cart is empty</h2>

          <Link
            to="/products"
            className="shop-btn"
          >
            Continue Shopping
          </Link>

        </div>
      ) : (
        <>

          <div className="cart-items">

            {cart.map((item) => (

              <div
                className="cart-item"
                key={item.product._id}
              >

                <img
                  src={
                    item.product.images?.length
                      ? `http://localhost:5000${item.product.images[0]}`
                      : "https://placehold.co/200x200?text=TechKart"
                  }
                  alt={item.product.name}
                />

                <div className="cart-info">

                  <h3>{item.product.name}</h3>

                  <p>₹{item.product.price}</p>

                  <div className="qty">

                    <button
                      onClick={() =>
                        updateQuantity(
                          item.product._id,
                          item.quantity - 1
                        )
                      }
                    >
                      -
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() =>
                        updateQuantity(
                          item.product._id,
                          item.quantity + 1
                        )
                      }
                    >
                      +
                    </button>

                  </div>

                </div>

                <button
                  className="remove-btn"
                  onClick={() =>
                    removeItem(item.product._id)
                  }
                >
                  Remove
                </button>

              </div>

            ))}

          </div>

          <div className="cart-summary">

            <h2>
              Total : ₹{subtotal.toLocaleString("en-IN")}
            </h2>

            <button
              className="checkout-btn"
              onClick={() => navigate("/checkout")}
            >
              Proceed To Checkout
            </button>

          </div>

        </>
      )}

    </div>
  );
}