// components/mobile/MobileSubscriptionPlans.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MobileSubscriptionPlans.css';
import { FaWallet, FaCreditCard, FaFire, FaGasPump, FaCalendar, FaCheck, FaTimes, FaPlus, FaMinus, FaExclamationTriangle, FaShieldAlt, FaTruck, FaBolt, FaTag, FaUserFriends } from 'react-icons/fa';
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
        // Fetch wallet balance from dashboard
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
        const sortedPlans = (result.data || []).sort((a, b) => a.displayOrder - b.displayOrder);
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

  const calculatePrice = (plan, size, frequency, period = 1) => {
    if (!plan || !plan.pricePerKg) return 0;
    
    // Extract numeric size
    const sizeNum = parseInt(size.toString().replace('kg', ''));
    
    // Base price
    let basePrice = sizeNum * plan.pricePerKg;
    
    // Frequency multiplier
    let freqMultiplier = 1;
    switch (frequency) {
      case 'Weekly':
        freqMultiplier = 4;
        break;
      case 'Bi-Weekly':
        freqMultiplier = 2;
        break;
      case 'Daily':
        freqMultiplier = 30;
        break;
      default: // Monthly
        freqMultiplier = 1;
    }
    
    // Calculate total
    return Math.round(basePrice * freqMultiplier * period);
  };

  const getPlanIcon = (planType) => {
    switch (planType) {
      case 'emergency':
        return <FaBolt className="plan-icon emergency" />;
      case 'custom':
        return <FaGasPump className="plan-icon custom" />;
      case 'one-time':
        return <FaTag className="plan-icon one-time" />;
      case 'business':
        return <FaUserFriends className="plan-icon business" />;
      default:
        return <FaFire className="plan-icon default" />;
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

  const getPlanDescription = (plan) => {
    if (plan.description) return plan.description;
    
    switch (plan.type) {
      case 'emergency':
        return 'Immediate delivery for urgent needs';
      case 'custom':
        return 'Build your own plan with custom options';
      case 'one-time':
        return 'Single purchase without commitment';
      default:
        return 'Regular delivery plan with fixed schedule';
    }
  };

  const handlePlanSelection = (plan) => {
    const price = calculatePrice(
      plan,
      selectedSize[plan._id] || plan.baseSize,
      selectedFrequency[plan._id] || 'Monthly',
      selectedPeriod[plan._id] || 1
    );

    setSelectedPlan({
      ...plan,
      selectedSize: selectedSize[plan._id] || plan.baseSize,
      selectedFrequency: selectedFrequency[plan._id] || 'Monthly',
      selectedPeriod: selectedPeriod[plan._id] || 1,
      price
    });
    setShowSummary(true);
  };

  const handleSubscribe = async () => {
    if (!selectedPlan) return;
    
    if (!user) {
      warningToast('Please log in to subscribe');
      navigate('/login');
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

  if (isLoading) {
    return (
      <div className="mobile-subscription-plans loading">
        <div className="loading-spinner"></div>
        <p>Loading plans...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mobile-subscription-plans error">
        <div className="error-content">
          <FaExclamationTriangle className="error-icon" />
          <h2>Unable to Load Plans</h2>
          <p>{error}</p>
          <button className="retry-btn" onClick={fetchPlans}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mobile-subscription-plans">
      {/* Header */}
      <div className="plans-header">
        <h1>Choose Your Plan</h1>
        <div className="wallet-display">
          <FaWallet className="wallet-icon" />
          <span>{formatCurrency(walletBalance)}</span>
        </div>
      </div>

      {/* Plans List */}
      <div className="plans-list">
        {plans.map(plan => (
          <div 
            key={plan._id} 
            className="plan-card"
            style={{ borderLeftColor: getPlanColor(plan.type) }}
          >
            <div className="plan-header">
              <div className="plan-title">
                {getPlanIcon(plan.type)}
                <div>
                  <h3>{plan.name}</h3>
                  <p className="plan-type">{plan.type}</p>
                </div>
              </div>
              <div className="plan-badge" style={{ backgroundColor: getPlanColor(plan.type) }}>
                {plan.recommended && '🔥'}
              </div>
            </div>

            <p className="plan-description">{getPlanDescription(plan)}</p>

            {/* Plan Features */}
            <div className="plan-features">
              {plan.features?.map((feature, index) => (
                <div key={index} className="feature-item">
                  {feature.included ? (
                    <FaCheck className="feature-icon included" />
                  ) : (
                    <FaTimes className="feature-icon excluded" />
                  )}
                  <span className={feature.included ? 'included' : 'excluded'}>
                    {feature.title}
                  </span>
                </div>
              ))}
            </div>

            {/* Plan Options */}
            <div className="plan-options">
              {/* Size Selection */}
              {plan.type === 'custom' || plan.type === 'one-time' || plan.type === 'emergency' ? (
                <div className="option-group">
                  <label className="option-label">
                    <FaGasPump className="option-icon" />
                    Cylinder Size
                  </label>
                  <select 
                    className="option-select"
                    value={selectedSize[plan._id] || ''}
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
                </div>
              ) : (
                <div className="option-info">
                  <FaGasPump className="info-icon" />
                  <span>Cylinder Size: <strong>{plan.baseSize}</strong></span>
                </div>
              )}

              {/* Frequency Selection */}
              {plan.type === 'custom' || plan.deliveryFrequency?.length > 1 ? (
                <div className="option-group">
                  <label className="option-label">
                    <FaCalendar className="option-icon" />
                    Delivery Frequency
                  </label>
                  <select 
                    className="option-select"
                    value={selectedFrequency[plan._id] || ''}
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
              ) : plan.deliveryFrequency?.[0] ? (
                <div className="option-info">
                  <FaCalendar className="info-icon" />
                  <span>Frequency: <strong>{plan.deliveryFrequency[0]}</strong></span>
                </div>
              ) : null}

              {/* Period Selection */}
              {plan.subscriptionPeriod?.length > 1 ? (
                <div className="option-group">
                  <label className="option-label">
                    <FaCalendar className="option-icon" />
                    Subscription Period
                  </label>
                  <select 
                    className="option-select"
                    value={selectedPeriod[plan._id] || ''}
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
              ) : null}
            </div>

            {/* Price and Action */}
            <div className="plan-footer">
              <div className="plan-price">
                <span className="price-label">Starting from</span>
                <span className="price-amount">
                  {formatCurrency(
                    calculatePrice(
                      plan,
                      selectedSize[plan._id] || plan.baseSize,
                      selectedFrequency[plan._id] || 'Monthly',
                      selectedPeriod[plan._id] || 1
                    )
                  )}
                </span>
                <span className="price-period">
                  {selectedFrequency[plan._id] === 'Monthly' ? '/month' : 
                   selectedFrequency[plan._id] === 'Weekly' ? '/week' : ''}
                </span>
              </div>
              
              <button 
                className="select-btn"
                onClick={() => handlePlanSelection(plan)}
                style={{ backgroundColor: getPlanColor(plan.type) }}
              >
                Select Plan
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Plan Summary Modal */}
      {showSummary && selectedPlan && (
        <div className="plan-summary-modal">
          <div className="summary-content">
            <div className="summary-header">
              <h2>Confirm Your Plan</h2>
              <button 
                className="close-summary"
                onClick={() => setShowSummary(false)}
                disabled={isProcessing}
              >
                <FaTimes />
              </button>
            </div>

            <div className="summary-body">
              <div className="plan-summary">
                <div className="plan-summary-header">
                  {getPlanIcon(selectedPlan.type)}
                  <div>
                    <h3>{selectedPlan.name}</h3>
                    <p className="plan-type">{selectedPlan.type}</p>
                  </div>
                </div>

                <div className="summary-details">
                  <div className="detail-item">
                    <span className="detail-label">Cylinder Size:</span>
                    <span className="detail-value">{selectedPlan.selectedSize}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Delivery Frequency:</span>
                    <span className="detail-value">{selectedPlan.selectedFrequency}</span>
                  </div>
                  {selectedPlan.selectedPeriod > 1 && (
                    <div className="detail-item">
                      <span className="detail-label">Subscription Period:</span>
                      <span className="detail-value">
                        {selectedPlan.selectedPeriod} month{selectedPlan.selectedPeriod > 1 ? 's' : ''}
                      </span>
                    </div>
                  )}
                  <div className="detail-item total">
                    <span className="detail-label">Total Price:</span>
                    <span className="detail-value price">{formatCurrency(selectedPlan.price)}</span>
                  </div>
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="payment-method">
                <h4>Payment Method</h4>
                <div className="payment-options">
                  <div 
                    className={`payment-option ${paymentMethod === 'paystack' ? 'selected' : ''}`}
                    onClick={() => setPaymentMethod('paystack')}
                  >
                    <div className="option-content">
                      <FaCreditCard className="option-icon card" />
                      <div className="option-text">
                        <span className="option-title">Pay with Card</span>
                        <span className="option-description">Secure payment via Paystack</span>
                      </div>
                    </div>
                    <div className="option-check">
                      {paymentMethod === 'paystack' && <FaCheck />}
                    </div>
                  </div>

                  <div 
                    className={`payment-option ${paymentMethod === 'wallet' ? 'selected' : ''}`}
                    onClick={() => setPaymentMethod('wallet')}
                  >
                    <div className="option-content">
                      <FaWallet className="option-icon wallet" />
                      <div className="option-text">
                        <span className="option-title">Pay with Wallet</span>
                        <span className="option-description">Balance: {formatCurrency(walletBalance)}</span>
                      </div>
                    </div>
                    <div className="option-check">
                      {paymentMethod === 'wallet' && <FaCheck />}
                    </div>
                  </div>
                </div>

                {paymentMethod === 'wallet' && walletBalance < selectedPlan.price && (
                  <div className="wallet-warning">
                    <FaExclamationTriangle />
                    <span>Insufficient wallet balance. Top up or select card payment.</span>
                  </div>
                )}
              </div>
            </div>

            <div className="summary-footer">
              <button 
                className="summary-btn cancel"
                onClick={() => setShowSummary(false)}
                disabled={isProcessing}
              >
                Cancel
              </button>
              <button 
                className="summary-btn confirm"
                onClick={handleSubscribe}
                disabled={isProcessing || (paymentMethod === 'wallet' && walletBalance < selectedPlan.price)}
              >
                {isProcessing ? (
                  <>
                    <div className="processing-spinner"></div>
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
    </div>
  );
};

export default MobileSubscriptionPlans;