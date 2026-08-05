import React, { useEffect, useState } from "react";

import {
    FaTimes,
    FaCreditCard,
    FaTruck,
    FaMoneyBillWave,
    FaUser,
    FaMapMarkerAlt,
    FaStore,
    FaBoxOpen,
    FaDownload,
    FaTrash,
    FaSyncAlt
} from "react-icons/fa";

import "../styles/orderDetails.css";



export default function OrderDetailModal({

    show,
    order,
    onClose,
    onDelete,
    onUpdateStatus

}) {


    const [paymentStatus,setPaymentStatus] =
        useState("Pending");


    const [orderStatus,setOrderStatus] =
        useState("Pending");


    const [loading,setLoading] =
        useState(false);




    useEffect(()=>{


        if(order){


            setPaymentStatus(
                order.paymentStatus || "Pending"
            );


            setOrderStatus(
                order.orderStatus || "Pending"
            );


        }


    },[order]);





    if(!show || !order){

        return null;

    }





    const updatePayment = async()=>{


        setLoading(true);


        await onUpdateStatus(

            order._id,

            {
                paymentStatus
            }

        );


        setLoading(false);


    };







    const updateOrder = async()=>{


        setLoading(true);


        await onUpdateStatus(

            order._id,

            {
                orderStatus
            }

        );


        setLoading(false);


    };







    const imageUrl=(item)=>{


        let img =
            item?.product?.images?.[0];



        if(!img){

            return "https://placehold.co/150";

        }



        if(img.startsWith("http")){

            return img;

        }



        return `http://localhost:5000${img}`;


    };








    const sellerName=(item)=>{


        return (

            item?.vendor?.name ||

            item?.product?.vendor?.name ||

            "Seller"

        );


    };





    const sellerEmail=(item)=>{


        return (

            item?.vendor?.email ||

            item?.product?.vendor?.email ||

            "No Email"

        );


    };







return (

<div className="order-modal-overlay">


<div className="order-modal-container">



<div className="order-modal-header">


<div>

<h1>

Order Details

</h1>


<p>

#{order._id}

</p>


</div>





<button

className="modal-close-btn"

onClick={onClose}

>


<FaTimes/>


</button>



</div>





<div className="order-summary-grid">

<div className="summary-box">

<FaCreditCard/>


<span>

Payment Status

</span>


<strong className={`status-pill ${paymentStatus.toLowerCase()}`}>

{paymentStatus}

</strong>


</div>





<div className="summary-box">


<FaTruck/>


<span>

Order Status

</span>


<strong className={`status-pill ${orderStatus.toLowerCase()}`}>

{orderStatus}

</strong>


</div>





<div className="summary-box">


<FaMoneyBillWave/>


<span>

Total Amount

</span>


<h2>

₹{Number(order.totalAmount || 0).toLocaleString("en-IN")}

</h2>


</div>



</div>


<div className="order-info-grid">



<div className="info-box">


<div className="info-title">

<FaUser/>

<h3>
Customer Information
</h3>

</div>




<p>

<b>Name:</b>{" "}

{
order.user?.name || "N/A"
}

</p>



<p>

<b>Email:</b>{" "}

{
order.user?.email || "N/A"
}

</p>



<p>

<b>Phone:</b>{" "}

{
order.shippingAddress?.phone || "N/A"
}

</p>



<p>

<b>Date:</b>{" "}

{
new Date(
order.createdAt
).toLocaleString()
}

</p>



</div>







<div className="info-box">


<div className="info-title">

<FaMapMarkerAlt/>

<h3>
Shipping Address
</h3>


</div>




<p>

{
order.shippingAddress?.fullName ||
"N/A"
}

</p>




<p>

{
order.shippingAddress?.address ||
"N/A"
}

</p>




<p>

{
order.shippingAddress?.city
}

,

{" "}

{
order.shippingAddress?.state
}

</p>




<p>

{
order.shippingAddress?.pincode
}

</p>



</div>







<div className="info-box">


<div className="info-title">


<FaStore/>


<h3>
Seller Information
</h3>


</div>





<p>

<b>
Seller:
</b>

{" "}

{
sellerName(
order.items?.[0]
)
}

</p>




<p>

<b>
Email:
</b>

{" "}

{
sellerEmail(
order.items?.[0]
)
}

</p>




<p>

<b>
Products:
</b>

{" "}

{
order.items?.length || 0
}

</p>




</div>




</div>



<div className="products-section">



<div className="section-heading">


<FaBoxOpen/>


<h2>
Ordered Products
</h2>



</div>







<div className="product-table">





<div className="product-table-head">


<div>
Product
</div>


<div>
Seller
</div>


<div>
Qty
</div>


<div>
Price
</div>


<div>
Total
</div>



</div>








{
order.items?.map((item,index)=>(


<div

className="product-row"

key={index}

>




<div className="product-main">


<img

src={
imageUrl(item)
}

alt="product"

onError={(e)=>{

e.target.src =
"https://placehold.co/100x100";

}}

/>





<div>


<h3>

{
item.product?.name ||
"Product"
}

</h3>



<p>

ID:

{" "}

{
item.product?._id ||
"N/A"
}

</p>



</div>



</div>








<div className="seller-column">


<strong>

{
sellerName(item)
}

</strong>


<span>

{
sellerEmail(item)
}

</span>


</div>







<div className="product-cell">


{
item.quantity
}


</div>








<div className="product-cell">


₹

{
Number(
item.price || 0
)
.toLocaleString(
"en-IN"
)
}


</div>








<div className="product-total">


₹

{

Number(

(item.price || 0)

*

(item.quantity || 0)

)

.toLocaleString(
"en-IN"
)

}


</div>







</div>



))


}





</div>



</div>


<div className="control-grid">





<div className="control-box">



<div className="control-title">


<FaCreditCard/>


<h3>
Update Payment Status
</h3>


</div>





<select

className="control-select"

value={paymentStatus}

onChange={(e)=>

setPaymentStatus(
e.target.value
)

}

>



<option value="Pending">

Pending

</option>



<option value="Paid">

Paid

</option>



<option value="Failed">

Failed

</option>



<option value="Refunded">

Refunded

</option>



</select>







<button

className="update-btn payment-update"

disabled={loading}

onClick={updatePayment}

>



<FaSyncAlt/>


{
loading

?

"Updating..."

:

"Update Payment"

}



</button>





</div>









<div className="control-box">



<div className="control-title">


<FaTruck/>


<h3>
Update Order Status
</h3>


</div>







<select

className="control-select"

value={orderStatus}

onChange={(e)=>

setOrderStatus(
e.target.value
)

}

>




<option value="Pending">

Pending

</option>




<option value="Processing">

Processing

</option>




<option value="Shipped">

Shipped

</option>




<option value="Delivered">

Delivered

</option>




<option value="Cancelled">

Cancelled

</option>




</select>







<button

className="update-btn order-update"

disabled={loading}

onClick={updateOrder}

>



<FaSyncAlt/>


{
loading

?

"Updating..."

:

"Update Order"

}



</button>





</div>




</div>


<div className="final-summary-box">



<h3>

Order Summary

</h3>







<div className="summary-line">


<span>

Total Products

</span>


<strong>

{
order.items?.length || 0
}

</strong>


</div>







<div className="summary-line">


<span>

Total Quantity

</span>


<strong>

{

order.items?.reduce(

(total,item)=>

total +

(item.quantity || 0),

0

)

}

</strong>


</div>







<div className="summary-line total">


<span>

Grand Total

</span>


<strong>

₹

{

Number(
order.totalAmount || 0
)

.toLocaleString(
"en-IN"
)

}


</strong>


</div>





</div>


<div className="modal-actions">





<button

className="invoice-download-btn"

onClick={()=>{


window.open(

`http://localhost:5000/api/invoice/${order._id}`,

"_blank"

);


}}

>


<FaDownload/>


Download Invoice


</button>







<button

className="delete-order-btn"

onClick={()=>{


const confirmDelete =

window.confirm(

"Are you sure you want to delete this order?"

);



if(confirmDelete){


onDelete(
order._id
);


}



}}

>


<FaTrash/>


Delete Order


</button>







<button

className="close-order-btn"

onClick={onClose}

>


<FaTimes/>


Close


</button>





</div>







</div>


</div>


);


}
