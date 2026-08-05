import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";

const initialState = {
  name: "",
  description: "",
  category: "",
  vendor: "",
  brand: "",
  price: "",
  discountPrice: "",
  stock: "",
  featured: false,
  image: null,
  preview: "",
};

export default function ProductModal({
  open,
  onClose,
  editingProduct,
  categories,
  vendors,
  refreshProducts,
}) {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    if (!editingProduct) {
      setForm(initialState);
      return;
    }

    setForm({
      name: editingProduct.name || "",
      description: editingProduct.description || "",
      category: editingProduct.category?._id || "",
      vendor: editingProduct.vendor?._id || "",
      brand: editingProduct.brand || "",
      price: editingProduct.price || "",
      discountPrice: editingProduct.discountPrice || "",
      stock: editingProduct.stock || "",
      featured: editingProduct.featured || false,
      image: null,
      preview:
        editingProduct.images?.length
          ? `http://localhost:5000${editingProduct.images[0]}`
          : "",
    });
  }, [editingProduct, open]);

  useEffect(() => {
    return () => {
      if (
        form.preview &&
        form.preview.startsWith("blob:")
      ) {
        URL.revokeObjectURL(form.preview);
      }
    };
  }, [form.preview]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  const handleImage = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB.");
      return;
    }

    if (
      form.preview &&
      form.preview.startsWith("blob:")
    ) {
      URL.revokeObjectURL(form.preview);
    }

    setForm((prev) => ({
      ...prev,
      image: file,
      preview: URL.createObjectURL(file),
    }));
  };

  const uploadImage = async () => {
    if (!form.image) return null;

    const fd = new FormData();

    fd.append("image", form.image);

    const { data } = await api.post(
      "/upload",
      fd,
      {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
      }
    );

    return data.image;
  };

  const submit = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (!form.name.trim())
      return toast.error(
        "Product name is required."
      );

    if (!form.description.trim())
      return toast.error(
        "Description is required."
      );

    if (!form.category)
      return toast.error(
        "Select a category."
      );

    if (!form.vendor)
      return toast.error(
        "Select a vendor."
      );

    if (!form.price)
      return toast.error(
        "Enter a valid price."
      );

    if (
      Number(form.discountPrice) >
      Number(form.price)
    ) {
      return toast.error(
        "Discount price cannot exceed selling price."
      );
    }

    try {
      setLoading(true);

      let uploadedImage = null;

      if (form.image) {
        uploadedImage =
          await uploadImage();
      }

      const payload = {
        name: form.name.trim(),
        description:
          form.description.trim(),
        category: form.category,
        vendor: form.vendor,
        brand: form.brand.trim(),
        price: Number(form.price),
        discountPrice: Number(
          form.discountPrice || 0
        ),
        stock: Number(form.stock || 0),
        featured: form.featured,
        images: uploadedImage
          ? [uploadedImage]
          : editingProduct?.images || [],
      };

      if (editingProduct) {
        await api.put(
          `/products/${editingProduct._id}`,
          payload
        );

        toast.success(
          "Product updated successfully"
        );
      } else {
        await api.post(
          "/products",
          payload
        );

        toast.success(
          "Product created successfully"
        );
      }

      refreshProducts();

      setForm(initialState);

      onClose();
    } catch (err) {
      console.error(err);

      toast.error(
        err.response?.data?.message ||
          "Failed to save product."
      );
    } finally {
      setLoading(false);
    }
  };
return (
  <div
    className="modal-backdrop"
    onClick={!loading ? onClose : undefined}
  >
    <div
      className="product-modal modern-product-modal"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}

      <div className="modal-header">
        <div>
          <h2>
            {editingProduct
              ? "Edit Product"
              : "Add Product"}
          </h2>

          <p>
            Fill in the product information below.
          </p>
        </div>

        <button
          type="button"
          className="close-modal"
          disabled={loading}
          onClick={onClose}
        >
          ✕
        </button>
      </div>

      <form
        className="product-form"
        onSubmit={submit}
      >
        <div className="product-layout">

          {/* LEFT */}

          <div className="product-left">

            {/* NAME */}

            <div className="form-group">

              <label>Product Name *</label>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="iPhone 16 Pro Max"
                disabled={loading}
              />

            </div>

            {/* DESCRIPTION */}

            <div className="form-group">

              <label>Description *</label>

              <textarea
                rows={5}
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Write product description..."
                disabled={loading}
              />

            </div>

            {/* CATEGORY + VENDOR */}

            <div className="two-column-grid">

              <div className="form-group">

                <label>Category *</label>

                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  disabled={loading}
                >

                  <option value="">
                    Select Category
                  </option>

                  {categories.map((cat) => (

                    <option
                      key={cat._id}
                      value={cat._id}
                    >
                      {cat.name}
                    </option>

                  ))}

                </select>

              </div>

              <div className="form-group">

                <label>Vendor *</label>

                <select
                  name="vendor"
                  value={form.vendor}
                  onChange={handleChange}
                  disabled={loading}
                >

                  <option value="">
                    Select Vendor
                  </option>

                  {vendors.map((vendor) => (

                    <option
                      key={vendor._id}
                      value={vendor._id}
                    >
                      {vendor.shopName || vendor.name}
                    </option>

                  ))}

                </select>

              </div>

            </div>

            {/* BRAND + PRICE */}

            <div className="two-column-grid">

              <div className="form-group">

                <label>Brand</label>

                <input
                  type="text"
                  name="brand"
                  value={form.brand}
                  onChange={handleChange}
                  placeholder="Apple"
                />

              </div>

              <div className="form-group">

                <label>Price *</label>

                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                />

              </div>

            </div>

            {/* DISCOUNT + STOCK */}

            <div className="two-column-grid">

              <div className="form-group">

                <label>Discount Price</label>

                <input
                  type="number"
                  name="discountPrice"
                  value={form.discountPrice}
                  onChange={handleChange}
                />

              </div>

              <div className="form-group">

                <label>Stock</label>

                <input
                  type="number"
                  name="stock"
                  value={form.stock}
                  onChange={handleChange}
                />

              </div>

            </div>

            {/* FEATURED */}

            <label className="featured-checkbox">

              <input
                type="checkbox"
                name="featured"
                checked={form.featured}
                onChange={handleChange}
              />

              Featured Product

            </label>

          </div>
          {/* RIGHT */}

          <div className="product-right">

            <div className="image-card">

              <h3>Product Image</h3>

              <div className="image-preview">

                {form.preview ? (

                  <img
                    src={form.preview}
                    alt="Preview"
                    className="preview-image"
                  />

                ) : (

                  <div className="image-placeholder">

                    <div className="image-icon">
                      📷
                    </div>

                    <p>No image selected</p>

                    <span>
                      Upload a product image
                    </span>

                  </div>

                )}

              </div>

              <label
                htmlFor="product-image"
                className="upload-button"
              >
                Choose Image
              </label>

              <input
                id="product-image"
                type="file"
                accept="image/*"
                hidden
                disabled={loading}
                onChange={handleImage}
              />

            </div>

          </div>

        </div>

        <div className="modal-footer">

          <button
            type="button"
            className="cancel-btn"
            disabled={loading}
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="primary-btn"
            disabled={loading}
          >
            {loading
              ? "Saving..."
              : editingProduct
              ? "Update Product"
              : "Create Product"}
          </button>

        </div>

      </form>

    </div>

  </div>
);
}