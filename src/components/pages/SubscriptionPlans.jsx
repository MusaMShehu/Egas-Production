import React, { useState, useEffect } from "react";
import "../../styles/SubscriptionPlans.css";
import initializePaystack from "@paystack/inline-js";
import axios from "axios";

const SubscriptionPlans = () => {
  const [user, setUser] = useState(null);
  const [customPlan, setCustomPlan] = useState({
    size: "6kg",
    frequency: "Monthly",
    oneTimeSize: ""
  });

  const [selectedFrequencies, setSelectedFrequencies] = useState({
    "Basic Plan": "Monthly",
    "Family Plan": "Monthly",
    "Business Plan": "Monthly"
  });

  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showSummary, setShowSummary] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user from localStorage on component mount
  useEffect(() => {
    const fetchUserFromStorage = () => {
      try {
        const userData = localStorage.getItem("user");
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error("Error fetching user from localStorage:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserFromStorage();
  }, []);

  const presetPlans = [
    { name: "Basic Plan", size: "6kg", basePrice: 1500 * 6 },
    { name: "Family Plan", size: "12kg", basePrice: 1500 * 12 },
    { name: "Business Plan", size: "50kg", basePrice: 1500 * 50 },
  ];

  const handleCustomChange = (field, value) => {
    setCustomPlan((prev) => ({ ...prev, [field]: value }));
  };

  const handleFrequencyChange = (planName, frequency) => {
    setSelectedFrequencies((prev) => ({ ...prev, [planName]: frequency }));
  };

  const calculatePrice = (base, frequency) => {
    let multiplier = 1;
    switch (frequency) {
      case "Daily": multiplier = 30; break;
      case "Weekly": multiplier = 4; break;
      case "Bi-Weekly": multiplier = 2; break;
      case "One-Time": multiplier = 1; break;
      default: multiplier = 1;
    }
    return base * multiplier;
  };

  const calculateCustomPrice = () => {
    const basePrice = 1500;
    const size = parseInt(customPlan.size.replace("kg", ""));
    return calculatePrice(size * basePrice, customPlan.frequency);
  };

  const calculateOneTimePrice = (size) => {
    if (!size) return 0;
    const basePrice = 1500;
    const kg = parseInt(size.replace("kg", ""));
    return kg * basePrice;
  };

  /** 🔹 Handle subscription/payment */
  const handleSubscribe = async (plan) => {
    if (!user) {
      alert("Please log in to subscribe");
      // Redirect to login page or show login modal
      window.location.href = "/login";
      return;
    }

    if (!user.email) {
      alert("User email not found. Please log in again.");
      // Clear invalid user data and redirect
      localStorage.removeItem("user");
      window.location.href = "/login";
      return;
    }

    setIsProcessing(true);

    try {
      const metadata = {
        userId: user._id,
        planName: plan.name,
        size: plan.size,
        frequency: plan.frequency,
        userEmail: user.email,
        userName: user.name || user.email.split('@')[0]
      };

      const payload = {
        amount: plan.price,
        email: user.email,
        orderId: `order-${user._id}-${Date.now()}`,
        userId: user._id,
        metadata: metadata
      };

      const resp = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/payments/initialize`,
        payload,
        { 
          headers: { 
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          } 
        }
      );

      const { reference } = resp.data;
      const paystack = initializePaystack();

      const handler = paystack.inlinePay({
        key: process.env.REACT_APP_PAYSTACK_PUBLIC_KEY,
        email: user.email,
        amount: Math.round(plan.price * 100), 
        reference: reference,
        metadata: metadata,
        onSuccess: async (paymentResp) => {
          try {
            console.log("Payment successful, verifying...", paymentResp);
            
            const verifyResp = await axios.get(
              `${process.env.REACT_APP_API_URL}/api/payments/verify/${paymentResp.reference}`,
              { headers: { Authorization: `Bearer ${user.token}` } }
            );

            if (verifyResp.data.ok) {
              if (plan.frequency === "One-Time") {
                alert("🎉 Purchase successful! Your order is being processed.");
              } else {
                alert("🎉 Subscription successful! Welcome to your new plan.");
              }
              
              // Refresh user data to get updated subscription info
              await refreshUserData();
            } else {
              alert("Payment verification failed. Please contact support.");
            }
          } catch (err) {
            console.error("Payment verification error:", err);
            alert("Payment verification failed. Please contact support with your reference: " + paymentResp.reference);
          } finally {
            setIsProcessing(false);
          }
        },
        onClose: () => {
          setIsProcessing(false);
          console.log("Payment window closed by user");
        },
        onError: (error) => {
          setIsProcessing(false);
          console.error("Payment error:", error);
          alert("Payment failed. Please try again.");
        }
      });

      handler.openIframe();

    } catch (err) {
      setIsProcessing(false);
      console.error("Payment initialization error:", err);
      
      if (err.response?.status === 401) {
        alert("Session expired. Please log in again.");
        localStorage.removeItem("user");
        window.location.href = "/login";
      } else if (err.response?.status === 400) {
        alert("Invalid request: " + (err.response.data.message || "Please check your input"));
      } else {
        alert("Payment initialization failed. Please try again.");
      }
    }
  };

  /** 🔹 Refresh user data after successful payment */
  const refreshUserData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/users/profile`,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      
      if (response.data) {
        const updatedUser = { ...user, ...response.data };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error("Error refreshing user data:", error);
    }
  };

  /** 🔹 Show summary before payment */
  const confirmPlan = (plan) => {
    if (!user) {
      alert("Please log in to subscribe");
      window.location.href = "/login";
      return;
    }

    if (plan.price <= 0) {
      alert("Please select a valid plan configuration");
      return;
    }

    setSelectedPlan(plan);
    setShowSummary(true);
  };

  const getPlanDescription = (plan) => {
    if (plan.frequency === "One-Time") {
      return "One-time purchase";
    }
    return `${plan.frequency.toLowerCase()} delivery`;
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="plans-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  // Show login prompt if user is not authenticated
  if (!user) {
    return (
      <div className="plans-container">
        <div className="login-prompt">
          <h1>Choose a Subscription Plan</h1>
          <div className="login-required">
            <p>Please log in to view and subscribe to our plans</p>
            <button 
              className="login-btn"
              onClick={() => window.location.href = "/login"}
            >
              Log In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="plans-container">
      <div className="user-welcome">
        <h1>Welcome, {user.name || user.email}!</h1>
        <p className="plan-subtitle">Choose a plan that fits your needs</p>
      </div>

      <div className="plans-grid">
        {/* Preset Plans */}
        {presetPlans.map((plan, index) => {
          const frequency = selectedFrequencies[plan.name] || "Monthly";
          const price = calculatePrice(plan.basePrice, frequency);

          return (
            <div key={index} className="plan-card">
              <div className="plan-header">
                <h2>{plan.name}</h2>
                <span className="plan-badge">{frequency}</span>
              </div>
              <div className="plan-details">
                <p className="plan-size">🛢️ {plan.size} Cylinder</p>
                <div className="frequency-selector">
                  <label>Delivery Frequency:</label>
                  <select
                    onChange={(e) => handleFrequencyChange(plan.name, e.target.value)}
                    value={frequency}
                  >
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Bi-Weekly">Bi-Weekly</option>
                    <option value="Monthly">Monthly</option>
                  </select>
                </div>
                <p className="price">₦{price.toLocaleString()}</p>
                <p className="plan-description">{getPlanDescription({ frequency })}</p>
                <button
                  className="subscribe-btn"
                  onClick={() => confirmPlan({ 
                    name: plan.name, 
                    size: plan.size, 
                    frequency, 
                    price 
                  })}
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : "Subscribe"}
                </button>
              </div>
            </div>
          );
        })}

        {/* Custom Plan */}
        <div className="plan-card custom-plan-card">
          <div className="plan-header">
            <h2>Custom Plan</h2>
            <span className="plan-badge">Flexible</span>
          </div>
          <div className="plan-details">
            <div className="custom-selector">
              <label>Cylinder Size:</label>
              <select
                onChange={(e) => handleCustomChange("size", e.target.value)}
                value={customPlan.size}
              >
                <option value="6kg">6kg</option>
                <option value="12kg">12kg</option>
                <option value="50kg">50kg</option>
              </select>
            </div>
            <div className="custom-selector">
              <label>Delivery Frequency:</label>
              <select
                onChange={(e) => handleCustomChange("frequency", e.target.value)}
                value={customPlan.frequency}
              >
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Bi-Weekly">Bi-Weekly</option>
                <option value="Monthly">Monthly</option>
              </select>
            </div>
            <p className="price">₦{calculateCustomPrice().toLocaleString()}</p>
            <p className="plan-description">{getPlanDescription({ frequency: customPlan.frequency })}</p>
            <button
              className="subscribe-btn"
              onClick={() =>
                confirmPlan({
                  name: "Custom Plan",
                  size: customPlan.size,
                  frequency: customPlan.frequency,
                  price: calculateCustomPrice(),
                })
              }
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Subscribe Custom"}
            </button>
          </div>
        </div>

        {/* One-Time Purchase */}
        <div className="plan-card one-time-card">
          <div className="plan-header">
            <h2>One-Time Purchase</h2>
            <span className="plan-badge">Single</span>
          </div>
          <div className="plan-details">
            <div className="custom-selector">
              <label>Cylinder Size:</label>
              <select
                onChange={(e) => handleCustomChange("oneTimeSize", e.target.value)}
                value={customPlan.oneTimeSize}
              >
                <option value="">Select Cylinder Size</option>
                <option value="6kg">6kg</option>
                <option value="12kg">12kg</option>
                <option value="50kg">50kg</option>
              </select>
            </div>
            {customPlan.oneTimeSize && (
              <>
                <p className="price">
                  ₦{calculateOneTimePrice(customPlan.oneTimeSize).toLocaleString()}
                </p>
                <p className="plan-description">One-time purchase with free delivery</p>
              </>
            )}
            <button
              className="subscribe-btn"
              onClick={() =>
                confirmPlan({
                  name: "One-Time Purchase",
                  size: customPlan.oneTimeSize,
                  frequency: "One-Time",
                  price: calculateOneTimePrice(customPlan.oneTimeSize),
                })
              }
              disabled={!customPlan.oneTimeSize || isProcessing}
            >
              {isProcessing ? "Processing..." : "Buy Now"}
            </button>
          </div>
        </div>
      </div>

      {/* Summary Modal */}
      {showSummary && selectedPlan && (
        <div className="summary-modal">
          <div className="summary-card">
            <h2>Confirm Your Order</h2>
            <div className="summary-details">
              <p><strong>Plan:</strong> {selectedPlan.name}</p>
              <p><strong>Size:</strong> {selectedPlan.size}</p>
              <p><strong>Type:</strong> {getPlanDescription(selectedPlan)}</p>
              <p><strong>Price:</strong> ₦{selectedPlan.price.toLocaleString()}</p>
              <p><strong>Email:</strong> {user.email}</p>
            </div>

            <div className="summary-actions">
              <button 
                onClick={() => setShowSummary(false)}
                disabled={isProcessing}
              >
                Cancel
              </button>
              <button
                className="confirm-btn"
                onClick={() => {
                  setShowSummary(false);
                  handleSubscribe(selectedPlan);
                }}
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : "Proceed to Payment"}
              </button>
            </div>
          </div>
        </div>
      )}

      {isProcessing && (
        <div className="loading-overlay">
          <div className="loading-spinner">Processing Payment...</div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionPlans;