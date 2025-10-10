import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const VerifySubscription = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const reference = params.get("reference");
  const trxref = params.get("trxref");

  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Verifying your payment...");
  const [verificationData, setVerificationData] = useState(null);

  // Use the reference from Paystack (either 'reference' or 'trxref' parameter)
  const paymentReference = reference || trxref;

  useEffect(() => {
    const verifyPayment = async () => {
      if (!paymentReference) {
        setStatus("error");
        setMessage("Invalid payment reference.");
        return;
      }

      try {
        // Get token from localStorage
        const token = localStorage.getItem("token");
        
        if (!token) {
          setStatus("error");
          setMessage("Please log in to verify payment.");
          setTimeout(() => navigate("/login"), 3000);
          return;
        }

        console.log("Verifying payment with reference:", paymentReference);

        const API_URL = process.env.REACT_APP_API_URL || "https://egas-server-1.onrender.com";
        
        const { data } = await axios.get(
          `${API_URL}/api/v1/subscriptions/verify/${paymentReference}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        console.log("Verification response:", data);

        if (data?.success) {
          setStatus("success");
          setVerificationData(data.data);
          setMessage("Payment verified successfully! Redirecting...");
          
          setTimeout(() => {
            // Redirect to success page or dashboard
            if (data.data.subscriptionId) {
              navigate(`/subscriptions/success?subscriptionId=${data.data.subscriptionId}`);
            } else {
              navigate("/dashboard?payment=success");
            }
          }, 2000);
        } else {
          setStatus("error");
          setMessage(data?.message || "Payment verification failed.");
        }
      } catch (error) {
        console.error("Verification error:", error);
        setStatus("error");
        setMessage(
          error.response?.data?.message ||
          error.message ||
          "An error occurred while verifying your payment."
        );
      }
    };

    verifyPayment();
  }, [paymentReference, navigate]);

  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "60px",
        fontFamily: "Arial, sans-serif",
        padding: "20px",
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <div style={{ maxWidth: "500px", margin: "0 auto" }}>
        <h2 style={{ 
          color: status === "success" ? "green" : status === "error" ? "red" : "#333",
          marginBottom: "20px"
        }}>
          {message}
        </h2>

        {status === "loading" && (
          <div style={{ marginTop: "20px" }}>
            <div 
              style={{
                border: "4px solid #f3f3f3",
                borderTop: "4px solid #3498db",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                animation: "spin 1s linear infinite",
                margin: "0 auto"
              }}
            />
            <p style={{ marginTop: "10px" }}>Please wait while we verify your payment...</p>
            <p style={{ fontSize: "14px", color: "#666", marginTop: "5px" }}>
              Reference: {paymentReference}
            </p>
          </div>
        )}

        {status === "success" && verificationData && (
          <div style={{ 
            background: "#f0fff0", 
            padding: "20px", 
            borderRadius: "8px",
            marginTop: "20px",
            textAlign: "left"
          }}>
            <h3 style={{ color: "green", marginBottom: "15px" }}>✅ Payment Verified Successfully!</h3>
            <div style={{ lineHeight: "1.6" }}>
              <p><strong>Reference:</strong> {verificationData.reference || paymentReference}</p>
              <p><strong>Amount:</strong> ₦{(verificationData.amount / 100).toLocaleString()}</p>
              {verificationData.planName && <p><strong>Plan:</strong> {verificationData.planName}</p>}
              <p><strong>Status:</strong> <span style={{ color: "green" }}>{verificationData.status}</span></p>
              {verificationData.subscriptionId && (
                <p><strong>Subscription ID:</strong> {verificationData.subscriptionId}</p>
              )}
            </div>
          </div>
        )}

        {status === "error" && (
          <div style={{ 
            background: "#fff0f0", 
            padding: "20px", 
            borderRadius: "8px",
            marginTop: "20px"
          }}>
            <h3 style={{ color: "red", marginBottom: "15px" }}>❌ Payment Verification Failed</h3>
            <p style={{ color: "red", marginBottom: "15px" }}>
              {message}
            </p>
            <p style={{ fontSize: "14px", color: "#666", marginBottom: "15px" }}>
              Reference: {paymentReference}
            </p>
            <button 
              onClick={() => navigate("/dashboard")}
              style={{
                padding: "10px 20px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                marginRight: "10px"
              }}
            >
              Go to Dashboard
            </button>
            <button 
              onClick={() => window.location.reload()}
              style={{
                padding: "10px 20px",
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              Retry Verification
            </button>
          </div>
        )}
      </div>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default VerifySubscription;