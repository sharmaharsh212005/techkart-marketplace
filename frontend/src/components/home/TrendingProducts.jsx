import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import ProductCard from "../ProductCard";
import "../../styles/home/trendingProducts.css";

export default function TrendingProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrendingProducts();
  }, []);

  const fetchTrendingProducts = async () => {
    try {
      const res = await api.get("/products?sort=rating&limit=8");
      setProducts(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <section className="trending-products">
        <div className="loading-box">Loading trending products...</div>
      </section>
    );

  return (
    <section className="trending-products">

      <div className="trending-header">
        <div>
          <h2>Trending Products</h2>
          <p>Highest rated products from our marketplace.</p>
        </div>

        <Link to="/products" className="view-all-btn">
          View All
        </Link>
      </div>

      <div className="trending-grid">
        {products.map(product => (
          <ProductCard
            key={product._id}
            product={product}
          />
        ))}
      </div>

    </section>
  );
}