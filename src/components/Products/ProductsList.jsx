// src/components/Products/Products.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Products.css';

const Products = () => {
  const [gasProducts, setGasProducts] = useState([]);
  const [accessoryProducts, setAccessoryProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, you would fetch these from your API
    const fetchProducts = async () => {
      try {
        // Simulate API call
        setTimeout(() => {
          const gasData = [
            {
              id: 1,
              name: "5kg Cylinder",
              description: "Perfect for small households or occasional use",
              price: 5000,
              image: "images/istockphoto-2152831248-612x612.jpg",
              category: "gas"
            },
            {
              id: 2,
              name: "12kg Cylinder",
              description: "Ideal for medium-sized families",
              price: 10500,
              image: "images/istockphoto-2152831245-612x612.jpg",
              category: "gas"
            },
            {
              id: 3,
              name: "25kg Cylinder",
              description: "For large families or small businesses",
              price: 20000,
              image: "images/istockphoto-2152826197-612x612.jpg",
              category: "gas"
            },
            {
              id: 4,
              name: "50kg Cylinder",
              description: "Commercial size for restaurants and industries",
              price: 38000,
              image: "images/istockphoto-2152826188-612x612.jpg",
              category: "gas"
            }
          ];

          const accessoryData = [
            {
              id: 5,
              name: "Gas Cookers",
              description: "High-efficiency burners for your kitchen",
              price: 15000,
              image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1511&q=80",
              category: "accessory"
            },
            {
              id: 6,
              name: "Safety Hoses",
              description: "Durable, high-pressure gas hoses",
              price: 3500,
              image: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwa90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
              category: "accessory"
            },
            {
              id: 7,
              name: "Gas Regulators",
              description: "Precision pressure regulators",
              price: 6000,
              image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
              category: "accessory"
            },
            {
              id: 8,
              name: "Gas Detectors",
              description: "Early warning for gas leaks",
              price: 12000,
              image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
              category: "accessory"
            }
          ];

          setGasProducts(gasData);
          setAccessoryProducts(accessoryData);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  return (
    <div className="products-page">
      {/* Products Hero Section */}
      <section className="page-hero">
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
              <div className="product-price">₦{product.price.toLocaleString()}</div>
              <Link to={`/order/${product.id}`} className="btn-primary">
                Order Now
              </Link>
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
              <div className="product-price">₦{product.price.toLocaleString()}</div>
              <Link to={`/order/${product.id}`} className="btn-primary">
                View Options
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Products;