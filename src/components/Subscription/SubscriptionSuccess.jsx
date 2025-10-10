import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const SubscriptionSuccess = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const subscriptionId = params.get("subscriptionId");

  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Your backend base URL (e.g., from .env)
  const API_URL =
    process.env.REACT_APP_API_URL || "https://egas-server-1.onrender.com";

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/v1/subscriptions/${subscriptionId}`
        );
        setSubscription(response.data.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load subscription details.");
      } finally {
        setLoading(false);
      }
    };

    if (subscriptionId) fetchSubscription();
  }, [subscriptionId, API_URL]);

  if (loading) return <p>Loading your subscription...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h2>🎉 Subscription Successful!</h2>
      <p>Thank you for subscribing!</p>

      <div
        style={{
          border: "1px solid #ddd",
          padding: "20px",
          borderRadius: "12px",
          display: "inline-block",
          marginTop: "20px",
        }}
      >
        <h3>Subscription Details</h3>
        <p>
          <strong>ID:</strong> {subscription._id}
        </p>
        <p>
          <strong>Plan:</strong> {subscription.plan?.name || "N/A"}
        </p>
        <p>
          <strong>Status:</strong>{" "}
          <span style={{ color: "green" }}>{subscription.status}</span>
        </p>
        <p>
          <strong>Start Date:</strong>{" "}
          {new Date(subscription.startDate).toLocaleDateString()}
        </p>
        <p>
          <strong>End Date:</strong>{" "}
          {new Date(subscription.endDate).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default SubscriptionSuccess;
