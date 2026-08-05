import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import "../styles/categories.css";

const categoryIcons = {
  Laptop: "💻",
  Laptops: "💻",
  Mobile: "📱",
  Mobiles: "📱",
  Audio: "🎧",
  Accessories: "🎒",
  "Smart Home": "🏠",
  Gaming: "🎮",
  Wearables: "⌚",
  Monitors: "🖥️",
};

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");

      setCategories((res.data.data || []).slice(0, 4));
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="categories-section">
        <div className="section-title">
          <h2>Shop by Category</h2>
        </div>

        <div className="categories-grid">
          <p>Loading categories...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="categories-section">

      <div className="section-title">
        <h2>Shop by Category</h2>

        <Link
          to="/products"
          className="view-all-btn"
        >
          View All
        </Link>
      </div>

      <div className="categories-grid">

        {categories.map((category) => (

          <Link
            key={category._id}
            to={`/products?category=${category._id}`}
            className="category-card"
          >

            <div className="category-icon">

              {categoryIcons[category.name] || "📦"}

            </div>

            <h3>{category.name}</h3>

            <p>
              Explore products in this category
            </p>

          </Link>

        ))}

      </div>

    </section>
  );
}