import "../../styles/home/testimonials.css";

const testimonials = [
  {
    id: 1,
    name: "Rahul Sharma",
    role: "Verified Buyer",
    image: "https://i.pravatar.cc/150?img=12",
    review:
      "Amazing shopping experience! The delivery was fast, the product quality exceeded my expectations, and customer support was incredibly helpful.",
    rating: 5,
  },
  {
    id: 2,
    name: "Priya Mehta",
    role: "Tech Enthusiast",
    image: "https://i.pravatar.cc/150?img=32",
    review:
      "TechKart has become my go-to marketplace for gadgets. Premium products, secure payments, and great offers every time.",
    rating: 5,
  },
  {
    id: 3,
    name: "Arjun Verma",
    role: "Gaming Customer",
    image: "https://i.pravatar.cc/150?img=14",
    review:
      "Bought my gaming setup here and everything arrived perfectly packed. Highly recommended for anyone looking for quality electronics.",
    rating: 5,
  },
];

const Testimonials = () => {
  return (
    <section className="testimonials">

      <div className="testimonials-header">

        <span>HAPPY CUSTOMERS</span>

        <h2>What Our Customers Say</h2>

        <p>
          Thousands of customers trust TechKart for premium electronics,
          reliable delivery, and exceptional support.
        </p>

      </div>

      <div className="testimonial-grid">

        {testimonials.map((item) => (

          <div className="testimonial-card" key={item.id}>

            <img src={item.image} alt={item.name} />

            <div className="stars">
              {"★★★★★"}
            </div>

            <p>"{item.review}"</p>

            <h3>{item.name}</h3>

            <span>{item.role}</span>

          </div>

        ))}

      </div>

    </section>
  );
};

export default Testimonials;