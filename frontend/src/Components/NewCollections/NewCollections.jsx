import React, { useEffect, useState } from "react";
import "./NewCollections.css";
import Item from "../Item/Item";
import { BASE_URL } from "../../context/ShopContext"; // reuse backend base URL

const NewCollections = () => {
  const [newCollections, setNewCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewCollections = async () => {
      try {
        const res = await fetch(`${BASE_URL}/newcollections`);
        const data = await res.json();

        setNewCollections(data.data || []);
      } catch (error) {
        console.error("Error fetching new collections:", error);
        setNewCollections([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNewCollections();
  }, []);

  return (
    <div className="new-collections">
      <h1>NEW COLLECTIONS</h1>
      <hr />
      <div className="collections">
        {loading && <p>Loading… ⏳</p>}
        {!loading && newCollections.length === 0 && <p>No new collections found</p>}
        {!loading &&
          newCollections.map((item) => (
            <Item
              key={item._id}
              _id={item._id}
              name={item.name}
              image={item.image}   // ✅ DIRECT
              new_price={item.new_price}
              old_price={item.old_price}
            />
          ))}
      </div>
    </div>
  );
};

export default NewCollections;