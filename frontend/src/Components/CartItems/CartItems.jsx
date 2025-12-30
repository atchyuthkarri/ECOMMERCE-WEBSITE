import React, { useContext } from "react";
import "./CartItems.css";
import { ShopContext } from "../../context/ShopContext";
import remove_icon from "../Assets/cart_cross_icon.png";

const CartItems = () => {
  const { all_product, cartItems, removeFromCart, getTotalCartAmount } = useContext(ShopContext);

  // Only products with quantity > 0
  const productsInCart = all_product.filter((product) => cartItems[product.id] > 0);

  if (productsInCart.length === 0)
    return <p style={{ textAlign: "center", marginTop: "20px" }}>Your cart is empty!</p>;

  return (
    <div className="cartitems">
      <div className="cartitems-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Price</p>
        <p>Quantity</p>
        <p>Total</p>
        <p>Remove</p>
      </div>
      <hr />

      {productsInCart.map((product) => (
        <div key={product.id}>
          <div className="cartitems-format-main cartitems-format">
            <img className="carticon-product-icon" src={product.image} alt={product.name} />
            <p>{product.name}</p>
            <p>${product.new_price}</p>
            <button className="cartitems-quantity">{cartItems[product.id]}</button>
            <p>${cartItems[product.id] * product.new_price}</p>
            <img
              className="carticons-remove-icon"
              src={remove_icon}
              alt="Remove"
              onClick={() => removeFromCart(product.id)}
            />
          </div>
          <hr />
        </div>
      ))}

      <div className="cartitems-down">
        <div className="cartitems-total">
          <h1>Cart Totals</h1>
          <div>
            <div className="cartitems-total-item">
              <p>Subtotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <p>Shipping Fee</p>
              <p>Free</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <h3>Total</h3>
              <h3>${getTotalCartAmount()}</h3>
            </div>
          </div>
          <button>PROCEED TO CHECKOUT</button>
        </div>
      </div>
    </div>
  );
};

export default CartItems;