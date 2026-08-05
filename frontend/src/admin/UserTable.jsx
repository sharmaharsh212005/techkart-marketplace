import { useMemo, useState } from "react";

export default function UserTable({
  users,
  onDelete,
  onRoleChange
}) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const pageSize = 8;

  const filtered = useMemo(() => {
    return users.filter((user) =>
      `${user.name} ${user.email}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [users, search]);

  const totalPages = Math.ceil(filtered.length / pageSize);

  const current = useMemo(() => {
    const start = (page - 1) * pageSize;

    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  return (
    <>
      <div className="admin-search">

          <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e)=>setSearch(e.target.value)}
          />

      </div>

      <table className="orders-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Joined</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {current.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>

              <td>{user.email}</td>

              <td>
                <select
                  className="role-select"
                  value={user.role}
                  onChange={(e) =>
                    onRoleChange(user._id, e.target.value)
                  }
                >
                  <option value="admin">Admin</option>
                  <option value="vendor">Vendor</option>
                  <option value="customer">Customer</option>
                </select>
              </td>

              <td>
                {new Date(user.createdAt).toLocaleDateString()}
              </td>

              <td>
                <button
                  className="delete-btn"
                  onClick={() => onDelete(user._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </button>

          <span>
            {page} / {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </>
  );
}