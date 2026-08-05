import { Link } from "react-router-dom";
import "../../styles/home/offerBanner.css";

const OfferBanner = () => {
  return (
    <section className="offer-banner">

      <div className="offer-card">

        <div className="offer-content">

          <span className="offer-tag">
            LIMITED TIME OFFER
          </span>

          <h2>
            Save up to 50% on Premium Electronics
          </h2>

          <p>
            Upgrade your setup with exclusive discounts on laptops,
            smartphones, gaming accessories, and more.
          </p>

          <Link
            to="/products"
            className="offer-btn"
          >
            Shop Now →
          </Link>

        </div>

        <div className="offer-image">

          <img
            src="/images/banner-electronics.png"
            alt="Offer Banner"
          />

        </div>

      </div>
    </section>
  );
};

export default OfferBanner;