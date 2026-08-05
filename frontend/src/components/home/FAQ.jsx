import { useState } from "react";
import "../../styles/home/faq.css";

const faqs = [
  {
    question: "How long does delivery take?",
    answer:
      "Orders are usually delivered within 3–7 business days depending on your location.",
  },
  {
    question: "Do you offer free shipping?",
    answer:
      "Yes. Free shipping is available on eligible products and promotional offers.",
  },
  {
    question: "Can I return a product?",
    answer:
      "Absolutely. We offer a hassle-free return and replacement policy on eligible products.",
  },
  {
    question: "Are all products genuine?",
    answer:
      "Yes. Every product sold on TechKart is sourced from verified vendors and is 100% authentic.",
  },
  {
    question: "Which payment methods are accepted?",
    answer:
      "We accept Credit Cards, Debit Cards, UPI, Net Banking, Wallets, and Cash on Delivery where available.",
  },
];

const FAQ = () => {
  const [active, setActive] = useState(0);

  return (
    <section className="faq-section">

      <div className="faq-header">

        <span>FAQ</span>

        <h2>Frequently Asked Questions</h2>

        <p>
          Find quick answers to the most common questions about shopping with
          TechKart.
        </p>

      </div>

      <div className="faq-container">

        {faqs.map((faq, index) => (

          <div
            className={`faq-item ${
              active === index ? "active" : ""
            }`}
            key={index}
          >

            <button
              className="faq-question"
              onClick={() =>
                setActive(active === index ? -1 : index)
              }
            >
              <span>{faq.question}</span>

              <span className="faq-icon">
                {active === index ? "−" : "+"}
              </span>

            </button>

            <div className="faq-answer">

              <p>{faq.answer}</p>

            </div>

          </div>

        ))}

      </div>

    </section>
  );
};

export default FAQ;