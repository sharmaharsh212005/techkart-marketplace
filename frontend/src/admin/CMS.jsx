import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";

import AdminSidebar from "../components/AdminSidebar";
import AdminTopbar from "../components/AdminTopbar";

import "../styles/admin.css";

const initialForm = {
  title: "",
  slug: "",
  content: "",
  isPublished: true,
};

export default function CMS() {
  const [pages, setPages] = useState([]);
  const [editing, setEditing] = useState(null);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [form, setForm] =
    useState(initialForm);

  useEffect(() => {
    loadPages();
  }, []);

  const loadPages = async () => {
    try {
      const { data } =
        await api.get("/cms");

      setPages(data.data || []);
    } catch {
      toast.error(
        "Unable to load pages"
      );
    }
  };

  const filteredPages =
    useMemo(() => {
      const keyword =
        search.toLowerCase();

      return pages.filter(
        (page) =>
          page.title
            ?.toLowerCase()
            .includes(keyword) ||
          page.slug
            ?.toLowerCase()
            .includes(keyword)
      );
    }, [pages, search]);

  const changeHandler = (e) => {
    const {
      name,
      value,
      checked,
      type,
    } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  const submitHandler =
    async (e) => {
      e.preventDefault();

      try {
        setLoading(true);

        if (editing) {
          await api.put(
            `/cms/${editing}`,
            form
          );

          toast.success(
            "Page Updated"
          );
        } else {
          await api.post(
            "/cms",
            form
          );

          toast.success(
            "Page Created"
          );
        }

        setEditing(null);

        setForm(initialForm);

        loadPages();
      } catch (err) {
        toast.error(
          err.response?.data
            ?.message ||
            "Unable to save page"
        );
      } finally {
        setLoading(false);
      }
    };

  const editPage = (page) => {
    setEditing(page._id);

    setForm({
      title: page.title,
      slug: page.slug,
      content: page.content,
      isPublished:
        page.isPublished,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const deletePage =
    async (id) => {
      if (
        !window.confirm(
          "Delete this page?"
        )
      )
        return;

      try {
        await api.delete(
          `/cms/${id}`
        );

        toast.success(
          "Page Deleted"
        );

        loadPages();
      } catch {
        toast.error(
          "Unable to delete page"
        );
      }
    };
  return (
    <div className="admin-layout">
      <AdminSidebar />

      <div className="admin-content">
        <AdminTopbar />

        <div className="dashboard-header">
          <div>
            <h1>CMS Management 📄</h1>

            <p>
              Create, edit and publish website
              pages for your marketplace.
            </p>
          </div>

          <div className="dashboard-date">
            {new Date().toLocaleDateString(
              "en-IN",
              {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              }
            )}
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-stat-card">
            <div className="dashboard-stat-icon">
              📄
            </div>

            <div className="dashboard-stat-content">
              <span>Total Pages</span>
              <h2>{pages.length}</h2>
              <small>Website Pages</small>
            </div>
          </div>

          <div className="dashboard-stat-card">
            <div className="dashboard-stat-icon">
              ✅
            </div>

            <div className="dashboard-stat-content">
              <span>Published</span>

              <h2>
                {
                  pages.filter(
                    (p) => p.isPublished
                  ).length
                }
              </h2>

              <small>Live Pages</small>
            </div>
          </div>

          <div className="dashboard-stat-card">
            <div className="dashboard-stat-icon">
              📝
            </div>

            <div className="dashboard-stat-content">
              <span>Drafts</span>

              <h2>
                {
                  pages.filter(
                    (p) => !p.isPublished
                  ).length
                }
              </h2>

              <small>Not Published</small>
            </div>
          </div>

          <div className="dashboard-stat-card">
            <div className="dashboard-stat-icon">
              ✍️
            </div>

            <div className="dashboard-stat-content">
              <span>Mode</span>

              <h2>
                {editing
                  ? "Edit"
                  : "Create"}
              </h2>

              <small>
                Current Action
              </small>
            </div>
          </div>
        </div>

        <div className="admin-card">
          <h3
            style={{
              marginBottom: 20,
            }}
          >
            {editing
              ? "Edit Page"
              : "Create New Page"}
          </h3>

          <form
            className="admin-form"
            onSubmit={submitHandler}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "1fr 1fr",
                gap: 20,
              }}
            >
              <div className="admin-group">
                <label>
                  Page Title
                </label>

                <input
                  className="admin-input"
                  name="title"
                  value={form.title}
                  onChange={changeHandler}
                  required
                />
              </div>

              <div className="admin-group">
                <label>Slug</label>

                <input
                  className="admin-input"
                  name="slug"
                  value={form.slug}
                  onChange={changeHandler}
                  required
                />
              </div>
            </div>

            <div className="admin-group">
              <label>
                Page Content
              </label>

              <textarea
                rows="8"
                className="admin-textarea"
                name="content"
                value={form.content}
                onChange={changeHandler}
              />
            </div>

            <label className="checkbox">
              <input
                type="checkbox"
                name="isPublished"
                checked={
                  form.isPublished
                }
                onChange={
                  changeHandler
                }
              />

              Publish Immediately
            </label>

            <div
              style={{
                display: "flex",
                justifyContent:
                  "flex-end",
                marginTop: 25,
                gap: 10,
              }}
            >
              {editing && (
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => {
                    setEditing(
                      null
                    );
                    setForm(
                      initialForm
                    );
                  }}
                >
                  Cancel
                </button>
              )}

              <button
                className="primary-btn"
                disabled={loading}
              >
                {loading
                  ? "Saving..."
                  : editing
                  ? "Update Page"
                  : "Create Page"}
              </button>
            </div>
          </form>
        </div>

        <div className="admin-card">
          <div className="table-toolbar">
            <input
              type="text"
              className="table-search"
              placeholder="Search pages..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
            />
          </div>

          <table className="orders-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Slug</th>
                <th>Status</th>
                <th width="180">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredPages.length ===
              0 ? (
                <tr>
                  <td
                    colSpan="4"
                    style={{
                      textAlign:
                        "center",
                    }}
                  >
                    No Pages Found
                  </td>
                </tr>
              ) : (
                filteredPages.map(
                  (page) => (
                    <tr
                      key={page._id}
                    >
                      <td>
                        <strong>
                          {
                            page.title
                          }
                        </strong>
                      </td>

                      <td>
                        /{page.slug}
                      </td>

                      <td>
                        <span
                          className={`status-badge ${
                            page.isPublished
                              ? "status-approved"
                              : "status-pending"
                          }`}
                        >
                          {page.isPublished
                            ? "Published"
                            : "Draft"}
                        </span>
                      </td>

                      <td className="action-buttons">
                        <button
                          className="edit-btn"
                          onClick={() =>
                            editPage(
                              page
                            )
                          }
                          type="button"
                        >
                          Edit
                        </button>

                        <button
                          className="delete-btn"
                          onClick={() =>
                            deletePage(
                              page._id
                            )
                          }
                          type="button"
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
  );
}