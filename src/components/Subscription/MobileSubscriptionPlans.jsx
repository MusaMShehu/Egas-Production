
// components/mobile/MobileSubscriptionPlans.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MobileSubscriptionPlans.css';
import { 
  FaWallet, 
  FaCreditCard, 
  FaFire, 
  FaBolt, 
  FaGasPump, 
  FaCalendar, 
  FaCheck, 
  FaTimes, 
  FaEye,
  FaTag,
  FaUserFriends,
  FaExclamationTriangle,
  FaArrowRight,
  FaInfoCircle,
  FaTruck,
  FaShieldAlt
} from 'react-icons/fa';
import { successToast, errorToast, infoToast, warningToast } from "../../utils/toast";

const MobileSubscriptionPlans = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [user, setUser] = useState(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedFrequency, setSelectedFrequency] = useState({});
  const [selectedSize, setSelectedSize] = useState({});
  const [selectedPeriod, setSelectedPeriod] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [showSummary, setShowSummary] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('paystack');
  const [planDetailsModal, setPlanDetailsModal] = useState(null);

  const API_BASE_URL = 'https://egas-server-1.onrender.com/api/v1';

  useEffect(() => {
    fetchUserData();
    fetchPlans();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (userData) {
        setUser(JSON.parse(userData));
      }

      if (token) {
        const response = await fetch(`${API_BASE_URL}/dashboard/overview`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.ok) {
          const data = await response.json();
          setWalletBalance(data.data?.walletBalance || 0);
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchPlans = async () => {
    setIsLoading(true);
    infoToast('Loading subscription plans...');
    
    try {
      const response = await fetch(`${API_BASE_URL}/subscription-plans`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const result = await response.json();
      
      if (result.success) {
        const allPlans = result.data || [];
        
        // Sort plans: one-time first, then emergency, then custom, then preset plans
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
        const freq = {};
        const size = {};
        const period = {};
        
        sortedPlans.forEach(plan => {
          if (plan.deliveryFrequency?.length) {
            freq[plan._id] = plan.deliveryFrequency[0];
          }
          if (plan.cylinderSizes?.length) {
            size[plan._id] = plan.cylinderSizes[0];
          } else if (plan.baseSize) {
            size[plan._id] = plan.baseSize;
          }
          if (plan.subscriptionPeriod?.length) {
            period[plan._id] = plan.subscriptionPeriod[0];
          }
        });
        
        setSelectedFrequency(freq);
        setSelectedSize(size);
        setSelectedPeriod(period);
        
        successToast('Plans loaded successfully');
      } else {
        throw new Error(result.message || 'Failed to load plans');
      }
    } catch (err) {
      console.error('Error fetching plans:', err);
      const errorMsg = err.message || 'Failed to load subscription plans';
      setError(errorMsg);
      errorToast(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // const calculatePrice = (plan, size, frequency, period = 1) => {
  //   if (!plan || !plan.pricePerKg) return 0;
    
  //   // Extract numeric size
  //   const sizeNum = parseInt(size.toString().replace('kg', ''));
    
  //   // Base price
  //   let basePrice = sizeNum * plan.pricePerKg;
    
  //   // Frequency multiplier
  //   let freqMultiplier = 1;
  //   switch (frequency) {
  //     case 'Weekly':
  //       freqMultiplier = 5;
  //       break;
  //     case 'Bi-weekly':
  //       freqMultiplier = 3;
  //       break;
  //     case 'Daily':
  //       freqMultiplier = 30;
  //       break;
  //     default: // Monthly
  //       freqMultiplier = 1;
  //   }
    
  //   // Calculate total
  //   return Math.round(basePrice * freqMultiplier * period);
  // };

  const calculatePrice = (plan, size, frequency, subscriptionPeriod = 1) => {
  if (!plan) return 0;

  // Extract numeric size value
  const sizeKg = parseInt(String(size).replace("kg", ""), 10) || parseInt(size, 10);

  // Calculate base price
  let baseAmount = sizeKg * (plan.pricePerKg || 0);

  // Delivery counts based on frequency
  let deliveriesPerMonth = 0;
  
  switch (frequency) {
    case "Daily":
      deliveriesPerMonth = 30;
      break;
    case "Weekly":
      deliveriesPerMonth = 4;
      break;
    case "Bi-weekly":
      deliveriesPerMonth = 2;
      break;
    case "Monthly":
      deliveriesPerMonth = 1;
      break;
    case "One-Time":
    case "Emergency":
      deliveriesPerMonth = 1;
      break;
    default:
      deliveriesPerMonth = 1;
  }

  // Calculate total deliveries with initial extra delivery
  let totalDeliveries = 0;
  
  if (frequency === "One-Time" || frequency === "Emergency") {
    totalDeliveries = 1;
  } else {
    if (subscriptionPeriod === 1) {
      // First month only
      totalDeliveries = deliveriesPerMonth + 1;
    } else {
      // Multiple months
      totalDeliveries = (deliveriesPerMonth + 1) + (deliveriesPerMonth * (subscriptionPeriod - 1));
    }
  }

  // Total price = base amount × total deliveries
  const totalAmount = baseAmount * totalDeliveries;

  return Math.round(totalAmount);
};


  const getPlanIcon = (planType) => {
    switch (planType) {
      case 'emergency':
        return <FaBolt className="mobsubplan-plan-icon mobsubplan-emergency" />;
      case 'custom':
        return <FaGasPump className="mobsubplan-plan-icon mobsubplan-custom" />;
      case 'one-time':
        return <FaTag className="mobsubplan-plan-icon mobsubplan-one-time" />;
      case 'business':
        return <FaUserFriends className="mobsubplan-plan-icon mobsubplan-business" />;
      default:
        return <FaFire className="mobsubplan-plan-icon mobsubplan-default" />;
    }
  };

  const getPlanColor = (planType) => {
    switch (planType) {
      case 'emergency':
        return '#e74c3c';
      case 'custom':
        return '#2ecc71';
      case 'one-time':
        return '#f39c12';
      case 'business':
        return '#9b59b6';
      default:
        return '#3498db';
    }
  };

  const getFrequencyTag = (planType, frequency) => {
    if (planType === 'one-time') return 'One-Time Purchase';
    if (planType === 'emergency') return 'Emergency Delivery';
    return frequency || 'Monthly';
  };

  const handlePlanSelection = (plan) => {
    const price = calculatePrice(
      plan,
      selectedSize[plan._id] || plan.baseSize,
      selectedFrequency[plan._id] || 'Monthly',
      selectedPeriod[plan._id] || 1
    );

    // Add this to the summary modal or plan details
const getDeliveryBreakdown = (frequency, period) => {
  let deliveriesPerMonth = 0;
  
  switch (frequency) {
    case "Daily": deliveriesPerMonth = 30; break;
    case "Weekly": deliveriesPerMonth = 4; break;
    case "Bi-weekly": deliveriesPerMonth = 2; break;
    case "Monthly": deliveriesPerMonth = 1; break;
    default: deliveriesPerMonth = 1;
  }

  if (frequency === "One-Time" || frequency === "Emergency") {
    return "1 delivery total";
  }

  if (period === 1) {
    return `${deliveriesPerMonth + 1} deliveries (${deliveriesPerMonth} regular + 1 initial)`;
  } else {
    const total = (deliveriesPerMonth + 1) + (deliveriesPerMonth * (period - 1));
    return `${total} deliveries total\n- Month 1: ${deliveriesPerMonth + 1} (${deliveriesPerMonth} + 1 initial)\n- Subsequent months: ${deliveriesPerMonth} per month`;
  }
};

    setSelectedPlan({
      ...plan,
      selectedSize: selectedSize[plan._id] || plan.baseSize,
      selectedFrequency: selectedFrequency[plan._id] || 'Monthly',
      selectedPeriod: selectedPeriod[plan._id] || 1,
      price
    });
    setShowSummary(true);
  };

  const handleViewDetails = (plan) => {
    setPlanDetailsModal(plan);
  };

  const handleSubscribe = async () => {
    if (!selectedPlan) return;
    
    if (!user) {
      warningToast('Please log in to subscribe');
      navigate('/auth');
      return;
    }

    if (!selectedPlan.price || selectedPlan.price <= 0) {
      errorToast('Please select valid plan options');
      return;
    }

    if (paymentMethod === 'wallet' && walletBalance < selectedPlan.price) {
      errorToast('Insufficient wallet balance');
      setPaymentMethod('paystack');
      return;
    }

    setIsProcessing(true);
    infoToast('Processing subscription...');

    try {
      const token = localStorage.getItem('token');
      
      const requestBody = {
        plan: selectedPlan._id,
        size: selectedPlan.selectedSize,
        frequency: selectedPlan.selectedFrequency,
        subscriptionPeriod: selectedPlan.selectedPeriod,
        paymentMethod: paymentMethod
      };

      const response = await fetch(`${API_BASE_URL}/subscriptions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || `HTTP error! status: ${response.status}`);
      }

      if (result.success) {
        if (paymentMethod === 'paystack' && result.authorization_url) {
          // Redirect to Paystack payment
          window.location.href = result.authorization_url;
        } else if (paymentMethod === 'wallet') {
          // Wallet payment successful
          setWalletBalance(result.walletBalance || walletBalance - selectedPlan.price);
          successToast('Subscription created successfully!');
          
          // Redirect to subscriptions page
          setTimeout(() => navigate('/subscriptions'), 1500);
        } else {
          successToast('Subscription created successfully!');
          setTimeout(() => navigate('/subscriptions'), 1500);
        }
      } else {
        throw new Error(result.message || 'Subscription failed');
      }
    } catch (err) {
      console.error('Subscription error:', err);
      const errorMsg = err.message || 'Failed to create subscription';
      errorToast(errorMsg);
    } finally {
      setIsProcessing(false);
      setShowSummary(false);
    }
  };

  const formatCurrency = (amount) => {
    return `₦${amount?.toLocaleString() || '0'}`;
  };

  const renderPlanCard = (plan) => {
    const currentSize = selectedSize[plan._id] || plan.baseSize;
    const currentFrequency = selectedFrequency[plan._id] || 'Monthly';
    const currentPeriod = selectedPeriod[plan._id] || 1;
    const price = calculatePrice(plan, currentSize, currentFrequency, currentPeriod);

    return (
      <div 
        key={plan._id} 
        className="mobsubplan-plan-card"
        style={{ borderLeftColor: getPlanColor(plan.type) }}
      >
        {/* Plan Header */}
        <div className="mobsubplan-plan-card-header">
          <div className="mobsubplan-plan-title-section">
            {getPlanIcon(plan.type)}
            <div className="mobsubplan-plan-title-content">
              <h3>{plan.name}</h3>
              <span className="mobsubplan-plan-type-badge" style={{ backgroundColor: getPlanColor(plan.type) }}>
                {plan.type === 'one-time' ? 'Single Purchase' : 
                 plan.type === 'emergency' ? 'Urgent' : 
                 plan.type === 'custom' ? 'Custom' : 'Regular'}
              </span>
            </div>
          </div>
          <button 
            className="mobsubplan-view-details-btn"
            onClick={() => handleViewDetails(plan)}
          >
            <FaEye size={14} />
          </button>
        </div>

        {/* Frequency Tag */}
        <div className="mobsubplan-plan-frequency-tag">
          <FaCalendar size={12} />
          <span>{getFrequencyTag(plan.type, currentFrequency)}</span>
        </div>

        {/* Price Display */}
        <div className="mobsubplan-plan-price-display">
          <span className="mobsubplan-price-amount">{formatCurrency(price)}</span>
          {plan.type !== 'one-time' && plan.type !== 'emergency' && (
            <span className="mobsubplan-price-period"></span>
          )}
        </div>

        {/* Size Selection */}
        <div className="mobsubplan-plan-option-section">
          <label className="mobsubplan-option-label">
            <FaGasPump size={14} />
            Cylinder Size
          </label>
          {(plan.type === 'custom' || plan.type === 'one-time' || plan.type === 'emergency') ? (
            <select 
              className="mobsubplan-option-select"
              value={currentSize}
              onChange={(e) => setSelectedSize(prev => ({
                ...prev,
                [plan._id]: e.target.value
              }))}
            >
              {plan.cylinderSizes?.map(size => (
                <option key={size} value={size}>
                  {size}kg
                </option>
              ))}
            </select>
          ) : (
            <div className="mobsubplan-option-info">
              <span>{plan.baseSize}</span>
            </div>
          )}
        </div>

        {/* Frequency Selection for custom and preset plans */}
        {(plan.type === 'custom' || plan.type === 'preset') && (
          <div className="mobsubplan-plan-option-section">
            <label className="mobsubplan-option-label">
              <FaCalendar size={14} />
              Delivery Frequency
            </label>
            <select 
              className="mobsubplan-option-select"
              value={currentFrequency}
              onChange={(e) => setSelectedFrequency(prev => ({
                ...prev,
                [plan._id]: e.target.value
              }))}
            >
              {plan.deliveryFrequency?.map(freq => (
                <option key={freq} value={freq}>
                  {freq}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Period Selection for non-one-time plans */}
        {plan.type !== 'one-time' && plan.subscriptionPeriod?.length > 0 && (
          <div className="mobsubplan-plan-option-section">
            <label className="mobsubplan-option-label">
              <FaCalendar size={14} />
              Subscription Period
            </label>
            <select 
              className="mobsubplan-option-select"
              value={currentPeriod}
              onChange={(e) => setSelectedPeriod(prev => ({
                ...prev,
                [plan._id]: parseInt(e.target.value)
              }))}
            >
              {plan.subscriptionPeriod?.map(period => (
                <option key={period} value={period}>
                  {period} month{period > 1 ? 's' : ''}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Action Button */}
        <button 
          className="mobsubplan-select-plan-btn"
          onClick={() => handlePlanSelection(plan)}
          style={{ backgroundColor: getPlanColor(plan.type) }}
          disabled={isProcessing}
        >
          {isProcessing ? 'Processing...' : 
           plan.type === 'one-time' ? 'Buy Now' :
           plan.type === 'emergency' ? 'Request Delivery' :
           'Subscribe Now'}
          <FaArrowRight className="mobsubplan-btn-icon" />
        </button>
      </div>
    );
  };

  const renderPlanDetailsModal = () => {
    if (!planDetailsModal) return null;

    return (
      <div className="mobsubplan-plan-details-modal">
        <div className="mobsubplan-modal-content">
          <div className="mobsubplan-modal-header">
            <div className="mobsubplan-modal-title-section">
              {getPlanIcon(planDetailsModal.type)}
              <div>
                <h2>{planDetailsModal.name}</h2>
                <span 
                  className="mobsubplan-modal-plan-type"
                  style={{ backgroundColor: getPlanColor(planDetailsModal.type) }}
                >
                  {planDetailsModal.type === 'one-time' ? 'One-Time Purchase' : 
                   planDetailsModal.type === 'emergency' ? 'Emergency Delivery' : 
                   planDetailsModal.type === 'custom' ? 'Custom Plan' : 'Subscription Plan'}
                </span>
              </div>
            </div>
            <button 
              className="mobsubplan-close-modal"
              onClick={() => setPlanDetailsModal(null)}
            >
              <FaTimes />
            </button>
          </div>

          <div className="mobsubplan-modal-body">
            <div className="mobsubplan-modal-section">
              <h3>Plan Description</h3>
              <p className="mobsubplan-plan-description">{planDetailsModal.description}</p>
            </div>

            {planDetailsModal.features?.length > 0 && (
              <div className="mobsubplan-modal-section">
                <h3>Features</h3>
                <div className="mobsubplan-features-list">
                  {planDetailsModal.features.map((feature, index) => (
                    <div key={index} className={`mobsubplan-feature-item ${feature.included ? 'mobsubplan-included' : 'mobsubplan-excluded'}`}>
                      {feature.included ? 
                        <FaCheck className="mobsubplan-feature-icon" /> : 
                        <FaTimes className="mobsubplan-feature-icon" />
                      }
                      <div className="mobsubplan-feature-content">
                        <strong>{feature.title}:</strong> {feature.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mobsubplan-modal-section">
              <h3>Specifications</h3>
              <div className="mobsubplan-specifications-grid">
                <div className="mobsubplan-spec-item">
                  <span className="mobsubplan-spec-label">Base Size:</span>
                  <span className="mobsubplan-spec-value">{planDetailsModal.baseSize}</span>
                </div>
                <div className="mobsubplan-spec-item">
                  <span className="mobsubplan-spec-label">Price per Kg:</span>
                  <span className="mobsubplan-spec-value">{formatCurrency(planDetailsModal.pricePerKg)}</span>
                </div>
                {planDetailsModal.deliveryFrequency && (
                  <div className="mobsubplan-spec-item">
                    <span className="mobsubplan-spec-label">Delivery Frequency:</span>
                    <span className="mobsubplan-spec-value">{planDetailsModal.deliveryFrequency.join(', ')}</span>
                  </div>
                )}
                {planDetailsModal.subscriptionPeriod && (
                  <div className="mobsubplan-spec-item">
                    <span className="mobsubplan-spec-label">Subscription Period:</span>
                    <span className="mobsubplan-spec-value">
                      {planDetailsModal.subscriptionPeriod.map(p => `${p} month${p > 1 ? 's' : ''}`).join(', ')}
                    </span>
                  </div>
                )}
                {planDetailsModal.cylinderSizes && (
                  <div className="mobsubplan-spec-item">
                    <span className="mobsubplan-spec-label">Available Sizes:</span>
                    <span className="mobsubplan-spec-value">{planDetailsModal.cylinderSizes.join(', ')}</span>
                  </div>
                )}
                {planDetailsModal.deliveryInfo && (
                  <>
                    <div className="mobsubplan-spec-item">
                      <span className="mobsubplan-spec-label">Delivery Time:</span>
                      <span className="mobsubplan-spec-value">{planDetailsModal.deliveryInfo.deliveryTime}</span>
                    </div>
                    <div className="mobsubplan-spec-item">
                      <span className="mobsubplan-spec-label">Free Delivery:</span>
                      <span className="mobsubplan-spec-value">
                        {planDetailsModal.deliveryInfo.freeDelivery ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="mobsubplan-modal-footer">
            <button 
              className="mobsubplan-btn-secondary"
              onClick={() => setPlanDetailsModal(null)}
            >
              Close
            </button>
            <button 
              className="mobsubplan-btn-primary"
              style={{ backgroundColor: getPlanColor(planDetailsModal.type) }}
              onClick={() => {
                setPlanDetailsModal(null);
                const currentSize = selectedSize[planDetailsModal._id] || planDetailsModal.baseSize;
                const currentFrequency = selectedFrequency[planDetailsModal._id] || 'Monthly';
                const currentPeriod = selectedPeriod[planDetailsModal._id] || 1;
                const price = calculatePrice(planDetailsModal, currentSize, currentFrequency, currentPeriod);
                
                setSelectedPlan({
                  ...planDetailsModal,
                  selectedSize: currentSize,
                  selectedFrequency: currentFrequency,
                  selectedPeriod: currentPeriod,
                  price
                });
                setShowSummary(true);
              }}
            >
              Select This Plan
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="mobsubplan-mobile-subscription-plans mobsubplan-loading">
        <div className="mobsubplan-loading-spinner"></div>
        <p>Loading plans...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mobsubplan-mobile-subscription-plans mobsubplan-error">
        <div className="mobsubplan-error-content">
          <FaExclamationTriangle className="mobsubplan-error-icon" />
          <h2>Unable to Load Plans</h2>
          <p>{error}</p>
          <button className="mobsubplan-retry-btn" onClick={fetchPlans}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mobsubplan-mobile-subscription-plans">
      {/* Header */}
      <div className="mobsubplan-plans-header">
        <h1>Choose Your Gas Plan</h1>
        <div className="mobsubplan-wallet-display">
          <FaWallet className="mobsubplan-wallet-icon" />
          <span>{formatCurrency(walletBalance)}</span>
        </div>
      </div>

      {/* One-Time Purchase Section */}
      <div className="mobsubplan-plan-category-section">
        <div className="mobsubplan-category-header">
          <FaTag className="mobsubplan-category-icon" />
          <div>
            <h2>One-Time Purchase</h2>
            <p className="mobsubplan-category-description">
              Perfect for occasional users. 
              Purchase gas as needed without any subscription.
            </p>
          </div>
        </div>
        <div className="mobsubplan-plans-list">
          {plans.filter(p => p.type === 'one-time').map(plan => renderPlanCard(plan))}
        </div>
      </div>

      {/* Emergency Delivery Section */}
      <div className="mobsubplan-plan-category-section">
        <div className="mobsubplan-category-header">
          <FaBolt className="mobsubplan-category-icon" />
          <div>
            <h2>Emergency Delivery</h2>
            <p className="mobsubplan-category-description">
              Need gas urgently? Get immediate refill delivery within hours. 
              Perfect for unexpected situations when you run out of gas.
            </p>
          </div>
        </div>
        <div className="mobsubplan-plans-list">
          {plans.filter(p => p.type === 'emergency').map(plan => renderPlanCard(plan))}
        </div>
      </div>

      {/* Preset Plans Section */}
      <div className="mobsubplan-plan-category-section">
        <div className="mobsubplan-category-header">
          <FaFire className="mobsubplan-category-icon" />
          <div>
            <h2>Regular Subscription Plans</h2>
            <p className="mobsubplan-category-description">
              Choose from our flexible subscription plans for regular gas refill delivery. 
              Save money and time with automatic deliveries based on your usage pattern.
            </p>
          </div>
        </div>
        <div className="mobsubplan-plans-list">
          {plans.filter(p => p.type === 'preset').map(plan => renderPlanCard(plan))}
        </div>
      </div>

      {/* Custom Plans Section */}
      <div className="mobsubplan-plan-category-section">
        <div className="mobsubplan-category-header">
          <FaGasPump className="mobsubplan-category-icon" />
          <div>
            <h2>Build Your Own Plan</h2>
            <p className="mobsubplan-category-description">
              Customize every aspect of your gas delivery. 
              Choose your cylinder size, delivery frequency, and subscription period.............coming soon.
            </p>
          </div>
        </div>
        <div className="mobsubplan-plans-list">
          {plans.filter(p => p.type === 'custom').map(plan => renderPlanCard(plan))}
        </div>
      </div>

      {/* Plan Details Modal */}
      {renderPlanDetailsModal()}

      {/* Payment Summary Modal */}
      {showSummary && selectedPlan && (
        <div className="mobsubplan-plan-summary-modal">
          <div className="mobsubplan-summary-content">
            <div className="mobsubplan-summary-header">
              <h2>Confirm Your Plan</h2>
              <button 
                className="mobsubplan-close-summary"
                onClick={() => setShowSummary(false)}
                disabled={isProcessing}
              >
                <FaTimes />
              </button>
            </div>

            <div className="mobsubplan-summary-body">
              <div className="mobsubplan-plan-summary">
                <div className="mobsubplan-plan-summary-header">
                  {getPlanIcon(selectedPlan.type)}
                  <div>
                    <h3>{selectedPlan.name}</h3>
                    <span className="mobsubplan-plan-type">{selectedPlan.type}</span>
                  </div>
                </div>

                <div className="mobsubplan-summary-details">
                  <div className="mobsubplan-detail-item">
                    <span className="mobsubplan-detail-label">Cylinder Size:</span>
                    <span className="mobsubplan-detail-value">{selectedPlan.selectedSize}</span>
                  </div>
                  <div className="mobsubplan-detail-item">
                    <span className="mobsubplan-detail-label">Delivery Frequency:</span>
                    <span className="mobsubplan-detail-value">{selectedPlan.selectedFrequency}</span>
                  </div>
                  {selectedPlan.selectedPeriod > 1 && (
                    <div className="mobsubplan-detail-item">
                      <span className="mobsubplan-detail-label">Subscription Period:</span>
                      <span className="mobsubplan-detail-value">
                        {selectedPlan.selectedPeriod} month{selectedPlan.selectedPeriod > 1 ? 's' : ''}
                      </span>
                    </div>
                  )}
                  <div className="mobsubplan-detail-item mobsubplan-total">
                    <span className="mobsubplan-detail-label">Total Price:</span>
                    <span className="mobsubplan-detail-value mobsubplan-price">{formatCurrency(selectedPlan.price)}</span>
                  </div>
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="mobsubplan-payment-method">
                <h4>Payment Method</h4>
                <div className="mobsubplan-payment-options">
                  <div 
                    className={`mobsubplan-payment-option ${paymentMethod === 'paystack' ? 'mobsubplan-selected' : ''}`}
                    onClick={() => setPaymentMethod('paystack')}
                  >
                    <div className="mobsubplan-option-content">
                      <FaCreditCard className="mobsubplan-option-icon mobsubplan-card" />
                      <div className="mobsubplan-option-text">
                        <span className="mobsubplan-option-title">Pay with Card</span>
                        <span className="mobsubplan-option-description">Secure payment via Paystack</span>
                      </div>
                    </div>
                    <div className="mobsubplan-option-check">
                      {paymentMethod === 'paystack' && <FaCheck />}
                    </div>
                  </div>

                  <div 
                    className={`mobsubplan-payment-option ${paymentMethod === 'wallet' ? 'mobsubplan-selected' : ''}`}
                    onClick={() => setPaymentMethod('wallet')}
                  >
                    <div className="mobsubplan-option-content">
                      <FaWallet className="mobsubplan-option-icon mobsubplan-wallet" />
                      <div className="mobsubplan-option-text">
                        <span className="mobsubplan-option-title">Pay with Wallet</span>
                        <span className="mobsubplan-option-description">Balance: {formatCurrency(walletBalance)}</span>
                      </div>
                    </div>
                    <div className="mobsubplan-option-check">
                      {paymentMethod === 'wallet' && <FaCheck />}
                    </div>
                  </div>
                </div>

                {paymentMethod === 'wallet' && walletBalance < selectedPlan.price && (
                  <div className="mobsubplan-wallet-warning">
                    <FaExclamationTriangle />
                    <span>Insufficient wallet balance. Top up or select card payment.</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mobsubplan-summary-footer">
              <button 
                className="mobsubplan-summary-btn mobsubplan-cancel"
                onClick={() => setShowSummary(false)}
                disabled={isProcessing}
              >
                Cancel
              </button>
              <button 
                className="mobsubplan-summary-btn mobsubplan-confirm"
                onClick={handleSubscribe}
                disabled={isProcessing || (paymentMethod === 'wallet' && walletBalance < selectedPlan.price)}
                style={{ backgroundColor: getPlanColor(selectedPlan.type) }}
              >
                {isProcessing ? (
                  <>
                    <div className="mobsubplan-processing-spinner"></div>
                    Processing...
                  </>
                ) : paymentMethod === 'wallet' ? (
                  `Pay ${formatCurrency(selectedPlan.price)}`
                ) : (
                  'Proceed to Payment'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {isProcessing && (
        <div className="mobsubplan-processing-overlay">
          <div className="mobsubplan-processing-spinner-large"></div>
          <p>Processing your request...</p>
        </div>
      )}
    </div>
  );
};

export default MobileSubscriptionPlans;