
// src/components/SubscriptionPlans.jsx
import React, { useState, useEffect, useCallback } from "react";
import "./SubscriptionPlan.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  FaWallet, 
  FaCreditCard, 
  FaFire, 
  FaBolt, 
  FaGasPump, 
  FaInfoCircle,
  FaCalendar,
  FaTag,
  FaCheck,
  FaTimes,
  FaEye,
  FaArrowRight
} from "react-icons/fa";
import { successToast, errorToast, infoToast, warningToast } from "../../utils/toast";

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
    subscriptionPeriod: 1,
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
  const [walletBalance, setWalletBalance] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("paystack");
  const [planDetailsModal, setPlanDetailsModal] = useState(null);
  const [selectedSize, setSelectedSize] = useState({});
  const [selectedPeriod, setSelectedPeriod] = useState({});

  // add interceptors once
  useEffect(() => {
    const reqId = axiosInstance.interceptors.request.use(
      (cfg) => {
        if (token)
          cfg.headers = { ...cfg.headers, Authorization: `Bearer ${token}` };
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

  // Fetch wallet balance
  const fetchWalletBalance = useCallback(async () => {
    if (!token) return;

    try {
      const response = await axiosInstance.get("/api/v1/dashboard/overview", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setWalletBalance(response.data.data?.walletBalance || 0);
      }
    } catch (error) {
      console.warn("Could not fetch wallet balance from dashboard:", error);
      try {
        const fallbackResponse = await axiosInstance.get("/api/v1/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (fallbackResponse.data.success) {
          setWalletBalance(fallbackResponse.data.data?.walletBalance || 0);
        }
      } catch (fallbackError) {
        console.warn("Could not fetch wallet balance", fallbackError);
      }
    }
  }, [token]);

  // fetch plans
  const fetchSubscriptionPlans = useCallback(async () => {
    try {
      setPlansLoading(true);
      setError("");
      setDebugInfo(null);

      const resp = await axiosInstance.get("/api/v1/subscription-plans");
      if (resp?.data?.success) {
        const allPlans = resp.data.data || [];
        
        // Sort plans: one-time first, then emergency, then custom, then preset plans sorted by displayOrder
        const sortedPlans = allPlans.sort((a, b) => {
          // One-time plans first
          if (a.type === 'one-time' && b.type !== 'one-time') return -1;
          if (a.type !== 'one-time' && b.type === 'one-time') return 1;
          
          // Emergency plans second
          if (a.type === 'emergency' && b.type !== 'emergency') return -1;
          if (a.type !== 'emergency' && b.type === 'emergency') return 1;
          
          // Custom plans third
          if (a.type === 'custom' && b.type !== 'custom') return -1;
          if (a.type !== 'custom' && b.type === 'custom') return 1;
          
          // Preset plans sorted by displayOrder
          return a.displayOrder - b.displayOrder;
        });
        
        setPlans(sortedPlans);

        // Initialize default selections
        const freqs = {};
        const periods = {};
        const sizes = {};
        sortedPlans.forEach((p) => {
          if (p.type === "preset") {
            freqs[p._id] = p.deliveryFrequency?.[0] || "Monthly";
            periods[p._id] = p.subscriptionPeriod?.[0] || 1;
            sizes[p._id] = p.baseSize;
          } else if (p.type === "one-time" || p.type === "emergency") {
            sizes[p._id] = p.cylinderSizes?.[0] || "6kg";
          } else if (p.type === "custom") {
            sizes[p._id] = "6kg";
            freqs[p._id] = "Monthly";
            periods[p._id] = 1;
          }
        });
        setSelectedFrequencies(freqs);
        setSelectedSubscriptionPeriods(periods);
        setSelectedSize(sizes);
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
    if (token) {
      fetchSubscriptionPlans();
      fetchWalletBalance();
    }
  }, [token, fetchSubscriptionPlans, fetchWalletBalance]);

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
      case "Daily":
        frequencyMultiplier = 30;
        break;
      case "Weekly":
        frequencyMultiplier = 5;
        break;
      case "Bi-weekly":
        frequencyMultiplier = 3;
        break;
      default:
        frequencyMultiplier = 1; // Monthly
    }

    // Apply subscription period (months)
    const totalAmount = baseAmount * frequencyMultiplier * subscriptionPeriod;

    return Math.round(totalAmount);
  };

  const getPlanIcon = (planType) => {
    switch (planType) {
      case 'one-time':
        return <FaTag className="subplan-plan-icon subplan-one-time" />;
      case 'emergency':
        return <FaBolt className="subplan-plan-icon subplan-emergency" />;
      case 'custom':
        return <FaGasPump className="subplan-plan-icon subplan-custom" />;
      default:
        return <FaFire className="subplan-plan-icon subplan-preset" />;
    }
  };

  const getPlanColor = (planType) => {
    switch (planType) {
      case 'one-time':
        return '#f39c12'; // Orange
      case 'emergency':
        return '#e74c3c'; // Red
      case 'custom':
        return '#2ecc71'; // Green
      default:
        return '#3498db'; // Blue
    }
  };

  const getFrequencyTag = (planType, frequency) => {
    if (planType === 'one-time') return 'One-Time';
    if (planType === 'emergency') return 'Emergency';
    return frequency || 'Monthly';
  };

  const getSizeOptions = (plan) => {
    switch (plan.type) {
      case "custom":
        const min = plan.cylinderSizeRange?.min || 5;
        const max = plan.cylinderSizeRange?.max || 100;
        return Array.from({ length: max - min + 1 }, (_, i) => `${i + min}kg`);

      case "one-time":
        return (plan.cylinderSizes || []).map((size) => `${size}kg`);

      case "emergency":
        return plan.cylinderSizes || ["6kg", "12kg", "25kg", "50kg"];

      default:
        return [plan.baseSize];
    }
  };

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
      navigate("/auth");
      return;
    }

    if (!planData.price || planData.price <= 0) {
      alert("Please select a valid plan configuration");
      return;
    }

    setIsProcessing(true);

    try {
      const requestBody = {
        plan: planData.planId,
        size: planData.size,
        frequency: planData.frequency,
        subscriptionPeriod: planData.subscriptionPeriod,
        paymentMethod: paymentMethod,
        ...(planData.planType === "custom" && { customPlan: planData }),
      };

      const response = await axiosInstance.post(
        "/api/v1/subscriptions",
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const { success, authorization_url, reference, data, message, walletBalance } = response.data;

      if (success) {
        if (paymentMethod === "paystack" && authorization_url) {
          window.location.href = authorization_url;
        } else if (paymentMethod === "wallet") {
          if (walletBalance !== undefined) {
            setWalletBalance(walletBalance);
          }
          await fetchWalletBalance();
          navigate("/subscriptions/wallet-success", {
            state: {
              subscription: data?.[0] || null,
              walletBalance: walletBalance,
            },
          });
        } else {
          throw new Error("Invalid payment response");
        }
      } else {
        throw new Error("Failed to initialize payment.");
      }
    } catch (error) {
      console.error("Payment initialization error:", error);
      if (error.response?.data?.message?.includes("Insufficient wallet balance")) {
        errorToast(error.response.data.message);
        setPaymentMethod("paystack");
      } else {
        const errorMsg = error.response?.data?.message || error.response?.data?.error || "Failed to process payment. Please try again.";
        errorToast(errorMsg);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRetry = () => {
    setError("");
    setDebugInfo(null);
    fetchSubscriptionPlans();
    if (token) fetchWalletBalance();
  };

  const confirmPlan = (planData) => {
    setSelectedPlan(planData);
    setShowSummary(true);
  };

  const handlePaymentConfirmation = () => {
    setShowSummary(false);
    initializePayment(selectedPlan);
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  const handleViewDetails = (plan) => {
    setPlanDetailsModal(plan);
  };

  const renderPlanFeatures = (features) => {
    return (
      <ul className="subplan-plan-features-list">
        {features?.map((feature, index) => (
          <li key={index} className={feature.included ? "subplan-feature-included" : "subplan-feature-excluded"}>
            {feature.included ? <FaCheck className="subplan-feature-icon" /> : <FaTimes className="subplan-feature-icon" />}
            <span>{feature.title}: {feature.description}</span>
          </li>
        ))}
      </ul>
    );
  };

  const formatCurrency = (amount) => {
    return `₦${amount?.toLocaleString() || "0"}`;
  };

  const renderPlanCard = (plan) => {
    const sizeOptions = getSizeOptions(plan);
    const frequencyOptions = getFrequencyOptions(plan);
    const currentSize = selectedSize[plan._id] || plan.baseSize;
    const currentFrequency = selectedFrequencies[plan._id] || frequencyOptions[0];
    const currentPeriod = selectedSubscriptionPeriods[plan._id] || plan.subscriptionPeriod?.[0] || 1;
    
    const price = calculatePrice(
      plan,
      currentSize,
      currentFrequency,
      currentPeriod
    );

    return (
      <div 
        key={plan._id} 
        className="subplan-plan-card"
        style={{ borderTop: `4px solid ${getPlanColor(plan.type)}` }}
      >
        {/* Plan Header */}
        <div className="subplan-plan-header">
          <div className="subplan-plan-title-section">
            {getPlanIcon(plan.type)}
            <div>
              <h3>{plan.name}</h3>
              <span className="subplan-plan-type-badge" style={{ backgroundColor: getPlanColor(plan.type) }}>
                {plan.type === 'one-time' ? 'Single Purchase' : 
                 plan.type === 'emergency' ? 'Urgent Delivery' : 
                 plan.type === 'custom' ? 'Build Your Plan' : 'Regular Plan'}
              </span>
            </div>
          </div>
          <button 
            className="subplan-view-details-btn"
            onClick={() => handleViewDetails(plan)}
          >
            <FaEye /> Details
          </button>
        </div>

        {/* Plan Frequency Tag */}
        <div className="subplan-plan-frequency-tag">
          <FaCalendar />
          <span>{getFrequencyTag(plan.type, currentFrequency)}</span>
        </div>

        {/* Plan Price */}
        <div className="subplan-plan-price-display">
          <span className="subplan-price-amount">{formatCurrency(price)}</span>
          {plan.type !== 'one-time' && plan.type !== 'emergency' && (
            <span className="subplan-price-period"></span>
          )}
        </div>

        {/* Plan Options */}
        <div className="subplan-plan-options">
          {/* Size Selection */}
          {(plan.type === 'custom' || plan.type === 'one-time' || plan.type === 'emergency') ? (
            <div className="subplan-option-group">
              <label className="subplan-option-label">
                <FaGasPump /> Cylinder Size
              </label>
              <select
                className="subplan-option-select"
                value={currentSize}
                onChange={(e) => setSelectedSize(prev => ({
                  ...prev,
                  [plan._id]: e.target.value
                }))}
              >
                {sizeOptions.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="subplan-option-info">
              <FaGasPump />
              <span>Cylinder Size: <strong>{plan.baseSize}</strong></span>
            </div>
          )}

          {/* Frequency Selection for custom and preset plans */}
          {(plan.type === 'custom' || plan.type === 'preset') && (
            <div className="subplan-option-group">
              <label className="subplan-option-label">
                <FaCalendar /> Delivery Frequency
              </label>
              <select
                className="subplan-option-select"
                value={currentFrequency}
                onChange={(e) => setSelectedFrequencies(prev => ({
                  ...prev,
                  [plan._id]: e.target.value
                }))}
              >
                {frequencyOptions.map((freq) => (
                  <option key={freq} value={freq}>
                    {freq}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Period Selection for non-one-time plans */}
          {plan.type !== 'one-time' && plan.subscriptionPeriod?.length > 0 && (
            <div className="subplan-option-group">
              <label className="subplan-option-label">
                <FaCalendar /> Subscription Period
              </label>
              <select
                className="subplan-option-select"
                value={currentPeriod}
                onChange={(e) => setSelectedSubscriptionPeriods(prev => ({
                  ...prev,
                  [plan._id]: parseInt(e.target.value)
                }))}
              >
                {plan.subscriptionPeriod?.map((period) => (
                  <option key={period} value={period}>
                    {period} month{period > 1 ? 's' : ''}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Action Button */}
        <button
          className="subplan-plan-action-btn"
          style={{ backgroundColor: getPlanColor(plan.type) }}
          onClick={() => confirmPlan({
            planId: plan._id,
            name: plan.name,
            planType: plan.type,
            size: currentSize,
            frequency: currentFrequency,
            subscriptionPeriod: currentPeriod,
            price,
          })}
          disabled={isProcessing}
        >
          {isProcessing ? "Processing..." : 
           plan.type === 'one-time' ? 'Buy Now' :
           plan.type === 'emergency' ? 'Request Emergency Delivery' :
           'Subscribe Now'}
          <FaArrowRight className="subplan-btn-icon" />
        </button>
      </div>
    );
  };

  // UI rendering
  if (isLoading || plansLoading) {
    return (
      <div className="subplan-plans-container">
        <div className="subplan-loading-spinner">
          <div className="subplan-spinner"></div>
          <p>Loading plans...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="subplan-plans-container">
        <div className="subplan-error-message">
          <h2>Error</h2>
          <p>{error}</p>
          <div className="subplan-error-actions">
            <button onClick={handleRetry}>Retry</button>
            <button onClick={() => setDebugInfo(null)}>Clear Debug</button>
          </div>
          {debugInfo && (
            <pre className="subplan-debug-info">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          )}
        </div>
      </div>
    );
  }

  if (!user || !token) {
    return (
      <div className="subplan-plans-container">
        <div className="subplan-login-prompt">
          <h1>Choose a Subscription Plan</h1>
          <p>Please log in to view and subscribe to our plans</p>
          <button onClick={() => navigate("/auth")}>Log In</button>
        </div>
      </div>
    );
  }

  return (
    <div className="subplan-plans-container">
      <div className="subplan-plans-header">
        <h1>Choose Your Gas Plan</h1>
        <p className="subplan-subtitle">Select the perfect plan for your needs</p>
        <div className="subplan-wallet-display">
          <FaWallet />
          <span>Wallet Balance: {formatCurrency(walletBalance)}</span>
        </div>
      </div>

      {/* Plan Categories with Descriptions */}
      <div className="subplan-plan-categories">
        {/* One-Time Purchase Section */}
        <div className="subplan-category-section">
          <div className="subplan-category-header">
            <FaTag className="subplan-category-icon" />
            <div>
              <h2>One-Time Purchase</h2>
              <p className="subplan-category-description">
                Perfect for occasional users or those who prefer no commitment. 
                Purchase gas cylinders as needed without any subscription.
              </p>
            </div>
          </div>
          <div className="subplan-plans-grid">
            {plans.filter(p => p.type === 'one-time').map(plan => renderPlanCard(plan))}
          </div>
        </div>

        {/* Emergency Plan Section */}
        <div className="subplan-category-section">
          <div className="subplan-category-header">
            <FaBolt className="subplan-category-icon" />
            <div>
              <h2>Emergency Delivery</h2>
              <p className="subplan-category-description">
                Need gas urgently? Get immediate delivery within hours. 
                Perfect for unexpected situations when you run out of gas.
              </p>
            </div>
          </div>
          <div className="subplan-plans-grid">
            {plans.filter(p => p.type === 'emergency').map(plan => renderPlanCard(plan))}
          </div>
        </div>

        {/* Preset Plans Section */}
        <div className="subplan-preset-category-section">
          <div className="subplan-category-header">
            <FaFire className="subplan-category-icon" />
            <div>
              <h2>Regular Subscription Plans</h2>
              <p className="subplan-category-description">
                Choose from our flexible subscription plans for regular gas delivery. 
                Save money with automatic deliveries based on your usage pattern.
              </p>
            </div>
          </div>
          <div className="subplan-plans-grid">
            {plans.filter(p => p.type === 'preset').map(plan => renderPlanCard(plan))}
          </div>
        </div>

        {/* Custom Plan Section */}
        <div className="subplan-category-section">
          <div className="subplan-category-header">
            <FaGasPump className="subplan-category-icon" />
            <div>
              <h2>Build Your Own Plan</h2>
              <p className="subplan-category-description">
                Customize every aspect of your gas delivery. 
                Choose your cylinder size, delivery frequency, and subscription period.
              </p>
            </div>
          </div>
          <div className="subplan-plans-grid">
            {plans.filter(p => p.type === 'custom').map(plan => renderPlanCard(plan))}
          </div>
        </div>
      </div>

      {/* Plan Details Modal */}
      {planDetailsModal && (
        <div className="subplan-plan-details-modal">
          <div className="subplan-modal-content">
            <div className="subplan-modal-header">
              <div className="subplan-modal-title">
                {getPlanIcon(planDetailsModal.type)}
                <div>
                  <h2>{planDetailsModal.name}</h2>
                  <span className="subplan-modal-plan-type" style={{ backgroundColor: getPlanColor(planDetailsModal.type) }}>
                    {planDetailsModal.type === 'one-time' ? 'One-Time Purchase' : 
                     planDetailsModal.type === 'emergency' ? 'Emergency Delivery' : 
                     planDetailsModal.type === 'custom' ? 'Custom Plan' : 'Subscription Plan'}
                  </span>
                </div>
              </div>
              <button className="subplan-close-modal" onClick={() => setPlanDetailsModal(null)}>
                <FaTimes />
              </button>
            </div>

            <div className="subplan-modal-body">
              <div className="subplan-plan-description">
                <h3>Plan Description</h3>
                <p>{planDetailsModal.description}</p>
              </div>

              <div className="subplan-plan-features">
                <h3>Features</h3>
                {renderPlanFeatures(planDetailsModal.features)}
              </div>

              <div className="subplan-plan-specifications">
                <h3>Specifications</h3>
                <div className="subplan-spec-grid">
                  <div className="subplan-spec-item">
                    <span className="subplan-spec-label">Base Size:</span>
                    <span className="subplan-spec-value">{planDetailsModal.baseSize}</span>
                  </div>
                  <div className="subplan-spec-item">
                    <span className="subplan-spec-label">Price per Kg:</span>
                    <span className="subplan-spec-value">{formatCurrency(planDetailsModal.pricePerKg)}</span>
                  </div>
                  {planDetailsModal.deliveryFrequency && (
                    <div className="subplan-spec-item">
                      <span className="subplan-spec-label">Delivery Frequency:</span>
                      <span className="subplan-spec-value">{planDetailsModal.deliveryFrequency.join(', ')}</span>
                    </div>
                  )}
                  {planDetailsModal.subscriptionPeriod && (
                    <div className="subplan-spec-item">
                      <span className="subplan-spec-label">Subscription Period:</span>
                      <span className="subplan-spec-value">
                        {planDetailsModal.subscriptionPeriod.map(p => `${p} month${p > 1 ? 's' : ''}`).join(', ')}
                      </span>
                    </div>
                  )}
                  {planDetailsModal.cylinderSizes && (
                    <div className="subplan-spec-item">
                      <span className="subplan-spec-label">Available Sizes:</span>
                      <span className="subplan-spec-value">{planDetailsModal.cylinderSizes.join(', ')}</span>
                    </div>
                  )}
                  {planDetailsModal.deliveryInfo && (
                    <>
                      <div className="subplan-spec-item">
                        <span className="subplan-spec-label">Delivery Time:</span>
                        <span className="subplan-spec-value">{planDetailsModal.deliveryInfo.deliveryTime}</span>
                      </div>
                      <div className="subplan-spec-item">
                        <span className="subplan-spec-label">Free Delivery:</span>
                        <span className="subplan-spec-value">
                          {planDetailsModal.deliveryInfo.freeDelivery ? 'Yes' : 'No'}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="subplan-modal-footer">
              <button className="subplan-btn-secondary" onClick={() => setPlanDetailsModal(null)}>
                Close
              </button>
              <button 
                className="subplan-btn-primary"
                style={{ backgroundColor: getPlanColor(planDetailsModal.type) }}
                onClick={() => {
                  setPlanDetailsModal(null);
                  const currentSize = selectedSize[planDetailsModal._id] || planDetailsModal.baseSize;
                  const currentFrequency = selectedFrequencies[planDetailsModal._id] || 'Monthly';
                  const currentPeriod = selectedSubscriptionPeriods[planDetailsModal._id] || 1;
                  const price = calculatePrice(planDetailsModal, currentSize, currentFrequency, currentPeriod);
                  
                  confirmPlan({
                    planId: planDetailsModal._id,
                    name: planDetailsModal.name,
                    planType: planDetailsModal.type,
                    size: currentSize,
                    frequency: currentFrequency,
                    subscriptionPeriod: currentPeriod,
                    price,
                  });
                }}
              >
                Select This Plan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Summary Modal */}
      {showSummary && selectedPlan && (
        <div className="subplan-summary-modal">
          <div className="subplan-summary-card">
            <h2>Confirm Your Order</h2>
            <div className="subplan-order-details">
              <p><strong>Plan:</strong> {selectedPlan.name}</p>
              <p><strong>Type:</strong> {selectedPlan.planType}</p>
              <p><strong>Size:</strong> {selectedPlan.size}</p>
              <p><strong>Frequency:</strong> {selectedPlan.frequency}</p>
              {selectedPlan.subscriptionPeriod && (
                <p><strong>Subscription Period:</strong> {selectedPlan.subscriptionPeriod} month{selectedPlan.subscriptionPeriod > 1 ? 's' : ''}</p>
              )}
              <p><strong>Total Price:</strong> {formatCurrency(selectedPlan.price)}</p>
            </div>

            <div className="subplan-payment-method">
              <h3>Select Payment Method</h3>
              <div className="subplan-payment-options">
                <label className={`subplan-payment-option ${paymentMethod === "paystack" ? "subplan-selected" : ""}`}>
                  <input className="subplan-payment-option-input"
                    type="radio"
                    name="paymentMethod"
                    value="paystack"
                    checked={paymentMethod === "paystack"}
                    onChange={() => handlePaymentMethodChange("paystack")}
                  />
                  <FaCreditCard />
                  <span>Pay with Paystack</span>
                </label>

                <label className={`subplan-payment-option ${paymentMethod === "wallet" ? "subplan-selected" : ""}`}>
                  <input className="subplan-payment-option-input"
                    type="radio"
                    name="paymentMethod"
                    value="wallet"
                    checked={paymentMethod === "wallet"}
                    onChange={() => handlePaymentMethodChange("wallet")}
                  />
                  <FaWallet />
                  <span>Pay From Wallet Balance</span>
                  <span className="subplan-wallet-balance">Balance: {formatCurrency(walletBalance)}</span>
                </label>
              </div>

              {paymentMethod === "wallet" && (
                <div className="subplan-wallet-info">
                  ✅ Wallet payment will be validated securely by our system
                </div>
              )}
            </div>

            <div className="subplan-summary-actions">
              <button onClick={() => setShowSummary(false)} disabled={isProcessing}>
                Cancel
              </button>
              <button
                onClick={handlePaymentConfirmation}
                disabled={isProcessing || (paymentMethod === "wallet" && walletBalance < selectedPlan.price)}
                className="subplan-confirm-payment-btn"
              >
                {isProcessing
                  ? "Processing..."
                  : paymentMethod === "wallet"
                  ? `Pay ${formatCurrency(selectedPlan.price)}`
                  : "Proceed to Payment"}
              </button>
            </div>
          </div>
        </div>
      )}

      {isProcessing && (
        <div className="subplan-loading-overlay">
          <div className="subplan-loading-spinner">
            Initializing Payment...
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionPlans;