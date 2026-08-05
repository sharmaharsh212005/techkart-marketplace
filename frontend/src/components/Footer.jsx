import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt
} from "react-icons/fa";
import api from "../api/axios";
import "../styles/footer.css";

export default function Footer() {

  const [settings, setSettings] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await api.get("/settings");
      setSettings(data.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <footer className="footer">

      <div className="footer-container">

        <div className="footer-about">

          <h2>
            <span>Tech</span>Kart
          </h2>

          <p>
            Your trusted multi-vendor electronics marketplace for premium gadgets,
            accessories and smart devices.
          </p>

        </div>

        <div className="footer-links">

          <h4>Quick Links</h4>

          <Link to="/">Home</Link>

          <Link to="/products">Products</Link>

          <Link to="/categories">Categories</Link>

          <Link to="/contact-us">Contact</Link>

        </div>

        <div className="footer-links">

          <h4>Information</h4>

          <Link to="/about-us">About Us</Link>

          <Link to="/privacy-policy">
            Privacy Policy
          </Link>

          <Link to="/terms-and-conditions">
            Terms & Conditions
          </Link>

          <Link to="/shipping-policy">
            Shipping Policy
          </Link>

        </div>

        <div className="footer-contact">

          <h4>Contact</h4>

          {settings?.email && (
            <p>
              <FaEnvelope />
              {settings.email}
            </p>
          )}

          {settings?.phone && (
            <p>
              <FaPhoneAlt />
              {settings.phone}
            </p>
          )}

          {settings?.address && (
            <p>
              <FaMapMarkerAlt />
              {settings.address}
            </p>
          )}

          <div className="footer-social">

            {settings?.facebook && (
              <a
                href={settings.facebook}
                target="_blank"
                rel="noreferrer"
              >
                <FaFacebookF />
              </a>
            )}

            {settings?.instagram && (
              <a
                href={settings.instagram}
                target="_blank"
                rel="noreferrer"
              >
                <FaInstagram />
              </a>
            )}

            {settings?.linkedin && (
              <a
                href={settings.linkedin}
                target="_blank"
                rel="noreferrer"
              >
                <FaLinkedinIn />
              </a>
            )}

          </div>

        </div>

      </div>

      <div className="footer-bottom">

        {settings?.footerText ||
          "© 2026 TechKart • Designed & Developed by Harshit Sharma"}

      </div>

    </footer>
  );
}