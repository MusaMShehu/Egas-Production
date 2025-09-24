// components/CartPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductCartPage.css';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryOption, setDeliveryOption] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('wallet');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // API base URL - replace with your actual API endpoint
  const API_BASE_URL = 'http://localhost:5000/api/v1';

  // Fetch cart items from API
  useEffect(() => {
    const fetchCartItems = async () => {
      setIsLoading(true);
      try {
        // In a real application, you would use your actual API endpoint
        // const response = await fetch(`${API_BASE_URL}/cart`, {
        //   headers: {
        //     'Authorization': `Bearer ${localStorage.getItem('token')}`
        //   }
        // });
        // const data = await response.json();
        
        // For demonstration, we'll use a timeout to simulate API call
        setTimeout(() => {
          // Mock data
          const mockCartItems = [
            { 
              _id: '1',
              productId: 'prod1', 
              name: '12kg Gas Cylinder', 
              quantity: 1, 
              price: 10500,
              image: '/images/12kg-cylinder.jpg'
            },
            { 
              _id: '2',
              productId: 'prod2', 
              name: '6kg Gas Cylinder', 
              quantity: 2, 
              price: 6000,
              image: '/images/6kg-cylinder.jpg'
            },
            { 
              _id: '3',
              productId: 'prod3', 
              name: 'Cooking Stove', 
              quantity: 1, 
              price: 8500,
              image: '/images/stove.jpg'
            }
          ];
          setCartItems(mockCartItems);
          
          // Set default delivery address from user profile
          setDeliveryAddress('123 Main St, Apt 4B, City, State');
          
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching cart items:', error);
        setError('Failed to load cart items. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        item._id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems(prevItems => prevItems.filter(item => item._id !== id));
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateDeliveryFee = () => {
    return deliveryOption === 'express' ? 1000 : 500;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateDeliveryFee();
  };

  const proceedToPayment = () => {
    // Prepare order data
    const orderData = {
      products: cartItems.map(item => ({
        product: item.productId,
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      deliveryAddress,
      deliveryOption,
      deliveryFee: calculateDeliveryFee(),
      totalAmount: calculateTotal(),
      paymentMethod
    };

    // Navigate to payment gateway page with order data
    navigate('/payment', { state: orderData });
  };

  const continueShopping = () => {
    navigate('/select_product');
  };

  const formatCurrency = (amount) => {
    return `¥${amount.toLocaleString()}`;
  };

  if (isLoading) {
    return <div className="cart-page loading">Loading cart...</div>;
  }

  return (
    <div className="cart-page">
      <div className="dashboard-header">
        <h1>Shopping Cart</h1>
        <div className="header-actions">
          <button className="btn-secondary" onClick={continueShopping}>
            <i className="fas fa-arrow-left"></i> Continue Shopping
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError('')} className="close-error">
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <i className="fas fa-shopping-cart"></i>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added any items to your cart yet.</p>
          <button className="btn-primary" onClick={continueShopping}>
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items">
            <h2>Cart Items ({cartItems.length})</h2>
            {cartItems.map((item) => (
              <div key={item._id} className="cart-item">
                <div className="item-image">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="item-details">
                  <h3 className="item-name">{item.name}</h3>
                  <p className="item-price">{formatCurrency(item.price)}</p>
                </div>
                <div className="item-quantity">
                  <button 
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                    className="quantity-btn"
                  >
                    -
                  </button>
                  <span className="quantity">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    className="quantity-btn"
                  >
                    +
                  </button>
                </div>
                <div className="item-total">
                  {formatCurrency(item.price * item.quantity)}
                </div>
                <button 
                  onClick={() => removeItem(item._id)}
                  className="remove-btn"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            ))}
          </div>

          <div className="order-summary">
            <h2>Order Summary</h2>
            
            <div className="summary-section">
              <h3>Delivery Information</h3>
              <div className="form-group">
                <label>Delivery Address:</label>
                <textarea 
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  rows="3"
                  placeholder="Enter your delivery address"
                />
              </div>
              
              <div className="form-group">
                <label>Delivery Option:</label>
                <select 
                  value={deliveryOption}
                  onChange={(e) => setDeliveryOption(e.target.value)}
                >
                  <option value="standard">Standard Delivery (3-5 days) - ¥500</option>
                  <option value="express">Express Delivery (1-2 days) - ¥1000</option>
                </select>
              </div>
            </div>

            <div className="summary-section">
              <h3>Payment Method</h3>
              <div className="payment-options">
                <label className="payment-option">
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="wallet"
                    checked={paymentMethod === 'wallet'}
                    onChange={() => setPaymentMethod('wallet')}
                  />
                  <span>Wallet</span>
                </label>
                
                <label className="payment-option">
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                  />
                  <span>Credit/Debit Card</span>
                </label>
                
                <label className="payment-option">
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="transfer"
                    checked={paymentMethod === 'transfer'}
                    onChange={() => setPaymentMethod('transfer')}
                  />
                  <span>Bank Transfer</span>
                </label>
              </div>
            </div>

            <div className="summary-section">
              <h3>Order Summary</h3>
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>{formatCurrency(calculateSubtotal())}</span>
              </div>
              <div className="summary-row">
                <span>Delivery Fee:</span>
                <span>{formatCurrency(calculateDeliveryFee())}</span>
              </div>
              <div className="summary-row total">
                <span>Total:</span>
                <span>{formatCurrency(calculateTotal())}</span>
              </div>
            </div>

            <button 
              className="btn-primary checkout-btn"
              onClick={proceedToPayment}
            >
              Proceed to Payment
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;