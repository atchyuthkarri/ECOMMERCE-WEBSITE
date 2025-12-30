import React, { createContext, useEffect, useState } from "react";

export const ShopContext = createContext(null);

const ShopContextProvider = (props) => {
  const [all_product, setAll_Product] = useState([]);
  const [cartItems, setCartItems] = useState({}); // Start empty

  // Fetch all products
  useEffect(() => {
    fetch("http://localhost:4000/allproducts")
      .then((res) => res.json())
      .then((data) => setAll_Product(data))
      .catch((err) => console.error("Fetch products error:", err));
  }, []);

  // Fetch cart from backend if user logged in
  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    if (!token) return;

    fetch("http://localhost:4000/getcart", {
      method: "GET",
      headers: { "auth-token": token, Accept: "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.cartData) setCartItems(data.cartData);
      })
      .catch((err) => console.error("Fetch cart error:", err));
  }, []);

  const syncCartWithServer = async (itemId, action = "add") => {
    const token = localStorage.getItem("auth-token");
    if (!token) return;

    try {
      const response = await fetch(
        `http://localhost:4000/${action === "add" ? "addtocart" : "removefromcart"}`,
        {
          method: "POST",
          headers: { Accept: "application/json", "Content-Type": "application/json", "auth-token": token },
          body: JSON.stringify({ itemId }),
        }
      );
      const data = await response.json();
      if (data.success && data.cartData) {
        setCartItems(data.cartData); // Replace state completely
      }
    } catch (err) {
      console.error(`${action} cart error:`, err);
    }
  };

  const addToCart = (itemId) => syncCartWithServer(itemId, "add");
  const removeFromCart = (itemId) => syncCartWithServer(itemId, "remove");

  const getTotalCartAmount = () => {
    return Object.entries(cartItems).reduce((total, [id, qty]) => {
      if (qty > 0) {
        const product = all_product.find((p) => p.id === Number(id));
        return product ? total + qty * product.new_price : total;
      }
      return total;
    }, 0);
  };

  const getTotalCartItems = () => Object.values(cartItems).reduce((sum, qty) => sum + qty, 0);

  return (
    <ShopContext.Provider
      value={{ all_product, cartItems, addToCart, removeFromCart, getTotalCartAmount, getTotalCartItems }}
    >
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;