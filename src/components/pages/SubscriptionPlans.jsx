import React, { useState } from "react";
import "../../styles/Subscription.css";
import initializePaystack from "@paystack/inline-js";
import axios from "axios";

const SubscriptionPlans = ({ user }) => {
  const [customPlan, setCustomPlan] = useState({
    size: "6kg",
    frequency: "Monthly",
    oneTimeSize: ""
  });

  const [selectedFrequencies, setSelectedFrequencies] = useState({
    "Starter Plan": "Monthly",
    "Family Plan": "Monthly",
    "Business Plan": "Monthly"
  });

  const [selectedPlan, setSelectedPlan] = useState(null); // ✅ plan user clicked
  const [showSummary, setShowSummary] = useState(false); // ✅ modal toggle

  const presetPlans = [
    { name: "Starter Plan", size: "6kg", basePrice: 1500 * 6 },
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

  /** 🔹 Proceed to Paystack after confirmation */
  const handleSubscribe = async (plan) => {
    try {
      const payload = {
        amount: plan.price,
        email: user.email,
        orderId: `${user._id}-${Date.now()}`,
        userId: user._id,
        planName: plan.name,
        size: plan.size,
        frequency: plan.frequency
      };

      const resp = await axios.post(
        "http://localhost:5000/api/v1/payments/initialize",
        payload,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      const { reference } = resp.data;
      const paystack = initializePaystack();

      const handler = paystack.inlinePay({
        key: process.env.REACT_APP_PAYSTACK_PUBLIC_KEY,
        email: user.email,
        amount: Math.round(plan.price * 100),
        reference,
        metadata: {
          planName: plan.name,
          size: plan.size,
          frequency: plan.frequency,
          userId: user._id
        },
        onSuccess: async (paymentResp) => {
          try {
            await axios.get(`http://localhost:5000/api/v1/payments/verify/${paymentResp.reference}`);
            await axios.post("http://localhost:5000/api/v1/subscriptions", {
              name: plan.name,
              size: plan.size,
              frequency: plan.frequency,
              price: plan.price,
              reference: paymentResp.reference,
            }, {
              headers: { Authorization: `Bearer ${user.token}` }
            });

            alert("Subscription successful!");
          } catch (err) {
            console.error("onSuccess handling error:", err.response?.data || err.message || err);
            alert("Verification/Subscription save failed");
          }
        },
        onClose: () => {
          alert("Payment window closed.");
        }
      });

      handler.openIframe();
    } catch (err) {
      console.error("Initialize payment error:", err.response?.data || err.message || err);
      alert("Payment initialization failed");
    }
  };

  /** 🔹 Show summary before payment */
  const confirmPlan = (plan) => {
    setSelectedPlan(plan);
    setShowSummary(true);
  };

  return (
    <div className="plans-container">
      <h1>Choose a Subscription Plan</h1>

      <div className="plans-grid">
        {/* Preset Plans */}
        {presetPlans.map((plan, index) => {
          const frequency = selectedFrequencies[plan.name] || "Monthly";
          const price = calculatePrice(plan.basePrice, frequency);

          return (
            <div key={index} className="plan-card">
              <div className="plan-header"><h2>{plan.name}</h2></div>
              <div className="plan-details">
                <p className="plan-size">{plan.size}</p>
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
                <button
                  className="subscribe-btn"
                  onClick={() =>
                    confirmPlan({ name: plan.name, size: plan.size, frequency, price })
                  }
                >
                  Subscribe
                </button>
              </div>
            </div>
          );
        })}

        {/* Custom Plan */}
        <div className="plan-card">
          <div className="plan-header"><h2>Custom Plan</h2></div>
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
            >
              Subscribe Custom
            </button>
          </div>
        </div>

        {/* One-Time Purchase */}
        <div className="plan-card">
          <div className="plan-header"><h2>One-Time Purchase</h2></div>
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
              <p className="price">
                ₦{calculateOneTimePrice(customPlan.oneTimeSize).toLocaleString()}
              </p>
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
              disabled={!customPlan.oneTimeSize}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* ✅ Summary Modal */}
      {showSummary && selectedPlan && (
        <div className="summary-modal">
          <div className="summary-card">
            <h2>Confirm Your Subscription</h2>
            <p><strong>Plan:</strong> {selectedPlan.name}</p>
            <p><strong>Size:</strong> {selectedPlan.size}</p>
            <p><strong>Frequency:</strong> {selectedPlan.frequency}</p>
            <p><strong>Price:</strong> ₦{selectedPlan.price.toLocaleString()}</p>

            <div className="summary-actions">
              <button onClick={() => setShowSummary(false)}>Cancel</button>
              <button
                className="confirm-btn"
                onClick={() => {
                  setShowSummary(false);
                  handleSubscribe(selectedPlan);
                }}
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionPlans;
