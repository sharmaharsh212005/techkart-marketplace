import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/home/featuredCategories.css";

const FeaturedCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.categories || data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="featured-categories">
        <div className="category-loading">
          Loading Categories...
        </div>
      </section>
    );
  }

  return (
    <section className="featured-categories">
      <div className="section-header">

        <div>

          <span className="section-tag">
            SHOP BY CATEGORY
          </span>

          <h2>
            Find Everything You Need
          </h2>

          <p>
            Browse our premium collection across multiple categories.
          </p>

        </div>

      </div>

      <div className="categories-grid">

        {categories.map((category) => (

          <Link
            key={category._id}
            to={`/products?category=${category._id}`}
            className="category-card"
          >

            <div className="category-image">

              <img
                src={category.image}
                alt={category.name}
              />

            </div>

            <div className="category-content">

              <h3>{category.name}</h3>

            </div>

          </Link>

        ))}

      </div>

    </section>
  );
};

export default FeaturedCategories;