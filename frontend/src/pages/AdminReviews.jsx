import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";

import AdminSidebar from "../components/AdminSidebar";
import AdminTopbar from "../components/AdminTopbar";

import "../styles/admin.css";

export default function AdminReviews() {
  const [reviews, setReviews] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [ratingFilter, setRatingFilter] =
    useState("All");

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews =
    async () => {
      try {
        setLoading(true);

        const { data } =
          await api.get(
            "/reviews/admin/all"
          );

        setReviews(data.data || []);
      } catch (error) {
        toast.error(
          error.response?.data
            ?.message ||
            "Unable to load reviews"
        );
      } finally {
        setLoading(false);
      }
    };

  const deleteReview =
    async (id) => {
      if (
        !window.confirm(
          "Delete this review?"
        )
      )
        return;

      try {
        await api.delete(
          `/reviews/${id}`
        );

        toast.success(
          "Review deleted"
        );

        fetchReviews();
      } catch (error) {
        toast.error(
          error.response?.data
            ?.message ||
            "Unable to delete review"
        );
      }
    };

  const filteredReviews =
    useMemo(() => {
      let data = [...reviews];

      if (ratingFilter !== "All") {
        data = data.filter(
          (review) =>
            review.rating ===
            Number(
              ratingFilter
            )
        );
      }

      if (search) {
        const keyword =
          search.toLowerCase();

        data = data.filter(
          (review) =>
            review.user?.name
              ?.toLowerCase()
              .includes(
                keyword
              ) ||
            review.product?.name
              ?.toLowerCase()
              .includes(
                keyword
              ) ||
            review.comment
              ?.toLowerCase()
              .includes(
                keyword
              )
        );
      }

      return data;
    }, [
      reviews,
      search,
      ratingFilter,
    ]);

  const averageRating =
    reviews.length
      ? (
          reviews.reduce(
            (sum, item) =>
              sum +
              item.rating,
            0
          ) /
          reviews.length
        ).toFixed(1)
      : 0;
  if (loading) {
    return (
      <div className="admin-layout">
        <AdminSidebar />

        <div className="admin-content">
          <AdminTopbar />

          <div
            style={{
              padding: 40,
              fontSize: 20,
              fontWeight: 600,
            }}
          >
            Loading Reviews...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <div className="admin-content">
        <AdminTopbar />

        <div className="dashboard-header">
          <div>
            <h1>Reviews Management ⭐</h1>

            <p>
              Monitor customer reviews and maintain product quality.
            </p>
          </div>

          <div className="dashboard-date">
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-stat-card">
            <div className="dashboard-stat-icon">
              ⭐
            </div>

            <div className="dashboard-stat-content">
              <span>Total Reviews</span>
              <h2>{reviews.length}</h2>
              <small>Customer Reviews</small>
            </div>
          </div>

          <div className="dashboard-stat-card">
            <div className="dashboard-stat-icon">
              🌟
            </div>

            <div className="dashboard-stat-content">
              <span>Average Rating</span>
              <h2>{averageRating}</h2>
              <small>Overall Score</small>
            </div>
          </div>

          <div className="dashboard-stat-card">
            <div className="dashboard-stat-icon">
              👍
            </div>

            <div className="dashboard-stat-content">
              <span>5 Star</span>
              <h2>
                {
                  reviews.filter(
                    (r) => r.rating === 5
                  ).length
                }
              </h2>

              <small>Excellent</small>
            </div>
          </div>

          <div className="dashboard-stat-card">
            <div className="dashboard-stat-icon">
              👎
            </div>

            <div className="dashboard-stat-content">
              <span>1 Star</span>
              <h2>
                {
                  reviews.filter(
                    (r) => r.rating === 1
                  ).length
                }
              </h2>

              <small>Poor Reviews</small>
            </div>
          </div>
        </div>

        <div className="admin-card">
          <div
            style={{
              display: "flex",
              gap: 15,
              marginBottom: 20,
              flexWrap: "wrap",
            }}
          >
            <input
              className="table-search"
              placeholder="Search reviews..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

            <select
              className="admin-input"
              value={ratingFilter}
              onChange={(e) =>
                setRatingFilter(e.target.value)
              }
              style={{
                maxWidth: 180,
              }}
            >
              <option value="All">
                All Ratings
              </option>

              <option value="5">
                ⭐⭐⭐⭐⭐
              </option>

              <option value="4">
                ⭐⭐⭐⭐
              </option>

              <option value="3">
                ⭐⭐⭐
              </option>

              <option value="2">
                ⭐⭐
              </option>

              <option value="1">
                ⭐
              </option>
            </select>
          </div>

          <div className="table-container">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Product</th>
                  <th>Rating</th>
                  <th>Comment</th>
                  <th>Date</th>
                  <th width="120">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredReviews.length ===
                0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      style={{
                        textAlign:
                          "center",
                      }}
                    >
                      No Reviews Found
                    </td>
                  </tr>
                ) : (
                  filteredReviews.map(
                    (review) => (
                      <tr
                        key={review._id}
                      >
                        <td>
                          <strong>
                            {
                              review.user
                                ?.name
                            }
                          </strong>

                          <br />

                          <small>
                            {
                              review.user
                                ?.email
                            }
                          </small>
                        </td>

                        <td>
                          {
                            review.product
                              ?.name
                          }
                        </td>

                        <td
                          style={{
                            color:
                              "#f59e0b",
                            fontWeight:
                              600,
                          }}
                        >
                          {"★".repeat(
                            review.rating
                          )}
                        </td>

                        <td>
                          {
                            review.comment
                          }
                        </td>

                        <td>
                          {new Date(
                            review.createdAt
                          ).toLocaleDateString()}
                        </td>

                        <td className="action-buttons">
                          <button
                            className="delete-btn"
                            type="button"
                            onClick={() =>
                              deleteReview(
                                review._id
                              )
                            }
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    )
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}