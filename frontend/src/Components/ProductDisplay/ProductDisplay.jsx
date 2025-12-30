import React, { useContext } from "react";
import "./ProductDisplay.css";
import star_icon from "../Assets/star_icon.png";
import star_dull_icon from "../Assets/star_dull_icon.png";
import { ShopContext } from "../../context/ShopContext";

const ProductDisplay = ({ product }) => {
  const { addToCart } = useContext(ShopContext);

  // Guard: show loading if product is undefined
  if (!product) return <div className="productdisplay">Loading product...</div>;

  return (
    <div className="productdisplay">
      <div className="productdisplay-left">
        <div className="productdisplay-img-list">
          <img src={product.image} alt={product.name || ""} />
          <img src={product.image} alt={product.name || ""} />
          <img src={product.image} alt={product.name || ""} />
          <img src={product.image} alt={product.name || ""} />
        </div>
        <div className="productdisplay-img">
          <img
            className="productdisplay-main-img"
            src={product.image}
            alt={product.name || ""}
          />
        </div>
      </div>
      <div className="productdisplay-right">
        <h1>{product.name || "Product Name"}</h1>
        <div className="productdisplay-right-stars">
          <img src={star_icon} alt="" />
          <img src={star_icon} alt="" />
          <img src={star_icon} alt="" />
          <img src={star_icon} alt="" />
          <img src={star_dull_icon} alt="" />
          <p>(122)</p>
        </div>
        <div className="productdisplay-right-prices">
          <div className="productdisplay-right-price-old">
            ${product.old_price || 0}
          </div>
          <div className="productdisplay-right-price-new">
            ${product.new_price || 0}
          </div>
        </div>
        <div className="productdisplay-right-description">
          Featuring a relaxed fit with ribbed cuffs and hem, this sweatshirt
          offers a timeless look that pairs easily with jeans, joggers, or
          layered outfits. Ideal for casual outings, travel, or lounging, it’s a
          must-have staple for any season.
        </div>
        <div className="productdisplay-right-size">
          <h1>Select Size</h1>
          <div className="productdisplay-right-sizes">
            <div>S</div>
            <div>M</div>
            <div>L</div>
            <div>XL</div>
            <div>XXL</div>
          </div>
        </div>
        <button onClick={() => addToCart(product.id)}>ADD TO CART</button>
        <p className="productdisplay-right-category">
          <span>Category :</span> {product.category || "N/A"}
        </p>
        <p className="productdisplay-right-category">
          <span>Tags :</span> Modern, Latest
        </p>
      </div>
    </div>
  );
};

export default ProductDisplay;