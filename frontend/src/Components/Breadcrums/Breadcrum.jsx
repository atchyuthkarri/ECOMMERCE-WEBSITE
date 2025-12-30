import React from 'react';
import "./Breadcrum.css";
import arrow_icon from "../Assets/breadcrum_arrow.png";

const Breadcrum = ({ product }) => {
  // If product is not yet loaded, render a placeholder or nothing
  if (!product) return <div className='breadcrum'>Loading...</div>;

  return (
    <div className='breadcrum'>
      HOME <img src={arrow_icon} alt="arrow" /> 
      SHOP <img src={arrow_icon} alt="arrow" /> 
      {product.category?.toUpperCase()} <img src={arrow_icon} alt="arrow" /> 
      {product.name?.toUpperCase()}
    </div>
  );
};

export default Breadcrum;