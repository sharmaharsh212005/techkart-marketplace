import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import {
    FaArrowLeft,
    FaDownload,
    FaUser,
    FaStore,
    FaMapMarkerAlt,
    FaCreditCard,
    FaBoxOpen,
    FaCheckCircle,
    FaTruck,
    FaClock,
    FaTimesCircle,
} from "react-icons/fa";

import api from "../api/axios";
import "../styles/orderDetails.css";

export default function OrderDetails() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [order,setOrder]=useState(null);

    const [loading,setLoading]=useState(true);

    const user=JSON.parse(
        localStorage.getItem("user")
    );

    useEffect(()=>{

        loadOrder();

    },[]);

    const loadOrder=async()=>{

        try{

            const {data}=await api.get(
                `/orders/${id}`
            );

            setOrder(data.data);

        }

        catch(err){

            toast.error(
                err.response?.data?.message ||
                "Unable to load order."
            );

            navigate("/orders");

        }

        finally{

            setLoading(false);

        }

    };

    const cancelOrder=async()=>{

        if(
            !window.confirm(
                "Cancel this order?"
            )
        ) return;

        try{

            await api.put(
                `/orders/${id}/cancel`
            );

            toast.success(
                "Order Cancelled"
            );

            loadOrder();

        }

        catch(err){

            toast.error(
                err.response?.data?.message ||
                "Unable to cancel order."
            );

        }

    };

    const downloadInvoice=async()=>{

        try{

            const response=await api.get(
                `/invoice/${id}`,
                {
                    responseType:"blob",
                    headers:{
                        Accept:"application/pdf"
                    }
                }
            );

            const blob=new Blob(
                [response.data],
                {
                    type:"application/pdf"
                }
            );

            const url=
                window.URL.createObjectURL(
                    blob
                );

            const link=
                document.createElement("a");

            link.href=url;

            link.download=`Invoice-${id}.pdf`;

            document.body.appendChild(
                link
            );

            link.click();

            document.body.removeChild(
                link
            );

            window.URL.revokeObjectURL(
                url
            );

        }

        catch{

            toast.error(
                "Unable to download invoice."
            );

        }

    };

    const statusIcon=(status)=>{

        switch(status){

            case "Delivered":
                return <FaCheckCircle/>;

            case "Shipped":
                return <FaTruck/>;

            case "Processing":
                return <FaClock/>;

            case "Cancelled":
                return <FaTimesCircle/>;

            default:
                return <FaBoxOpen/>;

        }

    };

    if(loading){

        return(

            <div className="order-loading">

                <div className="loader"/>

                <h2>
                    Loading Order...
                </h2>

            </div>

        );

    }

    if(!order) return null;

    return(

        <section className="order-details-page">

            <div className="details-header">

                <button
                    className="back-btn"
                    onClick={()=>
                        navigate("/orders")
                    }
                >

                    <FaArrowLeft/>

                    Back

                </button>

                <button
                    className="invoice-btn"
                    onClick={downloadInvoice}
                >

                    <FaDownload/>

                    Download Invoice

                </button>

            </div>

            <div className="details-card">

                <div className="details-top">

                    <div>

                        <h1>

                            Order #

                            {order._id
                                .slice(-8)
                                .toUpperCase()}

                        </h1>

                        <p>

                            Placed on{" "}

                            {new Date(
                                order.createdAt
                            ).toLocaleString(
                                "en-IN"
                            )}

                        </p>

                    </div>

                    <div className="status-group">

                        <span
                            className={`status-badge ${order.orderStatus.toLowerCase()}`}
                        >

                            {statusIcon(
                                order.orderStatus
                            )}

                            {order.orderStatus}

                        </span>

                        <span
                            className={`payment-badge ${order.paymentStatus.toLowerCase()}`}
                        >

                            <FaCreditCard/>

                            {order.paymentStatus}

                        </span>

                    </div>

                </div>

                <div className="details-grid">
{/* ================= CUSTOMER ================= */}

<div className="info-card">

    <div className="card-title">

        <FaUser />

        <h2>Customer Information</h2>

    </div>

    <div className="info-list">

        <div>

            <span>Name</span>

            <strong>
                {order.user?.name || "N/A"}
            </strong>

        </div>

        <div>

            <span>Email</span>

            <strong>
                {order.user?.email || "N/A"}
            </strong>

        </div>

        <div>

            <span>Order ID</span>

            <strong>
                {order._id}
            </strong>

        </div>

        <div>

            <span>Order Date</span>

            <strong>
                {new Date(
                    order.createdAt
                ).toLocaleString("en-IN")}
            </strong>

        </div>

    </div>

</div>


{/* ================= SHIPPING ================= */}

<div className="info-card">

    <div className="card-title">

        <FaMapMarkerAlt />

        <h2>Shipping Address</h2>

    </div>

    <div className="info-list">

        <div>

            <span>Full Name</span>

            <strong>
                {order.shippingAddress.fullName}
            </strong>

        </div>

        <div>

            <span>Phone</span>

            <strong>
                {order.shippingAddress.phone}
            </strong>

        </div>

        <div>

            <span>Address</span>

            <strong>

                {order.shippingAddress.address}

                <br />

                {order.shippingAddress.city},{" "}
                {order.shippingAddress.state}

                <br />

                {order.shippingAddress.pincode}

            </strong>

        </div>

    </div>

</div>


{/* ================= SELLER ================= */}

{user?.role === "admin" && (

<div className="info-card seller-card">

    <div className="card-title">

        <FaStore />

        <h2>Seller Information</h2>

    </div>

    <div className="info-list">

        <div>

            <span>Seller Name</span>

            <strong>

                {order.items[0]?.vendor?.name || "N/A"}

            </strong>

        </div>

        <div>

            <span>Email</span>

            <strong>

                {order.items[0]?.vendor?.email || "N/A"}

            </strong>

        </div>

        <div>

            <span>Total Products</span>

            <strong>

                {order.items.length}

            </strong>

        </div>

    </div>

</div>

)}


{/* ================= PAYMENT SUMMARY ================= */}

<div className="summary-card">

    <h2>

        <FaCreditCard />

        Payment Summary

    </h2>

    <div className="summary-row">

        <span>Payment Method</span>

        <strong>

            {order.paymentMethod}

        </strong>

    </div>

    <div className="summary-row">

        <span>Payment Status</span>

        <strong
            className={`payment-text ${order.paymentStatus.toLowerCase()}`}
        >

            {order.paymentStatus}

        </strong>

    </div>

    <div className="summary-row">

        <span>Order Status</span>

        <strong
            className={`order-text ${order.orderStatus.toLowerCase()}`}
        >

            {order.orderStatus}

        </strong>

    </div>

    {order.discount > 0 && (

    <div className="summary-row">

        <span>Discount</span>

        <strong className="discount">

            -₹{order.discount}

        </strong>

    </div>

    )}

    <div className="summary-row total-row">

        <span>Total Paid</span>

        <strong>

            ₹{order.totalAmount.toLocaleString("en-IN")}

        </strong>

    </div>

</div>

</div>


{/* ================= PRODUCTS ================= */}

<div className="products-section">

<h2>

    <FaBoxOpen />

    Ordered Products

</h2>
{order.items.map((item) => (

    <div
        key={item._id}
        className="product-row"
    >

        <img
            src={
                item.product?.images?.length
                    ? `http://localhost:5000${item.product.images[0]}`
                    : "https://placehold.co/120x120?text=TechKart"
            }
            alt={item.product?.name}
        />

        <div className="product-info">

            <h3>
                {item.product?.name}
            </h3>

            <p>

                Category :
                <strong>

                    {" "}
                    {item.product?.category?.name || "N/A"}

                </strong>

            </p>

            <p>

                Quantity :
                <strong>

                    {" "}
                    {item.quantity}

                </strong>

            </p>

            <p>

                Price :
                <strong>

                    {" "}
                    ₹{item.price}

                </strong>

            </p>

            {user?.role === "admin" && (

                <p>

                    Seller :
                    <strong>

                        {" "}
                        {item.vendor?.name}

                    </strong>

                </p>

            )}

        </div>

        <div className="product-total">

            ₹{(
                item.price *
                item.quantity
            ).toLocaleString("en-IN")}

        </div>

    </div>

))}

<div className="order-total-card">

    {order.discount > 0 && (

        <div className="total-line">

            <span>Discount</span>

            <strong className="discount">

                -₹{order.discount.toLocaleString("en-IN")}

            </strong>

        </div>

    )}

    <div className="total-line">

        <span>Total Items</span>

        <strong>

            {order.items.reduce(
                (sum,item)=>sum+item.quantity,
                0
            )}

        </strong>

    </div>

    <div className="total-line final-total">

        <span>Total Paid</span>

        <strong>

            ₹{order.totalAmount.toLocaleString("en-IN")}

        </strong>

    </div>

</div>

</div>


{/* ================= TIMELINE ================= */}

<div className="order-progress">

    {["Processing","Shipped","Delivered"].map((step,index)=>(

        <div
            key={step}
            className={`progress-step ${
                (
                    step==="Processing" &&
                    ["Processing","Shipped","Delivered"].includes(order.orderStatus)
                ) ||
                (
                    step==="Shipped" &&
                    ["Shipped","Delivered"].includes(order.orderStatus)
                ) ||
                (
                    step==="Delivered" &&
                    order.orderStatus==="Delivered"
                )
                    ? "active"
                    : ""
            }`}
        >

            <div className="step-circle">

                {index+1}

            </div>

            <span>

                {step}

            </span>

        </div>

    ))}

</div>


{/* ================= FOOTER ================= */}

<div className="details-footer">

    <div className="footer-info">

        <div>

            <small>Order ID</small>

            <strong>

                {order._id}

            </strong>

        </div>

        <div>

            <small>Payment</small>

            <strong>

                {order.paymentMethod}

            </strong>

        </div>

        <div>

            <small>Date</small>

            <strong>

                {new Date(
                    order.createdAt
                ).toLocaleString("en-IN")}

            </strong>

        </div>

    </div>

    <div className="footer-actions">

        {order.orderStatus==="Pending" && (

            <button
                className="cancel-btn"
                onClick={cancelOrder}
            >

                Cancel Order

            </button>

        )}

        <button
            className="invoice-btn secondary"
            onClick={downloadInvoice}
        >

            <FaDownload/>

            Invoice

        </button>

    </div>

</div>

</div>

</section>

);

}