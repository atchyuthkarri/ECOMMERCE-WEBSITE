import React, { useContext } from "react";
import "./ProductDisplay.css";
import star_icon from "../Assets/star_icon.png";
import star_dull_icon from "../Assets/star_dull_icon.png";
import { ShopContext, BASE_URL } from "../../context/ShopContext";

const ProductDisplay = ({ product }) => {
  const { addToCart, cartItems } = useContext(ShopContext);
  const qtyInCart = cartItems[product?._id] || 0;

  if (!product) return <div className="productdisplay">Loading product...</div>;

  // Handle image
  const imgSrc = product.image.startsWith("http")
    ? product.image
    : `${BASE_URL}/images/${product.image}`;

  return (
    <div className="productdisplay">
      <div className="productdisplay-left">
        <div className="productdisplay-img-list">
          {[1, 2, 3, 4].map((_, i) => (
            <img key={i} src={imgSrc} alt={product.name} />
          ))}
        </div>
        <div className="productdisplay-img">
          <img className="productdisplay-main-img" src={imgSrc} alt={product.name} />
        </div>
      </div>

      <div className="productdisplay-right">
        <h1>{product.name}</h1>
        <div className="productdisplay-right-stars">
          <img src={star_icon} alt="" />
          <img src={star_icon} alt="" />
          <img src={star_icon} alt="" />
          <img src={star_icon} alt="" />
          <img src={star_dull_icon} alt="" />
          <p>(122)</p>
        </div>
        <div className="productdisplay-right-prices">
          <div className="productdisplay-right-price-old">${product.old_price}</div>
          <div className="productdisplay-right-price-new">${product.new_price}</div>
        </div>

        <button onClick={() => addToCart(product._id)}>
          ADD TO CART {qtyInCart > 0 && `(${qtyInCart})`}
        </button>

        <p className="productdisplay-right-category">
          <span>Category :</span> {product.category || "N/A"}
        </p>
      </div>
    </div>
  );
};

export default ProductDisplay;