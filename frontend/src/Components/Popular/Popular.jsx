import React, { useEffect, useState } from "react";
import "./Popular.css";
import Item from "../Item/Item.jsx";

// Backend base URL
export const BASE_URL = "https://ecommerce-backend-9yw2.onrender.com";

const Popular = () => {
  const [popularProducts, setPopularProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularProducts = async () => {
      try {
        const res = await fetch(`${BASE_URL}/popularinwomen`);
        const data = await res.json();

        // ✅ Always ensure array
        setPopularProducts(
          Array.isArray(data)
            ? data
            : data.popularProducts || data.data || []
        );
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
        {loading && <p>Waking up server… ⏳</p>}

        {!loading && popularProducts.length === 0 && (
          <p>No popular products found</p>
        )}

        {!loading &&
          popularProducts.map((item, i) => (
            <Item
              key={i}
              id={item.id}
              name={item.name}
              image={item.image}
              new_price={item.new_price}
              old_price={item.old_price}
            />
          ))}
      </div>
    </div>
  );
};

export default Popular;