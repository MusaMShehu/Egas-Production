// import React, { useEffect, useState } from "react";
// import { useSearchParams, useNavigate } from "react-router-dom";
// import { FaCheckCircle, FaTimesCircle, FaRedo } from "react-icons/fa";
// import "./WalletTopupCallback.css";

// const API_BASE_URL =
//   process.env.REACT_APP_API_URL || "https://egas-server-1.onrender.com";

// const WalletTopupCallback = () => {
//   const [status, setStatus] = useState("verifying");
//   const [message, setMessage] = useState("Verifying your payment...");
//   const [amount, setAmount] = useState(0);
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();

//   useEffect(() => {
//     const verifyPayment = async () => {
//       const reference = searchParams.get("reference");
//       if (!reference) {
//         setStatus("error");
//         setMessage("Missing payment reference.");
//         return;
//       }

//       try {
//         const token = localStorage.getItem("token");
//         const response = await fetch(
//           `${API_BASE_URL}/api/v1/payments/wallet/verify?reference=${reference}`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         const data = await response.json();
//         console.log("Verification response:", data);

//         if (data.success) {
//           // Get amount from backend (convert if Paystack returns kobo)
//           const paymentAmount = (data?.data?.amount || data?.amount || 0);

//           setStatus("success");
//           setMessage(
//             data.message || "Payment successful! Your wallet has been updated."
//           );
//           setAmount(paymentAmount);
//         } else {
//           setStatus("error");
//           setMessage(data.message || "Payment verification failed.");
//         }
//       } catch (err) {
//         console.error("Verification error:", err);
//         setStatus("error");
//         setMessage("Unable to verify payment. Please try again.");
//       }
//     };

//     verifyPayment();
//   }, [searchParams]);

//   const handleGoToDashboard = () => {
//     navigate("/dashboard");
//   };

//   const handleRetry = () => {
//     window.location.reload();
//   };

//   return (
//     <div className="wallet-callback-container">
//       {status === "verifying" && (
//         <div className="wallet-status verifying">
//           <div className="spinner"></div>
//           <h2>Verifying Payment...</h2>
//           <p>Please wait while we confirm your transaction.</p>
//         </div>
//       )}

//       {status === "success" && (
//         <div className="wallet-status success">
//           <FaCheckCircle className="icon" />
//           <h2>Top-up Successful 🎉</h2>
//           <p>{message}</p>
//           <h3>
//             Amount: <span>₦{Number(amount).toLocaleString()}</span>
//           </h3>
//           <button className="btn-primary" onClick={handleGoToDashboard}>
//             Go to Dashboard
//           </button>
//         </div>
//       )}

//       {status === "error" && (
//         <div className="wallet-status error">
//           <FaTimesCircle className="icon" />
//           <h2>Verification Failed</h2>
//           <p>{message}</p>
//           <button className="btn-primary" onClick={handleRetry}>
//             <FaRedo /> Retry
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default WalletTopupCallback;





















// src/pages/walletTopupCallback.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import ApiService from '../../api/apiService';
import { useAuth } from '../../contexts/AuthContext';
import { FaCheckCircle, FaTimesCircle, FaRedo } from "react-icons/fa";
import { successToast, errorToast, infoToast } from "../../utils/toast";
import "./WalletTopupCallback.css";

const WalletTopupCallback = () => {
  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("Verifying your payment...");
  const [amount, setAmount] = useState(0);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const verifyPayment = async () => {
      const reference = searchParams.get("reference");
      if (!reference) {
        setStatus("error");
        setMessage("Missing payment reference.");
        return;
      }

      if (!isAuthenticated) {
        setStatus("error");
        setMessage("Please log in to verify payment.");
        setTimeout(() => navigate("/login"), 3000);
        return;
      }

      infoToast("Verifying payment...");

      try {
        const response = await ApiService.payments.verifyTopup(reference);

        if (response.success) {
          const paymentAmount = response?.data?.amount || response?.amount || 0;
          setStatus("success");
          setMessage(response.message || "Payment successful! Your wallet has been updated.");
          setAmount(paymentAmount);
          successToast("Wallet topped up successfully!");
          setTimeout(() => navigate("/dashboard/payments"), 3000);
        } else {
          setStatus("error");
          setMessage(response.message || "Payment verification failed.");
          errorToast(response.message || "Payment verification failed");
        }
      } catch (err) {
        console.error("Verification error:", err);
        setStatus("error");
        setMessage("Unable to verify payment. Please try again.");
        errorToast(err.message);
      }
    };

    verifyPayment();
  }, [searchParams, isAuthenticated, navigate]);

  const handleGoToDashboard = () => navigate("/dashboard");
  const handleRetry = () => window.location.reload();

  return (
    <div className="wallet-callback-container">
      {status === "verifying" && (<div className="wallet-status verifying"><div className="spinner"></div><h2>Verifying Payment...</h2><p>Please wait while we confirm your transaction.</p></div>)}
      {status === "success" && (<div className="wallet-status success"><FaCheckCircle className="icon" /><h2>Top-up Successful 🎉</h2><p>{message}</p><h3>Amount: <span>₦{Number(amount).toLocaleString()}</span></h3><button className="btn-primary" onClick={handleGoToDashboard}>Go to Dashboard</button></div>)}
      {status === "error" && (<div className="wallet-status error"><FaTimesCircle className="icon" /><h2>Verification Failed</h2><p>{message}</p><button className="btn-primary" onClick={handleRetry}><FaRedo /> Retry</button></div>)}
    </div>
  );
};

export default WalletTopupCallback;