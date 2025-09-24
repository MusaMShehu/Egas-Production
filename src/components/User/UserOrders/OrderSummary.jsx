import React from 'react';
import '../../Products/ProductSelection.css';

const OrderSummary = ({ cartItems, onClose, onUpdateCart, total }) => {
  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    onUpdateCart({
      items: cartItems.map(item =>
        item.productId === productId ? { ...item, quantity: newQuantity } : item
      )
    });
  };

  const handleRemoveItem = (productId) => {
    onUpdateCart({
      items: cartItems.filter(item => item.productId !== productId)
    });
  };

  const handleCheckout = () => {
    // Redirect to checkout page
    window.location.href = '/checkout';
  };

  return (
    <div className="order-summary-overlay">
      <div className="order-summary-modal">
        <div className="order-summary-header">
          <h2>Your Cart</h2>
          <button className="close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="order-summary-content">
          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <i className="fas fa-shopping-cart"></i>
              <p>Your cart is empty</p>
              <button className="continue-shopping" onClick={onClose}>
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {cartItems.map(item => (
                  <div key={item.productId} className="cart-item">
                    <img 
                      src={item.image || 'default-product.jpg'} 
                      alt={item.name}
                      onError={(e) => {
                        e.target.src = 'default-product.jpg';
                      }}
                    />
                    <div className="item-details">
                      <h4>{item.name}</h4>
                      <p className="item-price">${item.price.toFixed(2)}</p>
                    </div>
                    <div className="quantity-controls">
                      <button
                        onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    <div className="item-total">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                    <button
                      className="remove-item"
                      onClick={() => handleRemoveItem(item.productId)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                ))}
              </div>

              <div className="order-total">
                <div className="total-row">
                  <span>Subtotal:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="total-row">
                  <span>Shipping:</span>
                  <span>$0.00</span>
                </div>
                <div className="total-row grand-total">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="checkout-actions">
                <button className="continue-shopping" onClick={onClose}>
                  Continue Shopping
                </button>
                <button className="checkout-btn" onClick={handleCheckout}>
                  Proceed to Checkout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;