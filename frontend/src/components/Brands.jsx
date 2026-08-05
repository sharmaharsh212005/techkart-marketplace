import "../styles/brands.css";

const brands = [
  "Apple",
  "Samsung",
  "Dell",
  "ASUS",
  "Sony",
  "HP",
  "Lenovo",
  "Logitech"
];

export default function Brands() {
  return (
    <section className="brands-section">
      <p className="brand-title">Trusted by Top Technology Brands</p>

      <div className="brand-container">
        {brands.map((brand) => (
          <div className="brand-card" key={brand}>
            {brand}
          </div>
        ))}
      </div>
    </section>
  );
}