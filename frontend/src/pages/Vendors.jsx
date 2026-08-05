import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Vendors = () => {
  const [vendors, setVendors] = useState([]);
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchVendors = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:5000/api/vendors"
      );

      setVendors(data.data || []);
      setFilteredVendors(data.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setFilteredVendors(vendors);
      return;
    }

    const filtered = vendors.filter((vendor) =>
      (
        vendor.shopName ||
        vendor.name ||
        ""
      )
        .toLowerCase()
        .includes(search.toLowerCase())
    );

    setFilteredVendors(filtered);
  }, [search, vendors]);

  if (loading) {
    return (
      <div className="container py-5">
        <h2>Loading Vendors...</h2>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h2 className="mb-4">Explore Stores</h2>

      <input
        className="form-control mb-4"
        placeholder="Search Store..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filteredVendors.length === 0 ? (
        <div className="alert alert-info">
          No Vendors Found
        </div>
      ) : (
        <div className="row">
          {filteredVendors.map((vendor) => (
            <div
              className="col-lg-4 col-md-6 mb-4"
              key={vendor._id}
            >
              <div className="card shadow-sm h-100">

                <img
                  src={
                    vendor.shopBanner
                      ? `http://localhost:5000/${vendor.shopBanner}`
                      : "https://placehold.co/600x220?text=Store+Banner"
                  }
                  className="card-img-top"
                  style={{
                    height: "180px",
                    objectFit: "cover"
                  }}
                  alt=""
                />

                <div className="card-body text-center">

                  <img
                    src={
                      vendor.shopLogo
                        ? `http://localhost:5000/${vendor.shopLogo}`
                        : "https://placehold.co/100x100?text=Logo"
                    }
                    alt=""
                    style={{
                      width: 90,
                      height: 90,
                      borderRadius: "50%",
                      objectFit: "cover",
                      marginTop: -55,
                      border: "4px solid white"
                    }}
                  />

                  <h4 className="mt-3">
                    {vendor.shopName || vendor.name}
                  </h4>

                  <p className="text-muted">
                    {vendor.shopDescription ||
                      "No Description"}
                  </p>

                  <p>
                    ⭐ {vendor.shopRating || 0}
                  </p>

                  <p>
                    {vendor.totalProducts} Products
                  </p>

                  <Link
                    to={`/vendors/${vendor._id}`}
                    className="btn btn-primary"
                  >
                    Visit Store
                  </Link>

                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Vendors;