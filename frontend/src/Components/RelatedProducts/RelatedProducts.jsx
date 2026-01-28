import React, { useContext } from "react";
import "./RelatedProducts.css";
import { ShopContext } from "../../context/ShopContext";
import Item from "../Item/Item";

const RelatedProducts = ({ currentCategory, currentId }) => {
  const { all_product } = useContext(ShopContext);

  if (!currentCategory) return null;

  // Filter products by category and exclude the current product
  let filteredProducts = all_product.filter(
    (p) => p.category === currentCategory && p._id !== currentId
  );

  // Remove duplicates based on _id (just in case)
  filteredProducts = filteredProducts.filter(
    (v, i, a) => a.findIndex((t) => t._id === v._id) === i
  );

  // Limit to 4 related products
  filteredProducts = filteredProducts.slice(0, 4);

  if (filteredProducts.length === 0) return <p>No related products found.</p>;

  return (
    <div className="relatedproducts">
      <h1>Related Products</h1>
      <hr />
      <div className="relatedproducts-item">
        {filteredProducts.map((item) => (
          <Item key={item._id} {...item} />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;