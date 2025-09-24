// src/components/Subscriptions/SubsCheckout.js
import React from "react";
import "../../styles/SubsCheckout.css";

const Checkout = ({ plan, onConfirm, onCancel }) => {
  if (!plan) return null; // prevent crash

  return (
    <div className="checkout-container">
      <div className="checkout-card">
        <h2>Checkout</h2>
        <p>
          <strong>Plan:</strong> {plan.name}
        </p>
        <p>
          <strong>Size:</strong> {plan.size}
        </p>
        <p>
          <strong>Frequency:</strong> {plan.frequency}
        </p>
        <p className="price">
          <strong>Price:</strong> ₦{plan.price.toLocaleString()}
        </p>

        <div className="checkout-buttons">
          <button onClick={() => onConfirm(plan)}>Confirm</button>
          <button onClick={onCancel} className="cancel-btn">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
