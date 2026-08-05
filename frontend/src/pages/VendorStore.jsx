import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const VendorStore = () => {
  const { id } = useParams();

  const [vendor, setVendor] = useState(null);
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchVendor = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:5000/api/vendors/${id}`
      );

      setVendor(data.data.vendor);
      setProducts(data.data.products);
      setReviews(data.data.reviews);
      setCategories(data.data.categories);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendor();
  }, [id]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <h3>Loading Store...</h3>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">
          Vendor not found.
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">

      <div className="card shadow-sm mb-4">

        <img
          src={
            vendor.shopBanner
              ? `http://localhost:5000/${vendor.shopBanner}`
              : "https://placehold.co/1200x300?text=Store+Banner"
          }
          className="card-img-top"
          style={{
            height: 300,
            objectFit: "cover"
          }}
          alt=""
        />

        <div className="card-body text-center">

          <img
            src={
              vendor.shopLogo
                ? `http://localhost:5000/${vendor.shopLogo}`
                : "https://placehold.co/120?text=Logo"
            }
            alt=""
            style={{
              width: 120,
              height: 120,
              borderRadius: "50%",
              objectFit: "cover",
              marginTop: -70,
              border: "5px solid white"
            }}
          />

          <h2 className="mt-3">
            {vendor.shopName || vendor.name}
          </h2>

          <p className="text-muted">
            {vendor.shopDescription || "No description available"}
          </p>

          <p>
            ⭐ {vendor.shopRating || 0} ({vendor.totalReviews || 0} Reviews)
          </p>

          <p>
            📍 {vendor.shopAddress || "No Address"}
          </p>

          {vendor.shopPhone && (
            <p>
              📞 {vendor.shopPhone}
            </p>
          )}

          {vendor.shopEmail && (
            <p>
              ✉ {vendor.shopEmail}
            </p>
          )}

          <div className="mt-3">
            <strong>Categories</strong>

            <div className="mt-2">

              {categories.length === 0 ? (
                <span>No Categories</span>
              ) : (
                categories.map((cat) => (
                  <span
                    key={cat}
                    className="badge bg-primary me-2 mb-2"
                  >
                    {cat}
                  </span>
                ))
              )}

            </div>
          </div>

        </div>
      </div>

      <h3 className="mb-3">
        Products ({products.length})
      </h3>

      <div className="row">

        {products.length === 0 ? (
          <div className="alert alert-warning">
            No Products Available
          </div>
        ) : (
          products.map((product) => (
            <div
              className="col-lg-4 col-md-6 mb-4"
              key={product._id}
            >
              <div className="card h-100 shadow-sm">

                <img
                  src={
                    product.images?.length
                      ? `http://localhost:5000/${product.images[0]}`
                      : "https://placehold.co/400x300?text=Product"
                  }
                  className="card-img-top"
                  style={{
                    height: 220,
                    objectFit: "cover"
                  }}
                  alt=""
                />

                <div className="card-body">

                  <h5>
                    {product.name}
                  </h5>

                  <p className="text-muted">
                    {product.category?.name}
                  </p>

                  <h5 className="text-success">
                    ₹{product.price}
                  </h5>

                  <Link
                    to={`/products/${product._id}`}
                    className="btn btn-dark w-100"
                  >
                    View Product
                  </Link>

                </div>
              </div>
            </div>
          ))
        )}

      </div>

      <hr className="my-5" />

      <h3 className="mb-4">
        Customer Reviews
      </h3>

      {reviews.length === 0 ? (
        <div className="alert alert-secondary">
          No Reviews Yet
        </div>
      ) : (
        reviews.map((review) => (
          <div
            className="card mb-3"
            key={review._id}
          >
            <div className="card-body">

              <h5>
                {review.user?.name}
              </h5>

              <p>
                ⭐ {review.rating}
              </p>

              <strong>
                {review.product?.name}
              </strong>

              <p className="mt-2">
                {review.comment}
              </p>

            </div>
          </div>
        ))
      )}

    </div>
  );
};

export default VendorStore;