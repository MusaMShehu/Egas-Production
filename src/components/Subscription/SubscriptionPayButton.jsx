// import React from "react";
// import PaystackPop from "@paystack/inline-js";

// const SubscriptionPayButton = ({ email, amount, metadata }) => {
//   const publicKey = process.env.REACT_APP_PAYSTACK_PUBLIC_KEY;

//   const handlePayment = () => {
//     const paystack = new PaystackPop(); // ✅ must use 'new'

//     paystack.newTransaction({
//       key: publicKey,
//       email,
//       amount: amount * 100, // Convert to kobo
//       metadata,
//       ref: `SUB_${Date.now()}`,
//       onSuccess: (response) => {
//         // redirect to verify page
//         window.location.href = `/subscriptions/verify?reference=${response.reference}`;
//       },
//       onCancel: () => {
//         alert("Payment closed or cancelled");
//       },
//       onBankTransfer: (response) => {
//         console.log("Bank transfer initiated:", response);
//       },
//     });
//   };

//   return (
//     <button onClick={handlePayment} className="subscribe-button">
//       Subscribe Now
//     </button>
//   );
// };

// export default SubscriptionPayButton;













// src/components/SubscriptionPayButton.jsx
import React from "react";
import ApiService from '../../api/apiService';
import { useAuth } from '../../contexts/AuthContext';
import { successToast, errorToast, infoToast } from "../../utils/toast";

const SubscriptionPayButton = ({ email, amount, metadata, onSuccess }) => {
  const { isAuthenticated } = useAuth();
  const publicKey = process.env.REACT_APP_PAYSTACK_PUBLIC_KEY;

  const handlePayment = async () => {
    if (!isAuthenticated) {
      errorToast("Please log in to subscribe");
      return;
    }

    infoToast("Initializing payment...");

    try {
      const response = await ApiService.payments.initializeSubscriptionPayment({
        email,
        amount,
        ...metadata
      });

      if (response.success && response.authorization_url) {
        // Redirect to Paystack
        window.location.href = response.authorization_url;
      } else {
        throw new Error(response.message || "Payment initialization failed");
      }
    } catch (error) {
      console.error("Payment error:", error);
      errorToast(error.message || "Payment initialization failed");
    }
  };

  return (
    <button onClick={handlePayment} className="subscribe-button">
      Subscribe Now
    </button>
  );
};

export default SubscriptionPayButton;