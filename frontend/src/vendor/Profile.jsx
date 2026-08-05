import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";
import VendorSidebar from "./VendorSidebar";
import VendorTopbar from "./VendorTopbar";

export default function VendorProfile() {

    const [form, setForm] = useState({
        shopName: "",
        shopDescription: "",
        shopAddress: "",
        gstNumber: "",
        shopLogo: "",
        shopBanner: "",
        shopEmail: "",
        shopPhone: ""
    });

    const [saving, setSaving] = useState(false);

    useEffect(() => {

        loadProfile();

    }, []);

    const loadProfile = async () => {

        try {

            const { data } = await api.get("/vendor/profile");

            setForm({
                shopName: data.data.shopName || "",
                shopDescription: data.data.shopDescription || "",
                shopAddress: data.data.shopAddress || "",
                gstNumber: data.data.gstNumber || "",
                shopLogo: data.data.shopLogo || "",
                shopBanner: data.data.shopBanner || "",
                shopEmail: data.data.shopEmail || "",
                shopPhone: data.data.shopPhone || ""
            });

        } catch {

            toast.error("Unable to load profile");

        }

    };

    const handleLogoUpload = async (e) => {

        const file = e.target.files[0];

        if (!file) return;

        try {

            const formData = new FormData();

            formData.append("image", file);

            const { data } = await api.post(
                "/upload",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            const imageUrl =
                data.image.startsWith("/")
                    ? `http://localhost:5000${data.image}`
                    : data.image;

            setForm(prev => ({
                ...prev,
                shopLogo: imageUrl
            }));

            toast.success("Logo uploaded");

        } catch {

            toast.error("Logo upload failed");

        }

    };

    const submit = async (e) => {

        e.preventDefault();

        try {

            setSaving(true);

            await api.put(
                "/vendor/profile",
                form
            );

            toast.success("Profile Updated");

        } catch {

            toast.error("Update failed");

        } finally {

            setSaving(false);

        }

    };

    return (

        <div className="admin-layout">

            <VendorSidebar />

            <div className="admin-content">

                <VendorTopbar />

                <div className="admin-header">

                    <h1>
                        Shop Profile
                    </h1>

                </div>

                <form
                    onSubmit={submit}
                >

                    <div
                        className="admin-card"
                        style={{
                            padding: "34px",
                            marginBottom: "30px",
                            display: "flex",
                            alignItems: "center",
                            gap: "28px"
                        }}
                    >

                        <div
                            style={{
                                position: "relative",
                                width: 150,
                                height: 150
                            }}
                        >

                            <img
                                src={
                                    form.shopLogo ||
                                    "https://placehold.co/150x150"
                                }
                                alt=""
                                style={{
                                    width: "150px",
                                    height: "150px",
                                    borderRadius: "22px",
                                    objectFit: "cover",
                                    background: "#ffffff"
                                }}
                            />

                            <label
                                htmlFor="shopLogoUpload"
                                style={{
                                    position: "absolute",
                                    right: "-6px",
                                    bottom: "-6px",
                                    width: "42px",
                                    height: "42px",
                                    borderRadius: "50%",
                                    background: "#3b82f6",
                                    color: "#ffffff",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    cursor: "pointer",
                                    fontSize: "18px",
                                    fontWeight: "700",
                                    boxShadow: "0 10px 25px rgba(0,0,0,.35)"
                                }}
                            >
                                ✎
                            </label>

                            <input
                                id="shopLogoUpload"
                                type="file"
                                accept="image/*"
                                style={{
                                    display: "none"
                                }}
                                onChange={handleLogoUpload}
                            />

                        </div>

                        <div>

                            <h2
                                style={{
                                    fontSize: "56px",
                                    marginBottom: "10px"
                                }}
                            >
                                {form.shopName || "Your Shop"}
                            </h2>

                            <p
                                style={{
                                    color: "#9fb2d1",
                                    fontSize: "18px",
                                    maxWidth: "900px",
                                    lineHeight: 1.8
                                }}
                            >
                                {
                                    form.shopDescription ||
                                    "Add your shop description."
                                }
                            </p>

                        </div>

                    </div>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: "28px"
                        }}
                    >

                        <div
                            className="admin-card"
                            style={{
                                padding: "28px"
                            }}
                        >

                            <h3
                                style={{
                                    marginBottom: "24px"
                                }}
                            >
                                Shop Information
                            </h3>

                            <div
                                style={{
                                    display: "grid",
                                    gap: "18px"
                                }}
                            >

                                <input
                                    className="form-control"
                                    placeholder="Shop Name"
                                    value={form.shopName}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            shopName: e.target.value
                                        })
                                    }
                                />

                                <textarea
                                    className="form-control"
                                    rows={6}
                                    placeholder="Shop Description"
                                    value={form.shopDescription}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            shopDescription: e.target.value
                                        })
                                    }
                                />

                                <input
                                    className="form-control"
                                    placeholder="GST Number"
                                    value={form.gstNumber}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            gstNumber: e.target.value
                                        })
                                    }
                                />

                                <input
                                    className="form-control"
                                    placeholder="Shop Email"
                                    value={form.shopEmail}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            shopEmail: e.target.value
                                        })
                                    }
                                />

                                <input
                                    className="form-control"
                                    placeholder="Shop Phone"
                                    value={form.shopPhone}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            shopPhone: e.target.value
                                        })
                                    }
                                />

                            </div>

                        </div>

                        <div
                            className="admin-card"
                            style={{
                                padding: "28px"
                            }}
                        >

                            <h3
                                style={{
                                    marginBottom: "24px"
                                }}
                            >
                                Store Details
                            </h3>

                            <div
                                style={{
                                    display: "grid",
                                    gap: "18px"
                                }}
                            >

                                <input
                                    className="form-control"
                                    placeholder="Shop Address"
                                    value={form.shopAddress}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            shopAddress: e.target.value
                                        })
                                    }
                                />

                                <input
                                    className="form-control"
                                    placeholder="Shop Banner URL"
                                    value={form.shopBanner}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            shopBanner: e.target.value
                                        })
                                    }
                                />

                                {
                                    form.shopLogo && (

                                        <img
                                            src={form.shopLogo}
                                            alt=""
                                            style={{
                                                width: "100%",
                                                height: "240px",
                                                objectFit: "contain",
                                                background: "#ffffff",
                                                borderRadius: "18px",
                                                padding: "12px"
                                            }}
                                        />

                                    )
                                }

                                {
                                    form.shopBanner && (

                                        <img
                                            src={form.shopBanner}
                                            alt=""
                                            style={{
                                                width: "100%",
                                                height: "180px",
                                                objectFit: "cover",
                                                borderRadius: "18px"
                                            }}
                                        />

                                    )
                                }

                            </div>

                        </div>

                    </div>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            marginTop: "32px"
                        }}
                    >

                        <button
                            type="submit"
                            className="primary-btn"
                            disabled={saving}
                            style={{
                                width: "220px",
                                height: "52px",
                                borderRadius: "12px",
                                fontSize: "16px",
                                fontWeight: "600"
                            }}
                        >
                            {
                                saving
                                    ? "Saving..."
                                    : "Save Profile"
                            }
                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}