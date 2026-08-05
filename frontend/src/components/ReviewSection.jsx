import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";
import "../styles/reviewSection.css";

export default function ReviewSection({ productId }) {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");

    const token = localStorage.getItem("token");

    let user = null;

    try {
        user = JSON.parse(localStorage.getItem("user"));
    } catch {
        user = null;
    }

    useEffect(() => {
        if (productId) {
            fetchReviews();
        }
    }, [productId]);

    const fetchReviews = async () => {
        try {
            setLoading(true);

            const res = await api.get(`/products/${productId}/reviews`);

            const reviewData = Array.isArray(res.data?.data)
                ? res.data.data
                : [];

            setReviews(reviewData);
        } catch (err) {
            console.error(err);
            setReviews([]);
        } finally {
            setLoading(false);
        }
    };

    const submitReview = async (e) => {
        e.preventDefault();

        if (!token) {
            toast.error("Please login first.");
            return;
        }

        try {
            await api.post(
                `/products/${productId}/reviews`,
                {
                    rating,
                    comment,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            toast.success("Review submitted successfully.");

            setRating(5);
            setComment("");

            fetchReviews();
        } catch (err) {
            toast.error(
                err.response?.data?.message ||
                    "Unable to submit review."
            );
        }
    };

    const deleteReview = async (reviewId) => {
        if (!window.confirm("Delete this review?")) return;

        try {
            await api.delete(
                `/products/${productId}/reviews/${reviewId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            toast.success("Review deleted.");

            fetchReviews();
        } catch (err) {
            toast.error(
                err.response?.data?.message ||
                    "Unable to delete review."
            );
        }
    };

    if (loading) {
        return (
            <div className="review-loading">
                Loading reviews...
            </div>
        );
    }

    return (
        <div className="review-section">

            <h2>Customer Reviews</h2>

            {reviews.length === 0 ? (
                <div className="empty-state">
                    No reviews yet. Be the first to review this product.
                </div>
            ) : (
                reviews.map((review) => (
                    <div
                        key={review._id}
                        className="review-card"
                    >
                        <div className="review-header">

                            <div className="review-user">

                                <div className="review-avatar">
                                    {(review.user?.name || "U")
                                        .charAt(0)
                                        .toUpperCase()}
                                </div>

                                <div>

                                    <div className="review-name">
                                        {review.user?.name || "Anonymous"}
                                    </div>

                                    <div className="review-date">
                                        {review.createdAt
                                            ? new Date(
                                                  review.createdAt
                                              ).toLocaleDateString()
                                            : ""}
                                    </div>

                                </div>

                            </div>

                            <div className="review-stars">
                                {"★".repeat(review.rating || 0)}
                                {"☆".repeat(
                                    5 - (review.rating || 0)
                                )}
                            </div>

                        </div>

                        <div className="review-text">
                            {review.comment}
                        </div>

                        {token &&
                            (user?.role === "admin" ||
                                user?._id === review.user?._id) && (
                                <button
                                    className="review-delete-btn"
                                    onClick={() =>
                                        deleteReview(review._id)
                                    }
                                >
                                    Delete
                                </button>
                            )}
                    </div>
                ))
            )}

            <form
                className="review-form"
                onSubmit={submitReview}
            >
                <h3>Write a Review</h3>

                {!token && (
                    <p className="review-login-msg">
                        Please login to submit a review.
                    </p>
                )}

                <label>Rating</label>

                <select
                    value={rating}
                    disabled={!token}
                    onChange={(e) =>
                        setRating(Number(e.target.value))
                    }
                >
                    <option value={5}>★★★★★ (5)</option>
                    <option value={4}>★★★★☆ (4)</option>
                    <option value={3}>★★★☆☆ (3)</option>
                    <option value={2}>★★☆☆☆ (2)</option>
                    <option value={1}>★☆☆☆☆ (1)</option>
                </select>

                <label>Your Review</label>

                <textarea
                    value={comment}
                    disabled={!token}
                    required
                    placeholder="Share your experience..."
                    onChange={(e) =>
                        setComment(e.target.value)
                    }
                />

                <button
                    type="submit"
                    disabled={!token}
                    className="review-submit"
                >
                    Submit Review
                </button>
            </form>
        </div>
    );
}