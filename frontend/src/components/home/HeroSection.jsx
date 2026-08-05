import { Link } from "react-router-dom";
import { FaArrowRight, FaShieldAlt, FaShippingFast, FaHeadset } from "react-icons/fa";
import "../../styles/home/heroSection.css";

const HeroSection = () => {
  return (
    <section className="hero">

      <div className="hero-container">

        <div className="hero-content">

          <span className="hero-tag">
            ⚡ India's Trusted Tech Marketplace
          </span>

          <h1>
            Discover the Future of
            <span> Technology</span>
          </h1>

          <p>
            Shop premium laptops, smartphones, gaming accessories,
            smart devices, and electronics from trusted vendors across
            India with secure payments and fast delivery.
          </p>

          <div className="hero-buttons">

            <Link
              to="/products"
              className="hero-btn-primary"
            >
              Shop Now
              <FaArrowRight />
            </Link>

            <Link
              to="/categories"
              className="hero-btn-secondary"
            >
              Explore Categories
            </Link>

          </div>

          <div className="hero-features">

            <div className="feature-item">
              <FaShippingFast />
              <span>Fast Delivery</span>
            </div>

            <div className="feature-item">
              <FaShieldAlt />
              <span>Secure Payments</span>
            </div>

            <div className="feature-item">
              <FaHeadset />
              <span>24/7 Support</span>
            </div>

          </div>

        </div>

        <div className="hero-image">

          <img
            src="/images/hero-electronics.png"
            alt="TechKart Hero"
          />

        </div>

      </div>

    </section>
  );
};

export default HeroSection;