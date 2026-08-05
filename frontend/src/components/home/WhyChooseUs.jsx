import {
  FaShippingFast,
  FaShieldAlt,
  FaUndoAlt,
  FaHeadset
} from "react-icons/fa";

import "../../styles/home/whyChooseUs.css";

const features = [
  {
    icon: <FaShippingFast />,
    title: "Fast Delivery",
    description:
      "Lightning-fast delivery across India with live order tracking."
  },
  {
    icon: <FaShieldAlt />,
    title: "Secure Payments",
    description:
      "100% encrypted transactions with trusted payment partners."
  },
  {
    icon: <FaUndoAlt />,
    title: "Easy Returns",
    description:
      "Simple replacement and return policy for a worry-free shopping experience."
  },
  {
    icon: <FaHeadset />,
    title: "24/7 Support",
    description:
      "Dedicated customer support whenever you need assistance."
  }
];

const WhyChooseUs = () => {
  return (
    <section className="why-section">

      <div className="why-header">

        <span>WHY TECHKART</span>

        <h2>Shopping Made Better</h2>

        <p>
          Experience secure shopping, premium quality products,
          and exceptional customer service all in one place.
        </p>

      </div>

      <div className="why-grid">

        {features.map((item, index) => (

          <div
            className="why-card"
            key={index}
          >

            <div className="why-icon">
              {item.icon}
            </div>

            <h3>{item.title}</h3>

            <p>{item.description}</p>

          </div>

        ))}

      </div>

    </section>
  );
};

export default WhyChooseUs;