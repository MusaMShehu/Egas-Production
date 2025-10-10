import React from "react";
import PaystackPop from "@paystack/inline-js";

const SubscriptionPayButton = ({ email, amount, metadata }) => {
  const publicKey = process.env.REACT_APP_PAYSTACK_PUBLIC_KEY;

  const handlePayment = () => {
    const paystack = new PaystackPop(); // ✅ must use 'new'

    paystack.newTransaction({
      key: publicKey,
      email,
      amount: amount * 100, // Convert to kobo
      metadata,
      ref: `SUB_${Date.now()}`,
      onSuccess: (response) => {
        // redirect to verify page
        window.location.href = `/subscriptions/verify?reference=${response.reference}`;
      },
      onCancel: () => {
        alert("Payment closed or cancelled");
      },
      onBankTransfer: (response) => {
        console.log("Bank transfer initiated:", response);
      },
    });
  };

  return (
    <button onClick={handlePayment} className="subscribe-button">
      Subscribe Now
    </button>
  );
};

export default SubscriptionPayButton;
