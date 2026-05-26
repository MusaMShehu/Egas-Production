// import React from 'react';
// import '../../Products/ProductSelection.css';
// import { successToast, errorToast, infoToast, warningToast } from "../../../utils/toast";

// const OrderSummary = ({ cartItems, onClose, onUpdateCart, total }) => {
//   const handleQuantityChange = (productId, newQuantity) => {
//     if (newQuantity < 1) return;
    
//     const product = cartItems.find(item => item.productId === productId);
    
//     onUpdateCart({
//       items: cartItems.map(item =>
//         item.productId === productId ? { ...item, quantity: newQuantity } : item
//       )
//     });

//     if (newQuantity > product.quantity) {
//       successToast(`Increased ${product.name} quantity to ${newQuantity}`);
//     } else {
//       infoToast(`Decreased ${product.name} quantity to ${newQuantity}`);
//     }
//   };

//   const handleRemoveItem = (productId) => {
//     const productToRemove = cartItems.find(item => item.productId === productId);
    
//     if (productToRemove) {
//       onUpdateCart({
//         items: cartItems.filter(item => item.productId !== productId)
//       });
//       warningToast(`Removed ${productToRemove.name} from cart`);
//     }
//   };

//   const handleCheckout = () => {
//     if (cartItems.length === 0) {
//       errorToast('Cannot proceed to checkout with empty cart');
//       return;
//     }

//     infoToast('Redirecting to checkout...');
//     setTimeout(() => {
//       window.location.href = '/checkout';
//     }, 1000);
//   };

//   const handleContinueShopping = () => {
//     infoToast('Continuing shopping...');
//     onClose();
//   };

//   const handleCloseCart = () => {
//     if (cartItems.length > 0) {
//       infoToast('Cart closed. Your items are saved.');
//     } else {
//       infoToast('Cart closed');
//     }
//     onClose();
//   };

//   const getTotalItems = () => {
//     return cartItems.reduce((total, item) => total + item.quantity, 0);
//   };

//   const handleImageError = (e, productName) => {
//     e.target.src = 'default-product.jpg';
//     warningToast(`Could not load image for ${productName}, using default image`);
//   };

//   return (
//     <div className="order-summary-overlay">
//       <div className="order-summary-modal">
//         <div className="order-summary-header">
//           <h2>Your Cart {cartItems.length > 0 && `(${getTotalItems()} items)`}</h2>
//           <button className="close-btn" onClick={handleCloseCart}>
//             <i className="fas fa-times"></i>
//           </button>
//         </div>

//         <div className="order-summary-content">
//           {cartItems.length === 0 ? (
//             <div className="empty-cart">
//               <i className="fas fa-shopping-cart"></i>
//               <p>Your cart is empty</p>
//               <button className="continue-shopping" onClick={handleContinueShopping}>
//                 Continue Shopping
//               </button>
//             </div>
//           ) : (
//             <>
//               <div className="cart-items">
//                 {cartItems.map(item => (
//                   <div key={item.productId} className="cart-item">
//                     <img 
//                       src={item.image || 'default-product.jpg'} 
//                       alt={item.name}
//                       onError={(e) => handleImageError(e, item.name)}
//                     />
//                     <div className="item-details">
//                       <h4>{item.name}</h4>
//                       <p className="item-price">₦{item.price.toFixed(2)}</p>
//                     </div>
//                     <div className="quantity-controls">
//                       <button
//                         onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
//                         disabled={item.quantity <= 1}
//                         title="Decrease quantity"
//                       >
//                         -
//                       </button>
//                       <span>{item.quantity}</span>
//                       <button
//                         onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
//                         title="Increase quantity"
//                       >
//                         +
//                       </button>
//                     </div>
//                     <div className="item-total">
//                       ₦{(item.price * item.quantity).toFixed(2)}
//                     </div>
//                     <button
//                       className="remove-item"
//                       onClick={() => handleRemoveItem(item.productId)}
//                       title={`Remove ${item.name} from cart`}
//                     >
//                       <i className="fas fa-trash"></i>
//                     </button>
//                   </div>
//                 ))}
//               </div>

//               <div className="order-total">
//                 <div className="total-row">
//                   <span>Subtotal:</span>
//                   <span>₦{total.toFixed(2)}</span>
//                 </div>
//                 <div className="total-row">
//                   <span>Shipping:</span>
//                   <span>₦0.00</span>
//                 </div>
//                 <div className="total-row">
//                   <span>Tax:</span>
//                   <span>₦0.00</span>
//                 </div>
//                 <div className="total-row grand-total">
//                   <span>Total:</span>
//                   <span>₦{total.toFixed(2)}</span>
//                 </div>
//               </div>

//               <div className="checkout-actions">
//                 <button 
//                   className="continue-shopping" 
//                   onClick={handleContinueShopping}
//                 >
//                   Continue Shopping
//                 </button>
//                 <button 
//                   className="checkout-btn" 
//                   onClick={handleCheckout}
//                 >
//                   Proceed to Checkout (₦{total.toFixed(2)})
//                 </button>
//               </div>

//               <div className="cart-help-info">
//                 <p>
//                   <i className="fas fa-info-circle"></i>
//                   Your cart will be saved for later
//                 </p>
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OrderSummary;























// src/components/OrderSummary.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../../api/apiService';
import { useAuth } from '../../../contexts/AuthContext';
import '../../Products/ProductSelection.css';
import { successToast, errorToast, infoToast, warningToast } from "../../../utils/toast";

const OrderSummary = ({ cartItems, onClose, onUpdateCart, total }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    const product = cartItems.find(item => item.productId === productId);
    
    // Update local state
    onUpdateCart({
      items: cartItems.map(item =>
        item.productId === productId ? { ...item, quantity: newQuantity } : item
      )
    });

    // Sync with backend
    try {
      await ApiService.cart.update(productId, newQuantity);
      if (newQuantity > product.quantity) {
        successToast(`Increased ${product.name} quantity to ${newQuantity}`);
      } else {
        infoToast(`Decreased ${product.name} quantity to ${newQuantity}`);
      }
    } catch (error) {
      console.error('Failed to update cart:', error);
      errorToast('Failed to update cart. Please try again.');
    }
  };

  const handleRemoveItem = async (productId) => {
    const productToRemove = cartItems.find(item => item.productId === productId);
    
    if (productToRemove) {
      try {
        await ApiService.cart.remove(productId);
        onUpdateCart({
          items: cartItems.filter(item => item.productId !== productId)
        });
        warningToast(`Removed ${productToRemove.name} from cart`);
      } catch (error) {
        console.error('Failed to remove item:', error);
        errorToast('Failed to remove item. Please try again.');
      }
    }
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      errorToast('Cannot proceed to checkout with empty cart');
      return;
    }

    if (!isAuthenticated) {
      warningToast('Please log in to proceed to checkout');
      setTimeout(() => navigate('/auth'), 1000);
      return;
    }

    setIsProcessingCheckout(true);
    infoToast('Preparing checkout...');

    try {
      // First, ensure cart is synced with backend
      const cartResponse = await ApiService.cart.get();
      if (cartResponse.success && cartResponse.data) {
        // Proceed to checkout
        setTimeout(() => {
          navigate('/checkout');
          successToast('Redirecting to checkout');
        }, 500);
      } else {
        throw new Error('Failed to verify cart');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      errorToast('Failed to proceed to checkout. Please try again.');
    } finally {
      setIsProcessingCheckout(false);
    }
  };

  const handleContinueShopping = () => {
    infoToast('Continuing shopping...');
    onClose();
  };

  const handleCloseCart = () => {
    if (cartItems.length > 0) {
      infoToast('Cart closed. Your items are saved.');
    } else {
      infoToast('Cart closed');
    }
    onClose();
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const handleImageError = (e, productName) => {
    e.target.src = '/images/default-product.jpg';
    warningToast(`Could not load image for ${productName}, using default image`);
  };

  return (
    <div className="order-summary-overlay">
      <div className="order-summary-modal">
        <div className="order-summary-header">
          <h2>Your Cart {cartItems.length > 0 && `(${getTotalItems()} items)`}</h2>
          <button className="close-btn" onClick={handleCloseCart}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="order-summary-content">
          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <i className="fas fa-shopping-cart"></i>
              <p>Your cart is empty</p>
              <button className="continue-shopping" onClick={handleContinueShopping}>
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {cartItems.map(item => (
                  <div key={item.productId} className="cart-item">
                    <img 
                      src={item.image || '/images/default-product.jpg'} 
                      alt={item.name}
                      onError={(e) => handleImageError(e, item.name)}
                    />
                    <div className="item-details">
                      <h4>{item.name}</h4>
                      <p className="item-price">₦{item.price.toFixed(2)}</p>
                    </div>
                    <div className="quantity-controls">
                      <button
                        onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        title="Decrease quantity"
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                        title="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                    <div className="item-total">
                      ₦{(item.price * item.quantity).toFixed(2)}
                    </div>
                    <button
                      className="remove-item"
                      onClick={() => handleRemoveItem(item.productId)}
                      title={`Remove ${item.name} from cart`}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                ))}
              </div>

              <div className="order-total">
                <div className="total-row">
                  <span>Subtotal:</span>
                  <span>₦{total.toFixed(2)}</span>
                </div>
                <div className="total-row">
                  <span>Shipping:</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="total-row">
                  <span>Tax:</span>
                  <span>Included</span>
                </div>
                <div className="total-row grand-total">
                  <span>Total:</span>
                  <span>₦{total.toFixed(2)}</span>
                </div>
              </div>

              <div className="checkout-actions">
                <button 
                  className="continue-shopping" 
                  onClick={handleContinueShopping}
                  disabled={isProcessingCheckout}
                >
                  Continue Shopping
                </button>
                <button 
                  className="checkout-btn" 
                  onClick={handleCheckout}
                  disabled={isProcessingCheckout}
                >
                  {isProcessingCheckout ? 'Processing...' : `Proceed to Checkout (₦${total.toFixed(2)})`}
                </button>
              </div>

              <div className="cart-help-info">
                <p>
                  <i className="fas fa-info-circle"></i>
                  Your cart will be saved for later
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;