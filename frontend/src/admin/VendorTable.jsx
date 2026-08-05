import { useMemo, useState } from "react";

export default function VendorTable({
  vendors = [],
  onApprove,
  onReject,
}) {
  const [page, setPage] = useState(1);

  const pageSize = 8;

  const totalPages = Math.max(
    1,
    Math.ceil(vendors.length / pageSize)
  );

  const currentVendors = useMemo(() => {
    const start = (page - 1) * pageSize;

    return vendors.slice(
      start,
      start + pageSize
    );
  }, [vendors, page]);

  const getStatusClass = (status) => {
    switch (status) {
      case "Approved":
        return "status-badge delivered";

      case "Rejected":
        return "status-badge cancelled";

      default:
        return "status-badge pending";
    }
  };
  return (
    <>
      <div className="table-container">
        {currentVendors.length === 0 ? (
          <div className="empty">
            No vendors found.
          </div>
        ) : (
          <table className="orders-table">
            <thead>
              <tr>
                <th>Vendor</th>
                <th>Shop</th>
                <th>Email</th>
                <th>GST</th>
                <th>Rating</th>
                <th>Status</th>
                <th width="180">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {currentVendors.map(
                (vendor) => (
                  <tr
                    key={vendor._id}
                  >
                    <td>
                      <div className="customer-info">
                        <strong>
                          {vendor.name}
                        </strong>

                        <br />

                        <small>
                          {vendor.role}
                        </small>
                      </div>
                    </td>

                    <td>
                      {vendor.shopName ||
                        "-"}
                    </td>

                    <td>
                      {vendor.email}
                    </td>

                    <td>
                      {vendor.gstNumber ||
                        "-"}
                    </td>

                    <td>
                      ⭐{" "}
                      {(
                        vendor.shopRating ||
                        0
                      ).toFixed(1)}
                    </td>

                    <td>
                      <span
                        className={getStatusClass(
                          vendor.vendorStatus
                        )}
                      >
                        {
                          vendor.vendorStatus
                        }
                      </span>
                    </td>

                    <td>
                      {vendor.vendorStatus ===
                      "Pending" ? (
                        <>
                          <button
                            className="edit-btn"
                            onClick={() =>
                              onApprove(
                                vendor._id
                              )
                            }
                          >
                            Approve
                          </button>

                          <button
                            className="delete-btn"
                            onClick={() =>
                              onReject(
                                vendor._id
                              )
                            }
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            disabled={page === 1}
            onClick={() =>
              setPage(
                (prev) => prev - 1
              )
            }
          >
            Previous
          </button>

          <span className="pagination-info">
            Page {page} of{" "}
            {totalPages}
          </span>

          <button
            className="pagination-btn"
            disabled={
              page === totalPages
            }
            onClick={() =>
              setPage(
                (prev) => prev + 1
              )
            }
          >
            Next
          </button>
        </div>
      )}
    </>
  );
}