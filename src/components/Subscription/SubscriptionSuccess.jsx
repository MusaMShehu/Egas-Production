// import React, { useEffect, useState } from "react";
// import { useLocation } from "react-router-dom";
// import axios from "axios";

// const SubscriptionSuccess = () => {
//   const { search } = useLocation();
//   const params = new URLSearchParams(search);
//   const subscriptionId = params.get("subscriptionId");

//   const [subscription, setSubscription] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   // Your backend base URL (e.g., from .env)
//   const API_URL =
//     process.env.REACT_APP_API_URL || "https://egas-server-1.onrender.com";

//   useEffect(() => {
//     const fetchSubscription = async () => {
//       try {
//         const response = await axios.get(
//           `${API_URL}/api/v1/subscriptions/${subscriptionId}`
//         );
//         setSubscription(response.data.data);
//       } catch (err) {
//         console.error(err);
//         setError("Failed to load subscription details.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (subscriptionId) fetchSubscription();
//   }, [subscriptionId, API_URL]);

//   if (loading) return <p>Loading your subscription...</p>;
//   if (error) return <p style={{ color: "red" }}>{error}</p>;

//   return (
//     <div style={{ textAlign: "center", marginTop: "40px" }}>
//       <h2>🎉 Subscription Successful!</h2>
//       <p>Thank you for subscribing!</p>

//       <div
//         style={{
//           border: "1px solid #ddd",
//           padding: "20px",
//           borderRadius: "12px",
//           display: "inline-block",
//           marginTop: "20px",
//         }}
//       >
//         <h3>Subscription Details</h3>
//         <p>
//           <strong>ID:</strong> {subscription._id}
//         </p>
//         <p>
//           <strong>Plan:</strong> {subscription.plan?.name || "N/A"}
//         </p>
//         <p>
//           <strong>Status:</strong>{" "}
//           <span style={{ color: "green" }}>{subscription.status}</span>
//         </p>
//         <p>
//           <strong>Start Date:</strong>{" "}
//           {new Date(subscription.startDate).toLocaleDateString()}
//         </p>
//         <p>
//           <strong>End Date:</strong>{" "}
//           {new Date(subscription.endDate).toLocaleDateString()}
//         </p>
//       </div>
//     </div>
//   );
// };

// export default SubscriptionSuccess;






















// src/pages/SubscriptionSuccess.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ApiService from '../../api/apiService';
import { useAuth } from '../../contexts/AuthContext';
import { successToast, errorToast, infoToast } from "../../utils/toast";

const SubscriptionSuccess = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const params = new URLSearchParams(search);
  const subscriptionId = params.get("subscriptionId");
  const reference = params.get("reference");

  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSubscription = async () => {
      if (!isAuthenticated) {
        errorToast("Please log in to view subscription details");
        navigate("/auth");
        return;
      }

      try {
        infoToast("Loading subscription details...");

        let subscriptionData = null;
        
        // If we have subscriptionId, fetch directly
        if (subscriptionId) {
          const response = await ApiService.subscriptions.getById(subscriptionId);
          if (response.success) {
            subscriptionData = response.data;
          }
        } 
        // If we have reference, verify payment first
        else if (reference) {
          const verifyResponse = await ApiService.subscriptions.verifyPayment(reference);
          if (verifyResponse.success && verifyResponse.data?._id) {
            const subResponse = await ApiService.subscriptions.getById(verifyResponse.data._id);
            if (subResponse.success) {
              subscriptionData = subResponse.data;
            }
          }
        }

        if (subscriptionData) {
          setSubscription(subscriptionData);
          successToast("Subscription activated successfully!");
        } else {
          throw new Error("Could not find subscription details");
        }
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load subscription details.");
        errorToast(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [subscriptionId, reference, isAuthenticated, navigate]);

  const handleGoToSubscriptions = () => {
    navigate("/dashboard/subscriptions");
  };

  const handleGoToDashboard = () => {
    navigate("/dashboard");
  };

  if (loading) return <div className="subscription-success-loading"><div className="loading-spinner"></div><p>Loading your subscription...</p></div>;
  if (error) return <div className="subscription-success-error"><p style={{ color: "red" }}>{error}</p><button onClick={() => navigate("/dashboard")}>Go to Dashboard</button></div>;

  return (
    <div className="subscription-success-container" style={{ textAlign: "center", marginTop: "40px" }}>
      <h2>🎉 Subscription Successful!</h2>
      <p>Thank you for subscribing!</p>

      <div style={{ border: "1px solid #ddd", padding: "20px", borderRadius: "12px", display: "inline-block", marginTop: "20px" }}>
        <h3>Subscription Details</h3>
        <p><strong>ID:</strong> {subscription._id}</p>
        <p><strong>Plan:</strong> {subscription.plan?.name || subscription.planName || "N/A"}</p>
        <p><strong>Status:</strong> <span style={{ color: "green" }}>{subscription.status}</span></p>
        <p><strong>Start Date:</strong> {new Date(subscription.startDate).toLocaleDateString()}</p>
        <p><strong>End Date:</strong> {new Date(subscription.endDate).toLocaleDateString()}</p>
        <div style={{ marginTop: "20px" }}>
          <button onClick={handleGoToSubscriptions} style={{ marginRight: "10px", padding: "10px 20px", backgroundColor: "#3498db", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>View My Subscriptions</button>
          <button onClick={handleGoToDashboard} style={{ padding: "10px 20px", backgroundColor: "#2ecc71", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>Go to Dashboard</button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionSuccess;