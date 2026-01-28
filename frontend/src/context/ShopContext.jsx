import React, { createContext, useEffect, useState } from "react";

export const ShopContext = createContext(null);
export const BASE_URL = "https://ecommerce-backend-9yw2.onrender.com";

const ShopContextProvider = ({ children }) => {
  const [all_product, setAll_Product] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${BASE_URL}/allproducts`);
        const result = await res.json();
        setAll_Product(result.data || []);
      } catch (err) {
        console.error("Fetch products error:", err);
        setAll_Product([]);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  // Fetch cart after products loaded
  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem("auth-token");
      if (!token || loadingProducts) return;

      try {
        const res = await fetch(`${BASE_URL}/getcart`, {
          headers: { "auth-token": token, Accept: "application/json" },
        });
        const data = await res.json();

        if (data.success && data.data?.[0]) {
          const normalizedCart = {};
          Object.entries(data.data[0]).forEach(([id, qty]) => {
            if (qty > 0) normalizedCart[id.toString()] = qty;
          });
          setCartItems(normalizedCart);
        }
      } catch (err) {
        console.error("Fetch cart error:", err);
      }
    };
    fetchCart();
  }, [loadingProducts]);

  // Sync cart with backend
  const syncCartWithServer = async (itemId, action = "add") => {
    const token = localStorage.getItem("auth-token");

    // Local cart update if not logged in
    if (!token) {
      const tempCart = {
        ...cartItems,
        [itemId]: (cartItems[itemId] || 0) + (action === "add" ? 1 : 0),
      };
      setCartItems(tempCart);
      console.warn("No token, cart updated locally.");
      return;
    }

    try {
      const res = await fetch(
        `${BASE_URL}/${action === "add" ? "addtocart" : "removefromcart"}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", "auth-token": token },
          body: JSON.stringify({ itemId }),
        }
      );
      const data = await res.json();
      if (data.success && data.data?.[0]) {
        const normalizedCart = {};
        Object.entries(data.data[0]).forEach(([id, qty]) => {
          if (qty > 0) normalizedCart[id.toString()] = qty;
        });
        setCartItems(normalizedCart);
      }
    } catch (err) {
      console.error(`${action} cart error:`, err);
    }
  };

  const addToCart = (itemId) => syncCartWithServer(itemId, "add");
  const removeFromCart = (itemId) => syncCartWithServer(itemId, "remove");

  // Cart helpers
  const getTotalCartAmount = () =>
    Object.entries(cartItems).reduce((total, [id, qty]) => {
      const product = all_product.find((p) => p._id === id.toString());
      return product ? total + qty * product.new_price : total;
    }, 0);

  const getTotalCartItems = () =>
    Object.values(cartItems).reduce((sum, qty) => sum + qty, 0);

  const getCartItemsWithDetails = () =>
    Object.entries(cartItems)
      .map(([id, qty]) => {
        const product = all_product.find((p) => p._id === id.toString());
        return product ? { ...product, qty } : null;
      })
      .filter(Boolean);

  return (
    <ShopContext.Provider
      value={{
        all_product,
        cartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        getTotalCartItems,
        getCartItemsWithDetails,
        loadingProducts,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;