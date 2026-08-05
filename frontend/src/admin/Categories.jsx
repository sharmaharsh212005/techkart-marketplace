import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";
import AdminSidebar from "../components/AdminSidebar";
import AdminTopbar from "../components/AdminTopbar";
import CategoryModal from "./CategoryModal";
import CategoryTable from "./CategoryTable";
import "../styles/admin.css";
import "../styles/adminCategories.css";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);

      const res = await api.get("/categories");

      setCategories(res.data.data || []);
    } catch (err) {
      console.log(err);
      toast.error("Unable to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id) => {
    if (!window.confirm("Delete this category?")) return;

    try {
      await api.delete(`/categories/${id}`);

      toast.success("Category deleted successfully");

      fetchCategories();
    } catch (err) {
      console.log(err);
      toast.error("Unable to delete category");
    }
  };

  return (
    <div className="admin-layout">

      <AdminSidebar />

      <div className="admin-content">

        <AdminTopbar />

        <div className="dashboard-header">

            <div>

                <h1>Categories</h1>

                <p>
                    Organize and manage all marketplace product categories.
                </p>

            </div>

            <button
                className="add-category-btn"
                onClick={() => {
                    setEditingCategory(null);
                    setShowModal(true);
                }}
            >
                + Add Category
            </button>

        </div>

        {loading ? (
          <div className="empty">
            Loading...
          </div>
        ) : (
          <CategoryTable
            categories={categories}
            onEdit={(category) => {
              setEditingCategory(category);
              setShowModal(true);
            }}
            onDelete={deleteCategory}
          />
        )}

        <CategoryModal
          open={showModal}
          editingCategory={editingCategory}
          refreshCategories={fetchCategories}
          onClose={() => {
            setEditingCategory(null);
            setShowModal(false);
          }}
        />

      </div>

    </div>
  );
}