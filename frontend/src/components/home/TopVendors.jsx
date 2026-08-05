import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/home/topVendors.css";

const TopVendors = () => {
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    fetch("/api/vendors/top")
      .then((res) => res.json())
      .then((data) => setVendors(data.vendors || data))
      .catch(() => {});
  }, []);

  return (
    <section className="top-vendors">

      <div className="vendors-header">

        <div>
          <span>TRUSTED SELLERS</span>

          <h2>Top Rated Vendors</h2>

          <p>
            Buy confidently from our verified marketplace partners.
          </p>
        </div>

        <Link
          to="/vendors"
          className="vendors-btn"
        >
          View All
        </Link>

      </div>

      <div className="vendors-grid">

        {vendors.map((vendor) => (

          <div
            className="vendor-card"
            key={vendor._id}
          >

            <div className="vendor-avatar">

              <img
                src={vendor.logo}
                alt={vendor.shopName}
              />

            </div>

            <h3>{vendor.shopName}</h3>

            <p>{vendor.productsCount || 0} Products</p>

            <Link
              to={`/vendor/${vendor._id}`}
              className="visit-store"
            >
              Visit Store
            </Link>

          </div>

        ))}

      </div>

    </section>
  );
};

export default TopVendors;