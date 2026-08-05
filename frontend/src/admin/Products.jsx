import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import api from "../api/axios";

import AdminSidebar from "../components/AdminSidebar";
import AdminTopbar from "../components/AdminTopbar";

import ProductTable from "./ProductTable";
import ProductModal from "./ProductModal";

import "../styles/admin.css";
import "../styles/adminProducts.css";

export default function Products() {

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [vendors, setVendors] = useState([]);

    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);

    const [editingProduct, setEditingProduct] = useState(null);

    const [showFilters, setShowFilters] = useState(false);

    const [filters, setFilters] = useState({

        search: "",

        category: "",

        vendor: "",

        status: "",

        featured: "",

        stock: "",

        minPrice: "",

        maxPrice: "",

        sort: ""

    });

    useEffect(() => {

        loadData();

    }, []);

    useEffect(() => {

        fetchProducts();

    }, [filters]);

    async function loadData() {

        await Promise.all([

            fetchProducts(),

            fetchCategories(),

            fetchVendors()

        ]);

    }

    async function fetchProducts() {

        try{

            setLoading(true);

            const params={};

            Object.keys(filters).forEach(key=>{

                if(

                    filters[key]!=="" &&

                    filters[key]!==null &&

                    filters[key]!==undefined

                ){

                    params[key]=filters[key];

                }

            });

            const {data}=await api.get("/products",{

                params

            });

            setProducts(data.data || []);

        }

        catch(err){

            console.log(err);

            toast.error("Unable to fetch products");

        }

        finally{

            setLoading(false);

        }

    }

    async function fetchCategories(){

        try{

            const {data}=await api.get("/categories");

            setCategories(data.data || []);

        }

        catch(err){

            console.log(err);

        }

    }

    async function fetchVendors(){

        try{

            const {data}=await api.get("/users/vendors");

            setVendors(data.data || []);

        }

        catch(err){

            console.log(err);

        }

    }

    async function deleteProduct(id){

        if(!window.confirm("Delete this product?")) return;

        try{

            await api.delete(`/products/${id}`);

            toast.success("Product deleted");

            fetchProducts();

        }

        catch(err){

            toast.error("Unable to delete");

        }

    }

    async function approveProduct(id){

        try{

            await api.put(`/products/${id}/approve`);

            toast.success("Product approved");

            fetchProducts();

        }

        catch(err){

            toast.error("Unable to approve");

        }

    }

    async function rejectProduct(id){

        try{

            await api.put(`/products/${id}/reject`);

            toast.success("Product rejected");

            fetchProducts();

        }

        catch(err){

            toast.error("Unable to reject");

        }

    }

    function clearFilters(){

        setFilters({

            search:"",

            category:"",

            vendor:"",

            status:"",

            featured:"",

            stock:"",

            minPrice:"",

            maxPrice:"",

            sort:""

        });

    }

    return(

        <div className="admin-layout">

            <AdminSidebar/>

            <div className="admin-content">

                <AdminTopbar/>
                {/* =======================================
                        PAGE HEADER
                ======================================== */}

                <div className="dashboard-header">

                    <div>

                        <h1>Products</h1>

                        <p>
                            Manage marketplace products, vendors and approvals.
                        </p>

                    </div>

                    <button
                        className="add-product-btn"
                        onClick={() => {
                            setEditingProduct(null);
                            setShowModal(true);
                        }}
                    >
                        + Add Product
                    </button>

                </div>

                {/* =======================================
                        SEARCH BAR
                ======================================== */}

                <div className="products-toolbar">

                    <div className="search-box">

                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >

                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-4.3-4.3m1.3-5.2a7 7 0 11-14 0 7 7 0 0114 0z"
                            />

                        </svg>

                        <input
                            type="text"
                            placeholder="Search product, brand or vendor..."
                            value={filters.search}
                            onChange={(e)=>{

                                setFilters(prev=>({

                                    ...prev,

                                    search:e.target.value

                                }));

                            }}
                        />

                    </div>

                    <button
                        className="filter-btn"
                        onClick={()=>setShowFilters(!showFilters)}
                    >

                        {showFilters ? "Hide Filters" : "Filters"}

                    </button>

                </div>

                {/* =======================================
                        FILTER PANEL
                ======================================== */}

                {showFilters && (

                    <div className="products-filters">

                        <div className="filter-grid">

                            {/* CATEGORY */}

                            <select
                                value={filters.category}
                                onChange={(e)=>
                                    setFilters(prev=>({
                                        ...prev,
                                        category:e.target.value
                                    }))
                                }
                            >

                                <option value="">

                                    All Categories

                                </option>

                                {categories.map(category=>(

                                    <option
                                        key={category._id}
                                        value={category._id}
                                    >

                                        {category.name}

                                    </option>

                                ))}

                            </select>

                            {/* VENDOR */}

                            <select
                                value={filters.vendor}
                                onChange={(e)=>
                                    setFilters(prev=>({
                                        ...prev,
                                        vendor:e.target.value
                                    }))
                                }
                            >

                                <option value="">

                                    All Vendors

                                </option>

                                {vendors.map(vendor=>(

                                    <option
                                        key={vendor._id}
                                        value={vendor._id}
                                    >

                                        {vendor.shopName || vendor.name}

                                    </option>

                                ))}

                            </select>

                            {/* STATUS */}

                            <select
                                value={filters.status}
                                onChange={(e)=>
                                    setFilters(prev=>({
                                        ...prev,
                                        status:e.target.value
                                    }))
                                }
                            >

                                <option value="">

                                    All Status

                                </option>

                                <option value="Pending">

                                    Pending

                                </option>

                                <option value="Approved">

                                    Approved

                                </option>

                                <option value="Rejected">

                                    Rejected

                                </option>

                            </select>

                            {/* FEATURED */}

                            <select
                                value={filters.featured}
                                onChange={(e)=>
                                    setFilters(prev=>({
                                        ...prev,
                                        featured:e.target.value
                                    }))
                                }
                            >

                                <option value="">

                                    Featured

                                </option>

                                <option value="true">

                                    Featured Only

                                </option>

                                <option value="false">

                                    Normal Products

                                </option>

                            </select>
                            {/* STOCK */}

                            <select
                                value={filters.stock}
                                onChange={(e)=>
                                    setFilters(prev=>({
                                        ...prev,
                                        stock:e.target.value
                                    }))
                                }
                            >

                                <option value="">
                                    All Stock
                                </option>

                                <option value="in">
                                    In Stock
                                </option>

                                <option value="out">
                                    Out Of Stock
                                </option>

                            </select>

                            {/* MIN PRICE */}

                            <input
                                type="number"
                                placeholder="Minimum Price"
                                value={filters.minPrice}
                                onChange={(e)=>
                                    setFilters(prev=>({
                                        ...prev,
                                        minPrice:e.target.value
                                    }))
                                }
                            />

                            {/* MAX PRICE */}

                            <input
                                type="number"
                                placeholder="Maximum Price"
                                value={filters.maxPrice}
                                onChange={(e)=>
                                    setFilters(prev=>({
                                        ...prev,
                                        maxPrice:e.target.value
                                    }))
                                }
                            />

                            {/* SORT */}

                            <select
                                value={filters.sort}
                                onChange={(e)=>
                                    setFilters(prev=>({
                                        ...prev,
                                        sort:e.target.value
                                    }))
                                }
                            >

                                <option value="">
                                    Newest First
                                </option>

                                <option value="priceLow">
                                    Price Low → High
                                </option>

                                <option value="priceHigh">
                                    Price High → Low
                                </option>

                                <option value="stock">
                                    Highest Stock
                                </option>

                            </select>

                        </div>

                        <div className="products-actions">

                            <button
                                className="secondary-btn"
                                onClick={clearFilters}
                            >

                                Clear Filters

                            </button>

                            <button
                                className="primary-btn"
                                onClick={fetchProducts}
                            >

                                Apply Filters

                            </button>

                        </div>

                    </div>

                )}

                {/* =======================================
                        PRODUCT COUNT
                ======================================== */}

                <div className="products-results-header">

                    <div className="products-count">

                        <strong>

                            {products.length}

                        </strong>

                        <span>

                            Products Found

                        </span>

                    </div>

                </div>

                {/* =======================================
                        PRODUCT LIST
                ======================================== */}

                {

                    loading ?

                    (

                        <div className="loading-state">

                            <div className="loader"/>

                            <p>

                                Loading Products...

                            </p>

                        </div>

                    )

                    :

                    products.length===0 ?

                    (

                        <div className="empty-products">

                            <div className="empty-icon">

                                📦

                            </div>

                            <h3>

                                No Products Found

                            </h3>

                            <p>

                                Try another search or create a product.

                            </p>

                            <button
                                className="primary-btn"
                                onClick={()=>{
                                    setEditingProduct(null);
                                    setShowModal(true);
                                }}
                            >

                                + Add Product

                            </button>

                        </div>

                    )

                    :

                    (

                        <ProductTable

                            products={products}

                            onEdit={(product)=>{

                                setEditingProduct(product);

                                setShowModal(true);

                            }}

                            onDelete={deleteProduct}

                            onApprove={approveProduct}

                            onReject={rejectProduct}

                        />

                    )

                }

                {/* =======================================
                        PRODUCT MODAL
                ======================================== */}

                <ProductModal

                    open={showModal}

                    editingProduct={editingProduct}

                    categories={categories}

                    vendors={vendors}

                    refreshProducts={fetchProducts}

                    onClose={()=>{

                        setEditingProduct(null);

                        setShowModal(false);

                    }}

                />

            </div>

        </div>

    );

}