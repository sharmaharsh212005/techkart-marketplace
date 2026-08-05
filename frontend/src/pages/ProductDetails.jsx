import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../api/axios";

import ReviewSection from "../components/ReviewSection";
import ProductQuestions from "../components/ProductQuestions";
import EnquiryModal from "../components/EnquiryModal";
import RelatedProducts from "../components/RelatedProducts";

import "../styles/productDetails.css";

const API_URL = "http://localhost:5000";

export default function ProductDetails() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);

    const [product, setProduct] = useState(null);

    const [quantity, setQuantity] = useState(1);

    const [selectedImage, setSelectedImage] = useState(0);

    const [showEnquiry, setShowEnquiry] = useState(false);

    useEffect(() => {

        fetchProduct();

    }, [id]);

    const fetchProduct = async () => {

        try {

            setLoading(true);

            const { data } = await api.get(`/products/${id}`);

            setProduct(data.data);

            setQuantity(1);

            setSelectedImage(0);

        } catch (err) {

            toast.error("Product not found");

            navigate("/products");

        } finally {

            setLoading(false);

        }

    };

    const images = useMemo(() => {

        if (!product?.images?.length) {

            return ["/placeholder.png"];

        }

        return product.images.map((img) => {

            if (!img) return "/placeholder.png";

            if (img.startsWith("http")) return img;

            if (img.startsWith("/")) {

                return `${API_URL}${img}`;

            }

            return `${API_URL}/uploads/products/${img}`;

        });

    }, [product]);

    const increaseQty = () => {

        if (!product) return;

        setQuantity((prev) =>

            Math.min(prev + 1, product.stock)

        );

    };

    const decreaseQty = () => {

        setQuantity((prev) =>

            Math.max(prev - 1, 1)

        );

    };

    const addToCart = async () => {

        if (!product) return;

        try {

            await api.post("/cart", {

                product: product._id,

                quantity,

            });

            toast.success("Added to cart");

        } catch (err) {

            toast.error(

                err.response?.data?.message ||

                "Unable to add to cart"

            );

        }

    };

    const openEnquiry = () => {

        const token = localStorage.getItem("token");

        if (!token) {

            toast.error("Please login first");

            navigate("/login");

            return;

        }

        setShowEnquiry(true);

    };

    if (loading) {

        return (

            <div className="product-loading">

                Loading Product...

            </div>

        );

    }

    if (!product) return null;
return (

<>
<div className="product-page">

<div className="product-wrapper">

{/* ===========================
LEFT : IMAGE GALLERY
=========================== */}

<div className="gallery-section">

<div className="main-image-card">

<img
  src={product.images?.length
    ? `http://localhost:5000${product.images[0]}`
    : "https://placehold.co/500x500"}
  alt={product.name}
  style={{
    width: "100%",
    height: "280px",
    objectFit: "contain",
    padding: 0,
  }}
/>
</div>

{

images.length>1 && (

<div className="thumbnail-container">

{

images.map((img,index)=>(

<div

key={index}

className={`thumbnail-card ${
selectedImage===index ? "active" : ""
}`}

onClick={()=>setSelectedImage(index)}

>

<img

src={img}

alt={`thumb-${index}`}

onError={(e)=>{

e.target.src="/placeholder.png";

}}

/>

</div>

))

}

</div>

)

}

</div>

{/* ===========================
CENTER : PRODUCT DETAILS
=========================== */}

<div className="product-content">

<div className="breadcrumb">

Home / Products / {product.category?.name}

</div>

<h1>

{product.name}

</h1>

<div className="rating-row">

<div className="stars">

★★★★★

</div>

<span>

({product.numReviews || 0} Reviews)

</span>

</div>

<div className="price-row">

<h2>

₹{Number(product.price).toLocaleString()}

</h2>

{

product.discountPrice>0 && (

<h4>

₹{Number(product.discountPrice).toLocaleString()}

</h4>

)

}

</div>

<div className="stock-status">

{

product.stock>0

?

<span className="stock in">

In Stock • {product.stock} Available

</span>

:

<span className="stock out">

Out of Stock

</span>

}

</div>

<div className="description-card">

<h3>

Description

</h3>

<p>

{product.description}

</p>

</div>

<div className="product-info-grid">

<div>

<label>

Brand

</label>

<span>

{product.brand || "N/A"}

</span>

</div>

<div>

<label>

Category

</label>

<span>

{product.category?.name || "N/A"}

</span>

</div>

<div>

<label>

Availability

</label>

<span>

{

product.stock>0

?

"In Stock"

:

"Out of Stock"

}

</span>

</div>

</div>

<div className="quantity-box">

<h3>

Quantity

</h3>

<div className="quantity-selector">

<button

onClick={decreaseQty}

>

−

</button>

<span>

{quantity}

</span>

<button

onClick={increaseQty}

>

+

</button>

</div>

</div>

<div className="action-row">

<button

className="buy-btn"

disabled={product.stock<=0}

onClick={addToCart}

>

Add To Cart

</button>

<button

className="secondary-btn"

onClick={openEnquiry}

>

Ask Seller

</button>

</div>

</div>
{/* ===========================
RIGHT SIDEBAR
=========================== */}

<div className="sidebar-section">

    <div className="purchase-card">

        <h3>

            ₹{Number(product.price).toLocaleString()}

        </h3>

        <p className="sidebar-stock">

            {
                product.stock > 0
                    ? "✔ Available for Immediate Delivery"
                    : "Currently Unavailable"
            }

        </p>

        <button

            className="sidebar-cart-btn"

            disabled={product.stock <= 0}

            onClick={addToCart}

        >

            Add To Cart

        </button>


    </div>

    <div className="info-card">

        <h4>

            Delivery

        </h4>

        <ul>

            <li>🚚 Free delivery on eligible orders.</li>

            <li>📦 Ships within 24 Hours.</li>

            <li>🔄 7 Days Easy Replacement.</li>

        </ul>

    </div>

    <div className="info-card">

        <h4>

            Secure Shopping

        </h4>

        <ul>

            <li>🔒 100% Secure Checkout</li>

            <li>💳 Multiple Payment Options</li>

            <li>🛡 Manufacturer Warranty</li>

        </ul>

    </div>

    <RelatedProducts

        currentProduct={product._id}

        categoryId={product.category?._id}

    />

</div>

</div>

{/* ===========================
BOTTOM SECTIONS
=========================== */}

<div className="bottom-sections">

    <div className="reviews-wrapper">

        <ReviewSection

            productId={product._id}

        />

    </div>

    <div className="questions-wrapper">

        <ProductQuestions

            productId={product._id}

        />

    </div>

</div>

<EnquiryModal

    open={showEnquiry}

    onClose={() => setShowEnquiry(false)}

    productId={product._id}

    vendorId={product.vendor?._id}

/>

</div>

</>

);

}