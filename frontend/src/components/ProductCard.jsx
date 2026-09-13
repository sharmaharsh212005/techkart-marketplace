import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/productcard.css";
import api from "../api/axios";

export default function ProductCard({ product }) {
  const [wishlisted, setWishlisted] = useState(false);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    if (!token || user?.role !== "customer") return;

    fetchWishlist();
  }, []);

  const getImageUrl = (image) => {
    if (!image) {
      return "https://placehold.co/500x500/111827/ffffff?text=TechKart";
    }

    if (image.startsWith("http")) {
      return image;
    }

    const baseURL =
      import.meta.env.VITE_API_URL ||
      "http://localhost:5000/api";

    return `${baseURL.replace(/\/api\/?$/, "")}${image}`;
  };

  const fetchWishlist = async () => {
    try {
      const res = await api.get("/users/wishlist");

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
        await api.delete(`/users/wishlist/${product._id}`);

        setWishlisted(false);
      } else {
        await api.post(`/users/wishlist/${product._id}`);

        setWishlisted(true);
      }
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Something went wrong"
      );
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
          aria-label="Add to wishlist"
        >
          {wishlisted ? "❤️" : "🤍"}
        </button>

        <img
          src={getImageUrl(product.images?.[0])}
          alt={product.name}
        />

        <span className="brand-badge">
          {product.brand || "TechKart"}
        </span>

      </div>

      <div className="product-info">

        <span className="product-brand">
          {product.brand || "TechKart"}
        </span>

        <h3 className="product-title">
          {product.name}
        </h3>

        <p className="product-description">
          {product.description
            ? product.description.slice(0, 70) +
              (product.description.length > 70 ? "..." : "")
            : "Premium technology product from TechKart."}
        </p>

        <div className="product-meta">

          <div className="price-row">
            <span className="price">
              ₹
              {Number(
                product.discountPrice || product.price || 0
              ).toLocaleString("en-IN")}
            </span>

            {product.discountPrice && (
              <span className="old-price">
                ₹
                {Number(product.price || 0).toLocaleString(
                  "en-IN"
                )}
              </span>
            )}
          </div>

          <span
            className={`stock ${
              product.stock > 0
                ? "in-stock"
                : "out-of-stock"
            }`}
          >
            {product.stock > 0
              ? `In Stock (${product.stock})`
              : "Out of Stock"}
          </span>

          <Link
            className="view-btn"
            to={`/products/${product._id}`}
          >
            View Details
          </Link>

        </div>

      </div>
    </div>
  );
}