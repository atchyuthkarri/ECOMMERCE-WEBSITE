import React, { createContext, useEffect, useState } from "react";

export const ShopContext = createContext(null);

const ShopContextProvider = ({ children }) => {
  const [all_product, setAll_Product] = useState([]);
  const [cartItems, setCartItems] = useState({}); // { [productId]: quantity }
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:4000/allproducts");
        const data = await res.json();
        setAll_Product(data);
      } catch (err) {
        console.error("Fetch products error:", err);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  // Fetch cart for logged-in user **after products are loaded**
  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem("auth-token");
      if (!token || loadingProducts) return;

      try {
        const res = await fetch("http://localhost:4000/getcart", {
          headers: { "auth-token": token, Accept: "application/json" },
        });
        const data = await res.json();
        if (data.success && data.cartData) {
          const normalizedCart = {};
          Object.entries(data.cartData).forEach(([id, qty]) => {
            if (qty > 0) normalizedCart[Number(id)] = qty;
          });
          setCartItems(normalizedCart);
        }
      } catch (err) {
        console.error("Fetch cart error:", err);
      }
    };

    fetchCart();
  }, [loadingProducts]); // only run after products loaded

  const syncCartWithServer = async (itemId, action = "add") => {
    const token = localStorage.getItem("auth-token");
    if (!token) return;

    try {
      const res = await fetch(
        `http://localhost:4000/${action === "add" ? "addtocart" : "removefromcart"}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", "auth-token": token },
          body: JSON.stringify({ itemId }),
        }
      );

      const data = await res.json();
      if (data.success && data.cartData) {
        const normalizedCart = {};
        Object.entries(data.cartData).forEach(([id, qty]) => {
          if (qty > 0) normalizedCart[Number(id)] = qty;
        });
        setCartItems(normalizedCart);
      }
    } catch (err) {
      console.error(`${action} cart error:`, err);
    }
  };

  const addToCart = (itemId) => syncCartWithServer(itemId, "add");
  const removeFromCart = (itemId) => syncCartWithServer(itemId, "remove");

  const getTotalCartAmount = () =>
    Object.entries(cartItems).reduce((total, [id, qty]) => {
      const product = all_product.find((p) => p.id === Number(id));
      return product ? total + qty * product.new_price : total;
    }, 0);

  const getTotalCartItems = () =>
    Object.values(cartItems).reduce((sum, qty) => sum + qty, 0);

  const getCartItemsWithDetails = () =>
    Object.entries(cartItems)
      .map(([id, qty]) => {
        const product = all_product.find((p) => p.id === Number(id));
        return product ? { ...product, qty } : null;
      })
      .filter((item) => item !== null);

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
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;