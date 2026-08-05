import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";

import VendorSidebar from "./VendorSidebar";
import VendorTopbar from "./VendorTopbar";
import VendorProductModal from "./VendorProductModal";
import ProductTable from "../admin/ProductTable";

import "../styles/admin.css";
import "../styles/adminProducts.css";

export default function VendorProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/vendor/products");

      setProducts(data.data || []);
    } catch {
      toast.error("Unable to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await api.get("/categories");
      setCategories(data.data || []);
    } catch {
      toast.error("Unable to fetch categories");
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      await api.delete(`/products/${id}`);

      toast.success("Product deleted successfully");

      fetchProducts();
    } catch {
      toast.error("Unable to delete product");
    }
  };

  return (
    <div className="admin-layout">
      <VendorSidebar />

      <div className="admin-content">
        <VendorTopbar />

        <div className="admin-header">
          <h2>My Products</h2>

          <button
            className="primary-btn"
            onClick={() => {
              setEditingProduct(null);
              setShowModal(true);
            }}
          >
            + Add Product
          </button>
        </div>

        {loading ? (
          <div className="empty">Loading...</div>
        ) : (
          <ProductTable
            products={products}
            onEdit={(product) => {
              setEditingProduct(product);
              setShowModal(true);
            }}
            onDelete={deleteProduct}
            onApprove={() => {}}
            onReject={() => {}}
          />
        )}

        <VendorProductModal
          open={showModal}
          editingProduct={editingProduct}
          categories={categories}
          refreshProducts={fetchProducts}
          onClose={() => {
            setEditingProduct(null);
            setShowModal(false);
          }}
        />
      </div>
    </div>
  );
}