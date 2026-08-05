import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";
import VendorSidebar from "./VendorSidebar";
import VendorTopbar from "./VendorTopbar";

export default function VendorReviews() {

    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [ratingFilter, setRatingFilter] = useState("All");

    useEffect(() => {

        fetchReviews();

    }, []);

    const fetchReviews = async () => {

        try {

            const { data } = await api.get(
                "/vendor/reviews"
            );

            setReviews(data.data || []);

        } catch (err) {

            toast.error(
                err.response?.data?.message ||
                "Unable to load reviews"
            );

        } finally {

            setLoading(false);

        }

    };

    const filteredReviews = useMemo(() => {

        return reviews.filter((review) => {

            const matchesSearch =

                review.user?.name
                    ?.toLowerCase()
                    .includes(search.toLowerCase())

                ||

                review.product?.name
                    ?.toLowerCase()
                    .includes(search.toLowerCase())

                ||

                review.comment
                    ?.toLowerCase()
                    .includes(search.toLowerCase());

            const matchesRating =

                ratingFilter === "All"

                ||

                Number(review.rating) ===
                Number(ratingFilter);

            return matchesSearch && matchesRating;

        });

    }, [
        reviews,
        search,
        ratingFilter
    ]);

    const averageRating =
        reviews.length
            ? (
                reviews.reduce(
                    (sum, review) =>
                        sum + review.rating,
                    0
                ) / reviews.length
            ).toFixed(1)
            : "0.0";

    const fiveStar =
        reviews.filter(
            review => review.rating === 5
        ).length;

    const oneStar =
        reviews.filter(
            review => review.rating === 1
        ).length;

    if (loading) {

        return (

            <div className="admin-layout">

                <VendorSidebar />

                <div className="admin-content">

                    <VendorTopbar />

                    <div
                        className="admin-header"
                    >
                        <h2>
                            Loading Reviews...
                        </h2>
                    </div>

                </div>

            </div>

        );

    }

    return (

        <div className="admin-layout">

            <VendorSidebar />

            <div className="admin-content">

                <VendorTopbar />

                <div className="admin-header">

                    <h2>
                        Customer Reviews
                    </h2>

                </div>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(4, 1fr)",
                        gap: "28px",
                        marginBottom: "35px"
                    }}
                >

                    <div className="dashboard-stat-card">

                        <div className="dashboard-stat-icon">
                            ⭐
                        </div>

                        <div>

                            <p className="dashboard-stat-title">
                                Total Reviews
                            </p>

                            <h2>
                                {reviews.length}
                            </h2>

                            <span>
                                Customer Reviews
                            </span>

                        </div>

                    </div>

                    <div className="dashboard-stat-card">

                        <div className="dashboard-stat-icon">
                            🌞
                        </div>

                        <div>

                            <p className="dashboard-stat-title">
                                Average Rating
                            </p>

                            <h2>
                                {averageRating}
                            </h2>

                            <span>
                                Overall Score
                            </span>

                        </div>

                    </div>

                    <div className="dashboard-stat-card">

                        <div className="dashboard-stat-icon">
                            👍
                        </div>

                        <div>

                            <p className="dashboard-stat-title">
                                5 Star
                            </p>

                            <h2>
                                {fiveStar}
                            </h2>

                            <span>
                                Excellent
                            </span>

                        </div>

                    </div>

                    <div className="dashboard-stat-card">

                        <div className="dashboard-stat-icon">
                            👎
                        </div>

                        <div>

                            <p className="dashboard-stat-title">
                                1 Star
                            </p>

                            <h2>
                                {oneStar}
                            </h2>

                            <span>
                                Poor Reviews
                            </span>

                        </div>

                    </div>

                </div>

                <div
                    className="table-container"
                    style={{
                        marginTop: "30px"
                    }}
                >

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "22px",
                            gap: "20px",
                            flexWrap: "wrap"
                        }}
                    >

                        <input
                            type="text"
                            placeholder="Search customer, product or review..."
                            value={search}
                            onChange={(e) =>
                                setSearch(
                                    e.target.value
                                )
                            }
                            className="form-control"
                            style={{
                                maxWidth: "420px"
                            }}
                        />

                        <select
                            className="form-control"
                            style={{
                                width: "180px"
                            }}
                            value={ratingFilter}
                            onChange={(e) =>
                                setRatingFilter(
                                    e.target.value
                                )
                            }
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

                    <table className="orders-table">

                        <thead>

                            <tr>

                                <th>
                                    Customer
                                </th>

                                <th>
                                    Product
                                </th>

                                <th>
                                    Rating
                                </th>

                                <th>
                                    Review
                                </th>

                                <th>
                                    Date
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {
                                filteredReviews.length === 0
                                    ? (

                                        <tr>

                                            <td
                                                colSpan="5"
                                                style={{
                                                    textAlign: "center",
                                                    padding: "50px"
                                                }}
                                            >

                                                No reviews found.

                                            </td>

                                        </tr>

                                    )

                                    : (

                                        filteredReviews.map(
                                            (review) => (

                                                <tr
                                                    key={review._id}
                                                >

                                                    <td>

                                                        <strong>

                                                            {
                                                                review.user?.name
                                                            }

                                                        </strong>

                                                        <br />

                                                        <small>

                                                            {
                                                                review.user?.email
                                                            }

                                                        </small>

                                                    </td>

                                                    <td>

                                                        {
                                                            review.product?.name
                                                        }

                                                    </td>

                                                    <td>

                                                        {
                                                            "⭐".repeat(
                                                                review.rating
                                                            )
                                                        }

                                                    </td>

                                                    <td
                                                        style={{
                                                            maxWidth: "420px"
                                                        }}
                                                    >

                                                        {
                                                            review.comment
                                                        }

                                                    </td>

                                                    <td>

                                                        {
                                                            new Date(
                                                                review.createdAt
                                                            ).toLocaleDateString()
                                                        }

                                                    </td>

                                                </tr>

                                            )
                                        )

                                    )

                            }

                        </tbody>

                    </table>

                </div>
            </div>

        </div>


);

}