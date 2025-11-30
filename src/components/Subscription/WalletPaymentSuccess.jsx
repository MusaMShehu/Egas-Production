import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import "./WalletPaymentSuccess.css";

const WalletPaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { subscription, walletBalance } = location.state || {};

  // If no state, redirect to subscriptions page
  if (!subscription) {
    return (
      <div className="success-page-container">
        <div className="success-card">
          <p className="error-message">
            The Payment was charged from your wallet and subscription activated successfully.
          </p>
          <button
            onClick={() => navigate("/dashboard/subscriptions")}
            className="success-button"
          >
            Go to Subscriptions
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="success-button"
            style={{ marginLeft: "10px" }}
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const handleGoHome = () => {
    navigate("/dashboard");
  };

  return (
    <div className="success-page-container">
      <div className="success-card">
        <FaCheckCircle className="success-icon" />
        <h1 className="success-title">Payment Successful!</h1>
        <p className="success-text">
          Your subscription{" "}
          <span className="bold-text">{subscription.planName}</span> has been
          activated.
        </p>
        <p className="success-text">
          ₦{subscription.price.toLocaleString()} has been deducted from your
          wallet.
        </p>
        <p className="success-text">
          Current wallet balance: ₦{walletBalance?.toLocaleString() || "0"}
        </p>
        <button onClick={handleGoHome} className="success-button">
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default WalletPaymentSuccess;
