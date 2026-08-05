export default function ProductTable({
    products,
    onEdit,
    onDelete,
    onApprove,
    onReject,
}) {

    const getImage = (product) => {

        if (!product.images || product.images.length === 0)
            return "/placeholder.png";

        const image = product.images[0];

        if (image.startsWith("http"))
            return image;

        return `http://localhost:5000${image}`;

    };

    const getStatusClass = (status) => {

        switch (status) {

            case "Approved":
                return "admin-status-approved";

            case "Rejected":
                return "admin-status-rejected";

            default:
                return "admin-status-pending";

        }

    };

    return (

        <div className="premium-product-table">

            {

                products.map((product) => (

                    <div
                        key={product._id}
                        className="admin-product-card"
                    >

                        {/* =========================
                                TOP SECTION
                        ========================== */}

                        <div className="admin-product-top">

                            {/* IMAGE */}

                            <div className="admin-product-left">

                                <img

                                    src={getImage(product)}

                                    alt={product.name}

                                    className="admin-product-image"

                                    onError={(e)=>{

                                        e.target.src="/placeholder.png";

                                    }}

                                />

                            </div>

                            {/* PRODUCT INFO */}

                            <div className="admin-product-main">

                                <h3>

                                    {product.name}

                                </h3>

                                <p className="admin-brand">

                                    {product.brand || "No Brand"}

                                </p>

                                <p className="admin-description">

                                    {product.description}

                                </p>

                                {

                                    product.featured &&

                                    <div className="admin-featured-pill">

                                        ⭐ Featured Product

                                    </div>

                                }

                            </div>

                            {/* ACTIONS */}

                            <div className="admin-product-actions">
                                {product.approvalStatus === "Pending" && (
                                    <>
                                        <button
                                            className="approve-btn"
                                            onClick={() => onApprove(product._id)}
                                        >
                                            ✓ Approve
                                        </button>

                                        <button
                                            className="reject-btn"
                                            onClick={() => onReject(product._id)}
                                        >
                                            ✕ Reject
                                        </button>
                                    </>
                                )}

                                <button
                                    className="edit-btn"
                                    onClick={() => onEdit(product)}
                                >
                                    ✏ Edit
                                </button>

                                <button
                                    className="delete-btn"
                                    onClick={() => onDelete(product._id)}
                                >
                                    🗑 Delete
                                </button>

                            </div>

                        </div>

                        {/* =========================
                                PRODUCT DETAILS
                        ========================== */}

                        <div className="admin-product-details">

                            <div className="admin-info-block">

                                <span className="admin-label">

                                    CATEGORY

                                </span>

                                <strong>

                                    {product.category?.name || "-"}

                                </strong>

                            </div>

                            <div className="admin-info-block">

                                <span className="admin-label">

                                    VENDOR

                                </span>

                                <strong>

                                    {product.vendor?.shopname ||
                                     product.vendor?.name ||
                                     "-"}

                                </strong>

                            </div>

                            <div className="admin-info-block">

                                <span className="admin-label">

                                    PRICE

                                </span>

                                <strong>

                                    ₹{Number(product.price || 0).toLocaleString("en-IN")}

                                </strong>

                            </div>

                            <div className="admin-info-block">

                                <span className="admin-label">

                                    STOCK

                                </span>

                                <div className="admin-stock-number">

                                    {product.stock || 0}

                                </div>

                                <div
                                    className={`admin-status-badge ${
                                        (product.stock || 0) > 0
                                            ? "admin-status-approved"
                                            : "admin-status-rejected"
                                    }`}
                                >
                                    {(product.stock || 0) > 0
                                        ? "In Stock"
                                        : "Out of Stock"}
                                </div>

                            </div>

                            <div className="admin-info-block">

                                <span className="admin-label">

                                    STATUS

                                </span>

                                <div
                                    className={`admin-status-badge ${getStatusClass(
                                        product.approvalStatus
                                    )}`}
                                >
                                    {product.approvalStatus}
                                </div>

                            </div>

                        </div>

                    </div>

                ))

            }

        </div>

    );

}