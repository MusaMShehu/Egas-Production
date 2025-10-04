import React, { useState, useEffect } from 'react';
import cartAPI from '../../api/cartApi';
import { payWithWallet } from '../../api/walletPaymentApi';
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

  // Checkout form state
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('Nigeria');
  const [paymentMethod, setPaymentMethod] = useState('wallet');

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
  };

  // Checkout submit
  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    try {
      if (cartItems.length === 0) {
        alert('Your cart is empty!');
        return;
      }

      // Build correct payload
      const orderPayload = {
        products: cartItems.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
        })),
        deliveryAddress: { address, city, postalCode, country },
        paymentMethod,
      };

      const res = await fetch('http://localhost:5000/api/v1/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(orderPayload),
      });

      if (!res.ok) throw new Error('Failed to create order');
      const data = await res.json();
      const orderId = data.data._id;

      const totalAmount = cartItems.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0
      );

      // Wallet payment
      if (paymentMethod === 'wallet') {
        const result = await payWithWallet(orderId, totalAmount);
        alert('Wallet payment successful!');
        navigate(`/orders/${result.order._id}`);
      }

      // Paystack payment
      if (paymentMethod === 'paystack') {
        const PaystackPop = (await import('@paystack/inline-js')).default;
        const paystack = new PaystackPop();

        paystack.newTransaction({
          key: process.env.REACT_APP_PAYSTACK_PUBLIC_KEY,
          email: localStorage.getItem('userEmail'),
          amount: totalAmount * 100,
          onSuccess: async (transaction) => {
            alert(`Payment Successful! Ref: ${transaction.reference}`);

            await fetch(
              `http://localhost:5000/api/v1/orders/${orderId}/pay`,
              {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ transactionId: transaction.reference }),
              }
            );

            navigate(`/orders/${orderId}`);
          },
          onCancel: () => {
            alert('Payment cancelled');
          },
        });
      }
    } catch (err) {
      console.error('Checkout failed:', err);
      alert(err.message || 'Checkout failed. Please try again.');
    }
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
            <form onSubmit={handleCheckoutSubmit}>
              <div className="form-group">
                <label>Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Postal Code</label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  required
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
              <div className="form-group">
                <label>Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="wallet">Pay from Wallet</option>
                  <option value="paystack">Pay directly via Paystack</option>
                </select>
              </div>
              <div className="checkout-actions">
                <button type="submit" className="confirm-btn">
                  Confirm Order
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowCheckoutForm(false)}
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
