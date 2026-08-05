import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import ProductCard from "../ProductCard";
import "../../styles/home/featuredProducts.css";

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);

      const res = await api.get("/products?featured=true&limit=8");

      setProducts(res.data.data || []);
    } catch (err) {
      console.error(err);
      setError("Unable to load featured products.");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <section className="featured-products">
        <div className="loading-box">
          Loading featured products...
        </div>
      </section>
    );

  if (error)
    return (
      <section className="featured-products">
        <div className="error-box">{error}</div>
      </section>
    );

  if (!products.length)
    return (
      <section className="featured-products">
        <div className="empty-box">
          No Featured Products Available
        </div>
      </section>
    );

  return (
    <section className="featured-products">

      <div className="featured-header">

        <div>
          <h2>Featured Products</h2>

          <p>
            Handpicked products specially selected for you.
          </p>
        </div>

        <Link
          to="/products"
          className="view-all-btn"
        >
          View All
        </Link>

      </div>

      <div className="featured-grid">

        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
          />
        ))}

      </div>

    </section>
  );
}