// src/components/SubscriptionPlans.jsx
import React, { useState, useEffect, useCallback } from "react";
import "./SubscriptionPlan.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import PaystackPop from "@paystack/inline-js";

// Stable axios instance
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "https://egas-server-1.onrender.com",
  timeout: 30000,
});

const SubscriptionPlans = () => {
  const navigate = useNavigate();

  // state
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [plans, setPlans] = useState([]);
  const [customPlan, setCustomPlan] = useState({ 
    size: "6kg", 
    frequency: "Monthly",
    subscriptionPeriod: 1 
  });
  const [oneTimePlan, setOneTimePlan] = useState({ size: "6kg" });
  const [emergencyPlan, setEmergencyPlan] = useState({ size: "6kg" });
  const [selectedFrequencies, setSelectedFrequencies] = useState({});
  const [selectedSubscriptionPeriods, setSelectedSubscriptionPeriods] = useState({});
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showSummary, setShowSummary] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [plansLoading, setPlansLoading] = useState(true);
  const [error, setError] = useState("");
  const [debugInfo, setDebugInfo] = useState(null);

  // add interceptors once
  useEffect(() => {
    const reqId = axiosInstance.interceptors.request.use(
      (cfg) => {
        if (token) cfg.headers = { ...cfg.headers, Authorization: `Bearer ${token}` };
        return cfg;
      },
      (err) => Promise.reject(err)
    );

    const resId = axiosInstance.interceptors.response.use(
      (res) => res,
      (err) => Promise.reject(err)
    );

    return () => {
      axiosInstance.interceptors.request.eject(reqId);
      axiosInstance.interceptors.response.eject(resId);
    };
  }, [token]);

  // Load user/token from localStorage once
  useEffect(() => {
    try {
      const sUser = localStorage.getItem("user");
      const sToken = localStorage.getItem("token");
      if (sUser) setUser(JSON.parse(sUser));
      if (sToken) setToken(sToken);
    } catch (err) {
      console.error("Error reading localStorage:", err);
      setError("Failed to load session.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // fetch plans
  const fetchSubscriptionPlans = useCallback(async () => {
    try {
      setPlansLoading(true);
      setError("");
      setDebugInfo(null);

      const resp = await axiosInstance.get("/api/v1/subscription-plans");
      if (resp?.data?.success) {
        const sortedPlans = (resp.data.data || []).sort((a, b) => a.displayOrder - b.displayOrder);
        setPlans(sortedPlans);
        
        // Initialize default frequencies and subscription periods
        const freqs = {};
        const periods = {};
        sortedPlans.forEach((p) => {
          if (p.type === "preset") {
            freqs[p._id] = p.deliveryFrequency?.[0] || "Monthly";
            periods[p._id] = p.subscriptionPeriod?.[0] || 1;
          }
        });
        setSelectedFrequencies(freqs);
        setSelectedSubscriptionPeriods(periods);
      } else {
        console.warn("Unexpected plans response:", resp?.data);
        setError("Failed to load plans");
      }
    } catch (err) {
      console.error("Fetch plans error:", err);
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Unable to load subscription plans."
      );
      setDebugInfo(err?.response?.data || null);
    } finally {
      setPlansLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscriptionPlans();
  }, [fetchSubscriptionPlans]);

  // Price calculation helper
  const calculatePrice = (plan, size, frequency, subscriptionPeriod = 1) => {
    if (!plan) return 0;
    
    // Extract numeric size value
    const sizeKg = parseInt(String(size).replace("kg", ""), 10) || parseInt(size, 10);
    
    // Calculate base price
    let baseAmount = sizeKg * (plan.pricePerKg || 0);
    
    // Apply frequency multiplier
    let frequencyMultiplier = 1;
    switch (frequency) {
      case "Daily": frequencyMultiplier = 30; break;
      case "Weekly": frequencyMultiplier = 4; break;
      case "Bi-Weekly": frequencyMultiplier = 2; break;
      default: frequencyMultiplier = 1; // Monthly
    }
    
    // Apply subscription period (months)
    const totalAmount = baseAmount * frequencyMultiplier * subscriptionPeriod;
    
    return Math.round(totalAmount);
  };

  const getCustomPlanPrice = () => {
    const plan = plans.find((x) => x.type === "custom");
    if (!plan) return 0;
    return calculatePrice(plan, customPlan.size, customPlan.frequency, customPlan.subscriptionPeriod);
  };

  const getOneTimePlanPrice = () => {
    const plan = plans.find((x) => x.type === "one-time");
    if (!plan) return 0;
    return calculatePrice(plan, oneTimePlan.size, "One-Time", 1);
  };

  const getEmergencyPlanPrice = () => {
    const plan = plans.find((x) => x.type === "emergency");
    if (!plan) return 0;
    return calculatePrice(plan, emergencyPlan.size, "One-Time", 1);
  };

  // Generate size options based on plan type
  const getSizeOptions = (plan) => {
    switch (plan.type) {
      case "custom":
        const min = plan.cylinderSizeRange?.min || 5;
        const max = plan.cylinderSizeRange?.max || 100;
        return Array.from({ length: max - min + 1 }, (_, i) => `${i + min}kg`);
      
      case "one-time":
        return (plan.cylinderSizes || []).map(size => `${size}kg`);
      
      case "emergency":
        return plan.cylinderSizes || ["6kg", "12kg", "25kg", "50kg"];
      
      default: // preset
        return [plan.baseSize];
    }
  };

  // Generate frequency options based on plan type
  const getFrequencyOptions = (plan) => {
    switch (plan.type) {
      case "custom":
        const minDays = plan.deliveryFrequencyRange?.min || 1;
        const maxDays = plan.deliveryFrequencyRange?.max || 29;
        return Array.from({ length: maxDays - minDays + 1 }, (_, i) => {
          const days = i + minDays;
          return days === 1 ? "Daily" : `${days} days`;
        });
      
      case "preset":
        return plan.deliveryFrequency || ["Monthly"];
      
      default:
        return ["One-Time"];
    }
  };


  const initializePayment = async (planData) => {
  if (!user || !token) {
    alert("Please log in to subscribe");
    navigate("/login");
    return;
  }

  if (!planData.price || planData.price <= 0) {
    alert("Please select a valid plan configuration");
    return;
  }

  setIsProcessing(true);

  try {
    // Prepare request body for backend
    const requestBody = {
      plan: planData.planId,
      size: planData.size,
      frequency: planData.frequency,
      subscriptionPeriod: planData.subscriptionPeriod,
    };

    // Send request to backend API
    const response = await axiosInstance.post("/api/v1/subscriptions", requestBody, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const { success, authorization_url, reference } = response.data;

    if (success && authorization_url) {
      // Redirect user to Paystack payment page
      window.location.href = authorization_url;
    } else {
      throw new Error("Failed to initialize payment.");
    }
  } catch (error) {
    console.error("Payment initialization error:", error);
    alert(
      error.response?.data?.error ||
      error.response?.data?.message ||
      "Failed to initialize payment. Please try again."
    );
  } finally {
    setIsProcessing(false);
  }
};

  // Retry without reload
  const handleRetry = () => {
    setError("");
    setDebugInfo(null);
    fetchSubscriptionPlans();
  };

  // Confirm and initialize payment directly
  const confirmPlan = (planData) => {
    setSelectedPlan(planData);
    setShowSummary(true);
  };

  // Handle final payment confirmation
  const handlePaymentConfirmation = () => {
    setShowSummary(false);
    initializePayment(selectedPlan);
  };

  // Render plan features
  const renderFeatures = (features) => {
    return (
      <ul className="plan-features">
        {features?.map((feature, index) => (
          <li key={index} className={feature.included ? "feature-included" : "feature-excluded"}>
            <strong>{feature.title}:</strong> {feature.description}
          </li>
        ))}
      </ul>
    );
  };

  // UI rendering
  if (isLoading || plansLoading) {
    return (
      <div className="plans-container">
        <div className="loading-spinner">Loading plans...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="plans-container">
        <div className="error-message">
          <h2>Error</h2>
          <p>{error}</p>
          <div style={{ marginTop: 12 }}>
            <button onClick={handleRetry}>Retry</button>
            <button style={{ marginLeft: 8 }} onClick={() => { setDebugInfo(null); fetchSubscriptionPlans(); }}>
              Clear Debug
            </button>
          </div>
          {debugInfo && (
            <pre style={{ marginTop: 12, maxHeight: 280, overflow: "auto", background: "#111", color: "#fff", padding: 12 }}>
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          )}
        </div>
      </div>
    );
  }

  if (!user || !token) {
    return (
      <div className="plans-container">
        <div className="login-prompt">
          <h1>Choose a Subscription Plan</h1>
          <p>Please log in to view and subscribe to our plans</p>
          <button onClick={() => navigate("/login")}>Log In</button>
        </div>
      </div>
    );
  }

  // render plan cards
  return (
    <div className="plans-container">
      <div className="user-welcome">
        <h1>Welcome, {user.name || user.email}!</h1>
        <p className="plan-subtitle">Choose a plan that fits your needs</p>
      </div>

      <div className="plans-grid">
        {plans.map((plan) => {
          const sizeOptions = getSizeOptions(plan);
          const frequencyOptions = getFrequencyOptions(plan);

          // Custom Plan
          if (plan.type === "custom") {
            const price = getCustomPlanPrice();
            return (
              <div key={plan._id} className="plan-card custom-plan-card">
                <h2>{plan.name}</h2>
                <p>{plan.description}</p>
                {renderFeatures(plan.features)}
                
                <label>Cylinder Size</label>
                <select value={customPlan.size} onChange={(e) => setCustomPlan(prev => ({ ...prev, size: e.target.value }))}>
                  {sizeOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>

                <label>Delivery Frequency</label>
                <select value={customPlan.frequency} onChange={(e) => setCustomPlan(prev => ({ ...prev, frequency: e.target.value }))}>
                  {frequencyOptions.map((f) => <option key={f} value={f}>{f}</option>)}
                </select>

                <label>Subscription Period (Months)</label>
                <select value={customPlan.subscriptionPeriod} onChange={(e) => setCustomPlan(prev => ({ ...prev, subscriptionPeriod: parseInt(e.target.value) }))}>
                  {plan.subscriptionPeriod?.map((period) => <option key={period} value={period}>{period} month{period > 1 ? 's' : ''}</option>)}
                </select>

                <div className="plan-price">₦{price.toLocaleString()}</div>
                <button
                  disabled={isProcessing}
                  onClick={() => confirmPlan({
                    planId: plan._id,
                    name: plan.name,
                    planType: plan.type,
                    size: customPlan.size,
                    frequency: customPlan.frequency,
                    subscriptionPeriod: customPlan.subscriptionPeriod,
                    price
                  })}
                >{isProcessing ? "Processing..." : "Subscribe"}</button>
              </div>
            );
          }

          // One-time Purchase
          if (plan.type === "one-time") {
            const price = getOneTimePlanPrice();
            return (
              <div key={plan._id} className="plan-card one-time-card">
                <h2>{plan.name}</h2>
                <p>{plan.description}</p>
                {renderFeatures(plan.features)}
                
                <label>Cylinder Size</label>
                <select value={oneTimePlan.size} onChange={(e) => setOneTimePlan({ size: e.target.value })}>
                  {sizeOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>

                <div className="plan-price">₦{price.toLocaleString()}</div>
                <button 
                  disabled={isProcessing}
                  onClick={() => confirmPlan({
                    planId: plan._id,
                    name: plan.name,
                    planType: plan.type,
                    size: oneTimePlan.size,
                    frequency: "One-Time",
                    subscriptionPeriod: 1,
                    price
                  })}
                >{isProcessing ? "Processing..." : "Buy Now"}</button>
              </div>
            );
          }

          // Emergency Plan
          if (plan.type === "emergency") {
            const price = getEmergencyPlanPrice();
            return (
              <div key={plan._id} className="plan-card emergency-card">
                <h2>{plan.name} 🚨</h2>
                <p>{plan.description}</p>
                {renderFeatures(plan.features)}
                
                <label>Cylinder Size</label>
                <select value={emergencyPlan.size} onChange={(e) => setEmergencyPlan({ size: e.target.value })}>
                  {sizeOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>

                <div className="plan-price">₦{price.toLocaleString()}</div>
                <button 
                  disabled={isProcessing}
                  onClick={() => confirmPlan({
                    planId: plan._id,
                    name: plan.name,
                    planType: plan.type,
                    size: emergencyPlan.size,
                    frequency: "Emergency",
                    subscriptionPeriod: 1,
                    price
                  })}
                >{isProcessing ? "Processing..." : "Request Emergency Delivery"}</button>
              </div>
            );
          }

          // Preset Plans (Basic, Family, Business)
          const frequency = selectedFrequencies[plan._id] || frequencyOptions[0];
          const subscriptionPeriod = selectedSubscriptionPeriods[plan._id] || plan.subscriptionPeriod?.[0] || 1;
          const price = calculatePrice(plan, plan.baseSize, frequency, subscriptionPeriod);

          return (
            <div key={plan._id} className="plan-card">
              <h2>{plan.name}</h2>
              <p>{plan.description}</p>
              {renderFeatures(plan.features)}
              
              <div className="plan-details">
                <p><strong>Base Size:</strong> {plan.baseSize}</p>
                <p><strong>Price per Kg:</strong> ₦{plan.pricePerKg?.toLocaleString()}</p>
              </div>

              <label>Delivery Frequency</label>
              <select value={frequency} onChange={(e) => setSelectedFrequencies(prev => ({ ...prev, [plan._id]: e.target.value }))}>
                {frequencyOptions.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>

              <label>Subscription Period (Months)</label>
              <select value={subscriptionPeriod} onChange={(e) => setSelectedSubscriptionPeriods(prev => ({ ...prev, [plan._id]: parseInt(e.target.value) }))}>
                {plan.subscriptionPeriod?.map((period) => <option key={period} value={period}>{period} month{period > 1 ? 's' : ''}</option>)}
              </select>

              <div className="plan-price">₦{price.toLocaleString()}</div>
              <button disabled={isProcessing} onClick={() => confirmPlan({
                planId: plan._id,
                name: plan.name,
                planType: plan.type,
                size: plan.baseSize,
                frequency: frequency,
                subscriptionPeriod: subscriptionPeriod,
                price
              })}>{isProcessing ? "Processing..." : "Subscribe"}</button>
            </div>
          );
        })}
      </div>

      {/* Summary Modal */}
      {showSummary && selectedPlan && (
        <div className="summary-modal">
          <div className="summary-card">
            <h2>Confirm Your Order</h2>
            <p><strong>Plan:</strong> {selectedPlan.name}</p>
            <p><strong>Type:</strong> {selectedPlan.planType}</p>
            <p><strong>Size:</strong> {selectedPlan.size}</p>
            <p><strong>Frequency:</strong> {selectedPlan.frequency}</p>
            {selectedPlan.subscriptionPeriod && (
              <p><strong>Subscription Period:</strong> {selectedPlan.subscriptionPeriod} month{selectedPlan.subscriptionPeriod > 1 ? 's' : ''}</p>
            )}
            <p><strong>Total Price:</strong> ₦{Number(selectedPlan.price).toLocaleString()}</p>
            <div className="summary-actions">
              <button onClick={() => setShowSummary(false)} disabled={isProcessing}>
                Cancel
              </button>
              <button onClick={handlePaymentConfirmation} disabled={isProcessing} className="confirm-payment-btn">
                {isProcessing ? "Initializing Payment..." : "Proceed to Payment"}
              </button>
            </div>
          </div>
        </div>
      )}

      {isProcessing && (
        <div className="loading-overlay">
          <div className="loading-spinner">Initializing Payment...</div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionPlans;