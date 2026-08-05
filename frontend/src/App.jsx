import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import VendorRoute from "./components/VendorRoute";
import Categories from "./components/Categories";
import OfferBanner from "./components/home/OfferBanner";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import VendorsPage from "./pages/Vendors";
import VendorStore from "./pages/VendorStore";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";
import MyOrders from "./pages/MyOrders";
import MyEnquiries from "./pages/MyEnquiries";
import OrderDetails from "./pages/OrderDetails";
import NotFound from "./pages/NotFound";
import CMSPage from "./pages/CMSPage";
import AdminReviews from "./pages/AdminReviews";
import MyReviews from "./pages/MyReviews";
import Account from "./pages/Account";
import CustomerSettings from "./pages/CustomerSettings";


import Dashboard from "./admin/Dashboard";
import AdminProducts from "./admin/Products";
import AdminCategories from "./admin/Categories";
import AdminOrders from "./admin/Orders";
import Users from "./admin/Users";
import Vendors from "./admin/Vendors";
import AdminEnquiries from "./admin/Enquiries";
import Coupons from "./admin/Coupons";
import CMS from "./admin/CMS";
import Settings from "./admin/Settings";
import Reports from "./admin/Reports";
import Notifications from "./admin/Notifications";
import Activity from "./admin/Activity";
import Questions from "./admin/Questions";

import VendorDashboard from "./vendor/Dashboard";
import VendorProducts from "./vendor/Products";
import VendorOrders from "./vendor/Orders";
import VendorQuestions from "./vendor/Questions";
import VendorEnquiries from "./vendor/Enquiries";
import VendorProfile from "./vendor/Profile";
import VendorReviews from "./vendor/Reviews";

import "./App.css";

function App() {
    const location = useLocation();

    const isDashboardRoute =
        location.pathname.startsWith("/admin") ||
        location.pathname.startsWith("/vendor");

    const isFullWidthPage =
        location.pathname.startsWith("/products/");

    return (
        <>
            {!isDashboardRoute && <Navbar />}

            <main
                className={
                    isDashboardRoute
                        ? ""
                        : isFullWidthPage
                        ? ""
                        : "container"
                }
            >
                <Routes>

                    {/* ================= PUBLIC ================= */}

                    <Route path="/" element={<Home />} />

                    <Route
                        path="/login"
                        element={<Login />}
                    />

                    <Route
                        path="/register"
                        element={<Register />}
                    />

                    <Route
                        path="/products"
                        element={<Products />}
                    />

                    <Route
                        path="/products/:id"
                        element={<ProductDetails />}
                    />

                    <Route
                        path="/vendors"
                        element={<VendorsPage />}
                    />

                    <Route
                        path="/vendors/:id"
                        element={<VendorStore />}
                    />

                    <Route
                        path="/cart"
                        element={
                            <ProtectedRoute>
                                <Cart />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/wishlist"
                        element={
                            <ProtectedRoute>
                                <Wishlist />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/checkout"
                        element={
                            <ProtectedRoute>
                                <Checkout />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/orders"
                        element={
                            <ProtectedRoute>
                                <MyOrders />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/orders/:id"
                        element={
                            <ProtectedRoute>
                                <OrderDetails />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/my-enquiries"
                        element={
                            <ProtectedRoute>
                                <MyEnquiries />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/reviews"
                        element={
                            <ProtectedRoute>
                                <MyReviews />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/account"
                        element={
                            <ProtectedRoute>
                                <Account />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/:slug"
                        element={<CMSPage />}
                    />

                    <Route
                        path="/categories"
                        element={
                            <div className="container" style={{ padding: "40px 0" }}>
                                <Categories />
                            </div>
                        }
                    />

                    <Route
                        path="/offers"
                        element={
                            <div className="container" style={{ padding: "40px 0" }}>
                                <OfferBanner />
                            </div>
                        }
                    />

                    {/* ================= ADMIN ================= */}

                    <Route
                        path="/admin"
                        element={
                            <AdminRoute>
                                <Dashboard />
                            </AdminRoute>
                        }
                    />

                    <Route
                        path="/admin/products"
                        element={
                            <AdminRoute>
                                <AdminProducts />
                            </AdminRoute>
                        }
                    />

                    <Route
                        path="/admin/categories"
                        element={
                            <AdminRoute>
                                <AdminCategories />
                            </AdminRoute>
                        }
                    />

                    <Route
                        path="/admin/users"
                        element={
                            <AdminRoute>
                                <Users />
                            </AdminRoute>
                        }
                    />

                    <Route
                        path="/admin/vendors"
                        element={
                            <AdminRoute>
                                <Vendors />
                            </AdminRoute>
                        }
                    />

                    <Route
                        path="/admin/orders"
                        element={
                            <AdminRoute>
                                <AdminOrders />
                            </AdminRoute>
                        }
                    />

                    <Route
                        path="/admin/reviews"
                        element={
                            <AdminRoute>
                                <AdminReviews />
                            </AdminRoute>
                        }
                    />

                    <Route
                        path="/admin/questions"
                        element={
                            <AdminRoute>
                                <Questions />
                            </AdminRoute>
                        }
                    />

                    <Route
                        path="/admin/enquiries"
                        element={
                            <AdminRoute>
                                <AdminEnquiries />
                            </AdminRoute>
                        }
                    />

                    <Route
                        path="/admin/coupons"
                        element={
                            <AdminRoute>
                                <Coupons />
                            </AdminRoute>
                        }
                    />

                    <Route
                        path="/admin/cms"
                        element={
                            <AdminRoute>
                                <CMS />
                            </AdminRoute>
                        }
                    />

                    <Route
                        path="/admin/settings"
                        element={
                            <AdminRoute>
                                <Settings />
                            </AdminRoute>
                        }
                    />

                    <Route
                        path="/admin/reports"
                        element={
                            <AdminRoute>
                                <Reports />
                            </AdminRoute>
                        }
                    />

                    <Route
                        path="/admin/notifications"
                        element={
                            <AdminRoute>
                                <Notifications />
                            </AdminRoute>
                        }
                    />

                    <Route
                        path="/admin/activity"
                        element={
                            <AdminRoute>
                                <Activity />
                            </AdminRoute>
                        }
                    />

                    <Route
                        path="/account/settings"
                        element={
                            <ProtectedRoute>
                                <CustomerSettings />
                            </ProtectedRoute>
                        }
                    />

                    {/* ================= VENDOR ================= */}

                    <Route
                        path="/vendor"
                        element={
                            <VendorRoute>
                                <VendorDashboard />
                            </VendorRoute>
                        }
                    />

                    <Route
                        path="/vendor/products"
                        element={
                            <VendorRoute>
                                <VendorProducts />
                            </VendorRoute>
                        }
                    />

                    <Route
                        path="/vendor/orders"
                        element={
                            <VendorRoute>
                                <VendorOrders />
                            </VendorRoute>
                        }
                    />

                    <Route
                        path="/vendor/questions"
                        element={
                            <VendorRoute>
                                <VendorQuestions />
                            </VendorRoute>
                        }
                    />

                    <Route
                        path="/vendor/enquiries"
                        element={
                            <VendorRoute>
                                <VendorEnquiries />
                            </VendorRoute>
                        }
                    />

                    <Route
                        path="/vendor/profile"
                        element={
                            <VendorRoute>
                                <VendorProfile />
                            </VendorRoute>
                        }
                    />

                    <Route
                        path="/vendor/reviews"
                        element={
                            <VendorRoute>
                                <VendorReviews />
                            </VendorRoute>
                        }
                    />

                    {/* ================= 404 ================= */}

                    <Route
                        path="*"
                        element={<NotFound />}
                    />

                </Routes>
            </main>

            {!isDashboardRoute && <Footer />}
        </>
    );
}

export default App;