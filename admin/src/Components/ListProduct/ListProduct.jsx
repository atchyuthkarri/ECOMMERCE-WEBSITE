import React, { useEffect, useState } from "react";
import "./ListProduct.css";
import cross_icon from "../../assets/cross_icon.png";

const BASE_URL = "https://ecommerce-backend-9yw2.onrender.com";

const ListProduct = () => {
  const [allProducts, setAllProducts] = useState([]);

  const fetchInfo = async () => {
    try {
      const res = await fetch(`${BASE_URL}/allproducts`);
      const data = await res.json();
      if (data.success) {
        setAllProducts(data.data || []);
      } else {
        setAllProducts([]);
      }
    } catch (err) {
      console.error("Fetch all products error:", err);
      setAllProducts([]);
    }
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  const remove_product = async (_id) => {
    const token = localStorage.getItem("admin-token");
    if (!token) return alert("Admin not logged in!");

    try {
      const res = await fetch(`${BASE_URL}/removeproduct`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "admin-token": token, // ✅ send admin token
        },
        body: JSON.stringify({ id: _id }), // ✅ send _id
      });

      const data = await res.json();
      if (data.success) {
        alert("Product removed successfully ✅");
        fetchInfo(); // refresh list
      } else {
        alert("Failed to remove product ❌");
      }
    } catch (err) {
      console.error("Remove product error:", err);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="list-product">
      <h1>All Products List</h1>
      <div className="listproduct-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Old Price</p>
        <p>New Price</p>
        <p>Category</p>
        <p>Remove</p>
      </div>
      <div className="listproduct-allproducts">
        <hr />
        {allProducts.map((product, index) => (
          <React.Fragment key={product._id}>
            <div className="listproduct-format-main listproduct-format">
              <img
                src={product.image}
                alt={product.name}
                className="listproduct-product-icon"
              />
              <p>{product.name}</p>
              <p>${product.old_price}</p>
              <p>${product.new_price}</p>
              <p>{product.category}</p>
              <img
                onClick={() => remove_product(product._id)}
                className="listproduct-remove-icon"
                src={cross_icon}
                alt="Remove"
              />
            </div>
            <hr />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ListProduct;