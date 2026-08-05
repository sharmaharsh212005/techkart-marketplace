import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/wishlist.css";

const API = "http://localhost:5000/api";

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const res = await fetch(`${API}/users/wishlist`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        setWishlist(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (id) => {
    try {
      const res = await fetch(`${API}/users/wishlist/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        setWishlist((prev) => prev.filter((item) => item._id !== id));
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  if (loading) {
    return (
      <div className="container">
        <h2>Loading Wishlist...</h2>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: "30px 0" }}>
      <h1 style={{ marginBottom: "25px" }}>❤️ My Wishlist</h1>

      {wishlist.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "80px 20px",
          }}
        >
          <div style={{ fontSize: "70px" }}>💔</div>

          <h2>Your wishlist is empty</h2>

          <p>Save products you like to view them later.</p>

          <Link
              to="/products"
              className="wishlist-empty-btn"
          >
              Browse Products
          </Link>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          {wishlist.map((product) => (
            <div
              key={product._id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "#1b2438",
                borderRadius: "22px",
                padding: "26px",
                border: "1px solid rgba(255,255,255,.08)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "25px",
                }}
              >
                <img
                  src={
                    product.images?.length
                      ? `http://localhost:5000${product.images[0]}`
                      : "https://placehold.co/500x500"
                  }
                  alt={product.name}
                  style={{
                    width: "150px",
                    height: "150px",
                    objectFit: "cover",
                    borderRadius: "16px",
                  }}
                />

                <div>

                  <h2
                    style={{
                      color: "#fff",
                      marginBottom: "10px",
                    }}
                  >
                    {product.name}
                  </h2>

                  <h3
                    style={{
                      color: "#60a5fa",
                      marginBottom: "22px",
                    }}
                  >
                    ₹{product.discountPrice || product.price}
                  </h3>

                  <Link
                    to={`/products/${product._id}`}
                    className="view-btn"
                    style={{
                      width: "220px",
                    }}
                  >
                    View Product
                  </Link>

                </div>
              </div>

              <button
                className="delete-btn"
                onClick={() => removeItem(product._id)}
                style={{
                  width: "120px",
                  height: "46px",
                }}
              >
                Remove
              </button>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}