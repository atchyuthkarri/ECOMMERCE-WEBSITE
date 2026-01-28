import React, { useContext } from "react";
import "./CSS/ShopCategory.css";
import { ShopContext, BASE_URL } from "../context/ShopContext";
import Item from "../Components/Item/Item";
import dropdown_icon from "../Components/Assets/dropdown_icon.png";

const ShopCategory = ({ banner, category }) => {
  const { all_product } = useContext(ShopContext);
  const filteredProducts = all_product.filter(
    (item) => item.category.toLowerCase() === category.toLowerCase()
  );

  return (
    <div className="shop-category">
      <img className="shopcategory-banner" src={`${BASE_URL}/${banner}`} alt="banner" />

      <div className="shopcategory-indexsort">
        <p>
          <span>Showing 1-{filteredProducts.length}</span> Out of {filteredProducts.length} products
        </p>
        <div className="shopcategory-sort">
          Sort by <img src={dropdown_icon} alt="" />
        </div>
      </div>

      <div className="shopcategory-products">
        {filteredProducts.map((item) => (
          <Item key={item._id} {...item} />
        ))}
      </div>

      <div className="shopcategory-loadmore">Explore More</div>
    </div>
  );
};

export default ShopCategory;