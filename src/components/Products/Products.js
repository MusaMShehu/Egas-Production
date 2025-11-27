// src/components/Products/Products.js
import React from 'react';
import ProductsList from "./ProductsList";
import Services from "../Services/Services"
import './Products.css';

const Products = () => {
 
  return (
    <div className="products-page">
      
      <ProductsList/>
      <Services/>
    </div>
  );
};

export default Products;