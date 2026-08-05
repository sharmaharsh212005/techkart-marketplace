import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import "../styles/hero.css";

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

export default function Hero() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");

      setCategories((res.data.data || []).slice(0, 4));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <section className="hero">
      <div className="hero-left">
        <span className="badge">
          🚀 Premium Electronics Marketplace
        </span>

        <h1>
          Experience
          <br />
          The Future
          <br />
          <span>Of Shopping</span>
        </h1>

        <p>
          Discover premium laptops, smartphones,
          accessories and gadgets from trusted brands
          with secure payments and lightning-fast delivery.
        </p>

        <div className="hero-buttons">
          <Link
            to="/products"
            className="primary-btn"
          >
            Shop Now
          </Link>

          <Link
            to="/register"
            className="secondary-btn"
          >
            Join TechKart
          </Link>
        </div>
      </div>

      <div className="hero-right">

        <div className="circle one"></div>

        <div className="circle two"></div>

        {categories.map((category, index) => (

          <Link
            key={category._id}
            to={`/products?category=${category._id}`}
            className={`floating-card card-${index + 1}`}
          >

            <div className="card-icon">

              {categoryIcons[category.name] || "📦"}

            </div>

            <h3>{category.name}</h3>

            <p>Explore Products</p>

          </Link>

        ))}

        <div className="center-glow"></div>

      </div>
    </section>
  );
}