import React, { useState, useEffect } from 'react';
import cartAPI from '../../api/cartApi';
import { useNavigate } from 'react-router-dom';
import './ProductCart.css';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

  // Checkout form state
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('Nigeria');

  const navigate = useNavigate();

  // Fetch cart items
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

  // Calculate totals
  const calculateTotals = () => {
    const subtotal = cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
    const tax = subtotal * 0.08;
    const shipping = subtotal > 0 ? (subtotal > 50000 ? 0 : 2999) : 0;
    const total = subtotal + tax + shipping - discount;

    return {
      subtotal: subtotal.toFixed(2),
      tax: tax.toFixed(2),
      shipping: shipping.toFixed(2),
      discount: discount.toFixed(2),
      total: total.toFixed(2),
      rawTotal: total // For actual payment amount
    };
  };

  const totals = calculateTotals();

  // Update quantity safely
  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      await cartAPI.updateCartItem(itemId, newQuantity);
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item._id === itemId
            ? { ...item, quantity: Math.min(newQuantity, item.product.stock) }
            : item
        )
      );
    } catch (err) {
      console.error('Failed to update quantity:', err);
      alert('Failed to update quantity. Please try again.');
    }
  };

  // Remove item
  const removeItem = async (itemId) => {
    try {
      await cartAPI.removeFromCart(itemId);
      setCartItems((prevItems) => prevItems.filter((item) => item._id !== itemId));
    } catch (err) {
      console.error('Failed to remove item:', err);
      alert('Failed to remove item. Please try again.');
    }
  };

  // Apply coupon
  const applyCoupon = async () => {
    if (!couponCode.trim()) return;

    setIsApplyingCoupon(true);
    setTimeout(() => {
      if (couponCode.toUpperCase() === 'SAVE10') {
        setDiscount(1000);
        alert('Coupon applied successfully! ₦1000 discount added.');
      } else {
        alert('Invalid coupon code. Please try again.');
      }
      setIsApplyingCoupon(false);
    }, 1000);
  };

  // Open checkout form
  const proceedToCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty. Add some products first!');
      return;
    }
    setShowCheckoutForm(true);
    setSelectedPaymentMethod(null); // Reset payment method when opening form
  };

  // Create order with selected payment method
  const createOrder = async (paymentMethod) => {
    if (!validateAddress()) return;

    setIsProcessingPayment(true);
    try {
      const orderPayload = {
        products: cartItems.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
        })),
        address: address,
        city: city,
        postalCode: postalCode,
        country: country,
        deliveryOption: "standard",
        paymentMethod: paymentMethod // Set payment method based on button clicked
      };

      const res = await fetch('https://egas-server-1.onrender.com/api/v1/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(orderPayload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to create order');
      }

      const data = await res.json();
      return data;
      
    } catch (err) {
      console.error('Order creation failed:', err);
      throw err;
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Handle Wallet Payment
  // Handle Wallet Payment
const handleWalletPayment = async () => {
  setSelectedPaymentMethod('wallet');
  try {
    const result = await createOrder('wallet');
    
    if (result.success) {
      alert('Order placed successfully with wallet payment!');
      setShowCheckoutForm(false);
      
      // Show order details before redirecting
      const orderDetails = result.data;
      const orderSummary = `
Order Placed Successfully!

Order ID: ${orderDetails._id}
Total Amount: ₦${orderDetails.totalAmount?.toFixed(2) || totals.total}
Payment Method: Wallet Balance
Status: ${orderDetails.orderStatus || 'confirmed'}

You will be redirected to your order details in 4 seconds...
      `;
      
      alert(orderSummary);
      
      // Clear cart after successful order
      await clearCart();
      
      // Wait 4 seconds before redirecting to show the order details
      setTimeout(() => {
        navigate('/dashboard/orders');
      }, 4000);
    }
    
  } catch (err) {
    console.error('Wallet payment failed:', err);
    alert(err.message || 'Wallet payment failed. Please try again.');
  }
};

  // Handle Paystack Payment
  const handlePaystackPayment = async () => {
    setSelectedPaymentMethod('paystack');
    try {
      const result = await createOrder('paystack');
      
      if (result.success) {
        // Redirect to Paystack payment page
        if (result.authorization_url) {
          window.location.href = result.authorization_url;
        } else {
          throw new Error('Payment initialization failed');
        }
      }
      
    } catch (err) {
      console.error('Paystack payment failed:', err);
      alert(err.message || 'Paystack payment failed. Please try again.');
    }
  };

  // Clear cart after successful order
  const clearCart = async () => {
    try {
      await cartAPI.clearCart();
      setCartItems([]);
    } catch (err) {
      console.error('Failed to clear cart:', err);
    }
  };

  // Validate address fields
  const validateAddress = () => {
    if (!address.trim()) {
      alert('Please enter your address');
      return false;
    }
    if (!city.trim()) {
      alert('Please enter your city');
      return false;
    }
    if (!postalCode.trim()) {
      alert('Please enter your postal code');
      return false;
    }
    return true;
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
        <h3>Error Loading Cart</h3>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="cart-page-container">
      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added any items yet.</p>
        </div>
      ) : (
        <div className="cart-content">
          {/* Cart Items */}
          <div className="cart-items">
            <h2>Cart Items ({cartItems.length})</h2>
            {cartItems.map((item) => (
              <div key={item._id} className="cart-item">
                <div className="item-image">
                  <img
                    src={item.product.image || '/images/default-product.jpg'}
                    alt={item.product.name}
                    onError={(e) => {
                      e.target.src = '/images/logo.png';
                    }}
                  />
                </div>
                <div className="item-details">
                  <h3>{item.product.name}</h3>
                  <p>{item.product.description}</p>
                </div>
                <div className="item-price">₦{item.product.price.toFixed(2)}</div>
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
                  ₦{(item.product.price * item.quantity).toFixed(2)}
                </div>
                <button
                  className="remove-item-btn"
                  onClick={() => removeItem(item._id)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="order-summary">
            <h2>Order Summary</h2>
            <div className="summary-line">
              <span>Subtotal</span>
              <span>₦{totals.subtotal}</span>
            </div>
            <div className="summary-line">
              <span>Tax (8%)</span>
              <span>₦{totals.tax}</span>
            </div>
            <div className="summary-line">
              <span>Shipping</span>
              <span>
                {totals.shipping === '0.00' ? 'FREE' : `₦${totals.shipping}`}
              </span>
            </div>
            {discount > 0 && (
              <div className="summary-line discount">
                <span>Discount</span>
                <span>-₦{totals.discount}</span>
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
              <span>₦{totals.total}</span>
            </div>
            <button className="checkout-btn" onClick={proceedToCheckout}>
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}

      {/* Checkout Form Modal */}
      {showCheckoutForm && (
        <div className="checkout-modal">
          <div className="checkout-form-container">
            <h2>Checkout</h2>
            <div className="checkout-info">
              <p><strong>Total Amount:</strong> ₦{totals.total}</p>
              <p><strong>Items:</strong> {cartItems.length} product(s)</p>
            </div>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="form-group">
                <label>Address *</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  placeholder="Enter your full address"
                />
              </div>
              <div className="form-group">
                <label>City *</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  placeholder="Enter your city"
                />
              </div>
              <div className="form-group">
                <label>Postal Code *</label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  required
                  placeholder="Enter postal code"
                />
              </div>
              <div className="form-group">
                <label>Country</label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  required
                />
              </div>
              
              <div className="payment-buttons-container">
                <h3>Choose Payment Method</h3>
                <div className="payment-buttons">
                  <button 
                    type="button"
                    className={`payment-btn wallet-btn ${selectedPaymentMethod === 'wallet' ? 'selected' : ''}`}
                    onClick={handleWalletPayment}
                    disabled={isProcessingPayment}
                  >
                    {isProcessingPayment && selectedPaymentMethod === 'wallet' ? 'Processing...' : 'Pay with Wallet Balance'}
                  </button>
                  <button 
                    type="button"
                    className={`payment-btn paystack-btn ${selectedPaymentMethod === 'paystack' ? 'selected' : ''}`}
                    onClick={handlePaystackPayment}
                    disabled={isProcessingPayment}
                  >
                    {isProcessingPayment && selectedPaymentMethod === 'paystack' ? 'Processing...' : 'Pay with Paystack'}
                  </button>
                </div>
                {selectedPaymentMethod && (
                  <p className="payment-selected-message">
                    Selected: <strong>{selectedPaymentMethod === 'wallet' ? 'Wallet Balance' : 'Paystack'}</strong>
                  </p>
                )}
              </div>

              <div className="checkout-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => {
                    setShowCheckoutForm(false);
                    setSelectedPaymentMethod(null);
                  }}
                  disabled={isProcessingPayment}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;