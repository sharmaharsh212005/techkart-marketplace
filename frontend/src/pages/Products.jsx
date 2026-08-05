import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";
import "../styles/products.css";

export default function Products() {
  const [searchParams] = useSearchParams();

  const searchQuery = searchParams.get("search") || "";
  const categoryQuery = searchParams.get("category") || "";

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [showFilters, setShowFilters] = useState(false);

  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const [filters, setFilters] = useState({
    search: searchQuery,
    category: categoryQuery,
    minPrice: "",
    maxPrice: "",
    rating: "",
    stock: "",
    sort: "",
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      search: searchQuery,
      category: categoryQuery,
    }));

    setPage(1);
  }, [searchQuery, categoryQuery]);

  useEffect(() => {
    fetchProducts();
  }, [page, filters.search, filters.category]);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchProducts = async (customPage = page) => {
    try {
      setLoading(true);

      const params = {
        page: customPage,
        limit: 9,
        ...filters,
      };

      Object.keys(params).forEach((key) => {
        if (
          params[key] === "" ||
          params[key] === undefined ||
          params[key] === null
        ) {
          delete params[key];
        }
      });

      const res = await api.get("/products", {
        params,
      });

      setProducts(res.data.data || []);
      setPages(res.data.pages || 1);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    setPage(1);
    fetchProducts(1);
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      category: "",
      minPrice: "",
      maxPrice: "",
      rating: "",
      stock: "",
      sort: "",
    });

    setPage(1);

    window.history.replaceState({}, "", "/products");

    setTimeout(() => {
      fetchProducts(1);
    }, 100);
  };

  return (
    <div className="products-page container">

      <div className="products-header">
        <h1>Explore Products</h1>
        <p>Discover premium electronics at the best prices.</p>
      </div>

      <div className="search-toolbar">

        <input
          type="text"
          placeholder="Search Products..."
          value={filters.search}
          onChange={(e) =>
            setFilters({
              ...filters,
              search: e.target.value,
            })
          }
        />

        <button
          className="advanced-filter-btn"
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? "Hide Filters ▲" : "Advanced Search ▼"}
        </button>

      </div>

      <div className={`advanced-filters ${showFilters ? "open" : ""}`}>

        <div className="filters">

          <select
            value={filters.category}
            onChange={(e) =>
              setFilters({
                ...filters,
                category: e.target.value,
              })
            }
          >
            <option value="">All Categories</option>

            {categories.map((category) => (
              <option
                key={category._id}
                value={category._id}
              >
                {category.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Min Price"
            value={filters.minPrice}
            onChange={(e) =>
              setFilters({
                ...filters,
                minPrice: e.target.value,
              })
            }
          />

          <input
            type="number"
            placeholder="Max Price"
            value={filters.maxPrice}
            onChange={(e) =>
              setFilters({
                ...filters,
                maxPrice: e.target.value,
              })
            }
          />
          <select
            value={filters.rating}
            onChange={(e) =>
              setFilters({
                ...filters,
                rating: e.target.value,
              })
            }
          >
            <option value="">Any Rating</option>
            <option value="4">4★ & Above</option>
            <option value="3">3★ & Above</option>
            <option value="2">2★ & Above</option>
            <option value="1">1★ & Above</option>
          </select>

          <select
            value={filters.stock}
            onChange={(e) =>
              setFilters({
                ...filters,
                stock: e.target.value,
              })
            }
          >
            <option value="">All Stock</option>
            <option value="in">In Stock</option>
            <option value="out">Out Of Stock</option>
          </select>

          <select
            value={filters.sort}
            onChange={(e) =>
              setFilters({
                ...filters,
                sort: e.target.value,
              })
            }
          >
            <option value="">Newest</option>
            <option value="priceLow">Price: Low to High</option>
            <option value="priceHigh">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="stock">Stock Available</option>
          </select>

          <div className="filter-buttons">

            <button
              className="apply-filter-btn"
              onClick={applyFilters}
            >
              Apply Filters
            </button>

            <button
              className="clear-filter-btn"
              onClick={clearFilters}
            >
              Clear
            </button>

          </div>

        </div>

      </div>

      {loading ? (
        <div className="loading-products">
          Loading Products...
        </div>
      ) : products.length === 0 ? (
        <div className="no-products">
          <h2>No Products Found</h2>
          <p>Try changing your search or filters.</p>
        </div>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
            />
          ))}
        </div>
      )}

      {pages > 1 && (
        <div className="pagination">

          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </button>

          <span>
            Page {page} of {pages}
          </span>

          <button
            disabled={page === pages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>

        </div>
      )}

    </div>
  );
}