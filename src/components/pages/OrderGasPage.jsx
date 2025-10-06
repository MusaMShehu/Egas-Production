// components/pages/OrderGasPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/OrderGasPage.css';

const OrderGasPage = ({ user, setUser }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [deliveryOption, setDeliveryOption] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('wallet');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products from backend API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const response = await axios.get("https://egas-server-1.onrender.com/api/v1/products");
        // Axios automatically parses JSON
        setProducts(response.data);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  
  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setQuantity(1);
  };

  const handleQuantityChange = (action) => {
    if (action === 'increase') {
      setQuantity(quantity + 1);
    } else if (action === 'decrease' && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedProduct) return;
    
    const orderTotal = selectedProduct.price * quantity;
    const deliveryFee = deliveryOption === 'express' ? 1500 : 0;
    const totalAmount = orderTotal + deliveryFee;
    
    if (paymentMethod === 'wallet' && user.walletBalance < totalAmount) {
      alert('Insufficient wallet balance. Please choose another payment method or top up your wallet.');
      return;
    }
    
    try {
      const response = await fetch('https://egas-server-1.onrender.com/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          productId: selectedProduct.id,
          quantity,
          deliveryOption,
          paymentMethod,
          totalAmount
        }),
      });

      if (!response.ok) {
        throw new Error(`Order placement failed with status: ${response.status}`);
      }

      const orderData = await response.json();
      
      // Update user data with the order from the backend
      const updatedUser = { ...user };
      
      // Add to recent orders
      updatedUser.recentOrders.unshift(orderData);
      
      // Add to order history
      updatedUser.orderHistory.unshift(orderData);
      
      // Add transaction if paid with wallet
      if (paymentMethod === 'wallet') {
        const transactionResponse = await fetch('https://egas-server-1.onrender.com/api/transactions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user.id,
            orderId: orderData.id,
            amount: -totalAmount,
            type: 'debit'
          }),
        });

        if (!transactionResponse.ok) {
          throw new Error(`Transaction recording failed with status: ${transactionResponse.status}`);
        }

        const transactionData = await transactionResponse.json();
        updatedUser.transactions.unshift(transactionData);
        
        // Update wallet balance
        updatedUser.walletBalance -= totalAmount;
      }
      
      setUser(updatedUser);
      alert('Order placed successfully!');
    } catch (error) {
      console.error('Order placement error:', error);
      alert('Failed to place order. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="order-gas-page">
        <div className="order-container">
          <div className="loading-spinner">Loading products...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="order-gas-page">
        <div className="order-container">
          <div className="error-message">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="order-gas-page">
      <div className="order-container">
        <h2 className="text-xl font-bold mb-4">Order Gas</h2>
        <div className="order-grid">
          {/* Product Selection */}
          <div className="products-section">
            <h3 className="font-semibold mb-3">Select Product</h3>
            <div className="product-grid">
              {products.map(product => (
                <div 
                  key={product.id}
                  className={`product-card ${selectedProduct?.id === product.id ? 'selected' : ''}`}
                  onClick={() => handleProductSelect(product)}
                >
                  <div className="product-content">
                    <img src={product.image} alt={product.name} className="product-image" />
                    <div className="product-info">
                      <h4 className="product-name">{product.name}</h4>
                      <p className="product-description">{product.description}</p>
                      <p className="product-price">₦{product.price.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="order-summary">
            <h3 className="font-semibold mb-3">Order Summary</h3>
            <div>
              {selectedProduct ? (
                <>
                  <div className="summary-item">
                    <span className="text-gray-600">Product:</span>
                    <span className="font-medium">{selectedProduct.name}</span>
                  </div>
                  <div className="summary-item">
                    <span className="text-gray-600">Unit Price:</span>
                    <span className="font-medium">₦{selectedProduct.price.toLocaleString()}</span>
                  </div>
                  <div className="summary-item">
                    <span className="text-gray-600">Quantity:</span>
                    <div className="quantity-controls">
                      <button 
                        className="quantity-btn" 
                        onClick={() => handleQuantityChange('decrease')}
                      >
                        -
                      </button>
                      <span className="quantity-value">{quantity}</span>
                      <button 
                        className="quantity-btn" 
                        onClick={() => handleQuantityChange('increase')}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="order-total">
                    <span>Total:</span>
                    <span>₦{(selectedProduct.price * quantity).toLocaleString()}</span>
                  </div>
                </>
              ) : (
                <p className="text-gray-500 mb-4">Select a product to continue</p>
              )}
            </div>
            
            {selectedProduct && (
              <>
                <div className="delivery-options">
                  <h4 className="font-medium mb-2">Delivery Options</h4>
                  <div className="option-group">
                    <label className="option-label">
                      <input 
                        type="radio" 
                        name="delivery" 
                        value="standard" 
                        checked={deliveryOption === 'standard'}
                        onChange={() => setDeliveryOption('standard')}
                        className="option-input"
                      />
                      Standard Delivery (3-5 days)
                    </label>
                    <label className="option-label">
                      <input 
                        type="radio" 
                        name="delivery" 
                        value="express" 
                        checked={deliveryOption === 'express'}
                        onChange={() => setDeliveryOption('express')}
                        className="option-input"
                      />
                      Express Delivery (24 hours) - +₦1,500
                    </label>
                  </div>
                </div>
                
                <div className="payment-options">
                  <h4 className="font-medium mb-2">Payment Method</h4>
                  <div className="option-group">
                    <label className="option-label">
                      <input 
                        type="radio" 
                        name="payment" 
                        value="wallet" 
                        checked={paymentMethod === 'wallet'}
                        onChange={() => setPaymentMethod('wallet')}
                        className="option-input"
                      />
                      Pay from Wallet (Balance: ₦{user.walletBalance.toLocaleString()})
                    </label>
                    <label className="option-label">
                      <input 
                        type="radio" 
                        name="payment" 
                        value="card" 
                        checked={paymentMethod === 'card'}
                        onChange={() => setPaymentMethod('card')}
                        className="option-input"
                      />
                      Pay with Card
                    </label>
                    <label className="option-label">
                      <input 
                        type="radio" 
                        name="payment" 
                        value="transfer" 
                        checked={paymentMethod === 'transfer'}
                        onChange={() => setPaymentMethod('transfer')}
                        className="option-input"
                      />
                      Bank Transfer
                    </label>
                  </div>
                  <button 
                    className="place-order-btn" 
                    onClick={handlePlaceOrder}
                  >
                    Place Order
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderGasPage;