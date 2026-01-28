import React from "react";
import "./Item.css";
import { Link } from "react-router-dom";
// import { ShopContext } from "../../context/ShopContext";

const Item = ({ _id, name, image, new_price, old_price }) => {
  // const { addToCart, cartItems } = useContext(ShopContext);
  // const quantityInCart = cartItems[_id] || 0;

  return (
    <div className="item">
      <Link to={`/product/${_id}`}>
        <img src={image} alt={name} /> {/* ✅ USE DIRECT IMAGE */}
      </Link>

      <p>{name}</p>

      <div className="item-prices">
        <div className="item-price-new">${new_price}</div>
        <div className="item-price-old">${old_price}</div>
      </div>

      {/* <button onClick={() => addToCart(_id)}>
        Add to Cart {quantityInCart > 0 && `(${quantityInCart})`}
      </button> */}
    </div>
  );
};

export default Item;