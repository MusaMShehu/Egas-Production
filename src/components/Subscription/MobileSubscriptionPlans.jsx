
// // components/mobile/MobileSubscriptionPlans.js
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import './MobileSubscriptionPlans.css';
// import { 
//   FaWallet, 
//   FaCreditCard, 
//   FaFire, 
//   FaBolt, 
//   FaGasPump, 
//   FaCalendar, 
//   FaCheck, 
//   FaTimes, 
//   FaEye,
//   FaTag,
//   FaUserFriends,
//   FaExclamationTriangle,
//   FaArrowRight,
//   FaInfoCircle,
//   FaTruck,
//   FaShieldAlt
// } from 'react-icons/fa';
// import { successToast, errorToast, infoToast, warningToast } from "../../utils/toast";

// const MobileSubscriptionPlans = () => {
//   const navigate = useNavigate();
//   const [plans, setPlans] = useState([]);
//   const [user, setUser] = useState(null);
//   const [walletBalance, setWalletBalance] = useState(0);
//   const [selectedPlan, setSelectedPlan] = useState(null);
//   const [selectedFrequency, setSelectedFrequency] = useState({});
//   const [selectedSize, setSelectedSize] = useState({});
//   const [selectedPeriod, setSelectedPeriod] = useState({});
//   const [isLoading, setIsLoading] = useState(true);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [error, setError] = useState('');
//   const [showSummary, setShowSummary] = useState(false);
//   const [paymentMethod, setPaymentMethod] = useState('paystack');
//   const [planDetailsModal, setPlanDetailsModal] = useState(null);

//   const API_BASE_URL = 'https://egas-server-1.onrender.com/api/v1';

//   useEffect(() => {
//     fetchUserData();
//     fetchPlans();
//   }, []);

//   const fetchUserData = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const userData = localStorage.getItem('user');
      
//       if (userData) {
//         setUser(JSON.parse(userData));
//       }

//       if (token) {
//         const response = await fetch(`${API_BASE_URL}/dashboard/overview`, {
//           headers: { Authorization: `Bearer ${token}` }
//         });
        
//         if (response.ok) {
//           const data = await response.json();
//           setWalletBalance(data.data?.walletBalance || 0);
//         }
//       }
//     } catch (error) {
//       console.error('Error fetching user data:', error);
//     }
//   };

//   const fetchPlans = async () => {
//     setIsLoading(true);
//     infoToast('Loading subscription plans...');
    
//     try {
//       const response = await fetch(`${API_BASE_URL}/subscription-plans`);
//       if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

//       const result = await response.json();
      
//       if (result.success) {
//         const allPlans = result.data || [];
        
//         // Sort plans: one-time first, then emergency, then custom, then preset plans
//         const sortedPlans = allPlans.sort((a, b) => {
//           // One-time plans first
//           if (a.type === 'one-time' && b.type !== 'one-time') return -1;
//           if (a.type !== 'one-time' && b.type === 'one-time') return 1;
          
//           // Emergency plans second
//           if (a.type === 'emergency' && b.type !== 'emergency') return -1;
//           if (a.type !== 'emergency' && b.type === 'emergency') return 1;
          
//           // Custom plans third
//           if (a.type === 'custom' && b.type !== 'custom') return -1;
//           if (a.type !== 'custom' && b.type === 'custom') return 1;
          
//           // Preset plans sorted by displayOrder
//           return a.displayOrder - b.displayOrder;
//         });
        
//         setPlans(sortedPlans);
        
//         // Initialize default selections
//         const freq = {};
//         const size = {};
//         const period = {};
        
//         sortedPlans.forEach(plan => {
//           if (plan.deliveryFrequency?.length) {
//             freq[plan._id] = plan.deliveryFrequency[0];
//           }
//           if (plan.cylinderSizes?.length) {
//             size[plan._id] = plan.cylinderSizes[0];
//           } else if (plan.baseSize) {
//             size[plan._id] = plan.baseSize;
//           }
//           if (plan.subscriptionPeriod?.length) {
//             period[plan._id] = plan.subscriptionPeriod[0];
//           }
//         });
        
//         setSelectedFrequency(freq);
//         setSelectedSize(size);
//         setSelectedPeriod(period);
        
//         successToast('Plans loaded successfully');
//       } else {
//         throw new Error(result.message || 'Failed to load plans');
//       }
//     } catch (err) {
//       console.error('Error fetching plans:', err);
//       const errorMsg = err.message || 'Failed to load subscription plans';
//       setError(errorMsg);
//       errorToast(errorMsg);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // const calculatePrice = (plan, size, frequency, period = 1) => {
//   //   if (!plan || !plan.pricePerKg) return 0;
    
//   //   // Extract numeric size
//   //   const sizeNum = parseInt(size.toString().replace('kg', ''));
    
//   //   // Base price
//   //   let basePrice = sizeNum * plan.pricePerKg;
    
//   //   // Frequency multiplier
//   //   let freqMultiplier = 1;
//   //   switch (frequency) {
//   //     case 'Weekly':
//   //       freqMultiplier = 5;
//   //       break;
//   //     case 'Bi-weekly':
//   //       freqMultiplier = 3;
//   //       break;
//   //     case 'Daily':
//   //       freqMultiplier = 30;
//   //       break;
//   //     default: // Monthly
//   //       freqMultiplier = 1;
//   //   }
    
//   //   // Calculate total
//   //   return Math.round(basePrice * freqMultiplier * period);
//   // };

//   const calculatePrice = (plan, size, frequency, subscriptionPeriod = 1) => {
//   if (!plan) return 0;

//   // Extract numeric size value
//   const sizeKg = parseInt(String(size).replace("kg", ""), 10) || parseInt(size, 10);

//   // Calculate base price
//   let baseAmount = sizeKg * (plan.pricePerKg || 0);

//   // Delivery counts based on frequency
//   let deliveriesPerMonth = 0;
  
//   switch (frequency) {
//     case "Daily":
//       deliveriesPerMonth = 30;
//       break;
//     case "Weekly":
//       deliveriesPerMonth = 4;
//       break;
//     case "Bi-weekly":
//       deliveriesPerMonth = 2;
//       break;
//     case "Monthly":
//       deliveriesPerMonth = 1;
//       break;
//     case "One-Time":
//     case "Emergency":
//       deliveriesPerMonth = 1;
//       break;
//     default:
//       deliveriesPerMonth = 1;
//   }

//   // Calculate total deliveries with initial extra delivery
//   let totalDeliveries = 0;
  
//   if (frequency === "One-Time" || frequency === "Emergency") {
//     totalDeliveries = 1;
//   } else {
//     if (subscriptionPeriod === 1) {
//       // First month only
//       totalDeliveries = deliveriesPerMonth + 1;
//     } else {
//       // Multiple months
//       totalDeliveries = (deliveriesPerMonth + 1) + (deliveriesPerMonth * (subscriptionPeriod - 1));
//     }
//   }

//   // Total price = base amount × total deliveries
//   const totalAmount = baseAmount * totalDeliveries;

//   return Math.round(totalAmount);
// };


//   const getPlanIcon = (planType) => {
//     switch (planType) {
//       case 'emergency':
//         return <FaBolt className="mobsubplan-plan-icon mobsubplan-emergency" />;
//       case 'custom':
//         return <FaGasPump className="mobsubplan-plan-icon mobsubplan-custom" />;
//       case 'one-time':
//         return <FaTag className="mobsubplan-plan-icon mobsubplan-one-time" />;
//       case 'business':
//         return <FaUserFriends className="mobsubplan-plan-icon mobsubplan-business" />;
//       default:
//         return <FaFire className="mobsubplan-plan-icon mobsubplan-default" />;
//     }
//   };

//   const getPlanColor = (planType) => {
//     switch (planType) {
//       case 'emergency':
//         return '#e74c3c';
//       case 'custom':
//         return '#2ecc71';
//       case 'one-time':
//         return '#f39c12';
//       case 'business':
//         return '#9b59b6';
//       default:
//         return '#3498db';
//     }
//   };

//   const getFrequencyTag = (planType, frequency) => {
//     if (planType === 'one-time') return 'One-Time Purchase';
//     if (planType === 'emergency') return 'Emergency Delivery';
//     return frequency || 'Monthly';
//   };

//   const handlePlanSelection = (plan) => {
//     const price = calculatePrice(
//       plan,
//       selectedSize[plan._id] || plan.baseSize,
//       selectedFrequency[plan._id] || 'Monthly',
//       selectedPeriod[plan._id] || 1
//     );

//     // Add this to the summary modal or plan details
// const getDeliveryBreakdown = (frequency, period) => {
//   let deliveriesPerMonth = 0;
  
//   switch (frequency) {
//     case "Daily": deliveriesPerMonth = 30; break;
//     case "Weekly": deliveriesPerMonth = 4; break;
//     case "Bi-weekly": deliveriesPerMonth = 2; break;
//     case "Monthly": deliveriesPerMonth = 1; break;
//     default: deliveriesPerMonth = 1;
//   }

//   if (frequency === "One-Time" || frequency === "Emergency") {
//     return "1 delivery total";
//   }

//   if (period === 1) {
//     return `${deliveriesPerMonth + 1} deliveries (${deliveriesPerMonth} regular + 1 initial)`;
//   } else {
//     const total = (deliveriesPerMonth + 1) + (deliveriesPerMonth * (period - 1));
//     return `${total} deliveries total\n- Month 1: ${deliveriesPerMonth + 1} (${deliveriesPerMonth} + 1 initial)\n- Subsequent months: ${deliveriesPerMonth} per month`;
//   }
// };

//     setSelectedPlan({
//       ...plan,
//       selectedSize: selectedSize[plan._id] || plan.baseSize,
//       selectedFrequency: selectedFrequency[plan._id] || 'Monthly',
//       selectedPeriod: selectedPeriod[plan._id] || 1,
//       price
//     });
//     setShowSummary(true);
//   };

//   const handleViewDetails = (plan) => {
//     setPlanDetailsModal(plan);
//   };

//   const handleSubscribe = async () => {
//     if (!selectedPlan) return;
    
//     if (!user) {
//       warningToast('Please log in to subscribe');
//       navigate('/auth');
//       return;
//     }

//     if (!selectedPlan.price || selectedPlan.price <= 0) {
//       errorToast('Please select valid plan options');
//       return;
//     }

//     if (paymentMethod === 'wallet' && walletBalance < selectedPlan.price) {
//       errorToast('Insufficient wallet balance');
//       setPaymentMethod('paystack');
//       return;
//     }

//     setIsProcessing(true);
//     infoToast('Processing subscription...');

//     try {
//       const token = localStorage.getItem('token');
      
//       const requestBody = {
//         plan: selectedPlan._id,
//         size: selectedPlan.selectedSize,
//         frequency: selectedPlan.selectedFrequency,
//         subscriptionPeriod: selectedPlan.selectedPeriod,
//         paymentMethod: paymentMethod
//       };

//       const response = await fetch(`${API_BASE_URL}/subscriptions`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`
//         },
//         body: JSON.stringify(requestBody)
//       });

//       const result = await response.json();

//       if (!response.ok) {
//         throw new Error(result.message || `HTTP error! status: ${response.status}`);
//       }

//       if (result.success) {
//         if (paymentMethod === 'paystack' && result.authorization_url) {
//           // Redirect to Paystack payment
//           window.location.href = result.authorization_url;
//         } else if (paymentMethod === 'wallet') {
//           // Wallet payment successful
//           setWalletBalance(result.walletBalance || walletBalance - selectedPlan.price);
//           successToast('Subscription created successfully!');
          
//           // Redirect to subscriptions page
//           setTimeout(() => navigate('/subscriptions'), 1500);
//         } else {
//           successToast('Subscription created successfully!');
//           setTimeout(() => navigate('/subscriptions'), 1500);
//         }
//       } else {
//         throw new Error(result.message || 'Subscription failed');
//       }
//     } catch (err) {
//       console.error('Subscription error:', err);
//       const errorMsg = err.message || 'Failed to create subscription';
//       errorToast(errorMsg);
//     } finally {
//       setIsProcessing(false);
//       setShowSummary(false);
//     }
//   };

//   const formatCurrency = (amount) => {
//     return `₦${amount?.toLocaleString() || '0'}`;
//   };

//   const renderPlanCard = (plan) => {
//     const currentSize = selectedSize[plan._id] || plan.baseSize;
//     const currentFrequency = selectedFrequency[plan._id] || 'Monthly';
//     const currentPeriod = selectedPeriod[plan._id] || 1;
//     const price = calculatePrice(plan, currentSize, currentFrequency, currentPeriod);

//     return (
//       <div 
//         key={plan._id} 
//         className="mobsubplan-plan-card"
//         style={{ borderLeftColor: getPlanColor(plan.type) }}
//       >
//         {/* Plan Header */}
//         <div className="mobsubplan-plan-card-header">
//           <div className="mobsubplan-plan-title-section">
//             {getPlanIcon(plan.type)}
//             <div className="mobsubplan-plan-title-content">
//               <h3>{plan.name}</h3>
//               <span className="mobsubplan-plan-type-badge" style={{ backgroundColor: getPlanColor(plan.type) }}>
//                 {plan.type === 'one-time' ? 'Single Purchase' : 
//                  plan.type === 'emergency' ? 'Urgent' : 
//                  plan.type === 'custom' ? 'Custom' : 'Regular'}
//               </span>
//             </div>
//           </div>
//           <button 
//             className="mobsubplan-view-details-btn"
//             onClick={() => handleViewDetails(plan)}
//           >
//             <FaEye size={14} />
//           </button>
//         </div>

//         {/* Frequency Tag */}
//         <div className="mobsubplan-plan-frequency-tag">
//           <FaCalendar size={12} />
//           <span>{getFrequencyTag(plan.type, currentFrequency)}</span>
//         </div>

//         {/* Price Display */}
//         <div className="mobsubplan-plan-price-display">
//           <span className="mobsubplan-price-amount">{formatCurrency(price)}</span>
//           {plan.type !== 'one-time' && plan.type !== 'emergency' && (
//             <span className="mobsubplan-price-period"></span>
//           )}
//         </div>

//         {/* Size Selection */}
//         <div className="mobsubplan-plan-option-section">
//           <label className="mobsubplan-option-label">
//             <FaGasPump size={14} />
//             Cylinder Size
//           </label>
//           {(plan.type === 'custom' || plan.type === 'one-time' || plan.type === 'emergency') ? (
//             <select 
//               className="mobsubplan-option-select"
//               value={currentSize}
//               onChange={(e) => setSelectedSize(prev => ({
//                 ...prev,
//                 [plan._id]: e.target.value
//               }))}
//             >
//               {plan.cylinderSizes?.map(size => (
//                 <option key={size} value={size}>
//                   {size}kg
//                 </option>
//               ))}
//             </select>
//           ) : (
//             <div className="mobsubplan-option-info">
//               <span>{plan.baseSize}</span>
//             </div>
//           )}
//         </div>

//         {/* Frequency Selection for custom and preset plans */}
//         {(plan.type === 'custom' || plan.type === 'preset') && (
//           <div className="mobsubplan-plan-option-section">
//             <label className="mobsubplan-option-label">
//               <FaCalendar size={14} />
//               Delivery Frequency
//             </label>
//             <select 
//               className="mobsubplan-option-select"
//               value={currentFrequency}
//               onChange={(e) => setSelectedFrequency(prev => ({
//                 ...prev,
//                 [plan._id]: e.target.value
//               }))}
//             >
//               {plan.deliveryFrequency?.map(freq => (
//                 <option key={freq} value={freq}>
//                   {freq}
//                 </option>
//               ))}
//             </select>
//           </div>
//         )}

//         {/* Period Selection for non-one-time plans */}
//         {plan.type !== 'one-time' && plan.subscriptionPeriod?.length > 0 && (
//           <div className="mobsubplan-plan-option-section">
//             <label className="mobsubplan-option-label">
//               <FaCalendar size={14} />
//               Subscription Period
//             </label>
//             <select 
//               className="mobsubplan-option-select"
//               value={currentPeriod}
//               onChange={(e) => setSelectedPeriod(prev => ({
//                 ...prev,
//                 [plan._id]: parseInt(e.target.value)
//               }))}
//             >
//               {plan.subscriptionPeriod?.map(period => (
//                 <option key={period} value={period}>
//                   {period} month{period > 1 ? 's' : ''}
//                 </option>
//               ))}
//             </select>
//           </div>
//         )}

//         {/* Action Button */}
//         <button 
//           className="mobsubplan-select-plan-btn"
//           onClick={() => handlePlanSelection(plan)}
//           style={{ backgroundColor: getPlanColor(plan.type) }}
//           disabled={isProcessing}
//         >
//           {isProcessing ? 'Processing...' : 
//            plan.type === 'one-time' ? 'Buy Now' :
//            plan.type === 'emergency' ? 'Request Delivery' :
//            'Subscribe Now'}
//           <FaArrowRight className="mobsubplan-btn-icon" />
//         </button>
//       </div>
//     );
//   };

//   const renderPlanDetailsModal = () => {
//     if (!planDetailsModal) return null;

//     return (
//       <div className="mobsubplan-plan-details-modal">
//         <div className="mobsubplan-modal-content">
//           <div className="mobsubplan-modal-header">
//             <div className="mobsubplan-modal-title-section">
//               {getPlanIcon(planDetailsModal.type)}
//               <div>
//                 <h2>{planDetailsModal.name}</h2>
//                 <span 
//                   className="mobsubplan-modal-plan-type"
//                   style={{ backgroundColor: getPlanColor(planDetailsModal.type) }}
//                 >
//                   {planDetailsModal.type === 'one-time' ? 'One-Time Purchase' : 
//                    planDetailsModal.type === 'emergency' ? 'Emergency Delivery' : 
//                    planDetailsModal.type === 'custom' ? 'Custom Plan' : 'Subscription Plan'}
//                 </span>
//               </div>
//             </div>
//             <button 
//               className="mobsubplan-close-modal"
//               onClick={() => setPlanDetailsModal(null)}
//             >
//               <FaTimes />
//             </button>
//           </div>

//           <div className="mobsubplan-modal-body">
//             <div className="mobsubplan-modal-section">
//               <h3>Plan Description</h3>
//               <p className="mobsubplan-plan-description">{planDetailsModal.description}</p>
//             </div>

//             {planDetailsModal.features?.length > 0 && (
//               <div className="mobsubplan-modal-section">
//                 <h3>Features</h3>
//                 <div className="mobsubplan-features-list">
//                   {planDetailsModal.features.map((feature, index) => (
//                     <div key={index} className={`mobsubplan-feature-item ${feature.included ? 'mobsubplan-included' : 'mobsubplan-excluded'}`}>
//                       {feature.included ? 
//                         <FaCheck className="mobsubplan-feature-icon" /> : 
//                         <FaTimes className="mobsubplan-feature-icon" />
//                       }
//                       <div className="mobsubplan-feature-content">
//                         <strong>{feature.title}:</strong> {feature.description}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             <div className="mobsubplan-modal-section">
//               <h3>Specifications</h3>
//               <div className="mobsubplan-specifications-grid">
//                 <div className="mobsubplan-spec-item">
//                   <span className="mobsubplan-spec-label">Base Size:</span>
//                   <span className="mobsubplan-spec-value">{planDetailsModal.baseSize}</span>
//                 </div>
//                 <div className="mobsubplan-spec-item">
//                   <span className="mobsubplan-spec-label">Price per Kg:</span>
//                   <span className="mobsubplan-spec-value">{formatCurrency(planDetailsModal.pricePerKg)}</span>
//                 </div>
//                 {planDetailsModal.deliveryFrequency && (
//                   <div className="mobsubplan-spec-item">
//                     <span className="mobsubplan-spec-label">Delivery Frequency:</span>
//                     <span className="mobsubplan-spec-value">{planDetailsModal.deliveryFrequency.join(', ')}</span>
//                   </div>
//                 )}
//                 {planDetailsModal.subscriptionPeriod && (
//                   <div className="mobsubplan-spec-item">
//                     <span className="mobsubplan-spec-label">Subscription Period:</span>
//                     <span className="mobsubplan-spec-value">
//                       {planDetailsModal.subscriptionPeriod.map(p => `${p} month${p > 1 ? 's' : ''}`).join(', ')}
//                     </span>
//                   </div>
//                 )}
//                 {planDetailsModal.cylinderSizes && (
//                   <div className="mobsubplan-spec-item">
//                     <span className="mobsubplan-spec-label">Available Sizes:</span>
//                     <span className="mobsubplan-spec-value">{planDetailsModal.cylinderSizes.join(', ')}</span>
//                   </div>
//                 )}
//                 {planDetailsModal.deliveryInfo && (
//                   <>
//                     <div className="mobsubplan-spec-item">
//                       <span className="mobsubplan-spec-label">Delivery Time:</span>
//                       <span className="mobsubplan-spec-value">{planDetailsModal.deliveryInfo.deliveryTime}</span>
//                     </div>
//                     <div className="mobsubplan-spec-item">
//                       <span className="mobsubplan-spec-label">Free Delivery:</span>
//                       <span className="mobsubplan-spec-value">
//                         {planDetailsModal.deliveryInfo.freeDelivery ? 'Yes' : 'No'}
//                       </span>
//                     </div>
//                   </>
//                 )}
//               </div>
//             </div>
//           </div>

//           <div className="mobsubplan-modal-footer">
//             <button 
//               className="mobsubplan-btn-secondary"
//               onClick={() => setPlanDetailsModal(null)}
//             >
//               Close
//             </button>
//             <button 
//               className="mobsubplan-btn-primary"
//               style={{ backgroundColor: getPlanColor(planDetailsModal.type) }}
//               onClick={() => {
//                 setPlanDetailsModal(null);
//                 const currentSize = selectedSize[planDetailsModal._id] || planDetailsModal.baseSize;
//                 const currentFrequency = selectedFrequency[planDetailsModal._id] || 'Monthly';
//                 const currentPeriod = selectedPeriod[planDetailsModal._id] || 1;
//                 const price = calculatePrice(planDetailsModal, currentSize, currentFrequency, currentPeriod);
                
//                 setSelectedPlan({
//                   ...planDetailsModal,
//                   selectedSize: currentSize,
//                   selectedFrequency: currentFrequency,
//                   selectedPeriod: currentPeriod,
//                   price
//                 });
//                 setShowSummary(true);
//               }}
//             >
//               Select This Plan
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   if (isLoading) {
//     return (
//       <div className="mobsubplan-mobile-subscription-plans mobsubplan-loading">
//         <div className="mobsubplan-loading-spinner"></div>
//         <p>Loading plans...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="mobsubplan-mobile-subscription-plans mobsubplan-error">
//         <div className="mobsubplan-error-content">
//           <FaExclamationTriangle className="mobsubplan-error-icon" />
//           <h2>Unable to Load Plans</h2>
//           <p>{error}</p>
//           <button className="mobsubplan-retry-btn" onClick={fetchPlans}>
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="mobsubplan-mobile-subscription-plans">
//       {/* Header */}
//       <div className="mobsubplan-plans-header">
//         <h1>Choose Your Gas Plan</h1>
//         <div className="mobsubplan-wallet-display">
//           <FaWallet className="mobsubplan-wallet-icon" />
//           <span>{formatCurrency(walletBalance)}</span>
//         </div>
//       </div>

//       {/* One-Time Purchase Section */}
//       <div className="mobsubplan-plan-category-section">
//         <div className="mobsubplan-category-header">
//           <FaTag className="mobsubplan-category-icon" />
//           <div>
//             <h2>One-Time Purchase</h2>
//             <p className="mobsubplan-category-description">
//               Perfect for occasional users. 
//               Purchase gas as needed without any subscription.
//             </p>
//           </div>
//         </div>
//         <div className="mobsubplan-plans-list">
//           {plans.filter(p => p.type === 'one-time').map(plan => renderPlanCard(plan))}
//         </div>
//       </div>

//       {/* Emergency Delivery Section */}
//       <div className="mobsubplan-plan-category-section">
//         <div className="mobsubplan-category-header">
//           <FaBolt className="mobsubplan-category-icon" />
//           <div>
//             <h2>Emergency Delivery</h2>
//             <p className="mobsubplan-category-description">
//               Need gas urgently? Get immediate refill delivery within hours. 
//               Perfect for unexpected situations when you run out of gas.
//             </p>
//           </div>
//         </div>
//         <div className="mobsubplan-plans-list">
//           {plans.filter(p => p.type === 'emergency').map(plan => renderPlanCard(plan))}
//         </div>
//       </div>

//       {/* Preset Plans Section */}
//       <div className="mobsubplan-plan-category-section">
//         <div className="mobsubplan-category-header">
//           <FaFire className="mobsubplan-category-icon" />
//           <div>
//             <h2>Regular Subscription Plans</h2>
//             <p className="mobsubplan-category-description">
//               Choose from our flexible subscription plans for regular gas refill delivery. 
//               Save money and time with automatic deliveries based on your usage pattern.
//             </p>
//           </div>
//         </div>
//         <div className="mobsubplan-plans-list">
//           {plans.filter(p => p.type === 'preset').map(plan => renderPlanCard(plan))}
//         </div>
//       </div>

//       {/* Custom Plans Section */}
//       <div className="mobsubplan-plan-category-section">
//         <div className="mobsubplan-category-header">
//           <FaGasPump className="mobsubplan-category-icon" />
//           <div>
//             <h2>Build Your Own Plan</h2>
//             <p className="mobsubplan-category-description">
//               Customize every aspect of your gas delivery. 
//               Choose your cylinder size, delivery frequency, and subscription period.............coming soon.
//             </p>
//           </div>
//         </div>
//         <div className="mobsubplan-plans-list">
//           {plans.filter(p => p.type === 'custom').map(plan => renderPlanCard(plan))}
//         </div>
//       </div>

//       {/* Plan Details Modal */}
//       {renderPlanDetailsModal()}

//       {/* Payment Summary Modal */}
//       {showSummary && selectedPlan && (
//         <div className="mobsubplan-plan-summary-modal">
//           <div className="mobsubplan-summary-content">
//             <div className="mobsubplan-summary-header">
//               <h2>Confirm Your Plan</h2>
//               <button 
//                 className="mobsubplan-close-summary"
//                 onClick={() => setShowSummary(false)}
//                 disabled={isProcessing}
//               >
//                 <FaTimes />
//               </button>
//             </div>

//             <div className="mobsubplan-summary-body">
//               <div className="mobsubplan-plan-summary">
//                 <div className="mobsubplan-plan-summary-header">
//                   {getPlanIcon(selectedPlan.type)}
//                   <div>
//                     <h3>{selectedPlan.name}</h3>
//                     <span className="mobsubplan-plan-type">{selectedPlan.type}</span>
//                   </div>
//                 </div>

//                 <div className="mobsubplan-summary-details">
//                   <div className="mobsubplan-detail-item">
//                     <span className="mobsubplan-detail-label">Cylinder Size:</span>
//                     <span className="mobsubplan-detail-value">{selectedPlan.selectedSize}</span>
//                   </div>
//                   <div className="mobsubplan-detail-item">
//                     <span className="mobsubplan-detail-label">Delivery Frequency:</span>
//                     <span className="mobsubplan-detail-value">{selectedPlan.selectedFrequency}</span>
//                   </div>
//                   {selectedPlan.selectedPeriod > 1 && (
//                     <div className="mobsubplan-detail-item">
//                       <span className="mobsubplan-detail-label">Subscription Period:</span>
//                       <span className="mobsubplan-detail-value">
//                         {selectedPlan.selectedPeriod} month{selectedPlan.selectedPeriod > 1 ? 's' : ''}
//                       </span>
//                     </div>
//                   )}
//                   <div className="mobsubplan-detail-item mobsubplan-total">
//                     <span className="mobsubplan-detail-label">Total Price:</span>
//                     <span className="mobsubplan-detail-value mobsubplan-price">{formatCurrency(selectedPlan.price)}</span>
//                   </div>
//                 </div>
//               </div>

//               {/* Payment Method Selection */}
//               <div className="mobsubplan-payment-method">
//                 <h4>Payment Method</h4>
//                 <div className="mobsubplan-payment-options">
//                   <div 
//                     className={`mobsubplan-payment-option ${paymentMethod === 'paystack' ? 'mobsubplan-selected' : ''}`}
//                     onClick={() => setPaymentMethod('paystack')}
//                   >
//                     <div className="mobsubplan-option-content">
//                       <FaCreditCard className="mobsubplan-option-icon mobsubplan-card" />
//                       <div className="mobsubplan-option-text">
//                         <span className="mobsubplan-option-title">Pay with Card</span>
//                         <span className="mobsubplan-option-description">Secure payment via Paystack</span>
//                       </div>
//                     </div>
//                     <div className="mobsubplan-option-check">
//                       {paymentMethod === 'paystack' && <FaCheck />}
//                     </div>
//                   </div>

//                   <div 
//                     className={`mobsubplan-payment-option ${paymentMethod === 'wallet' ? 'mobsubplan-selected' : ''}`}
//                     onClick={() => setPaymentMethod('wallet')}
//                   >
//                     <div className="mobsubplan-option-content">
//                       <FaWallet className="mobsubplan-option-icon mobsubplan-wallet" />
//                       <div className="mobsubplan-option-text">
//                         <span className="mobsubplan-option-title">Pay with Wallet</span>
//                         <span className="mobsubplan-option-description">Balance: {formatCurrency(walletBalance)}</span>
//                       </div>
//                     </div>
//                     <div className="mobsubplan-option-check">
//                       {paymentMethod === 'wallet' && <FaCheck />}
//                     </div>
//                   </div>
//                 </div>

//                 {paymentMethod === 'wallet' && walletBalance < selectedPlan.price && (
//                   <div className="mobsubplan-wallet-warning">
//                     <FaExclamationTriangle />
//                     <span>Insufficient wallet balance. Top up or select card payment.</span>
//                   </div>
//                 )}
//               </div>
//             </div>

//             <div className="mobsubplan-summary-footer">
//               <button 
//                 className="mobsubplan-summary-btn mobsubplan-cancel"
//                 onClick={() => setShowSummary(false)}
//                 disabled={isProcessing}
//               >
//                 Cancel
//               </button>
//               <button 
//                 className="mobsubplan-summary-btn mobsubplan-confirm"
//                 onClick={handleSubscribe}
//                 disabled={isProcessing || (paymentMethod === 'wallet' && walletBalance < selectedPlan.price)}
//                 style={{ backgroundColor: getPlanColor(selectedPlan.type) }}
//               >
//                 {isProcessing ? (
//                   <>
//                     <div className="mobsubplan-processing-spinner"></div>
//                     Processing...
//                   </>
//                 ) : paymentMethod === 'wallet' ? (
//                   `Pay ${formatCurrency(selectedPlan.price)}`
//                 ) : (
//                   'Proceed to Payment'
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {isProcessing && (
//         <div className="mobsubplan-processing-overlay">
//           <div className="mobsubplan-processing-spinner-large"></div>
//           <p>Processing your request...</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MobileSubscriptionPlans;


// // components/mobile/MobileSubscriptionPlans.js
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import './MobileSubscriptionPlans.css';
// import { 
//   FaWallet, 
//   FaCreditCard, 
//   FaFire, 
//   FaBolt, 
//   FaGasPump, 
//   FaCalendar, 
//   FaCheck, 
//   FaTimes, 
//   FaEye,
//   FaTag,
//   FaUserFriends,
//   FaExclamationTriangle,
//   FaArrowRight,
//   FaInfoCircle,
//   FaTruck,
//   FaShieldAlt
// } from 'react-icons/fa';
// import { successToast, errorToast, infoToast, warningToast } from "../../utils/toast";

// const MobileSubscriptionPlans = () => {
//   const navigate = useNavigate();
//   const [plans, setPlans] = useState([]);
//   const [user, setUser] = useState(null);
//   const [walletBalance, setWalletBalance] = useState(0);
//   const [selectedPlan, setSelectedPlan] = useState(null);
//   const [selectedFrequency, setSelectedFrequency] = useState({});
//   const [selectedSize, setSelectedSize] = useState({});
//   const [selectedPeriod, setSelectedPeriod] = useState({});
//   const [isLoading, setIsLoading] = useState(true);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [error, setError] = useState('');
//   const [showSummary, setShowSummary] = useState(false);
//   const [paymentMethod, setPaymentMethod] = useState('paystack');
//   const [planDetailsModal, setPlanDetailsModal] = useState(null);

//   const API_BASE_URL = 'https://egas-server-1.onrender.com/api/v1';

//   useEffect(() => {
//     fetchUserData();
//     fetchPlans();
//   }, []);

//   const fetchUserData = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const userData = localStorage.getItem('user');
      
//       if (userData) {
//         setUser(JSON.parse(userData));
//       }

//       if (token) {
//         const response = await fetch(`${API_BASE_URL}/dashboard/overview`, {
//           headers: { Authorization: `Bearer ${token}` }
//         });
        
//         if (response.ok) {
//           const data = await response.json();
//           setWalletBalance(data.data?.walletBalance || 0);
//         }
//       }
//     } catch (error) {
//       console.error('Error fetching user data:', error);
//     }
//   };

//   const fetchPlans = async () => {
//     setIsLoading(true);
//     infoToast('Loading subscription plans...');
    
//     try {
//       const response = await fetch(`${API_BASE_URL}/subscription-plans`);
//       if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

//       const result = await response.json();
      
//       if (result.success) {
//         const allPlans = result.data || [];
        
//         // Sort plans: one-time first, then emergency, then custom, then preset plans
//         const sortedPlans = allPlans.sort((a, b) => {
//           // One-time plans first
//           if (a.type === 'one-time' && b.type !== 'one-time') return -1;
//           if (a.type !== 'one-time' && b.type === 'one-time') return 1;
          
//           // Emergency plans second
//           if (a.type === 'emergency' && b.type !== 'emergency') return -1;
//           if (a.type !== 'emergency' && b.type === 'emergency') return 1;
          
//           // Custom plans third
//           if (a.type === 'custom' && b.type !== 'custom') return -1;
//           if (a.type !== 'custom' && b.type === 'custom') return 1;
          
//           // Preset plans sorted by displayOrder
//           return a.displayOrder - b.displayOrder;
//         });
        
//         setPlans(sortedPlans);
        
//         // Initialize default selections
//         const freq = {};
//         const size = {};
//         const period = {};
        
//         sortedPlans.forEach(plan => {
//           if (plan.deliveryFrequency?.length) {
//             freq[plan._id] = plan.deliveryFrequency[0];
//           }
//           if (plan.cylinderSizes?.length) {
//             size[plan._id] = plan.cylinderSizes[0];
//           } else if (plan.baseSize) {
//             size[plan._id] = plan.baseSize;
//           }
//           if (plan.subscriptionPeriod?.length) {
//             period[plan._id] = plan.subscriptionPeriod[0];
//           }
//         });
        
//         setSelectedFrequency(freq);
//         setSelectedSize(size);
//         setSelectedPeriod(period);
        
//         successToast('Plans loaded successfully');
//       } else {
//         throw new Error(result.message || 'Failed to load plans');
//       }
//     } catch (err) {
//       console.error('Error fetching plans:', err);
//       const errorMsg = err.message || 'Failed to load subscription plans';
//       setError(errorMsg);
//       errorToast(errorMsg);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Price calculation - UPDATED to match backend
//   const calculatePrice = (plan, size, frequency, subscriptionPeriod = 1) => {
//     if (!plan || !plan.pricePerKg) return 0;
    
//     // Extract numeric size
//     const sizeNum = parseInt(size.toString().replace('kg', '')) || parseInt(size);
    
//     // Base price
//     let baseAmount = sizeNum * plan.pricePerKg;

//     // Determine deliveries per month based on frequency
//     let deliveriesPerMonth = 0;
    
//     switch (frequency) {
//       case "Daily":
//         deliveriesPerMonth = 30;
//         break;
//       case "Weekly":
//         deliveriesPerMonth = 4;
//         break;
//       case "Bi-weekly":
//         deliveriesPerMonth = 2;
//         break;
//       case "Monthly":
//         deliveriesPerMonth = 1;
//         break;
//       case "One-Time":
//       case "Emergency":
//         deliveriesPerMonth = 1;
//         break;
//       default:
//         deliveriesPerMonth = 1;
//     }

//     // Calculate total deliveries including initial extra delivery
//     let totalDeliveries = 0;
    
//     if (frequency === "One-Time" || frequency === "Emergency") {
//       totalDeliveries = 1;
//     } else {
//       if (subscriptionPeriod === 1) {
//         totalDeliveries = deliveriesPerMonth + 1;
//       } else {
//         totalDeliveries = (deliveriesPerMonth + 1) + (deliveriesPerMonth * (subscriptionPeriod - 1));
//       }
//     }

//     // Total price = base amount × total deliveries
//     return Math.round(baseAmount * totalDeliveries);
//   };

//   // Helper function for delivery breakdown
//   const getDeliveryBreakdown = (frequency, period) => {
//     let deliveriesPerMonth = 0;
    
//     switch (frequency) {
//       case "Daily": deliveriesPerMonth = 30; break;
//       case "Weekly": deliveriesPerMonth = 4; break;
//       case "Bi-weekly": deliveriesPerMonth = 2; break;
//       case "Monthly": deliveriesPerMonth = 1; break;
//       default: deliveriesPerMonth = 1;
//     }

//     if (frequency === "One-Time" || frequency === "Emergency") {
//       return {
//         text: "1 delivery",
//         details: ["1 delivery total"]
//       };
//     }

//     if (period === 1) {
//       return {
//         text: `${deliveriesPerMonth + 1} deliveries`,
//         details: [
//           `${deliveriesPerMonth + 1} total deliveries`,
//           `Includes 1 initial delivery on day 1`,
//           `${deliveriesPerMonth} regular deliveries`
//         ]
//       };
//     } else {
//       const total = (deliveriesPerMonth + 1) + (deliveriesPerMonth * (period - 1));
//       return {
//         text: `${total} deliveries`,
//         details: [
//           `${total} total deliveries`,
//           `Month 1: ${deliveriesPerMonth + 1} (${deliveriesPerMonth} + 1 initial)`,
//           `Subsequent months: ${deliveriesPerMonth} per month`
//         ]
//       };
//     }
//   };

//   const getPlanIcon = (planType) => {
//     switch (planType) {
//       case 'emergency':
//         return <FaBolt className="mobsubplan-plan-icon mobsubplan-emergency" />;
//       case 'custom':
//         return <FaGasPump className="mobsubplan-plan-icon mobsubplan-custom" />;
//       case 'one-time':
//         return <FaTag className="mobsubplan-plan-icon mobsubplan-one-time" />;
//       case 'business':
//         return <FaUserFriends className="mobsubplan-plan-icon mobsubplan-business" />;
//       default:
//         return <FaFire className="mobsubplan-plan-icon mobsubplan-default" />;
//     }
//   };

//   const getPlanColor = (planType) => {
//     switch (planType) {
//       case 'emergency':
//         return '#e74c3c';
//       case 'custom':
//         return '#2ecc71';
//       case 'one-time':
//         return '#f39c12';
//       case 'business':
//         return '#9b59b6';
//       default:
//         return '#3498db';
//     }
//   };

//   const getFrequencyTag = (planType, frequency) => {
//     if (planType === 'one-time') return 'One-Time Purchase';
//     if (planType === 'emergency') return 'Emergency Delivery';
//     return frequency || 'Monthly';
//   };

//   const handlePlanSelection = (plan) => {
//     const price = calculatePrice(
//       plan,
//       selectedSize[plan._id] || plan.baseSize,
//       selectedFrequency[plan._id] || 'Monthly',
//       selectedPeriod[plan._id] || 1
//     );

//     const deliveryBreakdown = getDeliveryBreakdown(
//       selectedFrequency[plan._id] || 'Monthly',
//       selectedPeriod[plan._id] || 1
//     );

//     setSelectedPlan({
//       ...plan,
//       selectedSize: selectedSize[plan._id] || plan.baseSize,
//       selectedFrequency: selectedFrequency[plan._id] || 'Monthly',
//       selectedPeriod: selectedPeriod[plan._id] || 1,
//       price,
//       deliveryBreakdown
//     });
//     setShowSummary(true);
//   };

//   const handleViewDetails = (plan) => {
//     setPlanDetailsModal(plan);
//   };

//   const handleSubscribe = async () => {
//     if (!selectedPlan) return;
    
//     if (!user) {
//       warningToast('Please log in to subscribe');
//       navigate('/auth');
//       return;
//     }

//     if (!selectedPlan.price || selectedPlan.price <= 0) {
//       errorToast('Please select valid plan options');
//       return;
//     }

//     if (paymentMethod === 'wallet' && walletBalance < selectedPlan.price) {
//       errorToast('Insufficient wallet balance');
//       setPaymentMethod('paystack');
//       return;
//     }

//     setIsProcessing(true);
//     infoToast('Processing subscription...');

//     try {
//       const token = localStorage.getItem('token');
      
//       const requestBody = {
//         plan: selectedPlan._id,
//         size: selectedPlan.selectedSize,
//         frequency: selectedPlan.selectedFrequency,
//         subscriptionPeriod: selectedPlan.selectedPeriod,
//         paymentMethod: paymentMethod
//       };

//       const response = await fetch(`${API_BASE_URL}/subscriptions`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`
//         },
//         body: JSON.stringify(requestBody)
//       });

//       const result = await response.json();

//       if (!response.ok) {
//         throw new Error(result.message || `HTTP error! status: ${response.status}`);
//       }

//       if (result.success) {
//         if (paymentMethod === 'paystack' && result.authorization_url) {
//           // Redirect to Paystack payment
//           window.location.href = result.authorization_url;
//         } else if (paymentMethod === 'wallet') {
//           // Wallet payment successful
//           setWalletBalance(result.walletBalance || walletBalance - selectedPlan.price);
//           successToast('Subscription created successfully!');
          
//           // Redirect to subscriptions page
//           setTimeout(() => navigate('/subscriptions'), 1500);
//         } else {
//           successToast('Subscription created successfully!');
//           setTimeout(() => navigate('/subscriptions'), 1500);
//         }
//       } else {
//         throw new Error(result.message || 'Subscription failed');
//       }
//     } catch (err) {
//       console.error('Subscription error:', err);
//       const errorMsg = err.message || 'Failed to create subscription';
//       errorToast(errorMsg);
//     } finally {
//       setIsProcessing(false);
//       setShowSummary(false);
//     }
//   };

//   const formatCurrency = (amount) => {
//     return `₦${amount?.toLocaleString() || '0'}`;
//   };

//   const renderPlanCard = (plan) => {
//     const currentSize = selectedSize[plan._id] || plan.baseSize;
//     const currentFrequency = selectedFrequency[plan._id] || 'Monthly';
//     const currentPeriod = selectedPeriod[plan._id] || 1;
//     const price = calculatePrice(plan, currentSize, currentFrequency, currentPeriod);
//     const deliveryBreakdown = getDeliveryBreakdown(currentFrequency, currentPeriod);

//     return (
//       <div 
//         key={plan._id} 
//         className="mobsubplan-plan-card"
//         style={{ borderLeftColor: getPlanColor(plan.type) }}
//       >
//         {/* Plan Header */}
//         <div className="mobsubplan-plan-card-header">
//           <div className="mobsubplan-plan-title-section">
//             {getPlanIcon(plan.type)}
//             <div className="mobsubplan-plan-title-content">
//               <h3>{plan.name}</h3>
//               <span className="mobsubplan-plan-type-badge" style={{ backgroundColor: getPlanColor(plan.type) }}>
//                 {plan.type === 'one-time' ? 'Single Purchase' : 
//                  plan.type === 'emergency' ? 'Urgent' : 
//                  plan.type === 'custom' ? 'Custom' : 'Regular'}
//               </span>
//             </div>
//           </div>
//           <button 
//             className="mobsubplan-view-details-btn"
//             onClick={() => handleViewDetails(plan)}
//           >
//             <FaEye size={14} />
//           </button>
//         </div>

//         {/* Frequency Tag */}
//         <div className="mobsubplan-plan-frequency-tag">
//           <FaCalendar size={12} />
//           <span>{getFrequencyTag(plan.type, currentFrequency)}</span>
//         </div>

//         {/* Price Display */}
//         <div className="mobsubplan-plan-price-display">
//           <span className="mobsubplan-price-amount">{formatCurrency(price)}</span>
//           {plan.type !== 'one-time' && plan.type !== 'emergency' && (
//             <span className="mobsubplan-price-period"></span>
//           )}
//         </div>

//         {/* Delivery Info (for non-one-time plans) */}
//         {plan.type !== 'one-time' && plan.type !== 'emergency' && (
//           <div className="mobsubplan-plan-delivery-info">
//             <div className="mobsubplan-delivery-count">
//               <FaTruck size={12} />
//               <span>{deliveryBreakdown.text}</span>
//             </div>
//             {currentPeriod === 1 && plan.type !== 'one-time' && plan.type !== 'emergency' && (
//               <div className="mobsubplan-initial-note">
//                 Includes 1 initial delivery on day 1
//               </div>
//             )}
//           </div>
//         )}

//         {/* Size Selection */}
//         <div className="mobsubplan-plan-option-section">
//           <label className="mobsubplan-option-label">
//             <FaGasPump size={14} />
//             Cylinder Size
//           </label>
//           {(plan.type === 'custom' || plan.type === 'one-time' || plan.type === 'emergency') ? (
//             <select 
//               className="mobsubplan-option-select"
//               value={currentSize}
//               onChange={(e) => setSelectedSize(prev => ({
//                 ...prev,
//                 [plan._id]: e.target.value
//               }))}
//             >
//               {plan.cylinderSizes?.map(size => (
//                 <option key={size} value={size}>
//                   {size}kg
//                 </option>
//               ))}
//             </select>
//           ) : (
//             <div className="mobsubplan-option-info">
//               <span>{plan.baseSize}</span>
//             </div>
//           )}
//         </div>

//         {/* Frequency Selection for custom and preset plans */}
//         {(plan.type === 'custom' || plan.type === 'preset') && (
//           <div className="mobsubplan-plan-option-section">
//             <label className="mobsubplan-option-label">
//               <FaCalendar size={14} />
//               Delivery Frequency
//             </label>
//             <select 
//               className="mobsubplan-option-select"
//               value={currentFrequency}
//               onChange={(e) => setSelectedFrequency(prev => ({
//                 ...prev,
//                 [plan._id]: e.target.value
//               }))}
//             >
//               {plan.deliveryFrequency?.map(freq => (
//                 <option key={freq} value={freq}>
//                   {freq}
//                 </option>
//               ))}
//             </select>
//           </div>
//         )}

//         {/* Period Selection for non-one-time plans */}
//         {plan.type !== 'one-time' && plan.subscriptionPeriod?.length > 0 && (
//           <div className="mobsubplan-plan-option-section">
//             <label className="mobsubplan-option-label">
//               <FaCalendar size={14} />
//               Subscription Period
//             </label>
//             <select 
//               className="mobsubplan-option-select"
//               value={currentPeriod}
//               onChange={(e) => setSelectedPeriod(prev => ({
//                 ...prev,
//                 [plan._id]: parseInt(e.target.value)
//               }))}
//             >
//               {plan.subscriptionPeriod?.map(period => (
//                 <option key={period} value={period}>
//                   {period} month{period > 1 ? 's' : ''}
//                 </option>
//               ))}
//             </select>
//           </div>
//         )}

//         {/* Action Button */}
//         <button 
//           className="mobsubplan-select-plan-btn"
//           onClick={() => handlePlanSelection(plan)}
//           style={{ backgroundColor: getPlanColor(plan.type) }}
//           disabled={isProcessing}
//         >
//           {isProcessing ? 'Processing...' : 
//            plan.type === 'one-time' ? 'Buy Now' :
//            plan.type === 'emergency' ? 'Request Delivery' :
//            'Subscribe Now'}
//           <FaArrowRight className="mobsubplan-btn-icon" />
//         </button>
//       </div>
//     );
//   };

//   const renderPlanDetailsModal = () => {
//     if (!planDetailsModal) return null;

//     return (
//       <div className="mobsubplan-plan-details-modal">
//         <div className="mobsubplan-modal-content">
//           <div className="mobsubplan-modal-header">
//             <div className="mobsubplan-modal-title-section">
//               {getPlanIcon(planDetailsModal.type)}
//               <div>
//                 <h2>{planDetailsModal.name}</h2>
//                 <span 
//                   className="mobsubplan-modal-plan-type"
//                   style={{ backgroundColor: getPlanColor(planDetailsModal.type) }}
//                 >
//                   {planDetailsModal.type === 'one-time' ? 'One-Time Purchase' : 
//                    planDetailsModal.type === 'emergency' ? 'Emergency Delivery' : 
//                    planDetailsModal.type === 'custom' ? 'Custom Plan' : 'Subscription Plan'}
//                 </span>
//               </div>
//             </div>
//             <button 
//               className="mobsubplan-close-modal"
//               onClick={() => setPlanDetailsModal(null)}
//             >
//               <FaTimes />
//             </button>
//           </div>

//           <div className="mobsubplan-modal-body">
//             <div className="mobsubplan-modal-section">
//               <h3>Plan Description</h3>
//               <p className="mobsubplan-plan-description">{planDetailsModal.description}</p>
//             </div>

//             {planDetailsModal.features?.length > 0 && (
//               <div className="mobsubplan-modal-section">
//                 <h3>Features</h3>
//                 <div className="mobsubplan-features-list">
//                   {planDetailsModal.features.map((feature, index) => (
//                     <div key={index} className={`mobsubplan-feature-item ${feature.included ? 'mobsubplan-included' : 'mobsubplan-excluded'}`}>
//                       {feature.included ? 
//                         <FaCheck className="mobsubplan-feature-icon" /> : 
//                         <FaTimes className="mobsubplan-feature-icon" />
//                       }
//                       <div className="mobsubplan-feature-content">
//                         <strong>{feature.title}:</strong> {feature.description}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             <div className="mobsubplan-modal-section">
//               <h3>Specifications</h3>
//               <div className="mobsubplan-specifications-grid">
//                 <div className="mobsubplan-spec-item">
//                   <span className="mobsubplan-spec-label">Base Size:</span>
//                   <span className="mobsubplan-spec-value">{planDetailsModal.baseSize}</span>
//                 </div>
//                 <div className="mobsubplan-spec-item">
//                   <span className="mobsubplan-spec-label">Price per Kg:</span>
//                   <span className="mobsubplan-spec-value">{formatCurrency(planDetailsModal.pricePerKg)}</span>
//                 </div>
//                 {planDetailsModal.deliveryFrequency && (
//                   <div className="mobsubplan-spec-item">
//                     <span className="mobsubplan-spec-label">Delivery Frequency:</span>
//                     <span className="mobsubplan-spec-value">{planDetailsModal.deliveryFrequency.join(', ')}</span>
//                   </div>
//                 )}
//                 {planDetailsModal.subscriptionPeriod && (
//                   <div className="mobsubplan-spec-item">
//                     <span className="mobsubplan-spec-label">Subscription Period:</span>
//                     <span className="mobsubplan-spec-value">
//                       {planDetailsModal.subscriptionPeriod.map(p => `${p} month${p > 1 ? 's' : ''}`).join(', ')}
//                     </span>
//                   </div>
//                 )}
//                 {planDetailsModal.cylinderSizes && (
//                   <div className="mobsubplan-spec-item">
//                     <span className="mobsubplan-spec-label">Available Sizes:</span>
//                     <span className="mobsubplan-spec-value">{planDetailsModal.cylinderSizes.join(', ')}</span>
//                   </div>
//                 )}
//                 {planDetailsModal.deliveryInfo && (
//                   <>
//                     <div className="mobsubplan-spec-item">
//                       <span className="mobsubplan-spec-label">Delivery Time:</span>
//                       <span className="mobsubplan-spec-value">{planDetailsModal.deliveryInfo.deliveryTime}</span>
//                     </div>
//                     <div className="mobsubplan-spec-item">
//                       <span className="mobsubplan-spec-label">Free Delivery:</span>
//                       <span className="mobsubplan-spec-value">
//                         {planDetailsModal.deliveryInfo.freeDelivery ? 'Yes' : 'No'}
//                       </span>
//                     </div>
//                   </>
//                 )}
//               </div>
//             </div>
//           </div>

//           <div className="mobsubplan-modal-footer">
//             <button 
//               className="mobsubplan-btn-secondary"
//               onClick={() => setPlanDetailsModal(null)}
//             >
//               Close
//             </button>
//             <button 
//               className="mobsubplan-btn-primary"
//               style={{ backgroundColor: getPlanColor(planDetailsModal.type) }}
//               onClick={() => {
//                 setPlanDetailsModal(null);
//                 const currentSize = selectedSize[planDetailsModal._id] || planDetailsModal.baseSize;
//                 const currentFrequency = selectedFrequency[planDetailsModal._id] || 'Monthly';
//                 const currentPeriod = selectedPeriod[planDetailsModal._id] || 1;
//                 const price = calculatePrice(planDetailsModal, currentSize, currentFrequency, currentPeriod);
//                 const deliveryBreakdown = getDeliveryBreakdown(currentFrequency, currentPeriod);
                
//                 setSelectedPlan({
//                   ...planDetailsModal,
//                   selectedSize: currentSize,
//                   selectedFrequency: currentFrequency,
//                   selectedPeriod: currentPeriod,
//                   price,
//                   deliveryBreakdown
//                 });
//                 setShowSummary(true);
//               }}
//             >
//               Select This Plan
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   if (isLoading) {
//     return (
//       <div className="mobsubplan-mobile-subscription-plans mobsubplan-loading">
//         <div className="mobsubplan-loading-spinner"></div>
//         <p>Loading plans...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="mobsubplan-mobile-subscription-plans mobsubplan-error">
//         <div className="mobsubplan-error-content">
//           <FaExclamationTriangle className="mobsubplan-error-icon" />
//           <h2>Unable to Load Plans</h2>
//           <p>{error}</p>
//           <button className="mobsubplan-retry-btn" onClick={fetchPlans}>
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="mobsubplan-mobile-subscription-plans">
//       {/* Header */}
//       <div className="mobsubplan-plans-header">
//         <h1>Choose Your Gas Plan</h1>
//         <div className="mobsubplan-wallet-display">
//           <FaWallet className="mobsubplan-wallet-icon" />
//           <span>{formatCurrency(walletBalance)}</span>
//         </div>
//       </div>

//       {/* One-Time Purchase Section */}
//       <div className="mobsubplan-plan-category-section">
//         <div className="mobsubplan-category-header">
//           <FaTag className="mobsubplan-category-icon" />
//           <div>
//             <h2>One-Time Purchase</h2>
//             <p className="mobsubplan-category-description">
//               Perfect for occasional users. 
//               Purchase gas as needed without any subscription.
//             </p>
//           </div>
//         </div>
//         <div className="mobsubplan-plans-list">
//           {plans.filter(p => p.type === 'one-time').map(plan => renderPlanCard(plan))}
//         </div>
//       </div>

//       {/* Emergency Delivery Section */}
//       <div className="mobsubplan-plan-category-section">
//         <div className="mobsubplan-category-header">
//           <FaBolt className="mobsubplan-category-icon" />
//           <div>
//             <h2>Emergency Delivery</h2>
//             <p className="mobsubplan-category-description">
//               Need gas urgently? Get immediate refill delivery within hours. 
//               Perfect for unexpected situations when you run out of gas.
//             </p>
//           </div>
//         </div>
//         <div className="mobsubplan-plans-list">
//           {plans.filter(p => p.type === 'emergency').map(plan => renderPlanCard(plan))}
//         </div>
//       </div>

//       {/* Preset Plans Section */}
//       <div className="mobsubplan-plan-category-section">
//         <div className="mobsubplan-category-header">
//           <FaFire className="mobsubplan-category-icon" />
//           <div>
//             <h2>Regular Subscription Plans</h2>
//             <p className="mobsubplan-category-description">
//               Choose from our flexible subscription plans for regular gas refill delivery. 
//               Save money and time with automatic deliveries based on your usage pattern.
//             </p>
//           </div>
//         </div>
//         <div className="mobsubplan-plans-list">
//           {plans.filter(p => p.type === 'preset').map(plan => renderPlanCard(plan))}
//         </div>
//       </div>

//       {/* Custom Plans Section */}
//       <div className="mobsubplan-plan-category-section">
//         <div className="mobsubplan-category-header">
//           <FaGasPump className="mobsubplan-category-icon" />
//           <div>
//             <h2>Build Your Own Plan</h2>
//             <p className="mobsubplan-category-description">
//               Customize every aspect of your gas delivery. 
//               Choose your cylinder size, delivery frequency, and subscription period.
//             </p>
//           </div>
//         </div>
//         <div className="mobsubplan-plans-list">
//           {plans.filter(p => p.type === 'custom').map(plan => renderPlanCard(plan))}
//         </div>
//       </div>

//       {/* Plan Details Modal */}
//       {renderPlanDetailsModal()}

//       {/* Payment Summary Modal */}
//       {showSummary && selectedPlan && (
//         <div className="mobsubplan-plan-summary-modal">
//           <div className="mobsubplan-summary-content">
//             <div className="mobsubplan-summary-header">
//               <h2>Confirm Your Plan</h2>
//               <button 
//                 className="mobsubplan-close-summary"
//                 onClick={() => setShowSummary(false)}
//                 disabled={isProcessing}
//               >
//                 <FaTimes />
//               </button>
//             </div>

//             <div className="mobsubplan-summary-body">
//               <div className="mobsubplan-plan-summary">
//                 <div className="mobsubplan-plan-summary-header">
//                   {getPlanIcon(selectedPlan.type)}
//                   <div>
//                     <h3>{selectedPlan.name}</h3>
//                     <span className="mobsubplan-plan-type">{selectedPlan.type}</span>
//                   </div>
//                 </div>

//                 <div className="mobsubplan-summary-details">
//                   <div className="mobsubplan-detail-item">
//                     <span className="mobsubplan-detail-label">Cylinder Size:</span>
//                     <span className="mobsubplan-detail-value">{selectedPlan.selectedSize}</span>
//                   </div>
//                   <div className="mobsubplan-detail-item">
//                     <span className="mobsubplan-detail-label">Delivery Frequency:</span>
//                     <span className="mobsubplan-detail-value">{selectedPlan.selectedFrequency}</span>
//                   </div>
//                   {selectedPlan.selectedPeriod > 1 && (
//                     <div className="mobsubplan-detail-item">
//                       <span className="mobsubplan-detail-label">Subscription Period:</span>
//                       <span className="mobsubplan-detail-value">
//                         {selectedPlan.selectedPeriod} month{selectedPlan.selectedPeriod > 1 ? 's' : ''}
//                       </span>
//                     </div>
//                   )}
                  
//                   {/* Delivery Breakdown */}
//                   <div className="mobsubplan-detail-item mobsubplan-delivery-breakdown">
//                     <span className="mobsubplan-detail-label">Deliveries:</span>
//                     <div className="mobsubplan-breakdown-details">
//                       {selectedPlan.deliveryBreakdown?.details?.map((item, index) => (
//                         <div key={index} style={{ 
//                           fontSize: '0.85rem', 
//                           color: '#7f8c8d',
//                           marginTop: index === 0 ? '0' : '2px'
//                         }}>
//                           {item}
//                         </div>
//                       ))}
//                     </div>
//                   </div>
                  
//                   <div className="mobsubplan-detail-item mobsubplan-total">
//                     <span className="mobsubplan-detail-label">Total Price:</span>
//                     <span className="mobsubplan-detail-value mobsubplan-price">{formatCurrency(selectedPlan.price)}</span>
//                   </div>
//                 </div>
//               </div>

//               {/* Payment Method Selection */}
//               <div className="mobsubplan-payment-method">
//                 <h4>Payment Method</h4>
//                 <div className="mobsubplan-payment-options">
//                   <div 
//                     className={`mobsubplan-payment-option ${paymentMethod === 'paystack' ? 'mobsubplan-selected' : ''}`}
//                     onClick={() => setPaymentMethod('paystack')}
//                   >
//                     <div className="mobsubplan-option-content">
//                       <FaCreditCard className="mobsubplan-option-icon mobsubplan-card" />
//                       <div className="mobsubplan-option-text">
//                         <span className="mobsubplan-option-title">Pay with Card</span>
//                         <span className="mobsubplan-option-description">Secure payment via Paystack</span>
//                       </div>
//                     </div>
//                     <div className="mobsubplan-option-check">
//                       {paymentMethod === 'paystack' && <FaCheck />}
//                     </div>
//                   </div>

//                   <div 
//                     className={`mobsubplan-payment-option ${paymentMethod === 'wallet' ? 'mobsubplan-selected' : ''}`}
//                     onClick={() => setPaymentMethod('wallet')}
//                   >
//                     <div className="mobsubplan-option-content">
//                       <FaWallet className="mobsubplan-option-icon mobsubplan-wallet" />
//                       <div className="mobsubplan-option-text">
//                         <span className="mobsubplan-option-title">Pay with Wallet</span>
//                         <span className="mobsubplan-option-description">Balance: {formatCurrency(walletBalance)}</span>
//                       </div>
//                     </div>
//                     <div className="mobsubplan-option-check">
//                       {paymentMethod === 'wallet' && <FaCheck />}
//                     </div>
//                   </div>
//                 </div>

//                 {paymentMethod === 'wallet' && walletBalance < selectedPlan.price && (
//                   <div className="mobsubplan-wallet-warning">
//                     <FaExclamationTriangle />
//                     <span>Insufficient wallet balance. Top up or select card payment.</span>
//                   </div>
//                 )}
//               </div>
//             </div>

//             <div className="mobsubplan-summary-footer">
//               <button 
//                 className="mobsubplan-summary-btn mobsubplan-cancel"
//                 onClick={() => setShowSummary(false)}
//                 disabled={isProcessing}
//               >
//                 Cancel
//               </button>
//               <button 
//                 className="mobsubplan-summary-btn mobsubplan-confirm"
//                 onClick={handleSubscribe}
//                 disabled={isProcessing || (paymentMethod === 'wallet' && walletBalance < selectedPlan.price)}
//                 style={{ backgroundColor: getPlanColor(selectedPlan.type) }}
//               >
//                 {isProcessing ? (
//                   <>
//                     <div className="mobsubplan-processing-spinner"></div>
//                     Processing...
//                   </>
//                 ) : paymentMethod === 'wallet' ? (
//                   `Pay ${formatCurrency(selectedPlan.price)}`
//                 ) : (
//                   'Proceed to Payment'
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {isProcessing && (
//         <div className="mobsubplan-processing-overlay">
//           <div className="mobsubplan-processing-spinner-large"></div>
//           <p>Processing your request...</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MobileSubscriptionPlans;











// components/mobile/MobileSubscriptionPlans.js
// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import './MobileSubscriptionPlans.css';
// import { 
//   FaWallet, 
//   FaCreditCard, 
//   FaFire, 
//   FaBolt, 
//   FaGasPump, 
//   FaCalendar, 
//   FaCheck, 
//   FaTimes, 
//   FaEye,
//   FaTag,
//   FaUserFriends,
//   FaExclamationTriangle,
//   FaArrowRight,
//   FaInfoCircle,
//   FaTruck,
//   FaShieldAlt
// } from 'react-icons/fa';
// import { successToast, errorToast, infoToast, warningToast } from "../../utils/toast";
// import axios from 'axios';

// const MobileSubscriptionPlans = () => {
//   const navigate = useNavigate();

//   // state - matching desktop component
//   const [plans, setPlans] = useState([]);
//   const [user, setUser] = useState(null);
//   const [token, setToken] = useState(null);
//   const [walletBalance, setWalletBalance] = useState(0);
//   const [selectedPlan, setSelectedPlan] = useState(null);
//   const [selectedFrequency, setSelectedFrequency] = useState({});
//   const [selectedSize, setSelectedSize] = useState({});
//   const [selectedPeriod, setSelectedPeriod] = useState({});
//   const [isLoading, setIsLoading] = useState(true);
//   const [plansLoading, setPlansLoading] = useState(true);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [error, setError] = useState('');
//   const [debugInfo, setDebugInfo] = useState(null);
//   const [showSummary, setShowSummary] = useState(false);
//   const [paymentMethod, setPaymentMethod] = useState('paystack');
//   const [planDetailsModal, setPlanDetailsModal] = useState(null);
//   const [activeBreakdown, setActiveBreakdown] = useState(null);

//   // Create axios instance with useRef to prevent recreation
//   const axiosInstanceRef = useRef(
//     axios.create({
//       baseURL: process.env.REACT_APP_API_URL || 'https://egas-server-1.onrender.com',
//       timeout: 30000,
//     })
//   );

//   // Add interceptors once on mount
//   useEffect(() => {
//     const axiosInstance = axiosInstanceRef.current;
    
//     const reqInterceptor = axiosInstance.interceptors.request.use(
//       (config) => {
//         if (token) {
//           config.headers.Authorization = `Bearer ${token}`;
//         }
//         return config;
//       },
//       (error) => Promise.reject(error)
//     );

//     const resInterceptor = axiosInstance.interceptors.response.use(
//       (response) => response,
//       (error) => Promise.reject(error)
//     );

//     return () => {
//       axiosInstance.interceptors.request.eject(reqInterceptor);
//       axiosInstance.interceptors.response.eject(resInterceptor);
//     };
//   }, [token]); // Only depend on token

//   // Load user/token from localStorage - run once
//   useEffect(() => {
//     let mounted = true;
    
//     const loadUserData = () => {
//       try {
//         const sUser = localStorage.getItem('user');
//         const sToken = localStorage.getItem('token');
//         if (mounted) {
//           if (sUser) setUser(JSON.parse(sUser));
//           if (sToken) setToken(sToken);
//         }
//       } catch (err) {
//         console.error('Error reading localStorage:', err);
//         if (mounted) setError('Failed to load session.');
//       } finally {
//         if (mounted) setIsLoading(false);
//       }
//     };

//     loadUserData();
    
//     return () => {
//       mounted = false;
//     };
//   }, []); // Empty dependency array - run once

//   // Fetch wallet balance - memoized with useCallback
//   const fetchWalletBalance = useCallback(async () => {
//     if (!token) return;

//     try {
//       const response = await axiosInstanceRef.current.get('/api/v1/dashboard/overview', {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (response.data.success) {
//         setWalletBalance(response.data.data?.walletBalance || 0);
//       }
//     } catch (error) {
//       console.warn('Could not fetch wallet balance from dashboard:', error);
//       try {
//         const fallbackResponse = await axiosInstanceRef.current.get('/api/v1/auth/me', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         if (fallbackResponse.data.success) {
//           setWalletBalance(fallbackResponse.data.data?.walletBalance || 0);
//         }
//       } catch (fallbackError) {
//         console.warn('Could not fetch wallet balance', fallbackError);
//       }
//     }
//   }, [token]); // Only depend on token

//   // Fetch plans - memoized with useCallback
//   const fetchSubscriptionPlans = useCallback(async () => {
//     try {
//       setPlansLoading(true);
//       setError('');
//       setDebugInfo(null);

//       const resp = await axiosInstanceRef.current.get('/api/v1/subscription-plans');
//       if (resp?.data?.success) {
//         const allPlans = resp.data.data || [];
        
//         // Sort plans: one-time first, then emergency, then custom, then preset plans sorted by displayOrder
//         const sortedPlans = allPlans.sort((a, b) => {
//           if (a.type === 'one-time' && b.type !== 'one-time') return -1;
//           if (a.type !== 'one-time' && b.type === 'one-time') return 1;
          
//           if (a.type === 'emergency' && b.type !== 'emergency') return -1;
//           if (a.type !== 'emergency' && b.type === 'emergency') return 1;
          
//           if (a.type === 'custom' && b.type !== 'custom') return -1;
//           if (a.type !== 'custom' && b.type === 'custom') return 1;
          
//           return a.displayOrder - b.displayOrder;
//         });
        
//         setPlans(sortedPlans);

//         // Initialize default selections
//         const freqs = {};
//         const periods = {};
//         const sizes = {};
//         sortedPlans.forEach((p) => {
//           if (p.type === 'preset') {
//             freqs[p._id] = p.deliveryFrequency?.[0] || 'Monthly';
//             periods[p._id] = p.subscriptionPeriod?.[0] || 1;
//             sizes[p._id] = p.baseSize;
//           } else if (p.type === 'one-time' || p.type === 'emergency') {
//             sizes[p._id] = p.cylinderSizes?.[0] || '6kg';
//           } else if (p.type === 'custom') {
//             sizes[p._id] = '6kg';
//             freqs[p._id] = 'Monthly';
//             periods[p._id] = 1;
//           }
//         });
//         setSelectedFrequency(freqs);
//         setSelectedPeriod(periods);
//         setSelectedSize(sizes);
        
//         successToast('Plans loaded successfully');
//       } else {
//         console.warn('Unexpected plans response:', resp?.data);
//         setError('Failed to load plans');
//         errorToast('Failed to load plans');
//       }
//     } catch (err) {
//       console.error('Fetch plans error:', err);
//       const errorMsg = err?.response?.data?.message ||
//         err?.message ||
//         'Unable to load subscription plans.';
//       setError(errorMsg);
//       setDebugInfo(err?.response?.data || null);
//       errorToast(errorMsg);
//     } finally {
//       setPlansLoading(false);
//     }
//   }, []); // Empty dependency array since we're using ref

//   // Main data fetching effect
//   useEffect(() => {
//     let mounted = true;
    
//     const fetchData = async () => {
//       if (token && mounted) {
//         await fetchSubscriptionPlans();
//         await fetchWalletBalance();
//       }
//     };

//     fetchData();
    
//     return () => {
//       mounted = false;
//     };
//   }, [token, fetchSubscriptionPlans, fetchWalletBalance]); // Include dependencies

//   // PRICE CALCULATION LOGIC - From desktop component (no external dependencies)
//   const calculatePrice = (plan, size, frequency, subscriptionPeriod = 1) => {
//     if (!plan) return 0;

//     // Extract numeric size value
//     const sizeKg = parseInt(String(size).replace('kg', ''), 10) || parseInt(size, 10);

//     // Calculate base price
//     let baseAmount = sizeKg * (plan.pricePerKg || 0);

//     // Determine deliveries per month based on frequency
//     let deliveriesPerMonth = 0;
    
//     switch (frequency) {
//       case 'Daily':
//         deliveriesPerMonth = 30;
//         break;
//       case 'Weekly':
//         deliveriesPerMonth = 4;
//         break;
//       case 'Bi-weekly':
//         deliveriesPerMonth = 2;
//         break;
//       case 'Monthly':
//         deliveriesPerMonth = 1;
//         break;
//       case 'One-Time':
//       case 'Emergency':
//         deliveriesPerMonth = 1;
//         break;
//       default:
//         deliveriesPerMonth = 1;
//     }

//     // Calculate total deliveries including initial extra delivery
//     let totalDeliveries = 0;
    
//     if (frequency === 'One-Time' || frequency === 'Emergency') {
//       totalDeliveries = 1;
//     } else {
//       if (subscriptionPeriod === 1) {
//         totalDeliveries = deliveriesPerMonth + 1;
//       } else {
//         totalDeliveries = (deliveriesPerMonth + 1) + (deliveriesPerMonth * (subscriptionPeriod - 1));
//       }
//     }

//     // Total price = base amount × total deliveries
//     const totalAmount = baseAmount * totalDeliveries;

//     return Math.round(totalAmount);
//   };

//   // Helper function for price breakdown (no external dependencies)
//   const getPriceBreakdown = (plan, size, frequency, subscriptionPeriod = 1) => {
//     if (!plan) return null;
    
//     const sizeKg = parseInt(String(size).replace('kg', ''), 10) || parseInt(size, 10);
//     const pricePerKg = plan.pricePerKg || 0;
//     const baseAmount = sizeKg * pricePerKg;
    
//     let deliveriesPerMonth = 0;
    
//     switch (frequency) {
//       case 'Daily':
//         deliveriesPerMonth = 30;
//         break;
//       case 'Weekly':
//         deliveriesPerMonth = 4;
//         break;
//       case 'Bi-weekly':
//         deliveriesPerMonth = 2;
//         break;
//       case 'Monthly':
//         deliveriesPerMonth = 1;
//         break;
//       case 'One-Time':
//       case 'Emergency':
//         deliveriesPerMonth = 1;
//         break;
//       default:
//         deliveriesPerMonth = 1;
//     }

//     let totalDeliveries = 0;
//     let breakdown = [];
//     let breakdownShort = '';
    
//     if (frequency === 'One-Time' || frequency === 'Emergency') {
//       totalDeliveries = 1;
//       breakdownShort = '1 delivery';
//       breakdown = ['1 delivery total'];
//     } else {
//       if (subscriptionPeriod === 1) {
//         totalDeliveries = deliveriesPerMonth + 1;
//         breakdownShort = `${deliveriesPerMonth + 1} deliveries`;
//         breakdown = [
//           `${deliveriesPerMonth + 1} total deliveries`,
//           `- Includes 1 initial delivery on day 1`,
//           `- ${deliveriesPerMonth} regular deliveries`
//         ];
//       } else {
//         totalDeliveries = (deliveriesPerMonth + 1) + (deliveriesPerMonth * (subscriptionPeriod - 1));
//         breakdownShort = `${totalDeliveries} deliveries`;
//         breakdown = [
//           `${totalDeliveries} total deliveries`,
//           `- Month 1: ${deliveriesPerMonth + 1} (${deliveriesPerMonth} regular + 1 initial)`,
//           `- Subsequent months: ${deliveriesPerMonth} per month`
//         ];
//       }
//     }

//     const totalPrice = baseAmount * totalDeliveries;

//     return {
//       totalPrice: Math.round(totalPrice),
//       breakdown,
//       breakdownShort,
//       pricePerKg,
//       baseAmount: Math.round(baseAmount),
//       totalDeliveries,
//       deliveriesPerMonth,
//       hasInitialDelivery: !(frequency === 'One-Time' || frequency === 'Emergency')
//     };
//   };

//   // Static helper functions (no dependencies)
//   const getPlanIcon = (planType) => {
//     switch (planType) {
//       case 'one-time':
//         return <FaTag className="mobsubplan-plan-icon mobsubplan-one-time" />;
//       case 'emergency':
//         return <FaBolt className="mobplan-plan-icon mobsubplan-emergency" />;
//       case 'custom':
//         return <FaGasPump className="mobsubplan-plan-icon mobsubplan-custom" />;
//       default:
//         return <FaFire className="mobsubplan-plan-icon mobsubplan-default" />;
//     }
//   };

//   const getPlanColor = (planType) => {
//     switch (planType) {
//       case 'one-time':
//         return '#f39c12';
//       case 'emergency':
//         return '#e74c3c';
//       case 'custom':
//         return '#2ecc71';
//       case 'business':
//         return '#9b59b6';
//       default:
//         return '#3498db';
//     }
//   };

//   const getFrequencyTag = (planType, frequency) => {
//     if (planType === 'one-time') return 'One-Time Purchase';
//     if (planType === 'emergency') return 'Emergency Delivery';
//     return frequency || 'Monthly';
//   };

//   const getSizeOptions = (plan) => {
//     switch (plan.type) {
//       case 'custom':
//         const min = plan.cylinderSizeRange?.min || 5;
//         const max = plan.cylinderSizeRange?.max || 100;
//         return Array.from({ length: max - min + 1 }, (_, i) => `${i + min}kg`);
//       case 'one-time':
//         return (plan.cylinderSizes || []).map((size) => `${size}kg`);
//       case 'emergency':
//         return plan.cylinderSizes || ['6kg', '12kg', '25kg', '50kg'];
//       default:
//         return [plan.baseSize];
//     }
//   };

//   const getFrequencyOptions = (plan) => {
//     switch (plan.type) {
//       case 'custom':
//         const minDays = plan.deliveryFrequencyRange?.min || 1;
//         const maxDays = plan.deliveryFrequencyRange?.max || 29;
//         return Array.from({ length: maxDays - minDays + 1 }, (_, i) => {
//           const days = i + minDays;
//           return days === 1 ? 'Daily' : `${days} days`;
//         });
//       case 'preset':
//         return plan.deliveryFrequency || ['Monthly'];
//       default:
//         return ['One-Time'];
//     }
//   };

//   // Event handlers
//   const handlePlanSelection = (plan) => {
//     const priceBreakdown = getPriceBreakdown(
//       plan,
//       selectedSize[plan._id] || plan.baseSize,
//       selectedFrequency[plan._id] || 'Monthly',
//       selectedPeriod[plan._id] || 1
//     );
    
//     setSelectedPlan({
//       ...plan,
//       selectedSize: selectedSize[plan._id] || plan.baseSize,
//       selectedFrequency: selectedFrequency[plan._id] || 'Monthly',
//       selectedPeriod: selectedPeriod[plan._id] || 1,
//       price: priceBreakdown?.totalPrice || 0,
//       priceBreakdown
//     });
//     setShowSummary(true);
//   };

//   const handleViewDetails = (plan) => {
//     setPlanDetailsModal(plan);
//   };

//   const initializePayment = async (planData) => {
//     if (!user || !token) {
//       warningToast('Please log in to subscribe');
//       navigate('/auth');
//       return;
//     }

//     if (!planData.price || planData.price <= 0) {
//       errorToast('Please select a valid plan configuration');
//       return;
//     }

//     setIsProcessing(true);
//     infoToast('Processing subscription...');

//     try {
//       const requestBody = {
//         plan: planData._id,
//         size: planData.selectedSize,
//         frequency: planData.selectedFrequency,
//         subscriptionPeriod: planData.selectedPeriod,
//         paymentMethod: paymentMethod,
//         ...(planData.type === 'custom' && { customPlan: planData }),
//       };

//       const response = await axiosInstanceRef.current.post(
//         '/api/v1/subscriptions',
//         requestBody,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//         }
//       );

//       const { success, authorization_url, reference, data, message, walletBalance } = response.data;

//       if (success) {
//         if (paymentMethod === 'paystack' && authorization_url) {
//           window.location.href = authorization_url;
//         } else if (paymentMethod === 'wallet') {
//           if (walletBalance !== undefined) {
//             setWalletBalance(walletBalance);
//           }
//           successToast('Subscription created successfully!');
//           setTimeout(() => navigate('/subscriptions'), 1500);
//         } else {
//           throw new Error('Invalid payment response');
//         }
//       } else {
//         throw new Error('Failed to initialize payment.');
//       }
//     } catch (error) {
//       console.error('Payment initialization error:', error);
//       if (error.response?.data?.message?.includes('Insufficient wallet balance')) {
//         errorToast(error.response.data.message);
//         setPaymentMethod('paystack');
//       } else {
//         const errorMsg = error.response?.data?.message || error.response?.data?.error || 'Failed to process payment. Please try again.';
//         errorToast(errorMsg);
//       }
//     } finally {
//       setIsProcessing(false);
//       setShowSummary(false);
//     }
//   };

//   const handleRetry = () => {
//     setError('');
//     setDebugInfo(null);
//     fetchSubscriptionPlans();
//     if (token) fetchWalletBalance();
//   };

//   const handleBreakdownTouch = (planId) => {
//   setActiveBreakdown(activeBreakdown === planId ? null : planId);
// };

// const handleOutsideClick = useCallback((e) => {
//   if (!e.target.closest('.mobsubplan-price-breakdown-mobile')) {
//     setActiveBreakdown(null);
//   }
// }, []);

// useEffect(() => {
//   document.addEventListener('click', handleOutsideClick);
//   return () => document.removeEventListener('click', handleOutsideClick);
// }, [handleOutsideClick]);

//   const formatCurrency = (amount) => {
//     return `₦${amount?.toLocaleString() || '0'}`;
//   };

//   const renderPlanCard = (plan) => {
//     const sizeOptions = getSizeOptions(plan);
//     const frequencyOptions = getFrequencyOptions(plan);
//     const currentSize = selectedSize[plan._id] || plan.baseSize;
//     const currentFrequency = selectedFrequency[plan._id] || frequencyOptions[0];
//     const currentPeriod = selectedPeriod[plan._id] || plan.subscriptionPeriod?.[0] || 1;
    
//     const priceBreakdown = getPriceBreakdown(plan, currentSize, currentFrequency, currentPeriod);
//     const price = priceBreakdown?.totalPrice || 0;

//     return (
//       <div 
//         key={plan._id} 
//         className="mobsubplan-plan-card"
//         style={{ borderLeftColor: getPlanColor(plan.type) }}
//       >
//         {/* Plan Header */}
//         <div className="mobsubplan-plan-card-header">
//           <div className="mobsubplan-plan-title-section">
//             {getPlanIcon(plan.type)}
//             <div className="mobsubplan-plan-title-content">
//               <h3>{plan.name}</h3>
//               <span className="mobsubplan-plan-type-badge" style={{ backgroundColor: getPlanColor(plan.type) }}>
//                 {plan.type === 'one-time' ? 'Single Purchase' : 
//                  plan.type === 'emergency' ? 'Urgent' : 
//                  plan.type === 'custom' ? 'Custom' : 'Regular'}
//               </span>
//             </div>
//           </div>
//           <button 
//             className="mobsubplan-view-details-btn"
//             onClick={() => handleViewDetails(plan)}
//           >
//             <FaEye size={14} />
//           </button>
//         </div>

//         {/* Frequency Tag */}
//         <div className="mobsubplan-plan-frequency-tag">
//           <FaCalendar size={12} />
//           <span>{getFrequencyTag(plan.type, currentFrequency)}</span>
//         </div>

//         {/* Price Display with breakdown tooltip for mobile */}
//         <div className="mobsubplan-plan-price-display">
//           <span className="mobsubplan-price-amount">{formatCurrency(price)}</span>
//           {plan.type !== 'one-time' && plan.type !== 'emergency' && priceBreakdown && (
//   <div 
//     className={`mobsubplan-price-breakdown-mobile ${activeBreakdown === plan._id ? 'active' : ''}`}
//     onClick={(e) => {
//       e.stopPropagation();
//       handleBreakdownTouch(plan._id);
//     }}
//   >
//     <FaInfoCircle className="mobsubplan-info-icon" size={14} />
//     <div className="mobsubplan-breakdown-popup">
//       <div className="mobsubplan-breakdown-header">
//         <strong>Price Breakdown:</strong>
//       </div>
//       <div className="mobsubplan-breakdown-content">
//         <div>Size: {currentSize} × ₦{priceBreakdown.pricePerKg?.toLocaleString()}/kg</div>
//         <div>Base: ₦{priceBreakdown.baseAmount?.toLocaleString()}</div>
//         <div>Deliveries: {priceBreakdown.breakdownShort}</div>
//         <div>Total: ₦{price.toLocaleString()}</div>
//       </div>
//     </div>
//   </div>
// )}
//         </div>

//         {/* Delivery Info (for non-one-time plans) */}
//         {plan.type !== 'one-time' && plan.type !== 'emergency' && priceBreakdown && (
//           <div className="mobsubplan-plan-delivery-info">
//             <div className="mobsubplan-delivery-count">
//               <FaTruck size={12} />
//               <span>{priceBreakdown.breakdownShort}</span>
//             </div>
//             {priceBreakdown.hasInitialDelivery && (
//               <div className="mobsubplan-initial-note">
//                 Includes 1 initial delivery on day 1
//               </div>
//             )}
//           </div>
//         )}

//         {/* Size Selection */}
//         <div className="mobsubplan-plan-option-section">
//           <label className="mobsubplan-option-label">
//             <FaGasPump size={14} />
//             Cylinder Size
//           </label>
//           {(plan.type === 'custom' || plan.type === 'one-time' || plan.type === 'emergency') ? (
//             <select 
//               className="mobsubplan-option-select"
//               value={currentSize}
//               onChange={(e) => setSelectedSize(prev => ({
//                 ...prev,
//                 [plan._id]: e.target.value
//               }))}
//             >
//               {sizeOptions.map(size => (
//                 <option key={size} value={size}>
//                   {size}
//                 </option>
//               ))}
//             </select>
//           ) : (
//             <div className="mobsubplan-option-info">
//               <span>{plan.baseSize}</span>
//             </div>
//           )}
//         </div>

//         {/* Frequency Selection for custom and preset plans */}
//         {(plan.type === 'custom' || plan.type === 'preset') && (
//           <div className="mobsubplan-plan-option-section">
//             <label className="mobsubplan-option-label">
//               <FaCalendar size={14} />
//               Delivery Frequency
//             </label>
//             <select 
//               className="mobsubplan-option-select"
//               value={currentFrequency}
//               onChange={(e) => setSelectedFrequency(prev => ({
//                 ...prev,
//                 [plan._id]: e.target.value
//               }))}
//             >
//               {frequencyOptions.map(freq => (
//                 <option key={freq} value={freq}>
//                   {freq}
//                 </option>
//               ))}
//             </select>
//           </div>
//         )}

//         {/* Period Selection for non-one-time plans */}
//         {plan.type !== 'one-time' && plan.subscriptionPeriod?.length > 0 && (
//           <div className="mobsubplan-plan-option-section">
//             <label className="mobsubplan-option-label">
//               <FaCalendar size={14} />
//               Subscription Period
//             </label>
//             <select 
//               className="mobsubplan-option-select"
//               value={currentPeriod}
//               onChange={(e) => setSelectedPeriod(prev => ({
//                 ...prev,
//                 [plan._id]: parseInt(e.target.value)
//               }))}
//             >
//               {plan.subscriptionPeriod?.map(period => (
//                 <option key={period} value={period}>
//                   {period} month{period > 1 ? 's' : ''}
//                 </option>
//               ))}
//             </select>
//           </div>
//         )}

//         {/* Action Button */}
//         <button 
//           className="mobsubplan-select-plan-btn"
//           onClick={() => handlePlanSelection(plan)}
//           style={{ backgroundColor: getPlanColor(plan.type) }}
//           disabled={isProcessing}
//         >
//           {isProcessing ? 'Processing...' : 
//            plan.type === 'one-time' ? 'Buy Now' :
//            plan.type === 'emergency' ? 'Request Delivery' :
//            'Subscribe Now'}
//           <FaArrowRight className="mobsubplan-btn-icon" />
//         </button>
//       </div>
//     );
//   };

//   const renderPlanDetailsModal = () => {
//     if (!planDetailsModal) return null;

//     return (
//       <div className="mobsubplan-plan-details-modal">
//         <div className="mobsubplan-modal-content">
//           <div className="mobsubplan-modal-header">
//             <div className="mobsubplan-modal-title-section">
//               {getPlanIcon(planDetailsModal.type)}
//               <div>
//                 <h2>{planDetailsModal.name}</h2>
//                 <span 
//                   className="mobsubplan-modal-plan-type"
//                   style={{ backgroundColor: getPlanColor(planDetailsModal.type) }}
//                 >
//                   {planDetailsModal.type === 'one-time' ? 'One-Time Purchase' : 
//                    planDetailsModal.type === 'emergency' ? 'Emergency Delivery' : 
//                    planDetailsModal.type === 'custom' ? 'Custom Plan' : 'Subscription Plan'}
//                 </span>
//               </div>
//             </div>
//             <button 
//               className="mobsubplan-close-modal"
//               onClick={() => setPlanDetailsModal(null)}
//             >
//               <FaTimes />
//             </button>
//           </div>

//           <div className="mobsubplan-modal-body">
//             <div className="mobsubplan-modal-section">
//               <h3>Plan Description</h3>
//               <p className="mobsubplan-plan-description">{planDetailsModal.description}</p>
//             </div>

//             {planDetailsModal.features?.length > 0 && (
//               <div className="mobsubplan-modal-section">
//                 <h3>Features</h3>
//                 <div className="mobsubplan-features-list">
//                   {planDetailsModal.features.map((feature, index) => (
//                     <div key={index} className={`mobsubplan-feature-item ${feature.included ? 'mobsubplan-included' : 'mobsubplan-excluded'}`}>
//                       {feature.included ? 
//                         <FaCheck className="mobsubplan-feature-icon" /> : 
//                         <FaTimes className="mobsubplan-feature-icon" />
//                       }
//                       <div className="mobsubplan-feature-content">
//                         <strong>{feature.title}:</strong> {feature.description}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             <div className="mobsubplan-modal-section">
//               <h3>Specifications</h3>
//               <div className="mobsubplan-specifications-grid">
//                 <div className="mobsubplan-spec-item">
//                   <span className="mobsubplan-spec-label">Base Size:</span>
//                   <span className="mobsubplan-spec-value">{planDetailsModal.baseSize}</span>
//                 </div>
//                 <div className="mobsubplan-spec-item">
//                   <span className="mobsubplan-spec-label">Price per Kg:</span>
//                   <span className="mobsubplan-spec-value">{formatCurrency(planDetailsModal.pricePerKg)}</span>
//                 </div>
//                 {planDetailsModal.deliveryFrequency && (
//                   <div className="mobsubplan-spec-item">
//                     <span className="mobsubplan-spec-label">Delivery Frequency:</span>
//                     <span className="mobsubplan-spec-value">{planDetailsModal.deliveryFrequency.join(', ')}</span>
//                   </div>
//                 )}
//                 {planDetailsModal.subscriptionPeriod && (
//                   <div className="mobsubplan-spec-item">
//                     <span className="mobsubplan-spec-label">Subscription Period:</span>
//                     <span className="mobsubplan-spec-value">
//                       {planDetailsModal.subscriptionPeriod.map(p => `${p} month${p > 1 ? 's' : ''}`).join(', ')}
//                     </span>
//                   </div>
//                 )}
//                 {planDetailsModal.cylinderSizes && (
//                   <div className="mobsubplan-spec-item">
//                     <span className="mobsubplan-spec-label">Available Sizes:</span>
//                     <span className="mobsubplan-spec-value">{planDetailsModal.cylinderSizes.join(', ')}</span>
//                   </div>
//                 )}
//                 {planDetailsModal.deliveryInfo && (
//                   <>
//                     <div className="mobsubplan-spec-item">
//                       <span className="mobsubplan-spec-label">Delivery Time:</span>
//                       <span className="mobsubplan-spec-value">{planDetailsModal.deliveryInfo.deliveryTime}</span>
//                     </div>
//                     <div className="mobsubplan-spec-item">
//                       <span className="mobsubplan-spec-label">Free Delivery:</span>
//                       <span className="mobsubplan-spec-value">
//                         {planDetailsModal.deliveryInfo.freeDelivery ? 'Yes' : 'No'}
//                       </span>
//                     </div>
//                   </>
//                 )}
//               </div>
//             </div>
//           </div>

//           <div className="mobsubplan-modal-footer">
//             <button 
//               className="mobsubplan-btn-secondary"
//               onClick={() => setPlanDetailsModal(null)}
//             >
//               Close
//             </button>
//             <button 
//               className="mobsubplan-btn-primary"
//               style={{ backgroundColor: getPlanColor(planDetailsModal.type) }}
//               onClick={() => {
//                 setPlanDetailsModal(null);
//                 const currentSize = selectedSize[planDetailsModal._id] || planDetailsModal.baseSize;
//                 const currentFrequency = selectedFrequency[planDetailsModal._id] || 'Monthly';
//                 const currentPeriod = selectedPeriod[planDetailsModal._id] || 1;
//                 const priceBreakdown = getPriceBreakdown(planDetailsModal, currentSize, currentFrequency, currentPeriod);
                
//                 setSelectedPlan({
//                   ...planDetailsModal,
//                   selectedSize: currentSize,
//                   selectedFrequency: currentFrequency,
//                   selectedPeriod: currentPeriod,
//                   price: priceBreakdown?.totalPrice || 0,
//                   priceBreakdown
//                 });
//                 setShowSummary(true);
//               }}
//             >
//               Select This Plan
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   if (isLoading || plansLoading) {
//     return (
//       <div className="mobsubplan-mobile-subscription-plans mobsubplan-loading">
//         <div className="mobsubplan-loading-spinner"></div>
//         <p>Loading plans...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="mobsubplan-mobile-subscription-plans mobsubplan-error">
//         <div className="mobsubplan-error-content">
//           <FaExclamationTriangle className="mobsubplan-error-icon" />
//           <h2>Unable to Load Plans</h2>
//           <p>{error}</p>
//           <button className="mobsubplan-retry-btn" onClick={handleRetry}>
//             Try Again
//           </button>
//           {debugInfo && (
//             <pre className="mobsubplan-debug-info">
//               {JSON.stringify(debugInfo, null, 2)}
//             </pre>
//           )}
//         </div>
//       </div>
//     );
//   }

//   if (!user || !token) {
//     return (
//       <div className="mobsubplan-mobile-subscription-plans">
//         <div className="mobsubplan-login-prompt">
//           <h1>Choose a Subscription Plan</h1>
//           <p>Please log in to view and subscribe to our plans</p>
//           <button 
//             className="mobsubplan-login-btn"
//             onClick={() => navigate('/auth')}
//           >
//             Log In
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="mobsubplan-mobile-subscription-plans">
//       {/* Header */}
//       <div className="mobsubplan-plans-header">
//         <h1>Choose Your Gas Plan</h1>
//         <div className="mobsubplan-wallet-display">
//           <FaWallet className="mobsubplan-wallet-icon" />
//           <span>{formatCurrency(walletBalance)}</span>
//         </div>
//       </div>

//       {/* One-Time Purchase Section */}
//       <div className="mobsubplan-plan-category-section">
//         <div className="mobsubplan-category-header">
//           <FaTag className="mobsubplan-category-icon" />
//           <div>
//             <h2>One-Time Purchase</h2>
//             <p className="mobsubplan-category-description">
//               Perfect for occasional users. 
//               Purchase LPG gas as needed without any subscription.
//             </p>
//           </div>
//         </div>
//         <div className="mobsubplan-plans-list">
//           {plans.filter(p => p.type === 'one-time').map(plan => renderPlanCard(plan))}
//         </div>
//       </div>

//       {/* Emergency Delivery Section */}
//       <div className="mobsubplan-plan-category-section">
//         <div className="mobsubplan-category-header">
//           <FaBolt className="mobsubplan-category-icon" />
//           <div>
//             <h2>Emergency Delivery</h2>
//             <p className="mobsubplan-category-description">
//               Need gas urgently? Get immediate refill delivery within hours. 
//               Perfect for unexpected situations when you run out of gas.
//             </p>
//           </div>
//         </div>
//         <div className="mobsubplan-plans-list">
//           {plans.filter(p => p.type === 'emergency').map(plan => renderPlanCard(plan))}
//         </div>
//       </div>

//       {/* Preset Plans Section */}
//       <div className="mobsubplan-plan-category-section">
//         <div className="mobsubplan-category-header">
//           <FaFire className="mobsubplan-category-icon" />
//           <div>
//             <h2>Regular Subscription Plans</h2>
//             <p className="mobsubplan-category-description">
//               Choose from our flexible subscription plans for regular gas refill delivery. 
//               Save money and time with automatic deliveries based on your usage pattern.
//             </p>
//           </div>
//         </div>
//         <div className="mobsubplan-plans-list">
//           {plans.filter(p => p.type === 'preset').map(plan => renderPlanCard(plan))}
//         </div>
//       </div>

//       {/* Custom Plans Section */}
//       <div className="mobsubplan-plan-category-section">
//         <div className="mobsubplan-category-header">
//           <FaGasPump className="mobsubplan-category-icon" />
//           <div>
//             <h2>Build Your Own Plan</h2>
//             <p className="mobsubplan-category-description">
//               Customize every aspect of your gas delivery. 
//               Choose your cylinder size, delivery frequency, and subscription period.
//             </p>
//           </div>
//         </div>
//         <div className="mobsubplan-plans-list">
//           {plans.filter(p => p.type === 'custom').map(plan => renderPlanCard(plan))}
//         </div>
//       </div>

//       {/* Plan Details Modal */}
//       {renderPlanDetailsModal()}

//       {/* Payment Summary Modal */}
//       {showSummary && selectedPlan && (
//         <div className="mobsubplan-plan-summary-modal">
//           <div className="mobsubplan-summary-content">
//             <div className="mobsubplan-summary-header">
//               <h2>Confirm Your Plan</h2>
//               <button 
//                 className="mobsubplan-close-summary"
//                 onClick={() => setShowSummary(false)}
//                 disabled={isProcessing}
//               >
//                 <FaTimes />
//               </button>
//             </div>

//             <div className="mobsubplan-summary-body">
//               <div className="mobsubplan-plan-summary">
//                 <div className="mobsubplan-plan-summary-header">
//                   {getPlanIcon(selectedPlan.type)}
//                   <div>
//                     <h3>{selectedPlan.name}</h3>
//                     <span className="mobsubplan-plan-type">{selectedPlan.type}</span>
//                   </div>
//                 </div>

//                 <div className="mobsubplan-summary-details">
//                   <div className="mobsubplan-detail-item">
//                     <span className="mobsubplan-detail-label">Cylinder Size:</span>
//                     <span className="mobsubplan-detail-value">{selectedPlan.selectedSize}</span>
//                   </div>
//                   <div className="mobsubplan-detail-item">
//                     <span className="mobsubplan-detail-label">Delivery Frequency:</span>
//                     <span className="mobsubplan-detail-value">{selectedPlan.selectedFrequency}</span>
//                   </div>
//                   {selectedPlan.selectedPeriod > 1 && (
//                     <div className="mobsubplan-detail-item">
//                       <span className="mobsubplan-detail-label">Subscription Period:</span>
//                       <span className="mobsubplan-detail-value">
//                         {selectedPlan.selectedPeriod} month{selectedPlan.selectedPeriod > 1 ? 's' : ''}
//                       </span>
//                     </div>
//                   )}
                  
//                   {/* Price Calculation Breakdown - From desktop component */}
//                   {selectedPlan.priceBreakdown && (
//                     <div className="mobsubplan-detail-item mobsubplan-price-breakdown">
//                       <span className="mobsubplan-detail-label">Calculation:</span>
//                       <div className="mobsubplan-breakdown-details">
//                         <div style={{ fontSize: '0.85rem', color: '#7f8c8d' }}>
//                           {selectedPlan.selectedSize} × ₦{selectedPlan.priceBreakdown.pricePerKg?.toLocaleString()}/kg × {selectedPlan.priceBreakdown.totalDeliveries} deliveries
//                         </div>
//                         {selectedPlan.priceBreakdown.breakdown.map((item, index) => (
//                           <div key={index} style={{ 
//                             fontSize: '0.85rem', 
//                             color: '#7f8c8d',
//                             marginTop: '2px'
//                           }}>
//                             {item}
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )}
                  
//                   <div className="mobsubplan-detail-item mobsubplan-total">
//                     <span className="mobsubplan-detail-label">Total Price:</span>
//                     <span className="mobsubplan-detail-value mobsubplan-price">{formatCurrency(selectedPlan.price)}</span>
//                   </div>
//                 </div>
//               </div>

//               {/* Payment Method Selection */}
//               <div className="mobsubplan-payment-method">
//                 <h4>Payment Method</h4>
//                 <div className="mobsubplan-payment-options">
//                   <div 
//                     className={`mobsubplan-payment-option ${paymentMethod === 'paystack' ? 'mobsubplan-selected' : ''}`}
//                     onClick={() => setPaymentMethod('paystack')}
//                   >
//                     <div className="mobsubplan-option-content">
//                       <FaCreditCard className="mobsubplan-option-icon mobsubplan-card" />
//                       <div className="mobsubplan-option-text">
//                         <span className="mobsubplan-option-title">Pay with Card</span>
//                         <span className="mobsubplan-option-description">Secure payment via Paystack</span>
//                       </div>
//                     </div>
//                     <div className="mobsubplan-option-check">
//                       {paymentMethod === 'paystack' && <FaCheck />}
//                     </div>
//                   </div>

//                   <div 
//                     className={`mobsubplan-payment-option ${paymentMethod === 'wallet' ? 'mobsubplan-selected' : ''}`}
//                     onClick={() => setPaymentMethod('wallet')}
//                   >
//                     <div className="mobsubplan-option-content">
//                       <FaWallet className="mobsubplan-option-icon mobsubplan-wallet" />
//                       <div className="mobsubplan-option-text">
//                         <span className="mobsubplan-option-title">Pay with Wallet</span>
//                         <span className="mobsubplan-option-description">Balance: {formatCurrency(walletBalance)}</span>
//                       </div>
//                     </div>
//                     <div className="mobsubplan-option-check">
//                       {paymentMethod === 'wallet' && <FaCheck />}
//                     </div>
//                   </div>
//                 </div>

//                 {paymentMethod === 'wallet' && (
//                   <div className={`mobsubplan-wallet-notice ${walletBalance < selectedPlan.price ? 'mobsubplan-wallet-warning' : 'mobsubplan-wallet-info'}`}>
//                     {walletBalance < selectedPlan.price ? (
//                       <>
//                         <FaExclamationTriangle />
//                         <span>Insufficient wallet balance. Top up or select card payment.</span>
//                       </>
//                     ) : (
//                       <>
//                         <FaCheck />
//                         <span>Wallet payment will be validated securely by our system</span>
//                       </>
//                     )}
//                   </div>
//                 )}
//               </div>
//             </div>

//             <div className="mobsubplan-summary-footer">
//               <button 
//                 className="mobsubplan-summary-btn mobsubplan-cancel"
//                 onClick={() => setShowSummary(false)}
//                 disabled={isProcessing}
//               >
//                 Cancel
//               </button>
//               <button 
//                 className="mobsubplan-summary-btn mobsubplan-confirm"
//                 onClick={() => initializePayment(selectedPlan)}
//                 disabled={isProcessing || (paymentMethod === 'wallet' && walletBalance < selectedPlan.price)}
//                 style={{ backgroundColor: getPlanColor(selectedPlan.type) }}
//               >
//                 {isProcessing ? (
//                   <>
//                     <div className="mobsubplan-processing-spinner"></div>
//                     Processing...
//                   </>
//                 ) : paymentMethod === 'wallet' ? (
//                   `Pay ${formatCurrency(selectedPlan.price)}`
//                 ) : (
//                   'Proceed to Payment'
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {isProcessing && (
//         <div className="mobsubplan-processing-overlay">
//           <div className="mobsubplan-processing-spinner-large"></div>
//           <p>Processing your request...</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MobileSubscriptionPlans;





// components/mobile/MobileSubscriptionPlans.js
import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  FaArrowRight,
  FaInfoCircle,
  FaTruck,
  FaCalculator,
  FaExclamationTriangle,
  FaChevronDown,
  FaChevronUp
} from 'react-icons/fa';
import { successToast, errorToast, infoToast, warningToast } from "../../utils/toast";
import axios from 'axios';

const MobileSubscriptionPlans = () => {
  const navigate = useNavigate();

  // State
  const [plans, setPlans] = useState([]);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedFrequency, setSelectedFrequency] = useState({});
  const [selectedSize, setSelectedSize] = useState({});
  const [selectedPeriod, setSelectedPeriod] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [plansLoading, setPlansLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [debugInfo, setDebugInfo] = useState(null);
  const [showSummary, setShowSummary] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('paystack');
  const [planDetailsModal, setPlanDetailsModal] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    priceBreakdown: true,
    deliverySchedule: true,
    features: true
  });

  // Refs
  const axiosInstanceRef = useRef(
    axios.create({
      baseURL: process.env.REACT_APP_API_URL || 'https://egas-server-1.onrender.com',
      timeout: 30000,
    })
  );

  // Effects
  useEffect(() => {
    const axiosInstance = axiosInstanceRef.current;
    
    const reqInterceptor = axiosInstance.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const resInterceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => Promise.reject(error)
    );

    return () => {
      axiosInstance.interceptors.request.eject(reqInterceptor);
      axiosInstance.interceptors.response.eject(resInterceptor);
    };
  }, [token]);

  useEffect(() => {
    let mounted = true;
    
    const loadUserData = () => {
      try {
        const sUser = localStorage.getItem('user');
        const sToken = localStorage.getItem('token');
        if (mounted) {
          if (sUser) setUser(JSON.parse(sUser));
          if (sToken) setToken(sToken);
        }
      } catch (err) {
        console.error('Error reading localStorage:', err);
        if (mounted) setError('Failed to load session.');
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    loadUserData();
    
    return () => {
      mounted = false;
    };
  }, []);

  const fetchWalletBalance = useCallback(async () => {
    if (!token) return;

    try {
      const response = await axiosInstanceRef.current.get('/api/v1/dashboard/overview', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setWalletBalance(response.data.data?.walletBalance || 0);
      }
    } catch (error) {
      console.warn('Could not fetch wallet balance:', error);
    }
  }, [token]);

  const fetchSubscriptionPlans = useCallback(async () => {
    try {
      setPlansLoading(true);
      setError('');
      setDebugInfo(null);

      const resp = await axiosInstanceRef.current.get('/api/v1/subscription-plans');
      if (resp?.data?.success) {
        const allPlans = resp.data.data || [];
        
        const sortedPlans = allPlans.sort((a, b) => {
          if (a.type === 'one-time' && b.type !== 'one-time') return -1;
          if (a.type !== 'one-time' && b.type === 'one-time') return 1;
          
          if (a.type === 'emergency' && b.type !== 'emergency') return -1;
          if (a.type !== 'emergency' && b.type === 'emergency') return 1;
          
          if (a.type === 'custom' && b.type !== 'custom') return -1;
          if (a.type !== 'custom' && b.type === 'custom') return 1;
          
          return a.displayOrder - b.displayOrder;
        });
        
        setPlans(sortedPlans);

        const freqs = {};
        const periods = {};
        const sizes = {};
        sortedPlans.forEach((p) => {
          if (p.type === 'preset') {
            freqs[p._id] = p.deliveryFrequency?.[0] || 'Monthly';
            periods[p._id] = p.subscriptionPeriod?.[0] || 1;
            sizes[p._id] = p.baseSize;
          } else if (p.type === 'one-time' || p.type === 'emergency') {
            sizes[p._id] = p.cylinderSizes?.[0] || '6kg';
          } else if (p.type === 'custom') {
            sizes[p._id] = '6kg';
            freqs[p._id] = 'Monthly';
            periods[p._id] = 1;
          }
        });
        setSelectedFrequency(freqs);
        setSelectedPeriod(periods);
        setSelectedSize(sizes);
        
        successToast('Plans loaded successfully');
      } else {
        setError('Failed to load plans');
        errorToast('Failed to load plans');
      }
    } catch (err) {
      console.error('Fetch plans error:', err);
      const errorMsg = err?.response?.data?.message ||
        err?.message ||
        'Unable to load subscription plans.';
      setError(errorMsg);
      setDebugInfo(err?.response?.data || null);
      errorToast(errorMsg);
    } finally {
      setPlansLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    
    const fetchData = async () => {
      if (token && mounted) {
        await fetchSubscriptionPlans();
        await fetchWalletBalance();
      }
    };

    fetchData();
    
    return () => {
      mounted = false;
    };
  }, [token, fetchSubscriptionPlans, fetchWalletBalance]);

  // Price calculation functions
  const calculatePrice = (plan, size, frequency, subscriptionPeriod = 1) => {
    if (!plan) return 0;

    const sizeKg = parseInt(String(size).replace('kg', ''), 10) || parseInt(size, 10);
    let baseAmount = sizeKg * (plan.pricePerKg || 0);

    let deliveriesPerMonth = 0;
    
    switch (frequency) {
      case 'Daily':
        deliveriesPerMonth = 30;
        break;
      case 'Weekly':
        deliveriesPerMonth = 4;
        break;
      case 'Bi-weekly':
        deliveriesPerMonth = 2;
        break;
      case 'Monthly':
        deliveriesPerMonth = 1;
        break;
      case 'One-Time':
      case 'Emergency':
        deliveriesPerMonth = 1;
        break;
      default:
        deliveriesPerMonth = 1;
    }

    let totalDeliveries = 0;
    
    if (frequency === 'One-Time' || frequency === 'Emergency') {
      totalDeliveries = 1;
    } else {
      if (subscriptionPeriod === 1) {
        totalDeliveries = deliveriesPerMonth + 1;
      } else {
        totalDeliveries = (deliveriesPerMonth + 1) + (deliveriesPerMonth * (subscriptionPeriod - 1));
      }
    }

    const totalAmount = baseAmount * totalDeliveries;
    return Math.round(totalAmount);
  };

  const getPriceBreakdown = (plan, size, frequency, subscriptionPeriod = 1) => {
    if (!plan) return null;
    
    const sizeKg = parseInt(String(size).replace('kg', ''), 10) || parseInt(size, 10);
    const pricePerKg = plan.pricePerKg || 0;
    const baseAmount = sizeKg * pricePerKg;
    
    let deliveriesPerMonth = 0;
    
    switch (frequency) {
      case 'Daily':
        deliveriesPerMonth = 30;
        break;
      case 'Weekly':
        deliveriesPerMonth = 4;
        break;
      case 'Bi-weekly':
        deliveriesPerMonth = 2;
        break;
      case 'Monthly':
        deliveriesPerMonth = 1;
        break;
      case 'One-Time':
      case 'Emergency':
        deliveriesPerMonth = 1;
        break;
      default:
        deliveriesPerMonth = 1;
    }

    let totalDeliveries = 0;
    let breakdown = [];
    let deliverySchedule = [];
    
    if (frequency === 'One-Time' || frequency === 'Emergency') {
      totalDeliveries = 1;
      deliverySchedule = ['1 delivery total'];
    } else {
      if (subscriptionPeriod === 1) {
        totalDeliveries = deliveriesPerMonth + 1;
        deliverySchedule = [
          'Month 1: 1 initial delivery + ' + deliveriesPerMonth + ' regular deliveries',
          'Total: ' + (deliveriesPerMonth + 1) + ' deliveries'
        ];
      } else {
        totalDeliveries = (deliveriesPerMonth + 1) + (deliveriesPerMonth * (subscriptionPeriod - 1));
        deliverySchedule = [
          'Month 1: 1 initial delivery + ' + deliveriesPerMonth + ' regular deliveries',
          'Months 2-' + subscriptionPeriod + ': ' + deliveriesPerMonth + ' deliveries per month',
          'Total: ' + totalDeliveries + ' deliveries'
        ];
      }
    }

    const totalPrice = baseAmount * totalDeliveries;

    return {
      totalPrice: Math.round(totalPrice),
      breakdown: [
        { label: 'Cylinder Size', value: size, calculation: `${sizeKg}kg` },
        { label: 'Price per Kg', value: `₦${pricePerKg.toLocaleString()}` },
        { label: 'Base Price per Delivery', value: `₦${Math.round(baseAmount).toLocaleString()}`, calculation: `${sizeKg}kg × ₦${pricePerKg.toLocaleString()}` },
        { label: 'Delivery Frequency', value: frequency },
        { label: 'Total Deliveries', value: totalDeliveries.toString() },
        { label: 'Subscription Period', value: `${subscriptionPeriod} month${subscriptionPeriod > 1 ? 's' : ''}` },
        { label: 'Total Price', value: `₦${Math.round(totalPrice).toLocaleString()}`, calculation: `₦${Math.round(baseAmount).toLocaleString()} × ${totalDeliveries} deliveries` }
      ],
      deliverySchedule,
      pricePerKg,
      baseAmount: Math.round(baseAmount),
      totalDeliveries,
      deliveriesPerMonth,
      hasInitialDelivery: !(frequency === 'One-Time' || frequency === 'Emergency')
    };
  };

  // Helper functions
  const getPlanIcon = (planType) => {
    switch (planType) {
      case 'one-time':
        return <FaTag className="mobsubplan-plan-icon mobsubplan-one-time" />;
      case 'emergency':
        return <FaBolt className="mobsubplan-plan-icon mobsubplan-emergency" />;
      case 'custom':
        return <FaGasPump className="mobsubplan-plan-icon mobsubplan-custom" />;
      default:
        return <FaFire className="mobsubplan-plan-icon mobsubplan-default" />;
    }
  };

  const getPlanColor = (planType) => {
    switch (planType) {
      case 'one-time':
        return '#f39c12';
      case 'emergency':
        return '#e74c3c';
      case 'custom':
        return '#2ecc71';
      default:
        return '#3498db';
    }
  };

  const getFrequencyTag = (planType, frequency) => {
    if (planType === 'one-time') return 'One-Time Purchase';
    if (planType === 'emergency') return 'Emergency Delivery';
    return frequency || 'Monthly';
  };

  const getSizeOptions = (plan) => {
    switch (plan.type) {
      case 'custom':
        const min = plan.cylinderSizeRange?.min || 5;
        const max = plan.cylinderSizeRange?.max || 100;
        return Array.from({ length: max - min + 1 }, (_, i) => `${i + min}kg`);
      case 'one-time':
        return (plan.cylinderSizes || []).map((size) => `${size}kg`);
      case 'emergency':
        return plan.cylinderSizes || ['6kg', '12kg', '25kg', '50kg'];
      default:
        return [plan.baseSize];
    }
  };

  const getFrequencyOptions = (plan) => {
    switch (plan.type) {
      case 'custom':
        const minDays = plan.deliveryFrequencyRange?.min || 1;
        const maxDays = plan.deliveryFrequencyRange?.max || 29;
        return Array.from({ length: maxDays - minDays + 1 }, (_, i) => {
          const days = i + minDays;
          return days === 1 ? 'Daily' : `${days} days`;
        });
      case 'preset':
        return plan.deliveryFrequency || ['Monthly'];
      default:
        return ['One-Time'];
    }
  };

  const formatCurrency = (amount) => {
    return `₦${amount?.toLocaleString() || '0'}`;
  };

  // Event handlers
  const handlePlanSelection = (plan) => {
    const priceBreakdown = getPriceBreakdown(
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
      price: priceBreakdown?.totalPrice || 0,
      priceBreakdown
    });
    setShowSummary(true);
  };

  const handleViewDetails = (plan) => {
    setPlanDetailsModal(plan);
    setExpandedSections({
      priceBreakdown: true,
      deliverySchedule: true,
      features: true
    });
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const initializePayment = async (planData) => {
    if (!user || !token) {
      warningToast('Please log in to subscribe');
      navigate('/auth');
      return;
    }

    if (!planData.price || planData.price <= 0) {
      errorToast('Please select a valid plan configuration');
      return;
    }

    setIsProcessing(true);
    infoToast('Processing subscription...');

    try {
      const requestBody = {
        plan: planData._id,
        size: planData.selectedSize,
        frequency: planData.selectedFrequency,
        subscriptionPeriod: planData.selectedPeriod,
        paymentMethod: paymentMethod,
        ...(planData.type === 'custom' && { customPlan: planData }),
      };

      const response = await axiosInstanceRef.current.post(
        '/api/v1/subscriptions',
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const { success, authorization_url, walletBalance } = response.data;

      if (success) {
        if (paymentMethod === 'paystack' && authorization_url) {
          window.location.href = authorization_url;
        } else if (paymentMethod === 'wallet') {
          if (walletBalance !== undefined) {
            setWalletBalance(walletBalance);
          }
          successToast('Subscription created successfully!');
          setTimeout(() => navigate('/subscriptions'), 1500);
        } else {
          throw new Error('Invalid payment response');
        }
      } else {
        throw new Error('Failed to initialize payment.');
      }
    } catch (error) {
      console.error('Payment initialization error:', error);
      if (error.response?.data?.message?.includes('Insufficient wallet balance')) {
        errorToast(error.response.data.message);
        setPaymentMethod('paystack');
      } else {
        const errorMsg = error.response?.data?.message || error.response?.data?.error || 'Failed to process payment. Please try again.';
        errorToast(errorMsg);
      }
    } finally {
      setIsProcessing(false);
      setShowSummary(false);
    }
  };

  const handleRetry = () => {
    setError('');
    setDebugInfo(null);
    fetchSubscriptionPlans();
    if (token) fetchWalletBalance();
  };

  // Render functions
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
            <span className="mobsubplan-price-period">total</span>
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
              {getSizeOptions(plan).map(size => (
                <option key={size} value={size}>
                  {size}
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
              {getFrequencyOptions(plan).map(freq => (
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

    const currentSize = selectedSize[planDetailsModal._id] || planDetailsModal.baseSize;
    const currentFrequency = selectedFrequency[planDetailsModal._id] || 'Monthly';
    const currentPeriod = selectedPeriod[planDetailsModal._id] || 1;
    const priceBreakdown = getPriceBreakdown(planDetailsModal, currentSize, currentFrequency, currentPeriod);
    const price = priceBreakdown?.totalPrice || 0;

    return (
      <div className="mobsubplan-plan-details-modal">
        <div className="mobsubplan-modal-content">
          {/* Modal Header */}
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

          {/* Modal Body */}
          <div className="mobsubplan-modal-body">
            {/* Plan Summary */}
            <div className="mobsubplan-modal-summary-card">
              <div className="mobsubplan-summary-price">
                <span className="mobsubplan-summary-price-amount">{formatCurrency(price)}</span>
                <span className="mobsubplan-summary-price-label">Total Price</span>
              </div>
              <div className="mobsubplan-summary-details">
                <div className="mobsubplan-summary-item">
                  <span className="mobsubplan-summary-label">Size:</span>
                  <span className="mobsubplan-summary-value">{currentSize}</span>
                </div>
                <div className="mobsubplan-summary-item">
                  <span className="mobsubplan-summary-label">Frequency:</span>
                  <span className="mobsubplan-summary-value">{currentFrequency}</span>
                </div>
                {currentPeriod > 1 && (
                  <div className="mobsubplan-summary-item">
                    <span className="mobsubplan-summary-label">Period:</span>
                    <span className="mobsubplan-summary-value">
                      {currentPeriod} month{currentPeriod > 1 ? 's' : ''}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Description Section */}
            <div className="mobsubplan-modal-section">
              <h3>Description</h3>
              <p className="mobsubplan-plan-description">{planDetailsModal.description}</p>
            </div>

            {/* Features Section */}
            {planDetailsModal.features?.length > 0 && (
              <div className="mobsubplan-modal-section">
                <button 
                  className="mobsubplan-section-toggle"
                  onClick={() => toggleSection('features')}
                >
                  <h3>Features</h3>
                  {expandedSections.features ? <FaChevronUp /> : <FaChevronDown />}
                </button>
                {expandedSections.features && (
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
                )}
              </div>
            )}

            {/* Price Breakdown Section */}
            <div className="mobsubplan-modal-section">
              <button 
                className="mobsubplan-section-toggle"
                onClick={() => toggleSection('priceBreakdown')}
              >
                <div className="mobsubplan-section-title">
                  <FaCalculator />
                  <h3>Price Breakdown</h3>
                </div>
                {expandedSections.priceBreakdown ? <FaChevronUp /> : <FaChevronDown />}
              </button>
              {expandedSections.priceBreakdown && priceBreakdown && (
                <div className="mobsubplan-price-breakdown-section">
                  <div className="mobsubplan-price-breakdown-grid">
                    {priceBreakdown.breakdown.map((item, index) => (
                      <div key={index} className={`mobsubplan-breakdown-item ${item.label === 'Total Price' ? 'mobsubplan-total-price' : ''}`}>
                        <div className="mobsubplan-breakdown-label">{item.label}</div>
                        <div className="mobsubplan-breakdown-value">{item.value}</div>
                        {item.calculation && (
                          <div className="mobsubplan-breakdown-calculation">
                            {item.calculation}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Delivery Schedule Section */}
            {planDetailsModal.type !== 'one-time' && planDetailsModal.type !== 'emergency' && priceBreakdown && (
              <div className="mobsubplan-modal-section">
                <button 
                  className="mobsubplan-section-toggle"
                  onClick={() => toggleSection('deliverySchedule')}
                >
                  <div className="mobsubplan-section-title">
                    <FaTruck />
                    <h3>Delivery Schedule</h3>
                  </div>
                  {expandedSections.deliverySchedule ? <FaChevronUp /> : <FaChevronDown />}
                </button>
                {expandedSections.deliverySchedule && (
                  <div className="mobsubplan-delivery-schedule-section">
                    <div className="mobsubplan-delivery-steps">
                      <div className="mobsubplan-delivery-step">
                        <div className="mobsubplan-step-number">1</div>
                        <div className="mobsubplan-step-content">
                          <div className="mobsubplan-step-title">Initial Delivery</div>
                          <div className="mobsubplan-step-description">
                            Day 1 - First cylinder delivered to your location
                          </div>
                        </div>
                      </div>
                      <div className="mobsubplan-delivery-step">
                        <div className="mobsubplan-step-number">2</div>
                        <div className="mobsubplan-step-content">
                          <div className="mobsubplan-step-title">Regular Deliveries</div>
                          <div className="mobsubplan-step-description">
                            Every {currentFrequency.toLowerCase()} - based on your selected schedule
                          </div>
                        </div>
                      </div>
                      {currentPeriod > 1 && (
                        <div className="mobsubplan-delivery-step">
                          <div className="mobsubplan-step-number">3</div>
                          <div className="mobsubplan-step-content">
                            <div className="mobsubplan-step-title">Subscription Period</div>
                            <div className="mobsubplan-step-description">
                              {currentPeriod} month{currentPeriod > 1 ? 's' : ''} total - automatic renewals
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="mobsubplan-delivery-summary">
                      <div className="mobsubplan-delivery-summary-item">
                        <span className="mobsubplan-delivery-summary-label">Total Deliveries:</span>
                        <span className="mobsubplan-delivery-summary-value">{priceBreakdown.totalDeliveries}</span>
                      </div>
                      <div className="mobsubplan-delivery-summary-item">
                        <span className="mobsubplan-delivery-summary-label">Deliveries per Month:</span>
                        <span className="mobsubplan-delivery-summary-value">{priceBreakdown.deliveriesPerMonth}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Specifications Section */}
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
                    <span className="mobsubplan-spec-label">Available Frequencies:</span>
                    <span className="mobsubplan-spec-value">{planDetailsModal.deliveryFrequency.join(', ')}</span>
                  </div>
                )}
                {planDetailsModal.subscriptionPeriod && (
                  <div className="mobsubplan-spec-item">
                    <span className="mobsubplan-spec-label">Available Periods:</span>
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
              </div>
            </div>
          </div>

          {/* Modal Footer */}
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
                handlePlanSelection(planDetailsModal);
              }}
            >
              Select This Plan
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderPaymentSummaryModal = () => {
    if (!showSummary || !selectedPlan) return null;

    return (
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

              {paymentMethod === 'wallet' && (
                <div className={`mobsubplan-wallet-notice ${walletBalance < selectedPlan.price ? 'mobsubplan-wallet-warning' : 'mobsubplan-wallet-info'}`}>
                  {walletBalance < selectedPlan.price ? (
                    <>
                      <FaExclamationTriangle />
                      <span>Insufficient wallet balance. Top up or select card payment.</span>
                    </>
                  ) : (
                    <>
                      <FaCheck />
                      <span>Wallet payment will be validated securely by our system</span>
                    </>
                  )}
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
              onClick={() => initializePayment(selectedPlan)}
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
    );
  };

  // Loading and Error States
  if (isLoading || plansLoading) {
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
          <button className="mobsubplan-retry-btn" onClick={handleRetry}>
            Try Again
          </button>
          {debugInfo && (
            <pre className="mobsubplan-debug-info">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          )}
        </div>
      </div>
    );
  }

  if (!user || !token) {
    return (
      <div className="mobsubplan-mobile-subscription-plans">
        <div className="mobsubplan-login-prompt">
          <h1>Choose a Subscription Plan</h1>
          <p>Please log in to view and subscribe to our plans</p>
          <button 
            className="mobsubplan-login-btn"
            onClick={() => navigate('/auth')}
          >
            Log In
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
              Perfect for occasional users. Purchase LPG gas as needed without any subscription.
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
            </p>
          </div>
        </div>
        <div className="mobsubplan-plans-list">
          {plans.filter(p => p.type === 'custom').map(plan => renderPlanCard(plan))}
        </div>
      </div>

      {/* Modals */}
      {renderPlanDetailsModal()}
      {renderPaymentSummaryModal()}

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