import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";

const initialForm = {
  name: "",
  description: "",
  image: "",
  isActive: true
};

export default function CategoryModal({
  open,
  editingCategory,
  refreshCategories,
  onClose
}) {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!editingCategory) {
      setForm(initialForm);
      return;
    }

    setForm({
      name: editingCategory.name,
      description: editingCategory.description || "",
      image: editingCategory.image || "",
      isActive: editingCategory.isActive
    });
  }, [editingCategory]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value
    }));
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error("Category name required");
      return;
    }

    try {
      setLoading(true);

      if (editingCategory) {
        await api.put(
          `/categories/${editingCategory._id}`,
          form
        );

        toast.success("Category Updated");
      } else {
        await api.post(
          "/categories",
          form
        );

        toast.success("Category Created");
      }

      refreshCategories();
      onClose();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        "Operation Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">

      <div className="product-modal">

        <h2>
          {editingCategory
            ? "Edit Category"
            : "Add Category"}
        </h2>

        <form onSubmit={submit}>

          <input
            className="form-control"
            name="name"
            placeholder="Category Name"
            value={form.name}
            onChange={handleChange}
          />

          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
          />

          <input
            name="image"
            placeholder="Image URL"
            value={form.image}
            onChange={handleChange}
          />

          <label className="checkbox">

            <input
              type="checkbox"
              name="isActive"
              checked={form.isActive}
              onChange={handleChange}
            />

            Active Category

          </label>

          <div className="modal-buttons">

            <button
              type="button"
              className="cancel-btn"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              className="primary-btn"
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : editingCategory
                ? "Update"
                : "Create"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}