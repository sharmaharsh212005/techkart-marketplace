import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import "../styles/relatedProducts.css";

const API_URL = "http://localhost:5000";

export default function RelatedProducts({
    currentProduct,
    categoryId,
}) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!categoryId) return;

        fetchProducts();
    }, [categoryId, currentProduct]);

    const fetchProducts = async () => {
        try {
            setLoading(true);

            const res = await api.get(
                `/products?category=${categoryId}&limit=50`
            );

            const allProducts = Array.isArray(res.data?.data)
                ? res.data.data
                : [];

            const related = allProducts
                .filter(
                    (item) =>
                        item._id !== currentProduct &&
                        item.approvalStatus === "Approved"
                )
                .slice(0, 4);

            setProducts(related);
        } catch (err) {
            console.error("Related Products Error:", err);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const getImage = (images = []) => {
        if (!Array.isArray(images) || images.length === 0) {
            return "/placeholder.png";
        }

        const img = images[0];

        if (!img) {
            return "/placeholder.png";
        }

        if (img.startsWith("http")) {
            return img;
        }

        if (img.startsWith("/")) {
            return `${API_URL}${img}`;
        }

        return `${API_URL}/uploads/products/${img}`;
    };

    if (loading) {
        return (
            <div className="related-card">
                <h3>Related Products</h3>
                <p>Loading...</p>
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="related-card">
                <h3>Related Products</h3>
                <p className="related-empty">
                    No related products found.
                </p>
            </div>
        );
    }

    return (
        <div className="related-card">
            <h3>Related Products</h3>

            {products.map((product) => (
                <Link
                    key={product._id}
                    to={`/products/${product._id}`}
                    className="related-item"
                >
                    <img
                        src={getImage(product.images)}
                        alt={product.name}
                        loading="lazy"
                        onError={(e) => {
                            e.target.src = "/placeholder.png";
                        }}
                    />

                    <div className="related-info">
                        <h4>{product.name}</h4>

                        <span>
                            ₹
                            {Number(
                                product.discountPrice || product.price
                            ).toLocaleString()}
                        </span>

                        {product.discountPrice > 0 && (
                            <small className="old-price">
                                ₹{Number(product.price).toLocaleString()}
                            </small>
                        )}
                    </div>
                </Link>
            ))}
        </div>
    );
}