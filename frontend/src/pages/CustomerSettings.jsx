import { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import toast from "react-hot-toast";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import "../styles/admin.css";
import "../styles/account.css";

export default function CustomerSettings() {

    const { setUser } = useAuth();

    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState("");

    const [profile, setProfile] = useState({
        name: "",
        email: "",
        phone: "",
        profileImage: "",
    });

    const [passwords, setPasswords] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {

        try {

            const { data } = await api.get("/users/profile");

            setProfile({
                name: data.data.name || "",
                email: data.data.email || "",
                phone: data.data.phone || "",
                profileImage: data.data.profileImage || "",
            });

        } catch {

            toast.error("Unable to load profile");

        }

    };

    const handleImage = (e) => {

        const file = e.target.files[0];

        if (!file) return;

        setImage(file);

        setPreview(URL.createObjectURL(file));

    };

    const saveProfile = async (e) => {

        e.preventDefault();

        try {

            const formData = new FormData();

            formData.append("name", profile.name);
            formData.append("phone", profile.phone);

            if (image) {
                formData.append("profileImage", image);
            }

            const { data } = await api.put(
                "/users/profile",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            const updatedUser = {
                ...JSON.parse(localStorage.getItem("user")),
                ...data.data,
            };

            localStorage.setItem(
                "user",
                JSON.stringify(updatedUser)
            );

            setUser(updatedUser);

            toast.success("Profile updated successfully");

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Unable to update profile"
            );

        }

    };

    const changePassword = async (e) => {

        e.preventDefault();

        if (
            passwords.newPassword !==
            passwords.confirmPassword
        ) {
            toast.error("Passwords do not match");
            return;
        }

        try {

            await api.put(
                "/users/change-password",
                {
                    currentPassword:
                        passwords.currentPassword,
                    newPassword:
                        passwords.newPassword,
                }
            );

            toast.success(
                "Password changed successfully"
            );

            setPasswords({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Unable to change password"
            );

        }

    };
return (
    <div className="admin-layout">

        <div className="admin-content">

            <div className="dashboard-header">

                <div>

                    <h1>
                        Account Settings ⚙️
                    </h1>

                    <p>
                        Update your profile information and account security.
                    </p>

                </div>

            </div>

            <div
                className="dashboard-extra"
                style={{
                    gridTemplateColumns: "1fr 1fr",
                }}
            >

                <div className="dashboard-widget">

                    <div className="widget-header">
                        <h3>Profile Information</h3>
                    </div>

                    <div className="profile-upload">

                        <div className="profile-avatar">

                            {preview ? (

                                <img
                                    src={preview}
                                    alt="Profile"
                                />

                            ) : profile.profileImage ? (

                                <img
                                    src={`http://localhost:5000${profile.profileImage}`}
                                    alt="Profile"
                                />

                            ) : (

                                <FaUserCircle />

                            )}

                        </div>

                        <label className="upload-btn">

                            📷 Upload New Photo

                            <input
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={handleImage}
                            />

                        </label>

                    </div>

                    <form
                        className="admin-form"
                        onSubmit={saveProfile}
                    >

                        <div className="admin-group">

                            <label>Name</label>

                            <input
                                className="admin-input"
                                type="text"
                                value={profile.name}
                                onChange={(e) =>
                                    setProfile({
                                        ...profile,
                                        name: e.target.value,
                                    })
                                }
                            />

                        </div>

                        <div className="admin-group">

                            <label>Email</label>

                            <input
                                className="admin-input"
                                type="email"
                                value={profile.email}
                                disabled
                            />

                        </div>

                        <div className="admin-group">

                            <label>Phone</label>

                            <input
                                className="admin-input"
                                type="text"
                                value={profile.phone}
                                onChange={(e) =>
                                    setProfile({
                                        ...profile,
                                        phone: e.target.value,
                                    })
                                }
                            />

                        </div>

                        <button
                            className="admin-btn"
                            type="submit"
                        >
                            💾 Save Changes
                        </button>

                    </form>

                </div>

                <div className="dashboard-widget">

                    <div className="widget-header">
                        <h3>Security</h3>
                    </div>

                    <form
                        className="admin-form"
                        onSubmit={changePassword}
                    >

                        <div className="admin-group">

                            <label>
                                Current Password
                            </label>

                            <input
                                className="admin-input"
                                type="password"
                                value={passwords.currentPassword}
                                onChange={(e) =>
                                    setPasswords({
                                        ...passwords,
                                        currentPassword:
                                            e.target.value,
                                    })
                                }
                            />

                        </div>

                        <div className="admin-group">

                            <label>
                                New Password
                            </label>

                            <input
                                className="admin-input"
                                type="password"
                                value={passwords.newPassword}
                                onChange={(e) =>
                                    setPasswords({
                                        ...passwords,
                                        newPassword:
                                            e.target.value,
                                    })
                                }
                            />

                        </div>

                        <div className="admin-group">

                            <label>
                                Confirm Password
                            </label>

                            <input
                                className="admin-input"
                                type="password"
                                value={passwords.confirmPassword}
                                onChange={(e) =>
                                    setPasswords({
                                        ...passwords,
                                        confirmPassword:
                                            e.target.value,
                                    })
                                }
                            />

                        </div>

                        <button
                            className="admin-btn"
                            type="submit"
                        >
                            🔒 Change Password
                        </button>

                    </form>

                </div>

            </div>

        </div>

    </div>
);
}