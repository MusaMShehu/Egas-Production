// src/components/SubscriptionPlans.jsx
import React, { useState, useEffect, useCallback } from "react";
import "../../styles/SubscriptionPlans.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";



// Stable axios instance
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000",
  timeout: 30000,
});

const SubscriptionPlans = () => {
  const navigate = useNavigate();

  // state
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [plans, setPlans] = useState([]);
  const [customPlan, setCustomPlan] = useState({ size: "6kg", frequency: "Monthly" });
  const [oneTimePlan, setOneTimePlan] = useState({ size: "" });
  const [selectedFrequencies, setSelectedFrequencies] = useState({});
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showSummary, setShowSummary] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [plansLoading, setPlansLoading] = useState(true);
  const [error, setError] = useState("");
  const [debugInfo, setDebugInfo] = useState(null); // shows backend error payload

  // add interceptors once
  useEffect(() => {
    const reqId = axiosInstance.interceptors.request.use(
      (cfg) => {
        // attach token if available
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
        setPlans(resp.data.data || []);
        // init frequencies
        const freqs = {};
        (resp.data.data || []).forEach((p) => {
          if (p.type === "preset") freqs[p._id] = p.frequencyOptions?.[0] || "Monthly";
        });
        setSelectedFrequencies(freqs);
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

  // load paystack script once
  const loadPaystackScript = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (window.PaystackPop) return resolve(window.PaystackPop);

      const scr = document.createElement("script");
      scr.src = "https://js.paystack.co/v1/inline.js";
      scr.async = true;
      scr.onload = () => {
        if (window.PaystackPop) resolve(window.PaystackPop);
        else reject(new Error("Paystack script loaded but window.PaystackPop missing"));
      };
      scr.onerror = (e) => reject(new Error("Failed to load Paystack script"));
      document.body.appendChild(scr);
    });
  }, []);

  // helpers: price calculations (frontend uses plan.price in NAIRA)
  const calculatePrice = (basePrice, pricePerKg, size, frequency) => {
    const sizeKg = parseInt(String(size || basePrice).replace("kg", ""), 10) || 1;
    const baseAmount = sizeKg * (pricePerKg ?? 0) || (basePrice ?? 0); // fallback
    let multiplier = 1;
    switch (frequency) {
      case "Daily": multiplier = 30; break;
      case "Weekly": multiplier = 4; break;
      case "Bi-Weekly": multiplier = 2; break;
      case "One-Time": multiplier = 1; break;
      default: multiplier = 1; // Monthly
    }
    return baseAmount * multiplier;
  };

  const getPlanPrice = (plan, frequency, customSize = null) => {
    // If backend gives explicit price fields (basePrice, pricePerKg) use them
    if (!plan) return 0;
    if (plan.price) return plan.price; // if the plan already contains price in naira
    return calculatePrice(plan.basePrice ?? 0, plan.pricePerKg ?? 0, customSize || plan.baseSize, frequency);
  };

  const getCustomPlanPrice = () => {
    const p = plans.find((x) => x.type === "custom");
    if (!p) return 0;
    return getPlanPrice(p, customPlan.frequency, customPlan.size);
  };

  const getOneTimePlanPrice = () => {
    if (!oneTimePlan.size) return 0;
    const p = plans.find((x) => x.type === "one-time");
    if (!p) return 0;
    return getPlanPrice(p, "One-Time", oneTimePlan.size);
  };

  // Retry without reload
  const handleRetry = () => {
    setError("");
    setDebugInfo(null);
    fetchSubscriptionPlans();
  };

  // Confirm and show summary
  const confirmPlan = (planData) => {
    if (!user || !token) {
      alert("Please log in to subscribe");
      navigate("/login");
      return;
    }

    if (!planData.price || planData.price <= 0) {
      alert("Please select a valid plan configuration");
      return;
    }

    setSelectedPlan(planData);
    setShowSummary(true);
  };

  // Main: initialize payment with backend and open paystack inline
  const handleSubscribe = async (planData) => {
    if (!user || !token) {
      alert("Please log in");
      navigate("/login");
      return;
    }

    setIsProcessing(true);
    setError("");
    setDebugInfo(null);

    // Build payload to match backend validate fields
    // IMPORTANT: `amount` here is in NAIRA (backend multiplies by 100)
    const initPayload = {
      amount: Number(planData.price),     // NAIRA - backend will call *100
      email: user.email,
      planId: planData.planId || null,
      frequency: planData.frequency || null,
      size: planData.size || null,
      planName: planData.name || null,
      // optional extras if you have them:
      startDate: planData.startDate || null,
      endDate: planData.endDate || null,
      price: planData.price || Number(planData.price)
    };

    console.log("Payment init payload:", initPayload);

    try {
      const resp = await axiosInstance.post(
        "/api/v1/payments/initialize",
        initPayload,
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );

      console.log("Backend initialization response:", resp?.data);
      if (!resp?.data?.success) {
        const msg = resp?.data?.message || "Initialization returned unsuccessful";
        setError(msg);
        setDebugInfo(resp?.data || null);
        setIsProcessing(false);
        return;
      }

      const authorization_url = resp.data.authorization_url;
      const reference = resp.data.reference;
      const access_code = resp.data.access_code;

      // Load paystack script
      await loadPaystackScript();

      // Important: inline setup still accepts amount in kobo — convert here for the inline popup display.
      // But backend already initialized the transaction and set a reference; the reference is the source of truth.
      const amountInKobo = Math.round(Number(planData.price) * 100);

      // Use the inline popup with the reference returned by your backend
      const handler = window.PaystackPop.setup({
  key: process.env.REACT_APP_PAYSTACK_PUBLIC_KEY,  
  email: user.email,
  amount: Math.round(planData.price * 100), 
  ref: resp.data.reference, 
  metadata: {
    planId: planData.planId,
    frequency: planData.frequency,
    size: planData.size,
    userId: user._id,
  },
  // ✅ THIS must be a function
  callback: function (response) {
    console.log("Payment successful:", response);
    // Call backend verify API
    axiosInstance
      .get(`/api/v1/payments/verify/${response.reference}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((verifyRes) => {
        console.log("Verification result:", verifyRes.data);
        alert("Payment verified successfully!");
      })
      .catch((err) => {
        console.error("Verification failed:", err.response?.data || err.message);
        alert("Payment verification failed!");
      });
  },
  // Optional but recommended
  onClose: function () {
    alert("Payment window closed.");
  },
});

handler.openIframe();

      // open the inline iframe
      // Some Paystack SDK versions provide handler.openIframe(); others automatically open.
      if (typeof handler.openIframe === "function") {
        handler.openIframe();
      } else {
        console.warn("handler.openIframe not available; popup may open automatically");
      }
    } catch (err) {
      console.error("Initialize payment error:", err);
      const backendErr = err?.response?.data;
      setError(backendErr?.message || err.message || "Payment initialization failed.");
      setDebugInfo(backendErr || { message: err.message });
      setIsProcessing(false);
    }
  };

  // small refresh function to reload updated profile (optional)
  const refreshUserData = async () => {
    if (!token) return;
    try {
      const resp = await axiosInstance.get("/api/v1/users/profile", { headers: { Authorization: `Bearer ${token}` } });
      if (resp?.data) {
        const updated = { ...user, ...resp.data };
        setUser(updated);
        localStorage.setItem("user", JSON.stringify(updated));
      }
    } catch (err) {
      console.error("Failed to refresh user:", err);
    }
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
          // CUSTOM plan
          if (plan.type === "custom") {
            const price = getCustomPlanPrice();
            return (
              <div key={plan._id} className="plan-card custom-plan-card">
                <h2>{plan.name}</h2>
                <p>{plan.description}</p>
                <label>Size</label>
                <select value={customPlan.size} onChange={(e) => setCustomPlan(prev => ({ ...prev, size: e.target.value }))}>
                  {plan.sizeOptions?.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <label>Frequency</label>
                <select value={customPlan.frequency} onChange={(e) => setCustomPlan(prev => ({ ...prev, frequency: e.target.value }))}>
                  {plan.frequencyOptions?.map((f) => <option key={f} value={f}>{f}</option>)}
                </select>
                <p>₦{price.toLocaleString()}</p>
                <button
                  disabled={isProcessing}
                  onClick={() => confirmPlan({
                    planId: plan._id,
                    name: plan.name,
                    size: customPlan.size,
                    frequency: customPlan.frequency,
                    price
                  })}
                >{isProcessing ? "Processing..." : "Subscribe"}</button>
              </div>
            );
          }

          // One-time
          if (plan.type === "one-time") {
            const price = getOneTimePlanPrice();
            return (
              <div key={plan._id} className="plan-card one-time-card">
                <h2>{plan.name}</h2>
                <p>{plan.description}</p>
                <label>Size</label>
                <select value={oneTimePlan.size} onChange={(e) => setOneTimePlan({ size: e.target.value })}>
                  <option value="">Select Size</option>
                  {plan.sizeOptions?.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <p>₦{price.toLocaleString()}</p>
                <button disabled={!oneTimePlan.size || isProcessing}
                  onClick={() => confirmPlan({
                    planId: plan._id,
                    name: plan.name,
                    size: oneTimePlan.size,
                    frequency: "One-Time",
                    price
                  })}
                >{isProcessing ? "Processing..." : "Buy Now"}</button>
              </div>
            );
          }

          // Preset
          const freq = selectedFrequencies[plan._id] || plan.frequencyOptions?.[0] || "Monthly";
          const price = getPlanPrice(plan, freq);
          return (
            <div key={plan._id} className="plan-card">
              <h2>{plan.name}</h2>
              <p>{plan.description}</p>
              <label>Frequency</label>
              <select value={freq} onChange={(e) => setSelectedFrequencies(prev => ({ ...prev, [plan._id]: e.target.value }))}>
                {plan.frequencyOptions?.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
              <p>₦{price.toLocaleString()}</p>
              <button disabled={isProcessing} onClick={() => confirmPlan({
                planId: plan._id,
                name: plan.name,
                size: plan.baseSize,
                frequency: freq,
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
            <p><strong>Size:</strong> {selectedPlan.size}</p>
            <p><strong>Frequency:</strong> {selectedPlan.frequency}</p>
            <p><strong>Price:</strong> ₦{Number(selectedPlan.price).toLocaleString()}</p>
            <div className="summary-actions">
              <button onClick={() => setShowSummary(false)} disabled={isProcessing}>Cancel</button>
              <button onClick={() => { setShowSummary(false); handleSubscribe(selectedPlan); }} disabled={isProcessing}>
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
