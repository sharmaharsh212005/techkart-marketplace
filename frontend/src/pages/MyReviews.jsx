import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";
import "../styles/reviewSection.css";

const API_URL = "http://localhost:5000";

export default function MyReviews() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            setLoading(true);

            const { data } = await api.get("/reviews/my");

            setReviews(data.data || []);
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Unable to load reviews"
            );
        } finally {
            setLoading(false);
        }
    };

    const deleteReview = async (review) => {
        if (!window.confirm("Delete this review?")) return;

        try {
            await api.delete(
                `/products/${review.product._id}/reviews/${review._id}`
            );

            toast.success("Review deleted");

            fetchReviews();
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Unable to delete review"
            );
        }
    };

    if (loading) {
        return (
            <div className="container">
                <h2
                    style={{
                        color: "#fff",
                        textAlign: "center",
                        marginTop: "40px",
                    }}
                >
                    Loading Reviews...
                </h2>
            </div>
        );
    }

    return (
        <div
            className="container"
            style={{
                maxWidth: "1200px",
                paddingTop: "40px",
                paddingBottom: "40px",
            }}
        >

            <h1
                style={{
                    color: "#fff",
                    marginBottom: "10px",
                }}
            >
                My Reviews
            </h1>

            <p
                style={{
                    color: "#94a3b8",
                    marginBottom: "35px",
                }}
            >
                Manage all reviews you've written.
            </p>

            {reviews.length === 0 ? (

                <div className="empty-state">
                    You haven't reviewed any products yet.
                </div>

            ) : (

                reviews.map((review) => (

                    <div
                        key={review._id}
                        className="review-card"
                        style={{
                            marginBottom: "25px",
                        }}
                    >

                        <div
                            style={{
                                display: "flex",
                                gap: "20px",
                                alignItems: "center",
                            }}
                        >

                            <img
                                src={
                                    review.product?.images?.length
                                        ? `${API_URL}${review.product.images[0]}`
                                        : "https://placehold.co/120x120"
                                }
                                alt={review.product?.name}
                                style={{
                                    width: "90px",
                                    height: "90px",
                                    objectFit: "contain",
                                    background: "#fff",
                                    borderRadius: "12px",
                                }}
                            />

                            <div style={{ flex: 1 }}>

                                <h3
                                    style={{
                                        color: "#fff",
                                        marginBottom: "8px",
                                    }}
                                >
                                    {review.product?.name}
                                </h3>

                                <div
                                    style={{
                                        color: "#60a5fa",
                                        marginBottom: "10px",
                                        fontWeight: 600,
                                    }}
                                >
                                    ₹{review.product?.price}
                                </div>

                                <div
                                    className="review-stars"
                                    style={{
                                        marginBottom: "10px",
                                    }}
                                >
                                    {"★".repeat(review.rating)}
                                    {"☆".repeat(5 - review.rating)}
                                </div>

                                <p
                                    style={{
                                        color: "#cbd5e1",
                                        marginBottom: "15px",
                                    }}
                                >
                                    {review.comment}
                                </p>

                                <small
                                    style={{
                                        color: "#94a3b8",
                                    }}
                                >
                                    {new Date(
                                        review.createdAt
                                    ).toLocaleDateString()}
                                </small>

                            </div>

                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "12px",
                                }}
                            >

                                <Link
                                    to={`/products/${review.product._id}`}
                                    className="review-submit"
                                    style={{
                                        textDecoration: "none",
                                        textAlign: "center",
                                    }}
                                >
                                    View Product
                                </Link>

                                <button
                                    className="review-delete-btn"
                                    onClick={() =>
                                        deleteReview(review)
                                    }
                                >
                                    Delete
                                </button>

                            </div>

                        </div>

                    </div>

                ))

            )}

        </div>
    );
}