import React, { useState } from "react";
import "./AddProduct.css";
import upload_area from "../../assets/upload_area.svg";

const BASE_URL = "https://ecommerce-backend-9yw2.onrender.com";

const AddProduct = () => {
  const [image, setImage] = useState(null);
  const [productDetails, setProductDetails] = useState({
    name: "",
    image: "",
    category: "women",
    new_price: "",
    old_price: "",
  });

  const imageHandler = (e) => {
    setImage(e.target.files[0]);
  };

  const changeHandler = (e) => {
    setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
  };

  const Add_Product = async () => {
    if (!productDetails.name || !productDetails.new_price || !image) {
      return alert("Please fill all required fields and select an image!");
    }

    try {
      // 1️⃣ Upload Image
      const formData = new FormData();
      formData.append("product", image);

      const uploadResponse = await fetch(`${BASE_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadResponse.json();

      if (!uploadData.success) {
        return alert("Image upload failed!");
      }

      const product = {
        ...productDetails,
        image: uploadData.data[0], // ✅ backend returns array of image URLs
      };

      // 2️⃣ Send Product to Backend (with admin token)
      const token = localStorage.getItem("admin-token");
      if (!token) return alert("Admin not logged in!");

      const productResponse = await fetch(`${BASE_URL}/admin/addproduct`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "admin-token": token, // ✅ send admin-token
        },
        body: JSON.stringify(product),
      });

      const productData = await productResponse.json();

      if (productData.success) {
        alert("Product Added Successfully ✅");
        setProductDetails({
          name: "",
          image: "",
          category: "women",
          new_price: "",
          old_price: "",
        });
        setImage(null);
      } else {
        alert("Failed to add product ❌");
      }
    } catch (err) {
      console.error("Add Product Error:", err);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="add-product">
      <div className="addproduct-itemfield">
        <p>Product Title</p>
        <input
          value={productDetails.name}
          onChange={changeHandler}
          type="text"
          name="name"
          placeholder="Type here"
        />
      </div>

      <div className="addproduct-price">
        <div className="addproduct-itemfield">
          <p>Price</p>
          <input
            value={productDetails.old_price}
            onChange={changeHandler}
            type="text"
            name="old_price"
            placeholder="Type here"
          />
        </div>
        <div className="addproduct-itemfield">
          <p>Offer Price</p>
          <input
            value={productDetails.new_price}
            onChange={changeHandler}
            type="text"
            name="new_price"
            placeholder="Type here"
          />
        </div>
      </div>

      <div className="addproduct-itemfield">
        <p>Product Category</p>
        <select
          value={productDetails.category}
          onChange={changeHandler}
          name="category"
          className="add-product-selector"
        >
          <option value="women">Women</option>
          <option value="men">Men</option>
          <option value="kid">Kids</option>
        </select>
      </div>

      <div className="addproduct-itemfield">
        <label htmlFor="file-input">
          <img
            src={image ? URL.createObjectURL(image) : upload_area}
            alt=""
            className="addproduct-thumbnail-img"
          />
        </label>
        <input
          onChange={imageHandler}
          type="file"
          name="image"
          id="file-input"
          hidden
        />
      </div>

      <button onClick={Add_Product} className="addproduct-btn">
        ADD PRODUCT
      </button>
    </div>
  );
};

export default AddProduct;