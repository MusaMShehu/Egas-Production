import React from "react";
import SubscriptionPlans from "./SubscriptionPlans";
import "../../styles/Subscription.css";

const Checkout = ({ plan, user, onConfirm, onCancel }) => {
  const handleConfirm = () => {
    onConfirm(plan);
  };

  return (
    <div className="checkout-container">
      <div className="checkout-card">
        <h2>Order Summary</h2>
        
        <div className="checkout-details">
          <div className="checkout-row">
            <span>Plan:</span>
            <span>{plan.name}</span>
          </div>
          
          <div className="checkout-row">
            <span>Cylinder Size:</span>
            <span>{plan.size}</span>
          </div>
          
          <div className="checkout-row">
            <span>Delivery Frequency:</span>
            <span>{plan.frequency}</span>
          </div>
          
          <div className="checkout-divider"></div>
          
          <div className="checkout-row total">
            <span>Total Amount:</span>
            <span>₦{plan.price.toLocaleString()}</span>
          </div>
          
          <div className="checkout-divider"></div>
          
          <div className="checkout-row">
            <span>Customer Name:</span>
            <span>{user.name}</span>
          </div>
          
          <div className="checkout-row">
            <span>Email:</span>
            <span>{user.email}</span>
          </div>
        </div>
        
        <div className="checkout-actions">
          <button className="cancel-btn" onClick={onCancel}>
            Back to Plans
          </button>
          <button className="confirm-btn" onClick={handleConfirm}>
            Confirm Subscription
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;