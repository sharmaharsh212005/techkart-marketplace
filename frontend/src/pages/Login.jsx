import { useState } from "react";
import {
    Link,
    useNavigate,
    useLocation
} from "react-router-dom";

import toast from "react-hot-toast";

import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

import "../styles/auth.css";

export default function Login() {

    const navigate = useNavigate();
    const location = useLocation();

    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);

    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);

            const { data } = await api.post(
                "/auth/login",
                formData
            );

            login({
                token: data.token,
                user: data.data
            });

            toast.success("Login Successful");

            const redirectPath =
                location.state?.from?.pathname;

            if (redirectPath) {

                navigate(
                    redirectPath,
                    {
                        replace: true
                    }
                );

                return;

            }

            switch (data.data.role) {

                case "admin":

                    navigate(
                        "/admin",
                        {
                            replace: true
                        }
                    );

                    break;

                case "vendor":

                    navigate(
                        "/vendor",
                        {
                            replace: true
                        }
                    );

                    break;

                default:

                    navigate(
                        "/",
                        {
                            replace: true
                        }
                    );

            }

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Login Failed"
            );

        } finally {

            setLoading(false);

        }

    };
    return (

        <div className="auth-container">

            <div className="auth-card">

                <h1
                    style={{
                        color: "#ffffff",
                        textAlign: "center",
                        marginBottom: "10px"
                    }}
                >
                    Welcome Back
                </h1>

                <p
                    style={{
                        color: "#b8c5d6",
                        textAlign: "center",
                        marginBottom: "25px"
                    }}
                >
                    Login to continue shopping.
                </p>

                <form onSubmit={handleSubmit}>

                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />

                    <div
                        style={{
                            position: "relative",
                            width: "100%"
                        }}
                    >

                        <input
                            type={
                                showPassword
                                    ? "text"
                                    : "password"
                            }
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            style={{
                                width: "100%",
                                paddingRight: "90px"
                            }}
                        />

                        <button
                            type="button"
                            onClick={() =>
                                setShowPassword(
                                    !showPassword
                                )
                            }
                            style={{
                                position: "absolute",
                                right: "12px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                background: "transparent",
                                border: "none",
                                color: "#60a5fa",
                                cursor: "pointer",
                                fontWeight: "600"
                            }}
                        >
                            {
                                showPassword
                                    ? "Hide"
                                    : "Show"
                            }
                        </button>

                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {
                            loading
                                ? "Logging In..."
                                : "Login"
                        }
                    </button>

                </form>

                <p
                    style={{
                        marginTop: "20px",
                        textAlign: "center",
                        color: "#b8c5d6"
                    }}
                >
                    Don't have an account?{" "}

                    <Link
                        to="/register"
                        style={{
                            color: "#60a5fa",
                            textDecoration: "none",
                            fontWeight: "600"
                        }}
                    >
                        Register
                    </Link>

                </p>

            </div>

        </div>

    );

}