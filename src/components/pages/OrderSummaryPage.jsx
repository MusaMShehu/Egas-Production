// src/components/OrderDetail/OrderDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../styles/OrderSummary.css';

const OrderDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError('');
        
        // API call to fetch product details
        const response = await fetch(`/api/products/${productId}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch product: ${response.status}`);
        }
        
        const productData = await response.json();
        setProduct(productData);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError('Failed to load product details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check if product is in stock
    if (product.stock < quantity) {
      setError(`Only ${product.stock} items available in stock`);
      return;
    }
    
    navigate('/checkout', { 
      state: { 
        product: { ...product, quantity },
        total: product.price * quantity
      }
    });
  };

  if (loading) {
    return (
      <div className="order-detail-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="order-detail-page">
        <div className="error-container">
          <h3>Error</h3>
          <p>{error || 'Product not found'}</p>
          <button 
            className="btn-primary" 
            onClick={() => navigate('/products')}
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="order-detail-page">
      <section className="page-hero">
        <h2>Order Details</h2>
        <p>Review your selection before proceeding to checkout</p>
      </section>

      <div className="order-detail-container">
        <div className="product-detail">
          <img 
            src={product.image} 
            alt={product.name} 
            onError={(e) => {
              e.target.src = '/images/placeholder-product.jpg';
            }}
          />
          <div className="product-info">
            <h3>{product.name}</h3>
            <p className="description">{product.description}</p>
            <p className="price">₦{product.price.toLocaleString()}</p>
            <p className={`stock-status ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
              {product.stock > 0 
                ? `${product.stock} available in stock` 
                : 'Out of stock'
              }
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="order-form">
          <div className="form-group">
            <label htmlFor="quantity">Quantity:</label>
            <input
              type="number"
              id="quantity"
              min="1"
              max={product.stock}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              required
              disabled={product.stock === 0}
            />
            {product.stock > 0 && (
              <span className="quantity-note">
                Maximum: {product.stock} units
              </span>
            )}
          </div>

          <div className="order-summary">
            <h4>Order Summary</h4>
            <div className="summary-item">
              <span>Subtotal:</span>
              <span>₦{(product.price * quantity).toLocaleString()}</span>
            </div>
            <div className="summary-item">
              <span>Delivery Fee:</span>
              <span>₦1,000</span>
            </div>
            <div className="summary-item total">
              <span>Total:</span>
              <span>₦{(product.price * quantity + 1000).toLocaleString()}</span>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button 
            type="submit" 
            className="btn-primary"
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? 'Out of Stock' : 'Proceed to Checkout'}
          </button>
          
          {product.stock === 0 && (
            <p className="out-of-stock-message">
              This product is currently out of stock. Please check back later.
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default OrderDetail;