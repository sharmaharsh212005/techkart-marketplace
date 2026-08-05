import { useState } from "react";
import "../../styles/home/newsletter.css";

const Newsletter = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email) return;

    alert("Thank you for subscribing!");

    setEmail("");
  };

  return (
    <section className="newsletter">

      <div className="newsletter-card">

        <span className="newsletter-tag">
          STAY UPDATED
        </span>

        <h2>
          Never Miss the Latest Tech Deals
        </h2>

        <p>
          Subscribe to receive exclusive offers, product launches,
          and special discounts directly in your inbox.
        </p>

        <form
          onSubmit={handleSubmit}
          className="newsletter-form"
        >

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            required
          />

          <button type="submit">
            Subscribe
          </button>

        </form>

      </div>

    </section>
  );
};

export default Newsletter;