import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const VerifyOrder = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const reference = params.get("reference");

  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Verifying your payment...");
  const [verificationData, setVerificationData] = useState(null);

  useEffect(() => {
    const verifyPayment = async () => {
      if (!reference) {
        setStatus("error");
        setMessage("Invalid payment reference.");
        return;
      }

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setStatus("error");
          setMessage("Please log in to verify payment.");
          setTimeout(() => navigate("/login"), 3000);
          return;
        }

        console.log("Verifying order payment with reference:", reference);

        const API_URL = process.env.REACT_APP_API_URL || "https://egas-server-1.onrender.com";

        const { data } = await axios.get(
          `${API_URL}/api/v1/orders/verify?reference=${reference}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log("Order verification response:", data);

        if (data?.success) {
          setStatus("success");
          setVerificationData(data.data);
          setMessage("Payment verified successfully! Redirecting...");

          // ✅ Wait briefly, then redirect safely
          setTimeout(() => {
            const id = data.orderId || data.data?._id;
            if (id) {
              navigate(`/orders/${id}`);
            } else {
              navigate('/orders');
            }
          }, 5000);
        } else {
          setStatus("error");
          setMessage(data?.message || "Payment verification failed.");
        }
      } catch (error) {
        console.error("Order verification error:", error);
        setStatus("error");
        setMessage(
          error.response?.data?.message ||
            error.message ||
            "An error occurred while verifying your payment."
        );
      }
    };

    verifyPayment();
  }, [reference, navigate]);

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
        justifyContent: "center",
      }}
    >
      <div style={{ maxWidth: "500px", margin: "0 auto" }}>
        <h2
          style={{
            color:
              status === "success"
                ? "green"
                : status === "error"
                ? "red"
                : "#333",
            marginBottom: "20px",
          }}
        >
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
                margin: "0 auto",
              }}
            />
            <p style={{ marginTop: "10px" }}>
              Please wait while we verify your payment...
            </p>
            <p style={{ fontSize: "14px", color: "#666", marginTop: "5px" }}>
              Reference: {reference}
            </p>
          </div>
        )}

        {status === "success" && verificationData && (
          <div
            style={{
              background: "#f0fff0",
              padding: "20px",
              borderRadius: "8px",
              marginTop: "20px",
              textAlign: "left",
            }}
          >
            <h3 style={{ color: "green", marginBottom: "15px" }}>
              ✅ Order Payment Verified Successfully!
            </h3>
            <div style={{ lineHeight: "1.6" }}>
              <p>
                <strong>Reference:</strong>{" "}
                {verificationData.reference || reference}
              </p>
              <p>
                <strong>Order ID:</strong> {verificationData.orderId || verificationData._id}
              </p>
              {verificationData.totalAmount && (
                <p>
                  <strong>Amount:</strong> ₦
                  {verificationData.totalAmount.toLocaleString()}
                </p>
              )}
              {verificationData.paymentMethod && (
                <p>
                  <strong>Payment Method:</strong> {verificationData.paymentMethod}
                </p>
              )}
              <p>
                <strong>Status:</strong>{" "}
                <span style={{ color: "green" }}>
                  {verificationData.paymentStatus || verificationData.orderStatus || "completed"}
                </span>
              </p>
              {verificationData.deliveryAddress && (
                <p>
                  <strong>Delivery Address:</strong> {verificationData.deliveryAddress}
                </p>
              )}
              {verificationData.products && (
                <p>
                  <strong>Items:</strong> {verificationData.products.length} product(s)
                </p>
              )}
            </div>
          </div>
        )}

        {status === "error" && (
          <div
            style={{
              background: "#fff0f0",
              padding: "20px",
              borderRadius: "8px",
              marginTop: "20px",
            }}
          >
            <h3 style={{ color: "red", marginBottom: "15px" }}>
              ❌ Order Payment Verification Failed
            </h3>
            <p style={{ color: "red", marginBottom: "15px" }}>{message}</p>
            <p style={{ fontSize: "14px", color: "#666", marginBottom: "15px" }}>
              Reference: {reference}
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
                marginRight: "10px",
              }}
            >
              Go to Dashboard
            </button>
            <button
              onClick={() => navigate("/cart")}
              style={{
                padding: "10px 20px",
                backgroundColor: "#6c757d",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                marginRight: "10px",
              }}
            >
              Back to Cart
            </button>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: "10px 20px",
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
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

export default VerifyOrder;