import React, { useEffect, useState } from "react";
import "./Popular.css";
import Item from "../Item/Item";
import { BASE_URL } from "../../context/ShopContext"; // reuse your backend base URL

const Popular = () => {
  const [popularProducts, setPopularProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularProducts = async () => {
      try {
        const res = await fetch(`${BASE_URL}/popularinwomen`);
        const data = await res.json();

        const products = data.data || []; // backend returns in "data"
        // Ensure we only take 4 products
        setPopularProducts(products.slice(0, 4));
      } catch (error) {
        console.error("Error fetching popular products:", error);
        setPopularProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularProducts();
  }, []);

  return (
    <div className="popular">
      <h1>POPULAR IN WOMEN</h1>
      <hr />

      <div className="popular-item">
        {loading && <p>Loading… ⏳</p>}
        {!loading && popularProducts.length === 0 && <p>No popular products found</p>}

        {!loading &&
          popularProducts.map((item) => (
            <Item
              key={item._id}
              _id={item._id}
              name={item.name}
              image={item.image}   // ✅ NO BASE_URL
              new_price={item.new_price}
              old_price={item.old_price}
            />
          ))}
      </div>
    </div>
  );
};

export default Popular;