// src/components/Products/Products.js
import React from 'react';
import ProductsList from "./ProductsList";
import './Products.css';

const Products = () => {
  const gasProducts = [
    {
      id: 1,
      name: "5kg Cylinder",
      description: "Perfect for small households or occasional use",
      price: "₦5,000",
      image: "images/istockphoto-2152831248-612x612.jpg",
      link: "order.html?product=5kg"
    },
    {
      id: 2,
      name: "12kg Cylinder",
      description: "Ideal for medium-sized families",
      price: "₦10,500",
      image: "images/istockphoto-2152831245-612x612.jpg",
      link: "order.html?product=12kg"
    },
    {
      id: 3,
      name: "25kg Cylinder",
      description: "For large families or small businesses",
      price: "₦20,000",
      image: "images/istockphoto-2152826197-612x612.jpg",
      link: "order.html?product=25kg"
    },
    {
      id: 4,
      name: "50kg Cylinder",
      description: "Commercial size for restaurants and industries",
      price: "₦38,000",
      image: "images/istockphoto-2152826188-612x612.jpg",
      link: "order.html?product=50kg"
    }
  ];

  const accessoryProducts = [
    {
      id: 1,
      name: "Gas Cookers",
      description: "High-efficiency burners for your kitchen",
      price: "From ₦15,000",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1511&q=80",
      link: "order.html?product=cooker"
    },
    {
      id: 2,
      name: "Safety Hoses",
      description: "Durable, high-pressure gas hoses",
      price: "From ₦3,500",
      image: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwa90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      link: "order.html?product=hose"
    },
    {
      id: 3,
      name: "Gas Regulators",
      description: "Precision pressure regulators",
      price: "From ₦6,000",
      image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      link: "order.html?product=regulator"
    },
    {
      id: 4,
      name: "Gas Detectors",
      description: "Early warning for gas leaks",
      price: "From ₦12,000",
      image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      link: "order.html?product=detector"
    }
  ];

  return (
    <div className="products-page">
      {/* <Header /> */}
      
      {/* Products Hero Section */}
      {/* <section className="page-hero">
        <h2>Our Products</h2>
        <p>High-quality gas solutions for every need</p>
      </section>

      {/* Product Categories */}
      <section className="product-categories">
        <div className="section-header">
          <h3>Gas Cylinders</h3>
          <p>We offer various sizes to suit your requirements</p>
        </div>
        
        <div className="products-grid">
          {gasProducts.map(product => (
            <div key={product.id} className="product-card">
              <img src={product.image} alt={product.name} />
              <h4>{product.name}</h4>
              <p>{product.description}</p>
              <div className="product-price">{product.price}</div>
              <button onClick={() => window.location.href = product.link}>
                Order Now
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Accessories Section */}
      <section className="product-categories">
        <div className="section-header">
          <h3>Accessories</h3>
          <p>Everything you need for safe gas usage</p>
        </div>
        
        <div className="products-grid">
          {accessoryProducts.map(product => (
            <div key={product.id} className="product-card">
              <img src={product.image} alt={product.name} />
              <h4>{product.name}</h4>
              <p>{product.description}</p>
              <div className="product-price">{product.price}</div>
              <button onClick={() => window.location.href = product.link}>
                View Options
              </button>
            </div>
          ))}
        </div>
      </section> */
      <ProductsList/>

      {/* <Footer /> */}
    </div>
  );
};

export default Products;