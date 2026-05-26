// // src/components/CallbackPage.js
// import React, { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import axios from "axios";
// import "./CallbackPage.css"; // optional if you want to style it cleanly

// const CallbackPage = () => {
//   const [status, setStatus] = useState("processing");
//   const [message, setMessage] = useState("Verifying your payment...");
//   const location = useLocation();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const verifyPayment = async () => {
//       try {
//         const urlParams = new URLSearchParams(location.search);
//         const reference = urlParams.get("reference") || urlParams.get("trxref");

//         if (!reference) {
//           setStatus("error");
//           setMessage("No payment reference found in URL");
//           return;
//         }

//         // ✅ Get auth token directly from localStorage
//         const token = localStorage.getItem("token");
//         if (!token) {
//           setStatus("error");
//           setMessage("You must be logged in to verify this payment");
//           return;
//         }

//         // ✅ Verify payment with backend using the updated route
//         const API_BASE_URL =
//           process.env.REACT_APP_API_URL ||
//           "https://egas-server-1.onrender.com";

//         const response = await axios.get(
//           `${API_BASE_URL}/api/v1/payments/wallet/verify?reference=${reference}`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         if (response.data.success) {
//           setStatus("success");
//           setMessage("Payment verified successfully! Your wallet has been updated.");

//           // ✅ Update wallet balance in localStorage (optional)
//           if (response.data.walletBalance !== undefined) {
//             localStorage.setItem("walletBalance", response.data.walletBalance);
//           }

//           // ✅ Redirect back to Payments page after short delay
//           setTimeout(() => {
//             navigate("/dashboard/payments", {
//               state: {
//                 message: "Your wallet has been topped up successfully!",
//               },
//             });
//           }, 3000);
//         } else {
//           setStatus("error");
//           setMessage(
//             response.data.message || "Payment verification failed. Please try again."
//           );
//         }
//       } catch (error) {
//         console.error("Payment verification error:", error);
//         setStatus("error");
//         setMessage(
//           error.response?.data?.message ||
//             "Payment verification failed. Please contact support."
//         );
//       }
//     };

//     verifyPayment();
//   }, [location, navigate]);

//   return (
//     <div className="callback-container">
//       <div className="callback-card">
//         <div className={`status-icon ${status}`}>
//           {status === "processing" && "⏳"}
//           {status === "success" && "✅"}
//           {status === "error" && "❌"}
//         </div>

//         <h2>
//           {status === "processing" && "Processing Payment..."}
//           {status === "success" && "Payment Successful!"}
//           {status === "error" && "Payment Failed"}
//         </h2>

//         <p>{message}</p>

//         {status === "processing" && (
//           <div className="loading-spinner">Loading...</div>
//         )}

//         {status === "error" && (
//           <button className="retry-btn" onClick={() => navigate("/dashboard/payments")}>
//             Try Again
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CallbackPage;





















import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ApiService from '../api/apiService';
import { useAuth } from '../contexts/AuthContext';
import { successToast, errorToast, infoToast } from "../utils/toast";
import "./CallbackPage.css";

const CallbackPage = () => {
  const [status, setStatus] = useState("processing");
  const [message, setMessage] = useState("Verifying your payment...");
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const urlParams = new URLSearchParams(location.search);
        const reference = urlParams.get("reference") || urlParams.get("trxref");

        if (!reference) {
          setStatus("error");
          setMessage("No payment reference found in URL");
          return;
        }

        if (!isAuthenticated) {
          setStatus("error");
          setMessage("You must be logged in to verify this payment");
          setTimeout(() => navigate("/login"), 3000);
          return;
        }

        infoToast("Verifying payment...");

        const response = await ApiService.payments.verifyTopup(reference);

        if (response.success) {
          setStatus("success");
          setMessage("Payment verified successfully! Your wallet has been updated.");
          successToast("Wallet topped up successfully!");

          if (response.walletBalance !== undefined) {
            // Update local storage for quick access (no token!)
            const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
            localStorage.setItem("user", JSON.stringify({ ...storedUser, walletBalance: response.walletBalance }));
          }

          setTimeout(() => navigate("/dashboard/payments", { state: { message: "Your wallet has been topped up successfully!" } }), 3000);
        } else {
          setStatus("error");
          setMessage(response.message || "Payment verification failed. Please try again.");
          errorToast(response.message || "Payment verification failed");
        }
      } catch (error) {
        console.error("Payment verification error:", error);
        setStatus("error");
        setMessage(error.response?.data?.message || "Payment verification failed. Please contact support.");
        errorToast(error.message);
      }
    };

    verifyPayment();
  }, [location, navigate, isAuthenticated]);

  return (
    <div className="callback-container">
      <div className="callback-card">
        <div className={`status-icon ${status}`}>
          {status === "processing" && "⏳"}
          {status === "success" && "✅"}
          {status === "error" && "❌"}
        </div>
        <h2>{status === "processing" && "Processing Payment..."}{status === "success" && "Payment Successful!"}{status === "error" && "Payment Failed"}</h2>
        <p>{message}</p>
        {status === "processing" && (<div className="loading-spinner">Loading...</div>)}
        {status === "error" && (<button className="retry-btn" onClick={() => navigate("/dashboard/payments")}>Try Again</button>)}
      </div>
    </div>
  );
};

export default CallbackPage;