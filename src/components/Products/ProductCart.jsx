import React, { useState, useEffect } from 'react';
import { cartAPI } from './api';
import './CartPage.css';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  // Fetch cart items from API
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        setLoading(true);
        setError(null);
        const cartData = await cartAPI.getCart();
        setCartItems(cartData.items || []);
      } catch (err) {
        console.error('Failed to fetch cart items:', err);
        setError('Failed to load cart items. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  // Calculate cart totals
  const calculateTotals = () => {
    const subtotal = cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    const tax = subtotal * 0.08; // 8% tax
    const shipping = subtotal > 0 ? (subtotal > 50 ? 0 : 5.99) : 0;
    const total = subtotal + tax + shipping - discount;

    return {
      subtotal: subtotal.toFixed(2),
      tax: tax.toFixed(2),
      shipping: shipping.toFixed(2),
      discount: discount.toFixed(2),
      total: total.toFixed(2)
    };
  };

  const totals = calculateTotals();

  // Update item quantity
  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      await cartAPI.updateCartItem(itemId, newQuantity);
      setCartItems(prevItems => 
        prevItems.map(item => 
          item._id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (err) {
      console.error('Failed to update quantity:', err);
      alert('Failed to update quantity. Please try again.');
    }
  };

  // Remove item from cart
  const removeItem = async (itemId) => {
    try {
      await cartAPI.removeFromCart(itemId);
      setCartItems(prevItems => prevItems.filter(item => item._id !== itemId));
    } catch (err) {
      console.error('Failed to remove item:', err);
      alert('Failed to remove item. Please try again.');
    }
  };

  // Apply coupon code
  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    
    setIsApplyingCoupon(true);
    try {
      // In a real app, you would validate the coupon via API
      // For this example, we'll simulate an API call
      setTimeout(() => {
        if (couponCode.toUpperCase() === 'SAVE10') {
          setDiscount(10);
          alert('Coupon applied successfully! $10 discount added.');
        } else {
          alert('Invalid coupon code. Please try again.');
        }
        setIsApplyingCoupon(false);
      }, 1000);
    } catch (err) {
      console.error('Failed to apply coupon:', err);
      alert('Failed to apply coupon. Please try again.');
      setIsApplyingCoupon(false);
    }
  };

  // Proceed to checkout
  const proceedToCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty. Add some products first!');
      return;
    }
    
    alert('Proceeding to checkout! In a real app, this would redirect to a checkout page.');
    // In a real app: history.push('/checkout');
  };

  // Continue shopping
  const continueShopping = () => {
    // In a real app: history.push('/products');
    alert('Continuing shopping! In a real app, this would redirect to the products page.');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your cart...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <i className="fas fa-exclamation-triangle"></i>
        <h3>Error Loading Cart</h3>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="cart-page-container">
      <header className="page-header">
        <h1>Your Shopping Cart</h1>
        <p>Review your items and proceed to checkout</p>
      </header>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <i className="fas fa-shopping-cart"></i>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added any items to your cart yet.</p>
          <button className="continue-shopping-btn" onClick={continueShopping}>
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items">
            <h2>Cart Items ({cartItems.length})</h2>
            
            {cartItems.map(item => (
              <div key={item._id} className="cart-item">
                <div className="item-image">
                  <img 
                    src={item.product.image || 'default-product.jpg'} 
                    alt={item.product.name}
                    onError={(e) => {
                      e.target.src = 'default-product.jpg';
                    }}
                  />
                </div>
                
                <div className="item-details">
                  <h3>{item.product.name}</h3>
                  <p className="item-category">{item.product.category}</p>
                  <p className="item-description">{item.product.description}</p>
                </div>
                
                <div className="item-price">${item.product.price.toFixed(2)}</div>
                
                <div className="item-quantity">
                  <button 
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    disabled={item.quantity >= item.product.stock}
                  >
                    +
                  </button>
                </div>
                
                <div className="item-total">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </div>
                
                <button 
                  className="remove-item-btn"
                  onClick={() => removeItem(item._id)}
                  title="Remove item"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            ))}
          </div>

          <div className="order-summary">
            <h2>Order Summary</h2>
            
            <div className="summary-line">
              <span>Subtotal</span>
              <span>${totals.subtotal}</span>
            </div>
            
            <div className="summary-line">
              <span>Tax (8%)</span>
              <span>${totals.tax}</span>
            </div>
            
            <div className="summary-line">
              <span>Shipping</span>
              <span>{totals.shipping === '0.00' ? 'FREE' : `$${totals.shipping}`}</span>
            </div>
            
            {discount > 0 && (
              <div className="summary-line discount">
                <span>Discount</span>
                <span>-${totals.discount}</span>
              </div>
            )}
            
            <div className="coupon-section">
              <input
                type="text"
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                disabled={discount > 0}
              />
              <button 
                onClick={applyCoupon}
                disabled={!couponCode.trim() || discount > 0 || isApplyingCoupon}
              >
                {isApplyingCoupon ? 'Applying...' : 'Apply'}
              </button>
            </div>
            
            <div className="summary-total">
              <span>Total</span>
              <span>${totals.total}</span>
            </div>
            
            <button 
              className="checkout-btn"
              onClick={proceedToCheckout}
            >
              Proceed to Checkout
            </button>
            
            <button 
              className="continue-shopping-btn"
              onClick={continueShopping}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;