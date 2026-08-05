import { useMemo, useState } from "react";

export default function CategoryTable({
  categories,
  onEdit,
  onDelete
}) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const pageSize = 8;

  const filteredCategories = useMemo(() => {
    return categories.filter((item) =>
      item.name
        ?.toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [categories, search]);

  const totalPages = Math.ceil(
    filteredCategories.length / pageSize
  );

  const currentCategories = useMemo(() => {
    const start = (page - 1) * pageSize;

    return filteredCategories.slice(
      start,
      start + pageSize
    );
  }, [filteredCategories, page]);

  return (
    <>
      <div className="admin-search">

          <input
              type="text"
              placeholder="Search categories..."
              value={search}
              onChange={(e)=>setSearch(e.target.value)}
          />

      </div>

      {currentCategories.length === 0 ? (
        <div className="empty">
          No Categories Found
        </div>
      ) : (
        <table className="orders-table">

          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Status</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {currentCategories.map((category) => (
              <tr key={category._id}>

                <td>{category.name}</td>

                <td>
                  {category.description || "-"}
                </td>

                <td>
                  {category.isActive
                    ? "Active"
                    : "Inactive"}
                </td>

                <td>
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="admin-product-image"
                    />
                  ) : (
                    "-"
                  )}
                </td>

                <td>

                  <button
                    className="edit-btn"
                    onClick={() =>
                      onEdit(category)
                    }
                  >
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() =>
                      onDelete(category._id)
                    }
                  >
                    Delete
                  </button>

                </td>

              </tr>
            ))}

          </tbody>

        </table>
      )}

      {totalPages > 1 && (
        <div className="pagination">

          <button
            disabled={page === 1}
            onClick={() =>
              setPage(page - 1)
            }
          >
            Previous
          </button>

          <span>
            {page} / {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() =>
              setPage(page + 1)
            }
          >
            Next
          </button>

        </div>
      )}
    </>
  );
}