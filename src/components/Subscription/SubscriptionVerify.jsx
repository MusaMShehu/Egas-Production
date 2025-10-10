import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const VerifySubscription = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const reference = params.get("reference");

  const [message, setMessage] = useState("Verifying your payment...");

  const API_URL =
    process.env.REACT_APP_API_URL || "https://egas-server-1.onrender.com";

  useEffect(() => {
    const verifyPayment = async () => {
      if (!reference) {
        setMessage("Invalid reference.");
        return;
      }

      try {
        const response = await axios.get(
          `${API_URL}/api/v1/subscriptions/verify?reference=${reference}`
        );

        // ✅ Correct the success check
        if (response.data.success) {
          const subscriptionId = response.data.data?._id;
          navigate(`/subscriptions/success?subscriptionId=${subscriptionId}`);
        } else {
          setMessage("Verification failed. Please contact support.");
        }
      } catch (error) {
        console.error("Verification error:", error.response?.data || error.message);
        setMessage("Error verifying payment.");
      }
    };

    verifyPayment();
  }, [reference, navigate, API_URL]);

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h2>{message}</h2>
    </div>
  );
};

export default VerifySubscription;
