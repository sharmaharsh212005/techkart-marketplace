import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";
import "../styles/auth.css";

export default function Register() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "customer",
    shopName: "",
    shopLogo: "",
    shopDescription: "",
    shopAddress: "",
    gstNumber: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const uploadLogo = async (file) => {
    try {
      const data = new FormData();
      data.append("image", file);

      const res = await api.post("/upload", data, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      setFormData((prev) => ({
        ...prev,
        shopLogo: res.data.image
      }));

      toast.success("Logo uploaded");
    } catch {
      toast.error("Logo upload failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const { data } = await api.post(
        "/auth/register",
        formData
      );

      toast.success(data.message);

      navigate("/login");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Registration Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">

        <h1>Create Account</h1>

        <p>Join TechKart Marketplace</p>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
          />

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="customer">
              Customer
            </option>

            <option value="vendor">
              Vendor
            </option>
          </select>

          {formData.role === "vendor" && (
            <>

              <input
                type="text"
                name="shopName"
                placeholder="Shop Name"
                value={formData.shopName}
                onChange={handleChange}
                required
              />

              <textarea
                name="shopDescription"
                placeholder="Shop Description"
                value={formData.shopDescription}
                onChange={handleChange}
                rows={3}
              />

              <input
                type="text"
                name="shopAddress"
                placeholder="Shop Address"
                value={formData.shopAddress}
                onChange={handleChange}
              />

              <input
                type="text"
                name="gstNumber"
                placeholder="GST Number"
                value={formData.gstNumber}
                onChange={handleChange}
              />

              <label>
                Upload Shop Logo
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  uploadLogo(e.target.files[0])
                }
              />

              {formData.shopLogo && (
                <img
                  src={formData.shopLogo}
                  alt="Shop Logo"
                  style={{
                    width: "90px",
                    height: "90px",
                    objectFit: "cover",
                    borderRadius: "10px",
                    marginBottom: "15px"
                  }}
                />
              )}

            </>
          )}

          <div className="password-field">

            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() =>
                setShowPassword(!showPassword)
              }
            >
              {showPassword
                ? "Hide"
                : "Show"}
            </button>

          </div>

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Creating Account..."
              : formData.role === "vendor"
              ? "Apply as Vendor"
              : "Register"}
          </button>

        </form>

        <p style={{ marginTop: 20 }}>
          Already have an account?{" "}
          <Link to="/login">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}