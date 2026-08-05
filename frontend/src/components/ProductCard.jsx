import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/productcard.css";

const API = "http://localhost:5000/api";

export default function ProductCard({ product }) {
  const [wishlisted, setWishlisted] = useState(false);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!token || user?.role !== "customer") return;

    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const res = await axios.get(`${API}/users/wishlist`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const ids = res.data.data.map((p) => p._id);
      setWishlisted(ids.includes(product._id));
    } catch (err) {
      console.error(err);
    }
  };

  const toggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!token) {
      alert("Please login first.");
      return;
    }

    if (user?.role !== "customer") {
      alert("Only customers can use wishlist.");
      return;
    }

    try {
      setLoading(true);

      if (wishlisted) {
        await axios.delete(`${API}/users/wishlist/${product._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setWishlisted(false);
      } else {
        await axios.post(
          `${API}/users/wishlist/${product._id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setWishlisted(true);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-card">
      <div className="product-image">
        <button
          className="wishlist-btn"
          onClick={toggleWishlist}
          disabled={loading}
        >
          {wishlisted ? "❤️" : "🤍"}
        </button>

        <img
          src={
            product.images?.length
              ? `http://localhost:5000${product.images[0]}`
              : "https://placehold.co/500x500/111827/ffffff?text=TechKart"
          }
          alt={product.name}
        />

        <span className="brand-badge">
          {product.brand || "TechKart"}
        </span>
      </div>

      <div className="product-info">
        <h3>{product.name}</h3>

        <p className="product-description">
          {product.description?.slice(0, 70)}...
        </p>

        <div className="price-row">
          <span className="price">
            ₹{product.discountPrice || product.price}
          </span>

          {product.discountPrice && (
            <span className="old-price">
              ₹{product.price}
            </span>
          )}
        </div>

        <Link
          className="view-btn"
          to={`/products/${product._id}`}
        >
          View Details
        </Link>
      </div>
    </div>
  );
}