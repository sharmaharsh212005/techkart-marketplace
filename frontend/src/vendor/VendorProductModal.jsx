import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";

const initialState = {
    name: "",
    description: "",
    category: "",
    brand: "",
    price: "",
    discountPrice: "",
    stock: "",
    featured: false,
    image: null,
    preview: ""
};

export default function VendorProductModal({
    open,
    onClose,
    editingProduct,
    categories,
    refreshProducts
}) {

    const [form, setForm] = useState(initialState);
    const [loading, setLoading] = useState(false);

    useEffect(() => {

        if (!editingProduct) {

            setForm(initialState);

            return;

        }

        setForm({
            name: editingProduct.name || "",
            description: editingProduct.description || "",
            category: editingProduct.category?._id || "",
            brand: editingProduct.brand || "",
            price: editingProduct.price || "",
            discountPrice: editingProduct.discountPrice || "",
            stock: editingProduct.stock || "",
            featured: editingProduct.featured || false,
            image: null,
            preview:
                editingProduct.images?.length
                    ? `http://localhost:5000${editingProduct.images[0]}`
                    : ""
        });

    }, [editingProduct]);

    if (!open) return null;

    const handleChange = (e) => {

        const {
            name,
            value,
            checked,
            type
        } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]:
                type === "checkbox"
                    ? checked
                    : value
        }));

    };

    const handleImage = (e) => {

        const file = e.target.files[0];

        if (!file) return;

        setForm((prev) => ({
            ...prev,
            image: file,
            preview: URL.createObjectURL(file)
        }));

    };

    const uploadImage = async () => {

        if (!form.image) return null;

        const formData = new FormData();

        formData.append(
            "image",
            form.image
        );

        const { data } =
            await api.post(
                "/upload",
                formData,
                {
                    headers: {
                        "Content-Type":
                            "multipart/form-data"
                    }
                }
            );

        return data.image;

    };

    const submit = async (e) => {

        e.preventDefault();

        if (
            !form.name ||
            !form.description ||
            !form.category ||
            !form.price
        ) {

            toast.error(
                "Please fill all required fields."
            );

            return;

        }

        try {

            setLoading(true);

            let uploadedImage = null;

            if (form.image) {

                uploadedImage =
                    await uploadImage();

            }

            const payload = {

                name: form.name,

                description: form.description,

                category: form.category,

                brand: form.brand,

                price: Number(form.price),

                discountPrice:
                    Number(form.discountPrice || 0),

                stock:
                    Number(form.stock || 0),

                featured: form.featured,

                images:
                    uploadedImage
                        ? [uploadedImage]
                        : editingProduct?.images || []

            };
            if (editingProduct) {

                await api.put(
                    `/vendor/products/${editingProduct._id}`,
                    payload
                );

                toast.success(
                    "Product updated successfully"
                );

            } else {

                await api.post(
                    "/vendor/products",
                    payload
                );

                toast.success(
                    "Product created successfully"
                );

            }

            refreshProducts();

            onClose();

            setForm(initialState);

        } catch (err) {

            toast.error(
                err.response?.data?.message ||
                "Something went wrong"
            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="modal-backdrop">

            <div
                className="product-modal"
                style={{
                    width: "1100px",
                    maxWidth: "95vw",
                    maxHeight: "92vh",
                    overflowY: "auto",
                    borderRadius: "20px",
                    padding: "32px"
                }}
            >

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "28px"
                    }}
                >

                    <div>

                        <h2>

                            {
                                editingProduct
                                    ? "Edit Product"
                                    : "Add Product"
                            }

                        </h2>

                        <p
                            style={{
                                color: "#94a3b8",
                                marginTop: "6px"
                            }}
                        >
                            Fill in the product information below.
                        </p>

                    </div>

                </div>

                <form
                    onSubmit={submit}
                >

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 340px",
                            gap: "30px"
                        }}
                    >

                        <div
                            style={{
                                display: "grid",
                                gap: "18px"
                            }}
                        >

                            <input
                                className="form-control"
                                placeholder="Product Name"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                            />

                            <textarea
                                className="form-control"
                                rows={6}
                                placeholder="Description"
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                            />

                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "1fr 1fr",
                                    gap: "16px"
                                }}
                            >

                                <select
                                    className="form-control"
                                    name="category"
                                    value={form.category}
                                    onChange={handleChange}
                                >

                                    <option value="">
                                        Select Category
                                    </option>

                                    {
                                        categories.map((category) => (

                                            <option
                                                key={category._id}
                                                value={category._id}
                                            >
                                                {category.name}
                                            </option>

                                        ))
                                    }

                                </select>

                                <input
                                    className="form-control"
                                    placeholder="Brand"
                                    name="brand"
                                    value={form.brand}
                                    onChange={handleChange}
                                />

                            </div>

                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "1fr 1fr 1fr",
                                    gap: "16px"
                                }}
                            >

                                <input
                                    className="form-control"
                                    type="number"
                                    placeholder="Price"
                                    name="price"
                                    value={form.price}
                                    onChange={handleChange}
                                />

                                <input
                                    className="form-control"
                                    type="number"
                                    placeholder="Discount"
                                    name="discountPrice"
                                    value={form.discountPrice}
                                    onChange={handleChange}
                                />

                                <input
                                    className="form-control"
                                    type="number"
                                    placeholder="Stock"
                                    name="stock"
                                    value={form.stock}
                                    onChange={handleChange}
                                />

                            </div>
                            <label
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "12px",
                                    color: "#fff",
                                    fontWeight: 600
                                }}
                            >

                                <input
                                    type="checkbox"
                                    name="featured"
                                    checked={form.featured}
                                    onChange={handleChange}
                                />

                                Featured Product

                            </label>

                        </div>

                        <div>

                            <div
                                style={{
                                    border: "2px dashed rgba(255,255,255,.15)",
                                    borderRadius: "18px",
                                    padding: "24px",
                                    textAlign: "center",
                                    background: "#101827"
                                }}
                            >

                                <h3
                                    style={{
                                        marginBottom: "18px"
                                    }}
                                >
                                    Product Image
                                </h3>

                                {
                                    form.preview
                                        ? (
                                            <img
                                                src={form.preview}
                                                alt="Preview"
                                                style={{
                                                    width: "100%",
                                                    height: "260px",
                                                    objectFit: "contain",
                                                    background: "#ffffff",
                                                    borderRadius: "14px",
                                                    padding: "12px",
                                                    marginBottom: "18px"
                                                }}
                                            />
                                        )
                                        : (
                                            <div
                                                style={{
                                                    width: "100%",
                                                    height: "260px",
                                                    borderRadius: "14px",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    background: "#1e293b",
                                                    color: "#94a3b8",
                                                    marginBottom: "18px"
                                                }}
                                            >
                                                No Image Selected
                                            </div>
                                        )
                                }

                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImage}
                                    style={{
                                        width: "100%"
                                    }}
                                />

                            </div>

                        </div>

                    </div>

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: "16px",
                            marginTop: "32px"
                        }}
                    >

                        <button
                            type="button"
                            onClick={onClose}
                            className="cancel-btn"
                            style={{
                                minWidth: "160px"
                            }}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="primary-btn"
                            disabled={loading}
                            style={{
                                minWidth: "220px"
                            }}
                        >
                            {
                                loading
                                    ? "Saving..."
                                    : editingProduct
                                    ? "Update Product"
                                    : "Create Product"
                            }
                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}