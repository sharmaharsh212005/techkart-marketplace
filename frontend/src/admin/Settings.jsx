import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";

import AdminSidebar from "../components/AdminSidebar";
import AdminTopbar from "../components/AdminTopbar";

import "../styles/admin.css";

export default function Settings() {
  const [loading, setLoading] =
    useState(false);

  const [form, setForm] = useState({
    siteName: "",
    logo: "",
    favicon: "",
    email: "",
    phone: "",
    address: "",
    facebook: "",
    instagram: "",
    linkedin: "",
    footerText: "",
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data } =
        await api.get("/settings");

      setForm(
        data.data || {
          siteName: "",
          logo: "",
          favicon: "",
          email: "",
          phone: "",
          address: "",
          facebook: "",
          instagram: "",
          linkedin: "",
          footerText: "",
        }
      );
    } catch {
      toast.error(
        "Unable to load settings"
      );
    }
  };

  const changeHandler = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]:
        e.target.value,
    }));
  };

  const submitHandler =
    async (e) => {
      e.preventDefault();

      try {
        setLoading(true);

        await api.put(
          "/settings",
          form
        );

        toast.success(
          "Settings updated successfully."
        );
      } catch {
        toast.error(
          "Unable to update settings."
        );
      } finally {
        setLoading(false);
      }
    };
  return (
    <div className="admin-layout">
      <AdminSidebar />

      <div className="admin-content">
        <AdminTopbar />

        <div className="dashboard-header">
          <div>
            <h1>Website Settings ⚙️</h1>

            <p>
              Manage your marketplace branding,
              contact information and social media.
            </p>
          </div>

          <div className="dashboard-date">
            {new Date().toLocaleDateString(
              "en-IN",
              {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              }
            )}
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-stat-card">
            <div className="dashboard-stat-icon">
              🌐
            </div>

            <div className="dashboard-stat-content">
              <span>Website</span>

              <h2>
                {form.siteName || "-"}
              </h2>

              <small>
                Current Store
              </small>
            </div>
          </div>

          <div className="dashboard-stat-card">
            <div className="dashboard-stat-icon">
              📧
            </div>

            <div className="dashboard-stat-content">
              <span>Email</span>

              <h2
                style={{
                  fontSize: "1.35rem",
                  lineHeight: "1.35",
                  wordBreak: "break-word",
                  overflowWrap: "anywhere",
                  whiteSpace: "normal",
                  maxWidth: "100%",
                }}
              >
                {form.email || "-"}
              </h2>

              <small>
                Contact Email
              </small>
            </div>
          </div>

          <div className="dashboard-stat-card">
            <div className="dashboard-stat-icon">
              📱
            </div>

            <div className="dashboard-stat-content">
              <span>Phone</span>

              <h2>
                {form.phone || "-"}
              </h2>

              <small>
                Support Contact
              </small>
            </div>
          </div>

          <div className="dashboard-stat-card">
            <div className="dashboard-stat-icon">
              🔗
            </div>

            <div className="dashboard-stat-content">
              <span>Social</span>

              <h2>
                3
              </h2>

              <small>
                Connected Platforms
              </small>
            </div>
          </div>
        </div>

        <div className="admin-card">
          <form
            className="admin-form"
            onSubmit={submitHandler}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "1fr 1fr",
                gap: "30px",
              }}
            >
              <div>
                <h3
                  style={{
                    marginBottom: 20,
                  }}
                >
                  Company Information
                </h3>

                <div className="admin-group">
                  <label>
                    Website Name
                  </label>

                  <input
                    className="admin-input"
                    name="siteName"
                    value={form.siteName}
                    onChange={changeHandler}
                  />
                </div>

                <div className="admin-group">
                  <label>
                    Email
                  </label>

                  <input
                    className="admin-input"
                    name="email"
                    value={form.email}
                    onChange={changeHandler}
                  />
                </div>

                <div className="admin-group">
                  <label>
                    Phone
                  </label>

                  <input
                    className="admin-input"
                    name="phone"
                    value={form.phone}
                    onChange={changeHandler}
                  />
                </div>

                <div className="admin-group">
                  <label>
                    Address
                  </label>

                  <textarea
                    className="admin-textarea"
                    rows="5"
                    name="address"
                    value={form.address}
                    onChange={changeHandler}
                  />
                </div>
              </div>

              <div>
                <h3
                  style={{
                    marginBottom: 20,
                  }}
                >
                  Branding & Social
                </h3>

                <div className="admin-group">
                  <label>
                    Logo URL
                  </label>

                  <input
                    className="admin-input"
                    name="logo"
                    value={form.logo}
                    onChange={changeHandler}
                  />

                  {form.logo && (
                    <img
                      src={form.logo}
                      alt="Logo"
                      style={{
                        width: 90,
                        height: 90,
                        objectFit: "contain",
                        marginTop: 10,
                        borderRadius: 8,
                        border:
                          "1px solid #ddd",
                        padding: 6,
                      }}
                    />
                  )}
                </div>

                <div className="admin-group">
                  <label>
                    Favicon URL
                  </label>

                  <input
                    className="admin-input"
                    name="favicon"
                    value={form.favicon}
                    onChange={changeHandler}
                  />
                </div>

                <div className="admin-group">
                  <label>
                    Facebook
                  </label>

                  <input
                    className="admin-input"
                    name="facebook"
                    value={form.facebook}
                    onChange={changeHandler}
                  />
                </div>

                <div className="admin-group">
                  <label>
                    Instagram
                  </label>

                  <input
                    className="admin-input"
                    name="instagram"
                    value={form.instagram}
                    onChange={changeHandler}
                  />
                </div>

                <div className="admin-group">
                  <label>
                    LinkedIn
                  </label>

                  <input
                    className="admin-input"
                    name="linkedin"
                    value={form.linkedin}
                    onChange={changeHandler}
                  />
                </div>

                <div className="admin-group">
                  <label>
                    Footer Text
                  </label>

                  <input
                    className="admin-input"
                    name="footerText"
                    value={form.footerText}
                    onChange={changeHandler}
                  />
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent:
                  "flex-end",
                marginTop: 30,
              }}
            >
              <button
                className="primary-btn"
                type="submit"
                disabled={loading}
              >
                {loading
                  ? "Saving..."
                  : "Save Settings"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}